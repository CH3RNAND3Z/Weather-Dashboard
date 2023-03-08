
		var apiKey = '553bc79707b85c55169711cf0870ca15';
		var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        var city;

		// Function to retrieve current weather conditions for a given city
		function getCurrentWeather(city) {
			$.ajax({
				url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
				method: 'GET'
			}).then(function(response) {
				console.log(response);
				$('#current-weather').show();
				$('#city-name').text(response.name);
				$('#date').text(moment().format('dddd, MMMM Do YYYY'));
				$('#weather-icon').html(`<img src="https://openweathermap.org/img/w/${response.weather[0].icon}.png">`);
				$('#temperature').text(`Temperature: ${response.main.temp} °F`);
				$('#humidity').text(`Humidity: ${response.main.humidity} %`);
				$('#wind-speed').text(`Wind Speed: ${response.wind.speed} MPH`);
                addToHistory(city);
                getForecast(city);
                }).catch(function(error) {
                console.log(error);
                alert('City not found');
                });
        }

        	// Function to retrieve 5-day forecast for a given city
	function getForecast(city) {
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`,
			method: 'GET'
		}).then(function(response) {
			console.log(response);
			$('#future-weather').show();
			$('#forecast-row').empty();
			for (var i = 0; i < response.list.length; i++) {
				if (response.list[i].dt_txt.includes('12:00:00')) {
					var forecastCard = $('<div>').addClass('col-md-2');
					var forecastDate = $('<p>').text(moment(response.list[i].dt_txt).format('MMM Do'));
					var forecastIcon = $('<p>').html(`<img src="https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png">`);
					var forecastTemp = $('<p>').text(`Temp: ${response.list[i].main.temp} °F`);
					var forecastWind = $('<p>').text(`Wind: ${response.list[i].wind.speed} MPH`);
					var forecastHumidity = $('<p>').text(`Humidity: ${response.list[i].main.humidity} %`);
					forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
					$('#forecast-row').append(forecastCard);
				}
			}
		}).catch(function(error) {
			console.log(error);
		});
	}

	// Function to add a city to search history
	function addToHistory(city) {
		if (!searchHistory.includes(city)) {
			searchHistory.push(city);
			localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
			var historyItem = $('<li>').text(city);
			$('#history-list').prepend(historyItem);
		}
	}

	// Event listener for search form submission
	$('form').on('submit', function(event) {
		event.preventDefault();
		var city = $('#city-input').val().trim();
		if (city) {
			getCurrentWeather(city);
		}
	});

	// Event listener for clicking a city in search history
	$(document).on('click', '#history-list li', function() {
		var city = $(this).text();
		getCurrentWeather(city);
	});

	// Populate search history on page load
	for (var i = 0; i < searchHistory.length; i++) {
		var historyItem = $('<li>').text(searchHistory[i]);
		$('#history-list').append(historyItem);
	}
    