function getWeather() {
  const apiKey = `afa20e59ebfeba907a79bff20da900c1`;
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Fetch current weather
  fetch(currentWeatherURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`City not found (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.log("Error fetching current weather data:", error);
      document.getElementById("weather-info").innerHTML = `<p>Error: ${error.message}</p>`;
      document.getElementById("temp-div").innerHTML = "";
      document.getElementById("weather-icon").style.display = "none";
    });

  // Fetch forecast
  fetch(forecastURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Forecast data not available (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.list) {
        displayHourlyForecast(data.list);
      } else {
        throw new Error("Invalid forecast data structure");
      }
    })
    .catch((error) => {
      console.log("Error fetching forecast data:", error);
      document.getElementById("hourly-forecast").innerHTML = `<p>Error loading forecast: ${error.message}</p>`;
    });
}

function displayWeather(data) {
  const temDivInfo = document.getElementById("temp-div");
  const WeatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");

  WeatherInfoDiv.innerHTML = "";
  temDivInfo.innerHTML = "";

  if (data.cod === '404') {
    WeatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    weatherIcon.style.display = "none";
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

    temDivInfo.innerHTML = temperatureHTML;
    WeatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconURL;
    weatherIcon.alt = description;
    weatherIcon.style.display = "block";
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  hourlyForecastDiv.innerHTML = "";

  // Add defensive check to prevent the error
  if (!hourlyData || !Array.isArray(hourlyData)) {
    hourlyForecastDiv.innerHTML = "<p>No hourly forecast data available</p>";
    return;
  }

  const next8Hours = hourlyData.slice(0, 8);

  next8Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hours = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const hourlyItemHtml = `
      <div class='hourly-item'>
        <span>${hours}:00</span>
        <img src="${iconURL}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

// Add event listener for the search 
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("search-btn").addEventListener("click", getWeather);
  
  // Allow pressing Enter in the input field to trigger search
  document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
  
  // Set default city
  document.getElementById("city").value = "London";
  getWeather();
});