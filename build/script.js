"use strict";
$('#searchButton').on("click", fetchCoords);
function fetchCoords() {
    try {
        let cityName = $('#searchField').val();
        if (cityName == "")
            throw "City name cannot be blank";
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=b70ad42d9781f26332d6aa51e4e2722e`)
            .then(response => response.json()
            .then(data => fetchWeather(data))
            .catch(e => { alert(e); }));
    }
    catch (e) {
        alert(e);
    }
}
function fetchWeather(data) {
    if (data[0] == undefined)
        throw "Cannot find city";
    let lat = data[0].lat;
    let lon = data[0].lon;
    console.log(`${lat},${lon}`);
}
