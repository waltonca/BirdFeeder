// fake data
const jsonData = {
  "temperature": 20,
  "humidity": 50,
  "foodLevel": 50
};
const jsonDataString = JSON.stringify(jsonData);

// const options = {
//   clientId: 'clientId-walton',
//   username: 'birdfeeder',
//   password: 'Nscc123!@#'
// }

const options = {
  clientId: 'clientId-walton',
};

const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);

console.log("Connecting mqtt client");

client.on('connect', function() {

  console.log("Connected to mqtt client");

  client.subscribe('birdFeeder$@NsCc&_%')
  
  // publish fake data
  // client.publish('birdFeeder', jsonDataString);

  // subscribe to topic
  client.on('message', function(topic, message) {
      // message is Buffer
      // console.log(message.toString()); 
      // convert message to json
      const messageJson = JSON.parse(message.toString());
      console.log(`temperature: ${messageJson.temperature}`);
      console.log(`humidity: ${messageJson.humidity}`);
      document.getElementById("temperature").innerHTML = messageJson.temperature;
      document.getElementById("humidity").innerHTML = messageJson.humidity;
      document.getElementById("image").querySelector('img').src = messageJson.image;
      // client.end();
  });
})

client.on('error', function(error) {
  console.log("Can't connect to mqtt client" + error);
  process.exit(1);
})


// TODO: call weather API to get weather data
// TODO: use data visualization library to display sensor data(our own data)

// TODO: figure out how to disply image from image data

// function convertImgToByteArray(img) {
//   var reader = new FileReader();
//   reader.readAsArrayBuffer(img);
//   reader.onload = function(event) {
//     var byteArray = new Uint8Array(event.target.result);
//     console.log(byteArray); // do something with the byte array
//   };
// }

// download image function
function downloadImage() {
  var img = document.getElementById("image").querySelector('img');
  var link = document.createElement('a');
  link.href = img.src;
  link.download = 'image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


