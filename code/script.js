// ========== Config ==========
const BASE_URL = "/.netlify/functions/fetchWeather";
const BASE_URL_FORECAST = "/.netlify/functions/fetchForecast";

const weatherIcons = {
  "scattered clouds": "./assets/design-2/noun_Cloud_1188486.svg",
  "few clouds": "./assets/design-2/noun_Cloud_1188486.svg",
  "clear sky": "./assets/design-2/Group37.png",
  "rain": "./assets/design-2/noun_Umbrella_2030530.svg"
};

const weatherMessages = {
  "clear sky": (city) => `Put your sunglasses on – the sun is shining in <strong>${city}</strong>!`,
  "few clouds": (city) => `A few clouds in <strong>${city}</strong> won't ruin your day!`,
  "scattered clouds": (city) => `Clouds are just <strong>${city}</strong>’s blanket.`,
  "rain": (city) => `Grab your umbrella if you're in <strong>${city}</strong> today!`,
  "snow": (city) => `It’s a <strong>${city}</strong> winter wonderland out there!`
};

const backgroundColors = {
  "clear sky": "#ffe082",
  "few clouds": "#b3e5fc",
  "scattered clouds": "#90caf9",
  "rain": "#4fc3f7",
  "snow": "#e1f5fe"
};

// ========== DOM Elements ==========
const description = document.getElementById("description");
const sunriseTime = document.getElementById("sunrise");
const sunsetTime = document.getElementById("sunset");
const fourDayForecast = document.getElementById("four-day-forecast");
const searchCityInput = document.getElementById("search-city");
const searchButton = document.getElementById("search-button");

// ========== Helpers ==========
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date().getDate();

// ========== Weather Fetch ==========
const fetchTodaysWeatherAsync = async (city) => {
  const todayURL = `${BASE_URL}?city=${city}`;

  try {
    const response = await fetch(todayURL);
    if (!response.ok) throw new Error("Failed to fetch today's weather");

    const data = await response.json();

    // Extract and set data
    const weatherDescription = data.weather[0].description;
    const capitalizedDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    description.innerHTML = `${capitalizedDescription} | ${Math.round(data.main.temp)} °C`;
    cityName.innerHTML = data.name;
    temperature.innerHTML = `${Math.round(data.main.temp)} °C`;

    // Weather icon
    const weatherIconURL = weatherIcons[weatherDescription] || "./assets/design-2/noun_Cloud_1188486.svg";
    document.getElementById("weather-icon").src = weatherIconURL;

    // Sunrise/Sunset
    const localTimezone = data.timezone * 1000;
    const sunrise = new Date((data.sys.sunrise * 1000) + localTimezone).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date((data.sys.sunset * 1000) + localTimezone).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunriseTime.innerHTML = `Sunrise: ${sunrise}`;
    sunsetTime.innerHTML = `Sunset: ${sunset}`;

    // Set cheezy weather text
    const getWeatherMessage = weatherMessages[weatherDescription];
    const personalizedMessage = getWeatherMessage
      ? getWeatherMessage(data.name)
      : `Enjoy the weather in <strong>${data.name}</strong>!`;

      document.getElementById("weather-message").innerHTML = personalizedMessage;

    // Background color
    const newBg = backgroundColors[weatherDescription] || "#e0e0e0";
    document.querySelector(".weather-container").style.backgroundColor = newBg;

    // Night mode
    const now = new Date().getTime();
    const sunsetTimestamp = data.sys.sunset * 1000;
    const container = document.querySelector(".weather-container");
    if (now > sunsetTimestamp) {
      container.classList.add("night-mode");
    } else {
      container.classList.remove("night-mode");
    }

  } catch (error) {
    console.error("Error fetching today's weather", error);
  }
};

// ========== Forecast Fetch ==========
const fetchForecastWeatherAsync = async (city) => {
  const forecastURL = `${BASE_URL_FORECAST}?city=${city}`;

  try {
    const response = await fetch(forecastURL);
    if (!response.ok) throw new Error("Failed to fetch forecast");

    const data = await response.json();

    const filteredForecast = data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt_txt);
      return forecastDate.getHours() === 12 && forecastDate.getDate() !== today;
    });

    fourDayForecast.innerHTML = "";

    filteredForecast.forEach(forecast => {
      const date = new Date(forecast.dt_txt);
      const dayName = weekdays[date.getDay()];
      const tempMin = Math.round(forecast.main.temp_min);
      const tempMax = Math.round(forecast.main.temp_max);
    
      fourDayForecast.innerHTML += `
        <p>${dayName}: ${tempMin} / ${tempMax} °C</p>`;
    });

  } catch (error) {
    console.error("Error fetching forecast", error);
  }
};

// ========== Events ==========
searchButton.addEventListener("click", () => {
  const city = searchCityInput.value.trim();
  if (city) {
    fetchTodaysWeatherAsync(city);
    fetchForecastWeatherAsync(city);
  }
});

searchCityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

// ========== Default city ==========
document.addEventListener("DOMContentLoaded", () => {
  const defaultCity = "Las Vegas";
  fetchTodaysWeatherAsync(defaultCity);
  fetchForecastWeatherAsync(defaultCity);
});

