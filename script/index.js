const mqtt = require('mqtt');

// fake data
const jsonData = {
    "temperature": 20,
    "humidity": 50,
    "foodLevel": 50
};

const options = {
    clientId: 'clientId-walton',
    username: 'birdfeeder',
    password: 'Nscc123!@#'
}

const client = mqtt.connect('tls://472339bf0ec7420b8edde1e3c394c04e.s2.eu.hivemq.cloud', options);

const jsonDataString = JSON.stringify(jsonData);

console.log("Connecting mqtt client");

client.on('connect', function() {
    console.log("Connected to mqtt client");

    client.subscribe('birdFeeder')
    
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
        // client.end();
    });
})

client.on('error', function(error) {
    console.log("Can't connect to mqtt client" + error);
    process.exit(1);
})

