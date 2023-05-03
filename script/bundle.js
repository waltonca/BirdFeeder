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

  // subscribe to Sensors topic
  client.subscribe('birdFeeder$@NsCc&_%/Sensors/#')
  // subscribe to Photos topic
  client.subscribe('birdFeeder$@NsCc&_%/Photos/#');
  
  // publish fake data
  // client.publish('birdFeeder', jsonDataString);

  // subscribe to Sensors topic
  client.on('message', function(topic, message) {
      // message is Buffer
      // console.log(message.toString()); 
      // convert message to json
      if (topic === 'birdFeeder$@NsCc&_%/Sensors') { // Sensors topic
        let sensors = message;
        const sensorsJson = JSON.parse(sensors.toString());
        console.log(`temperature: ${sensorsJson.temp_c}`);
        console.log(`humidity: ${sensorsJson.humidity}`);
        document.getElementById("temperature_c").innerHTML = sensorsJson.temp_c;
        document.getElementById("temperature_f").innerHTML = sensorsJson.temp_f;
        document.getElementById("humidity").innerHTML = sensorsJson.humidity;
      }
    
      if (topic === 'birdFeeder$@NsCc&_%/Photos') { // Photos topic
        let photo = message;
        const photoBase64 = photo.toString();
        console.log(`image: ${photoBase64}`);
        document.getElementById("image").innerHTML = `<img src="data:image/png;base64,${photoBase64}" alt="image">`;
      }
      
      // client.end();
  });
});

client.on('error', function(error) {
  console.log("Can't connect to mqtt client" + error);
  process.exit(1);
})


// TODO: call weather API to get weather data
// API: https://api.openweathermap.org/data/2.5/forecast?lat=44.668987&lon=-63.613506&appid=d9c2f7d833ba0d49857b4dfa60ddb3bc&units=metric
// Step1: get weather data
const API_KEY = 'd9c2f7d833ba0d49857b4dfa60ddb3bc';
const LOCATION_LAT = '44.668987';
const LOCATION_LON = '-63.613506';

const request = new XMLHttpRequest();

request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response);
        // Step2: display weather data
        // 5 days, only get 00:00:00 data, create a new array to store the data
        const weatherData = [];
        for (let i = 0; i < response.list.length; i++) {
            if (response.list[i].dt_txt.includes('00:00:00')) {
                weatherData.push(response.list[i]);
            }
        }
        console.log(weatherData);
        // display 5 days weather data
        for (let i = 0; i < weatherData.length; i++) {
            const date = new Date(weatherData[i].dt * 1000);
            const day = date.getDay();
            const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = dayList[day];
            const temp = weatherData[i].main.temp;
            const weather = weatherData[i].weather[0].main;
            console.log(`day: ${dayOfWeek}, temp: ${temp}, weather: ${weather}`);
            // render data
            document.getElementById("weather").innerHTML += `day: ${dayOfWeek}, temp: ${temp}, weather: ${weather}<br>`;    
        }
    } else {
        console.log("error");
    }
};
request.open(`GET`, `https://api.openweathermap.org/data/2.5/forecast?lat=${LOCATION_LAT}&lon=${LOCATION_LON}&appid=${API_KEY}&units=metric`);
request.send();




// TODO: use data visualization library to display sensor data(our own data)

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


