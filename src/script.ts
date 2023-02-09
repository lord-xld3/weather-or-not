$('#searchButton').on("click",fetchWeather)

function fetchWeather(){
    try{
        var cityName = $('#searchField').val()
        if (cityName == "") 
            throw 'City name cannot be blank';
    }catch (e) {
        return alert(e)
    }

    //#region region 5-day
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=b70ad42d9781f26332d6aa51e4e2722e`)
        
    .then(response => {
        if (response.ok){
            return response.json()
        }
        else throw `Error:${response.status}\nResponse:${response.statusText}`
    })
    .catch(e=>{return alert(e)})
    
    .then(data => {
        for(let i=0; i<40; i+=8){ //Jump 8*3hrs (24hrs)
            let date = (data.list[i].dt_txt).substr(5,5)
            let iconID = data.list[i].weather[0].icon
            switch (iconID){
                case '01d':
                    var icon='☀';break
                case '02d':
                    var icon='🌤';break
                case '03d':
                    var icon='⛅';break
                case '04d':
                    var icon='☁';break
                case '09d':
                    var icon='🌦';break
                case '10d':
                    var icon='🌧';break
                case '11d':
                    var icon='⛈';break
                case '13d':
                    var icon='🌨';break
                case '50d':
                    var icon='🌫';break
                default:
                    var icon='❔'
            }
            console.log(date)
            console.log(icon)
        }
    })
    .catch(e=>{return alert(e)})
    //#endregion
}