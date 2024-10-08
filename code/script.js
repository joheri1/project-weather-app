//API URL and Endpoints
const BASE_URL = "https://api.openweathermap.org/data/2.5/"
const api_key = "617b18d1663716ef276314bb0808d62b"

// DOM Selectors
const cityName = document.getElementById("city")
const description = document.getElementById("description")
const temperature = document.getElementById("temperature")
const sunriseTime = document.getElementById("sunrise")
const sunsetTime = document.getElementById("sunset")
const fourDayForecast = document.getElementById('four-day-forecast')

//Array with weekdays 
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Get today's date for comparison in forecast
const today = new Date().getDate() 

const weatherIcons = {
    "scattered clouds": "./assets/design-1/Group16.png", // Cloudy
    "few clouds": "./assets/design-1/Group34.png", // Few clouds
    "clear sky": "./assets/design-1/Group37.png", // Sunny
}
        
//Fetch todays weather
const fetchTodaysWeatherAsync = async (city) => {
    const todayURL = `${BASE_URL}weather?q=${city}&units=metric&APPID=${api_key}`
    // units=metric to get temperatures in Celcius
    try {
        const response = await fetch(`${todayURL}`)
        if (!response.ok) {
            throw new Error("Failed to fetch today's weather data")
        }
        //convert response to JSON
        const data = await response.json()

        //Update DOM with today's weather data
        cityName.innerHTML = data.name
        temperature.innerHTML = `${Math.round(data.main.temp)} °C`
        description.innerHTML = data.weather[0].description
        
        const weatherDescription = data.weather[0].description

        //Weather icon
        const weatherIconURL = weatherIcons[weatherDescription] || "./assets/design-1/Group16.png"; // Default icon
        console.log("Weather icon path:", weatherIconURL)
        document.getElementById("weather-icon").src = weatherIconURL


        //Sunset/Sunrise 
        
        //Convert Time zone and Sunset / Sunrise from seconds to milliseconds by multiplying by 1000, which the date object requires 
        const localTimezone = data.timezone * 1000 
        const sunrise = new Date((data.sys.sunrise * 1000) + localTimezone).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const sunset = new Date((data.sys.sunset * 1000) + localTimezone).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         
        sunriseTime.innerHTML = `Sunrise: ${sunrise}`
        sunsetTime.innerHTML = `Sunset: ${sunset}`

    } catch (error) {
     //Handle any errors 
    console.error("Error when fetching Today's weather", error)
     }
}
fetchTodaysWeatherAsync("Las Vegas")

//Fetch forecast weather
const fetchForecastWeatherAsync = async (city) => {
    const forecastURL = `${BASE_URL}forecast?q=${city}&units=metric&cnt=40&appid=${api_key}`
     // units=metric to get temperatures in Celcius and cnt=40 for a 5 day forecast, then we remove todays forecast
    try {
        const response = await fetch(`${forecastURL}`)
        if (!response.ok) {
            throw new Error("Failed to fetch forecast weather data")
      }
      //convert response to JSON
      const data = await response.json()

      //Filter forecast on 12:00
      const filteredForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt)
        return forecastDate.getHours() === 12 && forecastDate.getDate() !== today
      })
      filteredForecast.forEach(forecast => {
        let forecastDate = new Date(forecast.dt_txt)//Convert date to Date const
        let dayName = weekdays[forecastDate.getDay()] // Get weekday
        // Get weather icon
        const weatherDescription = forecast.weather[0].description
                
        //Update HTML with weekday, temperture and icon
        const forecastIconURL = weatherIcons[weatherDescription] || "./assets/design-1/Group16.png"; // Default icon
        fourDayForecast.innerHTML += `<p>${dayName}: <img src="${forecastIconURL}" alt="weather icon"> ${Math.round(forecast.main.temp)} °C</p>`
                
        })
    } catch (error) {
     //Handle any errors 
    console.error("Error when fetching the forecast", error)
     }
}
fetchForecastWeatherAsync("Las Vegas")