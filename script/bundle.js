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
        // document.getElementById("temperature_f").innerHTML = sensorsJson.temp_f;
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
// API: https://api.openweathermap.org/data/2.5/forecast/daily?lat=44.668987&lon=-63.613506&appid=20571ab45c74dc2a1897b60c5b8047a1&units=metric
// Step1: get weather data
const API_KEY = '20571ab45c74dc2a1897b60c5b8047a1';
const LOCATION_LAT = '44.668987';
const LOCATION_LON = '-63.613506';

const request = new XMLHttpRequest();

request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response);
        // Step2: display weather data
        // 7 days weather data
        // const weatherData = [];
        // // for (let i = 0; i < response.list.length; i++) {
        // //     if (response.list[i].dt_txt.includes('00:00:00')) {
        // //         weatherData.push(response.list[i]);
        // //     }
        // // }
        // console.log(weatherData);
        // display 5 days weather data
          
            // <div class="sc-AxhUy fxWvvr">
            //   <h6>Fri</h6>
            //   <svg width="48" height="48" viewBox="0 0 48 48"><path fill="#BBDEFB" d="M29.5 5A8.5 8.5 0 1 0 29.5 22A8.5 8.5 0 1 0 29.5 5Z"></path><path fill="#BBDEFB" d="M37 14.893A7 7 0 1 0 37 28.893 7 7 0 1 0 37 14.893zM11 15A7 7 0 1 0 11 29 7 7 0 1 0 11 15z"></path><path fill="#BBDEFB" d="M17.5 8A6.5 6.5 0 1 0 17.5 21A6.5 6.5 0 1 0 17.5 8Z"></path><path fill="#BBDEFB" d="M25 12.893A7 7 0 1 0 25 26.893A7 7 0 1 0 25 12.893Z"></path><path fill="#BBDEFB" d="M7,25c0,2.209,1.791,4,4,4h25c2.209,0,4-1.791,4-4v-1c0-2.209-1.791-4-4-4H11c-2.209,0-4,1.791-4,4V25z"></path><g><path fill="#2196F3" d="M34.95 37.15c-1.132 1.133-2.968 1.133-4.101 0-1.134-1.131-1.133-2.969 0-4.1C31.982 31.917 37 31 37 31S36.082 36.02 34.95 37.15zM23.95 41.15c-1.132 1.132-2.968 1.132-4.101 0-1.133-1.133-1.132-2.969 0-4.101 1.133-1.133 6.152-2.05 6.152-2.05S25.082 40.02 23.95 41.15zM13.95 37.15c-1.132 1.133-2.968 1.133-4.101 0-1.133-1.131-1.132-2.969 0-4.1 1.132-1.133 6.151-2.05 6.151-2.05S15.082 36.02 13.95 37.15z"></path></g></svg>
            //   <p>Rain</p>
            //   <span>6<sup>°</sup><small>/</small>2<sup>°</sup></span>
            // </div>

            // check weather
            let Icon;
            
    } else {
        console.log("error");
    }
};
request.open(`GET`, `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${LOCATION_LAT}&lon=${LOCATION_LON}&appid=${API_KEY}&units=metric`);
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


