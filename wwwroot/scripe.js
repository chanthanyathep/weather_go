/* function display1Weather() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var weatherRequest = {
        Day: date
    }
    var requestPayload = JSON.stringify(weatherRequest);

    const xhttp = new XMLHttpRequest;
    xhttp.onload = function () {
        var statusCode = this.status;
        var responseBody = this.responseText;
        console.log(statusCode);
        console.log(responseBody);
        if (statusCode === 200) {
            render1Weather(responseBody);
        } else {
            console.log("error" + statusCode);
        }
    }
    xhttp.open("POST", "/getWeather");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(requestPayload);
}

function render1Weather(responseBody) {
    var responseObject = JSON.parse(responseBody);
    var tableData = document.getElementById('data');
    var header = tableData.insertRow();
    var weathers = responseObject.weather;

    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Date';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Weather';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Sunrise';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Sunset';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Wind';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Temp(c)';
    var RowData = document.createElement("tr");
    cellHeader = RowData.insertCell();
    cellHeader.innerHTML = weathers.day
    cellHeader = RowData.insertCell();
    cellHeader.innerHTML = weathers.weather
    cellHeader = RowData.insertCell();
    cellHeader.innerHTML = weathers.sunrise
    cellHeader = RowData.insertCell();
    cellHeader.innerHTML = weathers.sunset
    cellHeader = RowData.insertCell();
    cellHeader.innerHTML = weathers.wind
    cellHeader = RowData.insertCell();
    cellHeader.innerHTML = weathers.temp
    tableData.appendChild(RowData);
} */


function displayWeather() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var statusCode = this.status;
        var responseBody = this.responseText;
        if (statusCode === 200) {
            renderWeather(responseBody);
        }
    }
    xhttp.open("GET", "/getAllWeather");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function renderWeather(responseBody) {
    var responseObject = JSON.parse(responseBody)
    var tableData = document.getElementById('data');
    console.log(responseObject);
    var header = tableData.insertRow();
    var weathers = responseObject.weathers;

    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Date';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Weather';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Sunrise';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Sunset';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Wind';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Temp(c)';
    var cellHeader = header.insertCell();
    cellHeader.innerHTML = 'Edit';

    for (let index = 0; index < weathers.length; index++) {
        //  var RowData = tableData.insertRow();
        var RowData = document.createElement("tr");
        cellHeader = RowData.insertCell();
        cellHeader.innerHTML = weathers[index].day
        cellHeader = RowData.insertCell();
        cellHeader.innerHTML = weathers[index].weather
        cellHeader = RowData.insertCell();
        cellHeader.innerHTML = weathers[index].sunrise
        cellHeader = RowData.insertCell();
        cellHeader.innerHTML = weathers[index].sunset
        cellHeader = RowData.insertCell();
        cellHeader.innerHTML = weathers[index].wind + " km/h"
        cellHeader = RowData.insertCell();
        cellHeader.innerHTML = weathers[index].temp
        cellHeader = RowData.insertCell();
        var button = document.createElement("button");
        var w = {
            weather_id: weathers[index].weather_id,
            day: weathers[index].day,
            weather: weathers[index].weather,
            sunrise: weathers[index].sunrise,
            sunset: weathers[index].sunset,
            wind: weathers[index].wind,
            temp: weathers[index].temp
        }
        button.innerHTML = "edit";
        button.setAttribute("onclick", "editWeather(" + JSON.stringify(w) + ")")
        cellHeader.appendChild(button);
        tableData.appendChild(RowData);
    }

}

function editWeather(weather) {
    console.log(weather);
    document.getElementById("overlay").style.display = "flex";
    document.getElementById("popup").style.display = "flex";
    document.getElementById("Date").value = weather.day;
    document.getElementById("Weather").value = weather.weather;
    document.getElementById("Sunrise").value = weather.sunrise;
    document.getElementById("Sunset").value = weather.sunset;
    document.getElementById("Wind").value = weather.wind;
    document.getElementById("Temp").value = weather.temp;
    document.getElementById("Weather_id").value = weather.weather_id;
}

function updateWeather() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    var Id = document.getElementById("Weather_id").value;
    var Date = document.getElementById("Date").value;
    var Weather = document.getElementById("Weather").value;
    var Sunrise = document.getElementById("Sunrise").value;
    var Sunset = document.getElementById("Sunset").value;
    var Wind = document.getElementById("Wind").value;
    var Temp = document.getElementById("Temp").value;

    var weather = {
        weather_id: Id,
        day: Date,
        weather: Weather,
        sunrise: Sunrise,
        sunset: Sunset,
        wind: Wind,
        temp: Temp
    }

    var requestPayload = JSON.stringify(weather);

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var statusCode = this.status;
        var responseBody = this.responseText;
        if (statusCode == 200) {
            document.getElementById("data").innerHTML = "";
            displayWeather();
        }
    }
    xhttp.open("PUT", "/updateWeather");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(requestPayload);
}

function newWeather() {
    var date = document.getElementById("Date").value;
    var weather = document.getElementById("Weather").value;
    var sunrise = document.getElementById("Sunrise").value;
    var sunset = document.getElementById("Sunset").value;
    var wind = document.getElementById("Wind").value;
    var temp = document.getElementById("Temp").value;

    var weatherRequest = {
        day: date,
        weather: weather,
        sunrise: sunrise,
        sunset: sunset,
        wind: wind,
        temp: temp
    }

    var requestPayload = JSON.stringify(weatherRequest);

    const xhttp = new XMLHttpRequest;
    xhttp.onload = function() {
        var statusCode = this.status;
        var responseBody = this.responseText;

        console.log(responseBody);
    }
    xhttp.open("POST", "/insertWeather");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(requestPayload);
}