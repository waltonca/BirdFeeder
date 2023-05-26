from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
from PIL import Image, ImageDraw, ImageFont
import io
import os
import shutil
import uuid

# Replace with your subscription keys and endpoints
computer_vision_subscription_key = "ea47d9ba135d4c018484bb0f3ff17439"
computer_vision_endpoint = "https://birdfeeder-nscc.cognitiveservices.azure.com/"
custom_vision_prediction_key = "e3ee0751443c43d9888408b9d6ee5fcd"
custom_vision_endpoint = "https://birdfeedernscc-prediction.cognitiveservices.azure.com/"

# Set the threshold for the percentage of image occupied by the bird
threshold = 20

# Authenticate with the Computer Vision API
computer_vision_credentials = CognitiveServicesCredentials(computer_vision_subscription_key)
computer_vision_client = ComputerVisionClient(computer_vision_endpoint, computer_vision_credentials)

# Authenticate with the Custom Vision API
custom_vision_credentials = ApiKeyCredentials(in_headers={"Prediction-key": custom_vision_prediction_key})
custom_vision_predictor = CustomVisionPredictionClient(custom_vision_endpoint, custom_vision_credentials)

# Create variables for your project
publish_iteration_name = "Iteration1"
project_id = "cd101e31-24b1-412e-9d00-558fd525e44f"

# Path to the photo
photo_path = "/home/birdfeeder/BirdFeeder/BirdRecognition/imageForRecognition/image.jpg"

# Set the maximum number of pictures to save in imageToPost
max_num_pictures = 5

# Open the photo as a stream
with open(photo_path, "rb") as photo_file:
    stream = io.BytesIO(photo_file.read())

# Call the Computer Vision API to analyze the photo
features = [VisualFeatureTypes.objects]
results = computer_vision_client.analyze_image_in_stream(stream, features)

# Set the new photo path
new_photo_path = photo_path

# Check if the photo contains a bird that occupies over the threshold% of the total image size
bird_detected = False
for obj in results.objects:
    if obj.object_property.lower() == 'bird':
        image_width, image_height = results.metadata.width, results.metadata.height
        bird_area = obj.rectangle.w * obj.rectangle.h
        image_area = image_width * image_height
        bird_percentage = (bird_area / image_area) * 100
        if bird_percentage > threshold:
            bird_detected = True
            break  # Stop looking for objects once a bird is found

# If a bird is detected and meets the threshold, perform species recognition
if bird_detected:
    # Initialize the species_name variable
    species_name = ""

    # Open the image for species recognition
    with open(photo_path, "rb") as image_contents:
        species_results = custom_vision_predictor.classify_image(project_id, publish_iteration_name, image_contents.read())

        # Display the species recognition results
        for prediction in species_results.predictions:
            if prediction.probability > 0.5:
                species_name = f"{prediction.tag_name}: {prediction.probability * 100:.2f}%"
                break  # Exit the loop after finding the first prediction above the threshold

    if species_name:
        # Load the image
        image = Image.open(new_photo_path)

        # Create a draw object
        draw = ImageDraw.Draw(image) 

        # Define the font and font size
        font_size = 40
        font = ImageFont.truetype("arial.ttf", font_size)

        # Define the text position
        text_position = (10, 10)

        # Define the text color
        text_color = (255, 255, 255)  # White color

        #Define the background color
        background_color = (211, 211, 211, 128)  # Darker Grey color with 50% opacity
        
        # Define the text to be displayed
        species_text = species_name

        # Get the size of the text
        text_width, text_height = draw.textsize(species_text, font=font)

        # Define the background rectangle coordinates
        background_rectangle = (
        text_position[0],
        text_position[1],
        text_position[0] + image_width,
        text_position[1] + text_height,
        )

        # Draw the background rectangle
        draw.rectangle(background_rectangle, fill=background_color)

        # Draw the text on the image
        draw.text(text_position, species_name, font=font, fill=text_color)

        # Generate a unique filename for the modified image
        modified_image_filename = str(uuid.uuid4()) + ".jpg"
        modified_image_path = os.path.join("/home/birdfeeder/BirdFeeder/WebServer/static/imageToPost", modified_image_filename)

        # Save the modified image
        image.save(modified_image_path)

        print("Transmitted photo to dashboard:", modified_image_path)
    else:
        print(f"No species recognition above the probability threshold for the detected bird")

# Get the number of pictures in the folder
pictures_in_folder = os.listdir("/home/birdfeeder/BirdFeeder/WebServer/static/imageToPost")
num_pictures_in_folder = len(pictures_in_folder)

# Remove the oldest pictures if the folder exceeds the maximum number of pictures
if num_pictures_in_folder > max_num_pictures:
    # Sort the pictures by creation time (oldest to newest)
    pictures_in_folder.sort(key=lambda x: os.path.getctime(os.path.join("/home/birdfeeder/BirdFeeder/WebServer/static/imageToPost", x)))

    # Remove the oldest pictures
    num_pictures_to_remove = num_pictures_in_folder - max_num_pictures
    for i in range(num_pictures_to_remove):
        picture_to_remove = os.path.join("/home/birdfeeder/BirdFeeder/WebServer/static/imageToPost", pictures_in_folder[i])
        os.remove(picture_to_remove)
        print("Removed old picture:", picture_to_remove)