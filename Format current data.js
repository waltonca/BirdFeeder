var icon = {};

var units = flow.get('units');
if (units === undefined) { units = 'imperial'; }

function timeConvert(UNIX_timestamp) {
    var dateObject = new Date(UNIX_timestamp * 1000);
    if (flow.get('hour12')) {  // 12 hour time format
        return dateObject.toLocaleString('en', { timezone: msg.payload.timezone, hour12: true, hour: 'numeric', minute: '2-digit' }).toLowerCase();
    } else {  // 24 hour time format
        return dateObject.toLocaleString('en', { timezone: msg.payload.timezone, hour12: false, hour: 'numeric', minute: '2-digit' });
    }
}

var degreesToCardinal = function (deg) {
    if (deg > 11.25 && deg <= 33.75) { return "NNE"; }
    else if (deg > 33.75 && deg < 56.25) { return "NE"; }
    else if (deg > 56.25 && deg < 78.75) { return "ENE"; }
    else if (deg > 78.75 && deg < 101.25) { return "E"; }
    else if (deg > 101.25 && deg < 123.75) { return "ESE"; }
    else if (deg > 123.75 && deg < 146.25) { return "SE"; }
    else if (deg > 146.25 && deg < 168.75) { return "SSE"; }
    else if (deg > 168.75 && deg < 191.25) { return "S"; }
    else if (deg > 191.25 && deg < 213.75) { return "SSW"; }
    else if (deg > 213.75 && deg < 236.25) { return "SW"; }
    else if (deg > 236.25 && deg < 258.75) { return "WSW"; }
    else if (deg > 258.75 && deg < 281.25) { return "W"; }
    else if (deg > 281.25 && deg < 303.75) { return "WNW"; }
    else if (deg > 303.75 && deg < 326.25) { return "NW"; }
    else if (deg > 326.25 && deg < 348.75) { return "NNW"; }
    else { return "N"; }
}

if (units == "imperial") {
    msg.payload.current.temp = msg.payload.current.temp.toFixed() + ' °F';
    msg.payload.current.wind_speed = msg.payload.current.wind_speed.toFixed() + ' mph';
}
else  // metric units
{
    msg.payload.current.temp = msg.payload.current.temp.toFixed(1) + ' °C';
    msg.payload.current.wind_speed = msg.payload.current.wind_speed.toFixed(1) + ' m/s';
}

msg.payload.current.wind_cardinal = degreesToCardinal(msg.payload.current.wind_deg);

msg.payload.current.sunrise = timeConvert(msg.payload.current.sunrise);
msg.payload.current.sunset = timeConvert(msg.payload.current.sunset);

var iconString = 'wi-owm-' + msg.payload.current.weather[0].icon + ' wi-4x';
icon = {
    ui_control: {
        icon: iconString
    }
};

return [msg, icon];