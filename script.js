const apiKey = '32a12c8f1ec2debb8ca1dbfc428c74fc';
const currentWeatherDiv = document.querySelector(".current-weather");
const searchButton = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");

const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
      // Filter the forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Continue with the rest of your code
    })
    .catch(error => console.error('Error fetching weather data:', error));
};


