"use strict";
$('#searchButton').on("click", function () {
    let city_name = $('#searchField').val();
    search_Button_Clicked(city_name);
});
check_And_Init_Saved_City_Names(null);
const api_key = 'b70ad42d9781f26332d6aa51e4e2722e';
function check_And_Init_Saved_City_Names(city_name) {
    let storage_data = localStorage.getItem('saved_city_names');
    if (city_name != null && storage_data == null) {
        var saved_city_array = [city_name];
        localStorage.setItem('saved_city_names', JSON.stringify(saved_city_array));
    }
    else {
        var saved_city_array = JSON.parse(storage_data);
        if (city_name != null && !(saved_city_array.includes(city_name))) {
            saved_city_array.push(city_name);
            localStorage.setItem('saved_city_names', JSON.stringify(saved_city_array));
        }
    }
    if (saved_city_array != null) {
        $('#savedCities').children().remove();
        for (let i = 0; i < saved_city_array.length; i++) {
            $('#savedCities').append(`<button class='cityButton'>${saved_city_array[i]}</button>`);
        }
        let city_button_array = document.querySelectorAll('.cityButton');
        for (let i = 0; i < city_button_array.length; i++) {
            city_button_array[i].addEventListener("click", function () {
                search_Button_Clicked($(city_button_array[i]).text());
            });
        }
    }
}
function search_Button_Clicked(city_name) {
    try {
        $('#content').css('display', 'none');
        if (!city_name)
            throw 'City name cannot be blank';
        $('#current').children().remove();
        $('#fiveday').children().remove();
        const fetch_Function = (fetch_url) => fetch(fetch_url)
            .then(fetch_response => {
            if (!fetch_response.ok)
                throw `Error: ${fetch_response.status}\nResponse: ${fetch_response.statusText}`;
            else
                return fetch_response.json();
        })
            .catch(error => Promise.reject(error));
        Promise.all([
            fetch_Function(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`)
                .then(response_data => {
                let data_reference = response_data;
                let weather_date = (`${data_reference.name} (today)`);
                parse_Weather_Data(data_reference, weather_date, '#current');
            }),
            fetch_Function(`https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${api_key}&units=metric`)
                .then(response_data => {
                for (let i = 7; i < response_data.list.length; i += 8) {
                    let data_reference = response_data.list[i];
                    let weather_date = (data_reference.dt_txt).substr(5, 5);
                    parse_Weather_Data(data_reference, weather_date, '#fiveday');
                }
            })
        ])
            .then(() => {
            check_And_Init_Saved_City_Names(city_name);
        })
            .then(() => {
            $('#content').css('display', 'flex');
        })
            .catch(error => alert(error));
    }
    catch (error) {
        alert(error);
    }
}
function parse_Weather_Data(data_reference, weather_date, html_weather_id) {
    let weather_iconID = data_reference.weather[0].icon;
    switch (weather_iconID.substr(0, 2)) {
        case '01':
            var weather_icon = '☀';
            break;
        case '02':
            var weather_icon = '🌤';
            break;
        case '03':
            var weather_icon = '⛅';
            break;
        case '04':
            var weather_icon = '☁';
            break;
        case '09':
            var weather_icon = '🌦';
            break;
        case '10':
            var weather_icon = '🌧';
            break;
        case '11':
            var weather_icon = '⛈';
            break;
        case '13':
            var weather_icon = '🌨';
            break;
        case '50':
            var weather_icon = '🌫';
            break;
        default: var weather_icon = '❔';
    }
    let wind_direction = ((data_reference.wind.deg > 0) && (data_reference.wind.deg < 45)) ? 'N⬆'
        : ((data_reference.wind.deg > 45) && (data_reference.wind.deg < 90)) ? 'NE↗'
            : ((data_reference.wind.deg > 90) && (data_reference.wind.deg < 135)) ? 'E➡'
                : ((data_reference.wind.deg > 135) && (data_reference.wind.deg < 180)) ? 'SE↘'
                    : ((data_reference.wind.deg > 180) && (data_reference.wind.deg < 225)) ? 'S⬇'
                        : ((data_reference.wind.deg > 225) && (data_reference.wind.deg < 270)) ? 'SW↙'
                            : ((data_reference.wind.deg > 270) && (data_reference.wind.deg < 315)) ? 'W⬅'
                                : 'NW↖';
    let weather_temp = `Temp: ${data_reference.main.temp}°C`;
    let weather_wind = `Wind: ${wind_direction}
	${data_reference.wind.speed}Km/h`;
    let weather_humidity = `Humidity: ${data_reference.main.humidity}%`;
    $(`${html_weather_id}`).append(`<div class='weathercard'><span>${weather_date}</span><span class='iconic'>${weather_icon}</span><span>${weather_temp}</span><span>${weather_wind}</span><span>${weather_humidity}</span></span>`);
}
