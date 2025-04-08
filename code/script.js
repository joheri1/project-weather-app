const fetchTodaysWeatherAsync = async (city) => {
  const todayURL = `${BASE_URL}?city=${city}`;

  try {
    const response = await fetch(todayURL);
    if (!response.ok) throw new Error("Failed to fetch today's weather");

    const data = await response.json();

    const weatherDescription = data.weather[0].description;
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

