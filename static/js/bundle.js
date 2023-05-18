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

getHumidityGauge(40);//test humidity gauge
getNetworkGauge(80)

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
    // subscribe to WiFi topic
    client.subscribe("birdFeeder$@NsCc&_%/WiFi/#");

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
            // document.getElementById("humidity").innerHTML =
            sensorsJson.humidity;
            // add data visualization
            getHumidityGauge(30);
            // getHeatIndexGauge(25, 70);

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

        if (topic === "birdFeeder$@NsCc&_%/WiFi") {
            // Wifi topic
            let wifi = message;
            // const wifi = photo.toString();
            const wifiJson = JSON.parse(wifi.toString());
            console.log(`WiFi: ${wifiJson}`);
            document.getElementById("network").innerHTML = wifiJson;
            // add data visualization
            // getBatteryGauge(wifiJson);

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
            <img src="/static/images/weather/${weatherIcon}.svg" alt="${weatherName}">
            <p>${weatherName}</p>
            <span>${lowestTemp}<sup>°</sup><small>/</small>${highestTemp}<sup>°</sup></span></div>`;

            if (i == 0) {
                // display today's weather data on weather today section, only the icon
                const weatherTodayIcon = document.getElementById("weatherToday");
                weatherTodayIcon.innerHTML = `<img src="/static/images/weather/${weatherIcon}.svg" alt="${weatherName}">`;
            }
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

// TODO: connect to image API, http://192.168.1.207:3000/api/images


const requestImages = new XMLHttpRequest();

requestImages.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response);
        // Array of images, length 5
        // test: console time
        let time = processTime(response.images[0].filetime);
        // console.log("haha" + time);
        const imageDiv = document.getElementById("image");
        imageDiv.innerHTML = `<img src="${response.images[0].filepath}" alt="bird"><span id="time">${time}</span>`;
        // update other 4 pictures
        const otherImages = document.getElementsByClassName("other-picture");
        // console.log(otherImages);
        for (let i = 0; i < otherImages.length; i++) {
            // console.log(otherImagesp[i]);
            otherImages[i].innerHTML = `<img src="${response.images[i + 1].filepath}" alt="bird"><span id="time">${processTime(response.images[i + 1].filetime)}</span>`;
        }
    } else {
        console.log("error");
    }
};
requestImages.open(
    `GET`,
    `http://192.168.1.207:3000/api/images`
);
requestImages.send();

// process time
function processTime(originTime) {
    // covert 1684259797846 into 10/16/2023 16:09:57
    let date = new Date(originTime);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let processedTime = `${month}/${day}/${year} ${hour}:${minute}:${second}`;
    return processedTime;
}


// Data Visualization functions
//Humidity Widget
function getHumidityGauge(humidity) {
    // console.log('data visual humidity');
    let circulargauge = new ej.circulargauge.CircularGauge({
        axes: [{
            radius: '100%',
            minimum: 0,
            maximum: 100,
            startAngle: 240,
            endAngle: 120,
            lineStyle: { width: 0 },
            majorTicks: { color: 'white', offset: -5, height: 12 },
            minorTicks: { width: 0 },
            labelStyle: {
                useRangeColor: true,
                font: {
                    color: '#424242',
                    size: '20px',
                    fontFamily: 'Poppins',
                    fontWeight: 'bold'
                }
            },
            annotations: [{
                content:
                    '<div id="humidityTxt" style="font-size: 35px">' + humidity + "%</div>",
                radius: "-60%",
                angle: 0,
                zIndex: "1",
            }],
            pointers: [{
                value: humidity,
                radius: '60%',
                color: '#76eeef',
                cap: { radius: 10, border: { color: '#33BCBD', width: 5 } },
                animation: { enable: true, duration: 1500 }
            }],
            ranges: [{
                start: 0,
                end: 50,
                startWidth: 10, endWidth: 10,
                radius: '102%',
                color: '#76eeef',
            }, {
                start: 50,
                end: 120,
                radius: '102%',
                startWidth: 10, endWidth: 10,
                color: '#54b4b5',
            }]
        }],

    });
    circulargauge.appendTo('#humidityVisual');
}

//Network Widget
function getNetworkGauge(value) {
    let circulargauge = new ej.circulargauge.CircularGauge({
        axes: [
            {
                startAngle: 0,
                endAngle: 360,
                lineStyle: { width: 0 },
                labelStyle: {
                    font: {
                        fontFamily: "Roboto",
                        fontStyle: "Regular",
                        size: "0px",
                        fontWeight: "Regular",
                    },
                },
                annotations: [
                    {
                        content:
                            '<div id="battery-life" style="font-size: 35px">' + value + "%</div>",
                        radius: "0%",
                        angle: 0,
                        zIndex: "1",
                    },
                ],
                ranges: [
                    {
                        start: 0,
                        end: 100,
                        radius: "100%",
                        startWidth: 30,
                        endWidth: 30,
                        color: "#E0E0E0",
                    },
                ],
                pointers: [
                    {
                        value: value,
                        radius: "100%",
                        pointerWidth: 30,
                        color: "#53a7a7",
                        type: "RangeBar"
                    },
                ],
                majorTicks: { width: 0 },
                minorTicks: { width: 0 },
            },
        ],
    });

    circulargauge.appendTo("#NetworkVisual");
}

