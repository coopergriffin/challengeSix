// Function to fetch weather data from OpenWeatherMap API
function fetchWeather(city) {
	// Your API key from OpenWeatherMap
	const apiKey = '9f2c585f02b8861898b85f73dc78bc2d';
	// API endpoint for current weather data
	const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	// API endpoint for 5-day forecast
	const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

	// Fetch current weather data
	fetch(currentWeatherURL)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display current weather information
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
        });

	// Fetch 5-day forecast data
	fetch(forecastURL)
		.then(response => response.json())
		.then(data => {
			// Display forecast information
			displayForecast(data);
		});
}

// Function to display current weather information
function displayCurrentWeather(data) {
	// Extract necessary information from the API response
    const cityName = data.name;
	const currentDate = new Date(data.dt * 1000); // Convert timestamp to milliseconds
	const iconCode = data.weather[0].icon;
	const temperature = data.main.temp;
	const humidity = data.main.humidity;
	const windSpeed = data.wind.speed;

	// Update HTML elements with current weather data
	document.getElementById('cityName').textContent = cityName;
	document.getElementById('currentDate').textContent = currentDate.toLocaleDateString();
	document.getElementById('weatherIcon').setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);
	document.getElementById('temperature').textContent = temperature + " °C";
	document.getElementById('humidity').textContent = humidity + "%";
	document.getElementById('windSpeed').textContent = windSpeed + " m/s";
}

// Function to display 5-day forecast
function displayForecast(data) {
    // Extract necessary information from the API response
    const forecastList = data.list;
  
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Increment date by 1 to get tomorrow
    tomorrow.setHours(0, 0, 0, 0); // Set time to start of day (midnight)
  
    // Clear previous forecast data
    document.getElementById('forecast').innerHTML = '';
  
    // Display forecast information for each day starting from tomorrow
    for (let i = 0; i < forecastList.length; i++) {
      const forecastData = forecastList[i];
      const forecastDate = new Date(forecastData.dt * 1000); // Convert timestamp to milliseconds
  
      // Skip today's forecast
      if (forecastDate.getTime() < tomorrow.getTime()) {
        continue;
      }
  
      const iconCode = forecastData.weather[0].icon;
      const temperature = forecastData.main.temp;
      const humidity = forecastData.main.humidity;
      const windSpeed = forecastData.wind.speed;
  
      // Create HTML elements for forecast data
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <div>${forecastDate.toLocaleDateString()}</div>
        <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        <div>Temperature: ${temperature} °C</div>
        <div>Humidity: ${humidity}%</div>
        <div>Wind Speed: ${windSpeed} m/s</div>
      `;
  
      // Append forecast item to the forecast container
      document.getElementById('forecast').appendChild(forecastItem);
    }
}
  


// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
	event.preventDefault();
	const city = document.getElementById('cityInput').value.trim();
	if (city) {
		fetchWeather(city);
		// Store the searched city in local storage
		saveToLocalStorage(city);
	}
});

// Function to save searched city to local storage
function saveToLocalStorage(city) {
	// Retrieve existing search history from local storage
	let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
	// Add new city to search history
	searchHistory.push(city);
	// Save updated search history to local storage
	localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to display search history
function displaySearchHistory() {
	// Retrieve search history from local storage
	const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
	
}

// Event listener for clicking on a city in the search history
document.getElementById('searchHistory').addEventListener('click', function(event) {
	if (event.target.tagName === 'BUTTON') {
		const city = event.target.textContent;
		fetchWeather(city);
	}
});

// Load search history when the page loads
window.addEventListener('load', function() {
	displaySearchHistory();
});
