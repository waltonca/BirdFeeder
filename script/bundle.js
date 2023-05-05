// fake data
const jsonData = {
    temperature: 20,
    humidity: 50,
    foodLevel: 50,
};
const jsonDataString = JSON.stringify(jsonData);

// const options = {
//   clientId: 'clientId-walton',
//   username: 'birdfeeder',
//   password: 'Nscc123!@#'
// }

// main
// display time and date every second
// Call the displayTime() function every second
setInterval(displayTime, 1000);

const options = {
    clientId: "clientId-walton-" + generateUUID(),
};

console.log(options.clientId);

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", options);

console.log("Connecting mqtt client");

client.on("connect", function () {
    console.log("Connected to mqtt client");

    // subscribe to Sensors topic
    client.subscribe("birdFeeder$@NsCc&_%/Sensors/#");
    // subscribe to Photos topic
    client.subscribe("birdFeeder$@NsCc&_%/Photos/#");

    // publish fake data
    // client.publish('birdFeeder', jsonDataString);

    // subscribe to Sensors topic
    client.on("message", function (topic, message) {
        // message is Buffer
        // console.log(message.toString());
        // convert message to json
        if (topic === "birdFeeder$@NsCc&_%/Sensors") {
            // Sensors topic
            let sensors = message;
            const sensorsJson = JSON.parse(sensors.toString());
            // console.log(`temperature: ${sensorsJson.temp_c}`);
            // console.log(`humidity: ${sensorsJson.humidity}`);
            document.getElementById("temperature_c").innerHTML =
                sensorsJson.temp_c;
            // document.getElementById("temperature_f").innerHTML = sensorsJson.temp_f;
            document.getElementById("humidity").innerHTML =
                sensorsJson.humidity;
        }

        if (topic === "birdFeeder$@NsCc&_%/Photos") {
            // Photos topic
            let photo = message;
            let imageTime = displayTime();
            // console.log(`time: ${imageTime}`);
            const photoBase64 = photo.toString();
            console.log(`image: ${photoBase64}`);
            document.getElementById("image").innerHTML = `<img src="data:image/png;base64,${photoBase64}" alt="image"><span id="time">${imageTime}</span>`;
        }

        // client.end();
    });
});

client.on("error", function (error) {
    console.log("Can't connect to mqtt client" + error);
    process.exit(1);
});

// TODO: call weather API to get weather data
// API: https://api.openweathermap.org/data/2.5/forecast/daily?lat=44.668987&lon=-63.613506&appid=20571ab45c74dc2a1897b60c5b8047a1&units=metric
// Step1: get weather data
const API_KEY = "20571ab45c74dc2a1897b60c5b8047a1";
const LOCATION_LAT = "44.668987";
const LOCATION_LON = "-63.613506";

const request = new XMLHttpRequest();

request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response);
        // Step2: display weather data
        // 7 days weather data
        const weatherData = response.list;
        console.log(weatherData);
        // display weather data, use different vsg icon to display different weather
        // need a loop to display 7 days weather data
        for (var i = 0; i < weatherData.length; i++) {
            // get day of week
            const date = new Date(weatherData[i].dt * 1000);
            const day = date.getDay();
            const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const dayOfWeek = dayList[day];

            // get weather icon and name
            let weatherIcon;
            let weatherName = weatherData[i].weather[0].main;
            let weatherCode = weatherData[i].weather[0].id;
            switch (weatherCode) {
                // Clear
                case 800:
                    weatherIcon = "sunny";
                    break;

                // Cloud
                case 801:
                case 802:
                    weatherIcon = "partlycloudy";
                    break;
                case 803:
                case 804:
                    weatherIcon = "cloudy";
                    break;

                // Rain
                case 500:
                case 501:
                case 520:
                case 521:
                case 511:
                    weatherIcon = "rain";
                    break;
                case 502:
                case 503:
                case 504:
                case 522:
                case 531:
                    weatherIcon = "heavyrain";
                    break;

                // Drizzle
                case 300:
                case 301:
                case 302:
                case 310:
                case 311:
                case 312:
                case 313:
                case 314:
                case 321:
                    weatherIcon = "rain";
                    break;

                // Thunderstorm
                case 200:
                case 201:
                case 202:
                case 210:
                case 211:
                case 212:
                case 221:
                case 230:
                case 231:
                case 232:
                    weatherIcon = "thunderstorm";
                    break;

                // Snow
                case 600:
                case 601:
                case 602:
                case 612:
                case 613:
                case 615:
                case 616:
                case 620:
                case 621:
                case 622:
                    weatherIcon = "snow";
                    break;
                case 611:
                    weatherIcon = "sleet";
                    break;

                // Atmosphere
                case 701:
                case 711:
                case 721:
                case 731:
                case 741:
                case 751:
                case 761:
                case 762:
                case 771:
                case 781:
                    weatherIcon = "haze";
                    break;

                default:
                    weatherIcon = "sunny";
            }
            // get lowest and highest temperature
            const lowestTemp = weatherData[i].temp.min.toFixed(1);
            const highestTemp = weatherData[i].temp.max.toFixed(1);

            // display weather data HTML
            const weatherDiv = document.getElementById("weather");
            weatherDiv.innerHTML += `
            <div class="weather-item">
            <h6>${dayOfWeek}</h6>
            <img src="images/weather/${weatherIcon}.svg" alt="${weatherName}">
            <p>${weatherName}</p>
            <span>${lowestTemp}<sup>°</sup><small>/</small>${highestTemp}<sup>°</sup></span></div>`;
        }
    } else {
        console.log("error");
    }
};
request.open(
    `GET`,
    `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${LOCATION_LAT}&lon=${LOCATION_LON}&appid=${API_KEY}&units=metric`
);
request.send();

// TODO: use data visualization library to display sensor data(our own data)

// download image function
function downloadImage() {
    var img = document.getElementById("image").querySelector("img");
    var link = document.createElement("a");
    link.href = img.src;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// TODO: display time and date
function displayTime() {
    // Create a new Date object
    let currentDate = new Date();

    // Get the current time and date components
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    // Add leading zeros to the time components if necessary
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Format the date and time string
    let datetimeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    // Display the date and time string in an HTML element
    // console.log(datetimeString);
    document.getElementById("datetime").innerHTML = datetimeString;
    return datetimeString;
}

// TODO: add timestamp and random number to the client ID, otherwise, the client ID will be the same. When multi users use this website, this will cause a problem. each time only one unqiue client ID can be linked to the MQTT broker.
function generateUUID() {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }
    return uuid;
}