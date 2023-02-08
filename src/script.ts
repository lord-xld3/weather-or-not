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
            console.log(data.list[i])
        }
    })
    .catch(e=>{return alert(e)})
    //#endregion
}