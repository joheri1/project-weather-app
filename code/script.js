const BASE_URL = "/.netlify/functions/fetchWeather";
const BASE_URL_FORECAST = "/.netlify/functions/fetchForecast";

const weatherIcons = {
  clear: "./assets/design-2/noun_Sunglasses_2055147.svg",
  clouds: "./assets/design-2/noun_Cloud_1188486.svg",
  rain: "./assets/design-2/noun_Umbrella_2030530.svg",
  snow: "./assets/design-2/snowflake.png",
};
const weatherCategories = {
  "clear sky": "clear",
  "few clouds": "clouds",
  "scattered clouds": "clouds",
  "broken clouds": "clouds",
  "overcast clouds": "clouds",
  "light rain": "rain",
  "moderate rain": "rain",
  "heavy intensity rain": "rain",
  "shower rain": "rain",
  "rain": "rain",
  "thunderstorm": "rain",
  "light snow": "snow",
  "snow": "snow"
};

const weatherMessages = {
  clear: (city) => `Put your sunnies on – <strong>${city}</strong> is looking rather great today!`,
  clouds: (city) => `Clouds are just <strong>${city}</strong>’s blanket.`,
  rain: (city) => `Grab your umbrella if you're in <strong>${city}</strong> today!`,
  snow: (city) => `It’s a <strong>${city}</strong> winter wonderland out there!`
};

const description = document.getElementById("description");
const sunriseTime = document.getElementById("sunrise");
const sunsetTime = document.getElementById("sunset");
const fourDayForecast = document.getElementById("four-day-forecast");
const searchCityInput = document.getElementById("search-city");
const searchButton = document.getElementById("search-button");

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date().getDate();

const fetchTodaysWeatherAsync = async (city) => {
  const todayURL = `${BASE_URL}?city=${city}`;

  try {
    const response = await fetch(todayURL);
    if (!response.ok) throw new Error("Failed to fetch today's weather");

    const data = await response.json();
    const fetchedDescription = data.weather[0].description;
    const weatherDescription = weatherCategories[fetchedDescription] || "default";
    const capitalizedDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    description.innerHTML = `${capitalizedDescription} | ${Math.round(data.main.temp)} °C`;

    const weatherIconURL = weatherIcons[weatherDescription] || "./assets/design-2/noun_Cloud_1188486.svg";
    document.getElementById("weather-icon").src = weatherIconURL;

    const localTimezone = data.timezone * 1000;
    const sunrise = new Date((data.sys.sunrise * 1000) + localTimezone).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date((data.sys.sunset * 1000) + localTimezone).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunriseTime.innerHTML = `Sunrise: ${sunrise}`;
    sunsetTime.innerHTML = `Sunset: ${sunset}`;

    const getWeatherMessage = weatherMessages[weatherDescription];
    const personalizedMessage = getWeatherMessage
      ? getWeatherMessage(data.name)
      : `Enjoy the weather in <strong>${data.name}</strong>!`;
    document.getElementById("weather-message").innerHTML = personalizedMessage;

    const container = document.querySelector(".weather-container");

    // Themes
    const themeClass = `theme-${weatherDescription.replace(/\s+/g, "-")}`;
    container.classList.remove(
      "theme-clear-sky",
      "theme-few-clouds",
      "theme-scattered-clouds",
      "theme-broken-clouds",
      "theme-rain",
      "theme-snow",
      "theme-light-snow"
    );
    container.classList.add(themeClass);

    // 🌙 Night mode
    const now = new Date().getTime();
    const sunsetTimestamp = data.sys.sunset * 1000;

    if (now > sunsetTimestamp) {
      container.classList.add("night-mode");
      document.body.classList.add("night-mode");

      document.getElementById("weather-message").innerHTML = `Have a good night in <strong>${data.name}</strong> 🌙`;
      document.getElementById("weather-icon").src = "./assets/design-2/moon.png";
      document.getElementById("weather-icon").alt = "Moon icon";
    } else {
      container.classList.remove("night-mode");
      document.body.classList.remove("night-mode");

      const getWeatherMessage = weatherMessages[weatherDescription];
      const personalizedMessage = getWeatherMessage
        ? getWeatherMessage(data.name)
        : `Enjoy the weather in <strong>${data.name}</strong>!`;

      document.getElementById("weather-message").innerHTML = personalizedMessage;

      const weatherIconURL = weatherIcons[weatherDescription] || "./assets/design-2/noun_Cloud_1188486.svg";
      document.getElementById("weather-icon").src = weatherIconURL;
    }

  } catch (error) {
    console.error("Error fetching today's weather", error);
  }
};

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

document.addEventListener("DOMContentLoaded", () => {
  const defaultCity = "Stockholm";
  fetchTodaysWeatherAsync(defaultCity);
  fetchForecastWeatherAsync(defaultCity);
});

