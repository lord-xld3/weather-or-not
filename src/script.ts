//#region Init
	$('#searchButton').on("click", function(){
		var cityName = $('#searchField').val()
		onSearch(cityName)
	})
	initSavedCities(null)
	const apiKey = 'b70ad42d9781f26332d6aa51e4e2722e'
//#endregion

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

function onSearch(cityName:string|number|string[]|undefined) {
	try {
		$('#content').css('display','none')
		// handle user input
		if (!cityName) throw 'City name cannot be blank'
		// clear existing results
		$('#current').children().remove()
		$('#fiveday').children().remove()
		
		// define a function that returns a promise
		const fetchData = (url: string) =>
		fetch(url)
			.then(response => {
				if (!response.ok)
					throw `Error: ${response.status}\nResponse: ${response.statusText}`
				else return response.json()
			})
			.catch(err => Promise.reject(err))
		
		// run ^^^ function twice with different parameters
		Promise.all([
			fetchData(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
				.then(data => {
					var dataRef = data
					var date:string = (`${dataRef.name} (today)`)
					parseWeather(dataRef, date, '#current')
				}),
			fetchData(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
				.then(data => {
					// jump 8x in 3hr increments (24hrs)
					// start at 7 (8th index), end after 39 (40th index)
					for (let i = 7; i < data.list.length; i += 8) {
						var dataRef = data.list[i]
						// substr to only grab mm-dd from date
						var date:string = (dataRef.dt_txt).substr(5,5)
						parseWeather(dataRef, date, '#fiveday')
					}
				})
		])
		.then(() => { // if both promises are resolved
			initSavedCities(cityName)
		})
		.then(() => {
			$('#content').css('display','flex')
		})
		.catch(err => alert(err)) // catch failed fetches
  	} catch (err) {alert(err)} // catch user input, mainly
}

function parseWeather(dataRef:any,date:string,htmlID:string){
	
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

	// define data to generate an html element
	let temp = `Temp: ${dataRef.main.temp}°C`
	let wind = `Wind: ${wind_direction}
	${dataRef.wind.speed}Km/h`
	let humid = `Humidity: ${dataRef.main.humidity}%`
	$(`${htmlID}`).append(`<div class='weathercard'><span>${date}</span><span class='iconic'>${icon}</span><span>${temp}</span><span>${wind}</span><span>${humid}</span></span>`)
}