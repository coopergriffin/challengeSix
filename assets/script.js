// assets/script.js
document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '9f2c585f02b8861898b85f73dc78bc2d';  
    const apiUrl = 'http://api.openweathermap.org/geo/1.0/direct';

    // Replace these values with the specific city, state, and country you want to query
    var cityName = 'Toronto';
    var stateCode = 'ON';
    var countryCode = 'CA';
    const limit = 5;  // You can adjust the limit as needed

    // Construct the URL with the variables
    const fullUrl = `${apiUrl}?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;

    // Make a GET request to the API
    fetch(fullUrl)
    .then(response => {
        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response as JSON
        return response.json();
    })
    .then(data => {
        // Log the data from the API
        console.log('API Response:', data);
    })
    .catch(error => {
        // Log any errors that occurred during the fetch
        console.error('Error fetching data:', error);
    });

});