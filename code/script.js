//API URL and Endpoints
const BASE_URL = "/.netlify/functions/fetchWeather";
const BASE_URL_FORECAST = "/.netlify/functions/fetchForecast";

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
    "scattered clouds": "./assets/design-1/noun_Cloud_1188486.svg", // Cloudy
    "few clouds": "./assets/design-1/noun_Cloud_1188486.svg", // Few clouds
    "clear sky": "./assets/design-1/Group37.png", // Sunny
    "rain": "./assets/design-1/noun_Umbrella_2030530.svg", // Rainy
}
  const weatherMessages = {
    "clear sky": "Put your sunglasses on - the sun is shining! 😎",
    "few clouds": "A few clouds won't ruin your day! ☁️",
    "scattered clouds": "Clouds are just nature’s blanket. 😌",
    "rain": "Grab your umbrella! ☔",
    "snow": "It’s a winter wonderland out there! ❄️",
  };
  const backgroundColors = {
    "clear sky": "#ffe082",    
    "few clouds": "#b3e5fc",    
    "scattered clouds": "#90caf9",
    "rain": "#4fc3f7",
    "snow": "#e1f5fe",
  };
        
//Fetch todays weather
const fetchTodaysWeatherAsync = async (city) => {
    const todayURL = `${BASE_URL}?city=${city}`;

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

        //Capitalize the description
        const rawDescription = data.weather[0].description
        const capitalizedDescription = rawDescription.charAt(0).toUpperCase() + rawDescription.slice(1)
        description.innerHTML = capitalizedDescription

        // Save description in a varible to get the icons
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
    const forecastURL = `${BASE_URL_FORECAST}?city=${city}`;

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

      fourDayForecast.innerHTML = ""

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
// Las Vegas is default
fetchTodaysWeatherAsync("Las Vegas")
fetchForecastWeatherAsync("Las Vegas")

// Add input field functionality 

const searchCityInput = document.getElementById("search-city")
const searchButton = document.getElementById("search-button")

searchButton.addEventListener("click", () => {
  const city = searchCityInput.value.trim()
  if (city !== "") {
    // Clear forecast
    fourDayForecast.innerHTML = ""
    // Fetch weather for searched city
    fetchTodaysWeatherAsync(city)
    fetchForecastWeatherAsync(city)
  }
})

searchCityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click()
  }
})

