"use strict";
$('#searchButton').on("click", function () {
    var cityName = $('#searchField').val();
    onSearch(cityName);
});
initSavedCities(null);
const apiKey = 'b70ad42d9781f26332d6aa51e4e2722e';
function initSavedCities(cityName) {
    let saved = localStorage.getItem('saved_city_names');
    if (cityName != null && saved == null) {
        var savedArray = [cityName];
        localStorage.setItem('saved_city_names', JSON.stringify(savedArray));
    }
    else {
        var savedArray = JSON.parse(saved);
        if (cityName != null && !(savedArray.includes(cityName))) {
            savedArray.push(cityName);
            localStorage.setItem('saved_city_names', JSON.stringify(savedArray));
        }
    }
    if (savedArray != null) {
        $('#savedCities').children().remove();
        for (let i = 0; i < savedArray.length; i++) {
            $('#savedCities').append(`<button class='cityButton'>${savedArray[i]}</button>`);
        }
        let buttonArray = document.querySelectorAll('.cityButton');
        for (let i = 0; i < buttonArray.length; i++) {
            buttonArray[i].addEventListener("click", function () {
                onSearch($(buttonArray[i]).text());
            });
        }
    }
}
function onSearch(cityName) {
    try {
        $('#content').css('display', 'none');
        if (!cityName)
            throw 'City name cannot be blank';
        $('#current').children().remove();
        $('#fiveday').children().remove();
        const fetchData = (url) => fetch(url)
            .then(response => {
            if (!response.ok)
                throw `Error: ${response.status}\nResponse: ${response.statusText}`;
            else
                return response.json();
        })
            .catch(err => Promise.reject(err));
        Promise.all([
            fetchData(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
                .then(data => {
                parseWeather(data, null, '#current');
            }),
            fetchData(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
                .then(data => {
                for (let i = 0; i < 40; i += 8) {
                    parseWeather(data, i, '#fiveday');
                }
            })
        ])
            .then(() => {
            initSavedCities(cityName);
        })
            .then(() => {
            $('#content').css('display', 'flex');
        })
            .catch(err => alert(err));
    }
    catch (err) {
        alert(err);
    }
}
function parseWeather(data, i, htmlID) {
    if (i != null) {
        var dataRef = data.list[i];
        var date = (dataRef.dt_txt).substr(5, 5);
    }
    else {
        var dataRef = data;
        var date = (`${dataRef.name} (today)`);
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
    $(`${htmlID}`).append(`<div class='weathercard'><span>${date}</span><span class='iconic'>${icon}</span><span>${temp}</span><span>${wind}</span><span>${humid}</span></span>`);
}
