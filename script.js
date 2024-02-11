// script.js

$(document).ready(function () {
    // OpenWeatherMap API key
    const apiKey = '32a12c8f1ec2debb8ca1dbfc428c74fc    ';
  
    // Event listener for the search form
    $('#search-form').submit(function (event) {
      event.preventDefault();
  
      // Get the city name from the input
      const cityName = $('#search-input').val();
  
      // Check if the city name is not empty
      if (cityName.trim() !== '') {
        // Clear previous weather data
        $('#today').empty();
        $('#forecast').empty();
  
        // Fetch current weather data
        fetchWeatherData(cityName);
        
        // Add the city to the search history
        addToHistory(cityName);
      }
    });
  
}