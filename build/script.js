"use strict";
$('#searchButton').on("click", onSearch);
var apiKey = 'b70ad42d9781f26332d6aa51e4e2722e';
function onSearch() {
    try {
        var cityName = $('#searchField').val();
        if (cityName == "")
            throw 'City name cannot be blank';
        $('#current').children().remove();
        $('#5day').children().remove();
        const fetchCurrentWeather = new Promise((resolve, reject) => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
                .then(response => checkResponse(response)).catch(err => reject(err))
                .then(data => {
                parseWeather(data, null, '#current');
            });
        });
        const fetch5dayWeather = new Promise((resolve, reject) => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
                .then(response => checkResponse(response)).catch(err => reject(err))
                .then(data => {
                for (let i = 0; i < 40; i += 8) {
                    parseWeather(data, i, '#5day');
                }
            });
        });
        Promise.all([fetchCurrentWeather, fetch5dayWeather])
            .then(_ => {
            let saved = localStorage.getItem('saved_city_names');
            if (saved == null) {
                localStorage.setItem('saved_city_names', JSON.stringify([cityName]));
            }
            else {
                let savedArray = JSON.parse(saved);
                savedArray.push(cityName);
                localStorage.setItem('saved_city_names', JSON.stringify(savedArray));
            }
        });
    }
    catch (err) {
        alert(err);
    }
}
function checkResponse(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        throw `Error: ${response.status}\nResponse: ${response.statusText}`;
    }
}
function parseWeather(data, i, htmlID) {
    if (i != null) {
        var dataRef = data.list[i];
        var date = (dataRef.dt_txt).substr(5, 5);
    }
    else {
        var dataRef = data;
        let dateObj = new Date();
        let mm = dateObj.getMonth() + 1;
        let dd = dateObj.getDate();
        if (mm < 10)
            mm = '0' + mm;
        if (dd < 10)
            dd = '0' + dd;
        var date = (`${mm}-${dd}`);
    }
    let iconID = dataRef.weather[0].icon;
    switch (iconID.substr(0, 2)) {
        case '01':
            var icon = '☀';
            break;
        case '02':
            var icon = '🌤';
            break;
        case '03':
            var icon = '⛅';
            break;
        case '04':
            var icon = '☁';
            break;
        case '09':
            var icon = '🌦';
            break;
        case '10':
            var icon = '🌧';
            break;
        case '11':
            var icon = '⛈';
            break;
        case '13':
            var icon = '🌨';
            break;
        case '50':
            var icon = '🌫';
            break;
        default: var icon = '❔';
    }
    let wind_direction = ((dataRef.wind.deg > 0) && (dataRef.wind.deg < 45)) ? 'N⬆'
        : ((dataRef.wind.deg > 45) && (dataRef.wind.deg < 90)) ? 'NE↗'
            : ((dataRef.wind.deg > 90) && (dataRef.wind.deg < 135)) ? 'E➡'
                : ((dataRef.wind.deg > 135) && (dataRef.wind.deg < 180)) ? 'SE↘'
                    : ((dataRef.wind.deg > 180) && (dataRef.wind.deg < 225)) ? 'S⬇'
                        : ((dataRef.wind.deg > 225) && (dataRef.wind.deg < 270)) ? 'SW↙'
                            : ((dataRef.wind.deg > 270) && (dataRef.wind.deg < 315)) ? 'W⬅'
                                : 'NW↖';
    let temp = `Temp: ${dataRef.main.temp}°C`;
    let wind = `Wind: ${wind_direction}${dataRef.wind.speed} Km/h`;
    let humid = `Humidity:${dataRef.main.humidity}%`;
    $(`${htmlID}`).append(`<div><div>${date}</div><div>${icon}</div><div>${temp}</div><div>${wind}</div><div>${humid}</div></div>`);
}
