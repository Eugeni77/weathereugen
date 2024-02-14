$(document).ready(function () {
  const API_KEY = '32a12c8f1ec2debb8ca1dbfc428c74fc';
  const currentWeatherDiv = $(".current-weather");
  const weatherCardsDiv = $(".weather-cards");
  const cityInput = $(".city-input");
  const searchButton = $(".search-btn");

  function createWeatherCard(cityName, weatherItem, index) {
    const iconCode = weatherItem.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    if (index === 0) {
      // Display real-time date for the main weather card
      const utcTimestamp = weatherItem.dt; // UTC timestamp from weather data
      const localDate = new Date(utcTimestamp * 1000); // Convert to local time
      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const formattedDate = localDate.toLocaleDateString("en-US", options);

      // HTML for the main weather card
      return `<div class="details">
                <h2>${cityName} (${formattedDate})</h2>
                <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </div>
            <div class="icon">
                <img src="${iconUrl}" alt="weather-icon">
                <h6>${weatherItem.weather[0].description}</h6>
            </div>`;
    } else {
      // HTML for the other five-day forecast card
      const date = new Date(weatherItem.dt * 1000);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      return `<li class="card">
                <h3>${formattedDate}</h3>
                <img src="${iconUrl}" alt="weather-icon">
                <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </li>`;
    }
  }

  function getWeatherDetails(cityName, latitude, longitude) {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
      .then((response) => response.json())
      .then((data) => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter((forecast) => {
          const forecastDate = new Date(forecast.dt * 1000).getDate();
          if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
          }
        });

        cityInput.val("");
        currentWeatherDiv.empty();
        weatherCardsDiv.empty();

        fiveDaysForecast.forEach((weatherItem, index) => {
          const html = createWeatherCard(cityName, weatherItem, index);
          if (index === 0) {
            currentWeatherDiv.append(html);
          } else {
            weatherCardsDiv.append(html);
          }
        });

        localStorage.setItem("lastSearchedCity", cityName);
      })
      .catch(() => {
        alert("An error occurred while fetching the weather forecast!");
      });
  }

  function getCityCoordinates() {
    const cityName = cityInput.val().trim();
    if (cityName === "") return;

    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
      })
      .catch(() => {
        alert("An error occurred while fetching the coordinates!");
      });
  }

  const lastSearchedCity = localStorage.getItem("lastSearchedCity");
  if (lastSearchedCity) {
    cityInput.val(lastSearchedCity);
    getWeatherDetails(lastSearchedCity);
  }

  searchButton.click(getCityCoordinates); // Use click() instead of on("click", ...)
  cityInput.keyup((e) => e.key === "Enter" && getCityCoordinates());
});
