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
          displayForecast(forecasts.slice(0, 5));
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
  
    function displayForecast(forecasts) {
      const forecastSection = $('#forecast');
      forecastSection.append('<h2>5-Day Forecast</h2>');
  
      $.each(forecasts, function (index, forecast) {
        const date = new Date(forecast.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        const temperature = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;
  
        forecastSection.append(`
          <div class="card col-md-2 m-2">
            <div class="card-body">
              <h5 class="card-title">${date.toLocaleDateString()}</h5>
              <img src="${iconUrl}" alt="Weather Icon">
              <p class="card-text">Temperature: ${temperature} K</p>
              <p class="card-text">Humidity: ${humidity}%</p>
              <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
            </div>
          </div>
        `);
      });
    }
  
    function addToHistory(cityName) {
      const historyList = $('#history');
      historyList.append(`<a href="#" class="list-group-item">${cityName}</a>`);
    }
  });
  