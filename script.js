// script.js

$(document).ready(function () {
    const apiKey = '32a12c8f1ec2debb8ca1dbfc428c74fc';
  
    $('#search-form').submit(function (event) {
      event.preventDefault();
  
      const cityName = $('#search-input').val();
  
      if (cityName.trim() !== '') {
        $('#today').empty();
        $('#forecast').empty();
  
        fetchWeatherData(cityName);
        addToHistory(cityName);
      }
    });
  
    function fetchWeatherData(cityName) {
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
  
      $.get({
        url: weatherApiUrl,
        dataType: 'json',
        success: function (data) {
          const city = data.city.name;
          const forecasts = data.list;
  
          displayTodayWeather(city, forecasts[0]);
          displayForecast(forecasts.slice(1, 6));
        },
        error: function (error) {
          console.error('Error fetching weather data:', error);
        }
      });
    }
  
    function displayTodayWeather(city, todayData) {
      const todaySection = $('#today');
      todaySection.append(`<h2>${city}</h2>`);
  
      const date = new Date(todayData.dt * 1000);
      const iconUrl = `https://openweathermap.org/img/w/${todayData.weather[0].icon}.png`;
      const temperature = todayData.main.temp;
      const humidity = todayData.main.humidity;
      const windSpeed = todayData.wind.speed;
  
      todaySection.append(`
        <p>Date: ${date.toLocaleDateString()}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperature} K</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <hr>
      `);
    }
  
}