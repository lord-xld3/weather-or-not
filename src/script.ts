$('#searchButton').on("click", function(){
	var cityName = $('#searchField').val()
	onSearch(cityName)
})
initSavedCities(null)
const apiKey = 'b70ad42d9781f26332d6aa51e4e2722e'

function initSavedCities(cityName:any){
	
	// handle localStorage
	let saved:any = localStorage.getItem('saved_city_names')
	if (cityName!=null && saved==null){
		// initialize storage
		var savedArray = [cityName]
		localStorage.setItem('saved_city_names', JSON.stringify(savedArray))
	}
	else {
		var savedArray:any[] = JSON.parse(saved)
		if (cityName!=null && !(savedArray.includes(cityName))){
			// push unique city to storage
			savedArray.push(cityName)
			localStorage.setItem('saved_city_names', JSON.stringify(savedArray))
		}
	}

	// remove then create buttons for saved cities
	if (savedArray!=null){
		$('#savedCities').children().remove()
		for (let i = 0; i < savedArray.length; i++){
			$('#savedCities').append(`<button class='cityButton'>${savedArray[i]}</button>`)
		}

		// add event listeners for each button created
		let buttonArray = document.querySelectorAll('.cityButton')
		for (let i = 0; i < buttonArray.length; i++){
			buttonArray[i].addEventListener("click",function(){
				onSearch($(buttonArray[i]).text())
			})
		}
	}
}

function onSearch(cityName:any) {
	try {
		// handle user input
		if (!cityName) throw 'City name cannot be blank'
		// clear existing results
		$('#current').children().remove()
		$('#5day').children().remove()

		// define a function that returns a promise
		const fetchData = (url: string) =>
		fetch(url)
			.then(response => {
				if (!response.ok)
					throw `Error: ${response.status}\nResponse: ${response.statusText}`
				else return response.json()
			})
			.catch(err => Promise.reject(err))

		Promise.all([
			fetchData(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
				.then(data => {
					parseWeather(data, null, '#current')
				}),
			fetchData(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
				.then(data => {
					for (let i = 0; i < 40; i += 8) {
						parseWeather(data, i, '#5day')
					}
				})
		])
		.then(() => { // if both promises are resolved
			initSavedCities(cityName)
		})
		.catch(err => alert(err)) // catch failed fetches
  	} catch (err) {alert(err)} // catch user input, mainly
}

function parseWeather(data:any,i:number|null,htmlID:string){
	if (i!=null){
		// refer to data.list[i] for 5-day only
		var dataRef = data.list[i]
		
		// substr to only grab mm-dd from date
		var date:string = (dataRef.dt_txt).substr(5,5)
	}else {
		// refer to data for current day
		var dataRef = data
		
		// get current date
		let dateObj = new Date()
		let mm:number|string = dateObj.getMonth()+1
		let dd:number|string = dateObj.getDate()
		if (mm<10) mm = '0' + mm
		if (dd<10) dd = '0' + dd
		var date:string = (`${mm}-${dd}`)
	}
	
	//refer to https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
	let iconID = dataRef.weather[0].icon 
					
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
	let wind_direction = ((dataRef.wind.deg > 0) && (dataRef.wind.deg < 45))?'N⬆'
	:((dataRef.wind.deg > 45) && (dataRef.wind.deg < 90))?'NE↗'
	:((dataRef.wind.deg > 90) && (dataRef.wind.deg < 135))?'E➡'
	:((dataRef.wind.deg > 135) && (dataRef.wind.deg < 180))?'SE↘'
	:((dataRef.wind.deg > 180) && (dataRef.wind.deg < 225))?'S⬇'
	:((dataRef.wind.deg > 225) && (dataRef.wind.deg < 270))?'SW↙'
	:((dataRef.wind.deg > 270) && (dataRef.wind.deg < 315))?'W⬅'
	:'NW↖'

	// define data to return to generate an html element
	let temp = `Temp: ${dataRef.main.temp}°C`
	let wind = `Wind: ${wind_direction}${dataRef.wind.speed} Km/h`
	let humid = `Humidity:${dataRef.main.humidity}%`
	$(`${htmlID}`).append(`<div><div>${date}</div><div>${icon}</div><div>${temp}</div><div>${wind}</div><div>${humid}</div></div>`)
}