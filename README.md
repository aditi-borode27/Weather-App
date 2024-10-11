# Weather App

This Weather App is a web-based application that provides real-time weather information for a selected city. It utilizes the OpenWeatherMap API to fetch the current weather, hourly forecast, and five-day weather predictions for any city across the globe. The app also displays key weather data such as temperature, humidity, and feels-like temperature.

## Features

- **Current Weather:** Displays the current temperature, weather description, and high/low temperatures for the selected city.
- **Hourly Forecast:** Provides a detailed weather forecast for the next 12 hours with temperature and icons representing weather conditions.
- **Five-Day Forecast:** Displays the temperature range and weather conditions for the next five days.
- **Humidity and Feels-Like:** Shows additional weather information like humidity percentage and feels-like temperature.
- **City Search:** Allows users to search for a city and retrieve weather details based on geolocation.
- **Geolocation Support:** Automatically fetches weather data for the user’s current location if geolocation is enabled.([Geolocation API](https://openweathermap.org/api/geocoding-api))

## Technologies Used

- **HTML5** for structure
- **CSS3** for responsive styling
- **JavaScript (ES6)** for functionality
- **OpenWeatherMap API** for fetching weather data
- **Geolocation API** for retrieving the user's current location

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/aditi-borode27/Weather-App.git
   ```

2. Navigate to the project directory:
    ```bash
    cd Weather-App
    ```

3. Open `index.html` in your web browser to use the app.

4. Search for a city or allow the app to use your current location for weather details.

## API Usage

This app uses the [OpenWeatherMap API](https://openweathermap.org/api) to retrieve weather data.

- **Current Weather Data:** Provides real-time weather details like temperature, weather description, and humidity.
- **Five-Day Forecast:** Gives predictions for temperature and conditions over the next five days.
