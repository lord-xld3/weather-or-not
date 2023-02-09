$('#searchButton').on("click",fetchWeather)

function fetchWeather(){
    try{
        var cityName = $('#searchField').val()
        if (cityName == "") 
            throw 'City name cannot be blank';
    }catch (e) {return alert(e)}

    //#region region 5-day
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=b70ad42d9781f26332d6aa51e4e2722e&units=metric`)
        
    .then(response => {
        if (response.ok){
            return response.json()
        }
        else throw `Error: ${response.status}\nResponse: ${response.statusText}`
    },e=>{return alert(e)})
    
    
    .then(data => {
        $('#5day').children().remove()
        let saved = localStorage.getItem('saved_city_names')
        if (saved==null){
            localStorage.setItem('saved_city_names',JSON.stringify([cityName]))
        }else{
            let savedArray = JSON.parse(saved)
            savedArray.push(cityName)
            localStorage.setItem('saved_city_names',JSON.stringify(savedArray))
        }
        for(let i=0; i<40; i+=8){ //Jump 8*3hrs (24hrs)

            //refer to https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
            let iconID = data.list[i].weather[0].icon 
            
            //substr because I don't want to check cases for all 'night' icons
            switch (iconID.substr(0,2)){
                case '01':var icon='☀';break
                case '02':var icon='🌤';break
                case '03':var icon='⛅';break
                case '04':var icon='☁';break
                case '09':var icon='🌦';break
                case '10':var icon='🌧';break
                case '11':var icon='⛈';break
                case '13':var icon='🌨';break
                case '50':var icon='🌫';break
                default:var icon='❔'
            }
            // which way doth the wind bloweth?
            let wind_direction = (data.list[i].wind.speed > 0 && data.list[i].wind.speed < 45)?'N'
            :(data.list[i].wind.speed > 45 && data.list[i].wind.speed < 90)?'NE'
            :(data.list[i].wind.speed > 90 && data.list[i].wind.speed < 135)?'E'
            :(data.list[i].wind.speed > 135 && data.list[i].wind.speed < 180)?'SE'
            :(data.list[i].wind.speed > 180 && data.list[i].wind.speed < 225)?'S'
            :(data.list[i].wind.speed > 225 && data.list[i].wind.speed < 270)?'SW'
            :(data.list[i].wind.speed > 270 && data.list[i].wind.speed < 315)?'W'
            :'NW'

            // substr to only grab mm-dd from date
            let date = (data.list[i].dt_txt).substr(5,5)
            let temp = `Temp: ${data.list[i].main.temp}°C`
            let wind = `Wind: ${wind_direction}${data.list[i].wind.speed} Km/h`
            let humid = `Humidity:${data.list[i].main.humidity}%`
            $('#5day').append(`<div><div>${date}</div><div>${icon}</div><div>${temp}</div><div>${wind}</div><div>${humid}</div></div>`)
        }
    },e=>{return alert(e)})
    //#endregion
}