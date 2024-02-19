// Function to fetch weather data from OpenWeatherMap API
// Define the API key constant
const apiKey = '9f2c585f02b8861898b85f73dc78bc2d'; // Replace 'YOUR_API_KEY' with your actual API key


// Define the base API URL
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// Function to fetch current weather data
function fetchWeather(city) {
	const currentWeatherUrl = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`;

	fetch(currentWeatherUrl)
		.then(response => {
			if (!response.ok) {
				throw new Error('Error fetching current weather: ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			displayCurrentWeather(data);
			fetchForecast(city);
			saveSearchHistoryList(city);
		})
		.catch(error => console.error('Error fetching current weather:', error));
}

// Function to fetch forecast data
function fetchForecast(city) {
	const forecastUrl = `${apiUrl}forecast?q=${city}&units=metric&appid=${apiKey}`;

	fetch(forecastUrl)
		.then(response => {
			if (!response.ok) {
				throw new Error('Error fetching forecast: ' + response.statusText);
			}
			return response.json();
		})
		.then(data => displayForecast(data))
		.catch(error => console.error('Error fetching forecast:', error));
}

// Function to display current weather
function displayCurrentWeather(data) {
	// Extract necessary information from the API response
	const cityName = data.name;
	const currentDate = new Date(data.dt * 1000);
	const iconCode = data.weather[0].icon;
	const temperature = data.main.temp;
	const humidity = data.main.humidity;
	const windSpeed = data.wind.speed;

	// Display current weather information
	document.getElementById('cityName').textContent = `City: ${cityName}`;
	document.getElementById('currentDate').textContent = `Date: ${currentDate.toLocaleDateString()}`;
	document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${iconCode}.png`;
	document.getElementById('temperature').textContent = `Temperature: ${temperature} °C`;
	document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
	document.getElementById('windSpeed').textContent = `Wind Speed: ${windSpeed} m/s`;
}

// Function to display 5-day forecast starting from tomorrow
function displayForecast(data) {
    // Clear existing forecast display
    document.getElementById('forecast').innerHTML = '';

    // Extract necessary information from the API response
    const forecastList = data.list;

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set time to midnight

    // Initialize an array to store forecast chunks
    const forecastChunks = [];

    // Group forecast data by date and keep only one entry per day
    forecastList.forEach(forecastData => {
        const forecastDate = new Date(forecastData.dt * 1000);
        forecastDate.setHours(0, 0, 0, 0); // Set time to midnight

        // Exclude today's forecast and past forecasts
        if (forecastDate >= tomorrow && forecastChunks.length < 5) {
            const existingDate = forecastChunks.find(chunk => {
                const chunkDate = new Date(chunk.dt * 1000);
                return chunkDate.toDateString() === forecastDate.toDateString();
            });
            if (!existingDate) {
                forecastChunks.push(forecastData);
            }
        }
    });

    // Display forecast information for each date
    forecastChunks.forEach(forecastData => {
        displayForecastInfo(forecastData);
    });
}

// Function to display forecast information
function displayForecastInfo(forecastData) {
	// Extract forecast information from the forecast data point
	const forecastDate = new Date(forecastData.dt * 1000);
	const iconCode = forecastData.weather[0].icon;
	const temperature = forecastData.main.temp;
	const humidity = forecastData.main.humidity;
	const windSpeed = forecastData.wind.speed;

	// Display forecast information
	// You can customize this part to display the information as you want
	document.getElementById('forecast').innerHTML += `
    <div class="forecast-item">
        <h3>Date: ${forecastDate.toLocaleDateString()}</h3>
        <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
  `;
}

// Function to save search history
function saveSearchHistoryList(city) {
	const searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
	if (!searchHistoryList.includes(city)) {
		searchHistoryList.push(city);
		localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));
		displaySearchHistory(searchHistoryList);
	}
}

// Function to display search history
function displaySearchHistory(history) {
	const searchHistoryList = document.getElementById('searchHistoryList');
	searchHistoryList.innerHTML = '';
	history.forEach(city => {
		const li = document.createElement('li');
		li.textContent = city;
		li.addEventListener('click', () => {
			fetchWeather(city);
		});
		searchHistoryList.appendChild(li);
	});
}

// Event listener for the search form submission
document.getElementById('searchForm').addEventListener('submit', function (event) {
	event.preventDefault();
	const cityInput = document.getElementById('cityInput');
	const city = cityInput.value.trim();
	if (city) {
		fetchWeather(city);
		cityInput.value = '';
	}
});

// Display search history on page load
window.addEventListener('load', function () {
	const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
	displaySearchHistory(searchHistory);
});

