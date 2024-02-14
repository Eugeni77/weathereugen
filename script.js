$(document).ready(function () {
  const API_KEY = "32a12c8f1ec2debb8ca1dbfc428c74fc";
  const cityInput = $(".city-input");
  const searchButton = $(".search-btn");
  const currentWeatherDiv = $(".current-weather");
  const weatherCardsDiv = $(".weather-cards");

  const createWeatherCard = (cityName, weatherItem, index) => {
    const iconUrl = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png`;

    if (index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="${iconUrl}" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five-day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="${iconUrl}" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

  const getWeatherDetails = (cityName, latitude, longitude) => {
      const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

      $.ajax({
          url: WEATHER_API_URL,
          method: "GET",
          dataType: "json",
          success: function (data) {
              const uniqueForecastDays = [];
              const fiveDaysForecast = data.list.filter(forecast => {
                  const forecastDate = new Date(forecast.dt_txt).getDate();
                  if (!uniqueForecastDays.includes(forecastDate)) {
                      return uniqueForecastDays.push(forecastDate);
                  }
              });

              // Clearing previous weather data
              cityInput.val("");
              currentWeatherDiv.html("");
              weatherCardsDiv.html("");

              // Creating weather cards and adding them to the DOM
              $.each(fiveDaysForecast, function (index, weatherItem) {
                  const html = createWeatherCard(cityName, weatherItem, index);
                  if (index === 0) {
                      currentWeatherDiv.append(html);
                  } else {
                      weatherCardsDiv.append(html);
                  }
              });
          },
          error: function () {
              alert("An error occurred while fetching the weather forecast!");
          }
      });
  }

  const getCityCoordinates = () => {
      const cityName = cityInput.val().trim();
      if (cityName === "") return;
      const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

      // Get entered city coordinates (latitude, longitude, and name) from the API response
      $.ajax({
          url: API_URL,
          method: "GET",
          dataType: "json",
          success: function (data) {
              if (!data.length) return alert(`No coordinates found for ${cityName}`);
              const { lat, lon, name } = data[0];
              getWeatherDetails(name, lat, lon);
          },
          error: function () {
              alert("An error occurred while fetching the coordinates!");
          }
      });
  }

  searchButton.on("click", getCityCoordinates);
  cityInput.on("keyup", function (e) {
      if (e.key === "Enter") {
          getCityCoordinates();
      }
  });
});
