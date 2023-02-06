"use strict";
$('#searchButton').on("click", fetchCoords);
function fetchCoords() {
    let cityName = $('#searchField').val();
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=b70ad42d9781f26332d6aa51e4e2722e`)
        .then(response => response.json().then(data => fetchWeather(data)));
}
function fetchWeather(data) {
    try {
        let lat = data[0].lat;
        let lon = data[0].lon;
        console.log(`${lat},${lon}`);
    }
    catch {
        (e) => console.log(e);
    }
}
