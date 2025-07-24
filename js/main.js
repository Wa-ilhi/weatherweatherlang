let apiKey = "50ecb1cfc9b5f6fac940b3f17930a3f2";

// Add weather alert styles
const bubbleStyle = `
.weather-alert-bubble {
    position: absolute;
    top: 0px;
    right: 100px;
    z-index: 100;
    animation: bubbleFadeIn 0.5s ease-out;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    max-width: 150px;
    font-size: 14px;
    font-weight: 500;
}

.alert-content {
    padding: 10px 15px;
    border-radius: 18px;
    text-align: center;
    position: relative;
}

.alert-tail {
    position: absolute;
    bottom: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
}

/* Alert type colors */
.rain-alert { background-color: #3498db; color: white; }
.rain-alert .alert-tail { border-top: 10px solid #3498db; }

.clear-alert { background-color: #f1c40f; color: #2c3e50; }
.clear-alert .alert-tail { border-top: 10px solid #f1c40f; }

.snow-alert { background-color: #ecf0f1; color: #2c3e50; }
.snow-alert .alert-tail { border-top: 10px solid #ecf0f1; }

.clouds-alert { background-color: #95a5a6; color: white; }
.clouds-alert .alert-tail { border-top: 10px solid #95a5a6; }

.mist-alert { background-color: #7f8c8d; color: white; }
.mist-alert .alert-tail { border-top: 10px solid #7f8c8d; }

.haze-alert { background-color: #e67e22; color: white; }
.haze-alert .alert-tail { border-top: 10px solid #e67e22; }

.thunderstorm-alert { background-color: #9b59b6; color: white; }
.thunderstorm-alert .alert-tail { border-top: 10px solid #9b59b6; }

@keyframes bubbleFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

// Add the styles to the document
const styleElement = document.createElement('style');
styleElement.innerHTML = bubbleStyle;
document.head.appendChild(styleElement);

// Weather alert function
function showWeatherAlert(message, alertType) {
    // Remove any existing alert first
    const existingAlert = document.querySelector('.weather-alert-bubble');
    if (existingAlert) existingAlert.remove();
    
    // Create alert bubble
    const alertBubble = document.createElement('div');
    alertBubble.className = `weather-alert-bubble ${alertType}-alert`;
    alertBubble.innerHTML = `
        <div class="alert-content">${message}</div>
        <div class="alert-tail"></div>
    `;
    
    // Insert near weather icon
    const weatherIconContainer = document.querySelector('.weather-icon-css');
    weatherIconContainer.appendChild(alertBubble);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alertBubble.style.animation = 'bubbleFadeIn 0.5s ease-out reverse';
        setTimeout(() => alertBubble.remove(), 500);
    }, 8000);
}

navigator.geolocation.getCurrentPosition(async function (position) {
    try {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        
        // Get city name from coordinates
        var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
        var userdata = await map.json();
        let loc = userdata[0].name;
        
        // Get weather data
        let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
        let data = await respond.json();

        console.log(data);
        
        // Display current weather info
        let cityMain = document.getElementById("city-name");
        let cityTemp = document.getElementById("metric");
        let weatherMain = document.querySelectorAll("#weather-main");
        let mainHumidity = document.getElementById("humidity");
        let mainFeel = document.getElementById("feels-like");
        let weatherImg = document.querySelector(".weather-icon");
        let weatherImgs = document.querySelector(".weather-icons");
        let tempMinWeather = document.getElementById("temp-min-today");
        let tempMaxWeather = document.getElementById("temp-max-today");

        cityMain.innerHTML = data.city.name;
        cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
        weatherMain[0].innerHTML = data.list[0].weather[0].description;
        weatherMain[1].innerHTML = data.list[0].weather[0].description;
        mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
        mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
        tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
        tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

        let weatherCondition = data.list[0].weather[0].main.toLowerCase();

        // Set weather icon and show appropriate alert
        if (weatherCondition === "rain") {
            weatherImg.src = "img/rainy2.png";
            weatherImgs.src = "img/rainy2.png";
            showWeatherAlert("Murag kaulanon bai, ayaw nalang og dayon", "rain");
           
        } 
        else if (weatherCondition === "clear" || weatherCondition === "clear sky") {
            weatherImg.src = "img/sunny1.png";
            weatherImgs.src = "img/sunny1.png";
            if (data.list[0].main.temp > 30) {
                showWeatherAlert("Pag washing na kay mag rides ta", "clear");
            }
        } 
        else if (weatherCondition === "snow") {
            weatherImg.src = "img/snow.png";
            weatherImgs.src = "img/snow.png";
            showWeatherAlert("❄️ Snow expected! Drive carefully", "snow");
        } 
        else if (weatherCondition === "clouds" || weatherCondition === "smoke") {
            weatherImg.src = "img/rainy2.png";
            weatherImgs.src = "img/rainy2.png";
            if (weatherCondition === "smoke") {
                showWeatherAlert("🔥 Smoke alert! Limit outdoor activity", "haze");
            } else {
                showWeatherAlert("Dag-om na bai, tulog sa nalang", "clouds");
            }
        } 
        else if (weatherCondition === "mist" || weatherCondition === "fog") {
            weatherImg.src = "img/mist.png";
            weatherImgs.src = "img/mist.png";
            showWeatherAlert("Gabon bai, dalag trapo", "mist");
        } 
        else if (weatherCondition === "haze") {
            weatherImg.src = "img/haze.png";
            weatherImgs.src = "img/haze.png";
            showWeatherAlert("😷 Hazy conditions! Wear a mask", "haze");
        } 
        else if (data.list[0].weather[0].main === "Thunderstorm") {
            weatherImg.src = "img/thunderstorm.png";
            weatherImgs.src = "img/thunderstorm.png";
            showWeatherAlert("Pag puyo sa inyong balay bai, makilatan ka", "thunderstorm");
        }

        // Fetch and display 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log("5-Day Forecast for", data.city.name);
                displayForecast(data);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function displayForecast(data) {
            const dailyForecasts = {};
            let forecast = document.getElementById('future-forecast-box');
            let forecastbox = "";

            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                let dayName = ["Domingo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"];
                let day = new Date(date).getDay();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        day_today: dayName[day],
                        temperature: Math.floor(item.main.temp) + "°",
                        description: item.weather[0].description,
                        weatherImg: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let imgSrc = "";

                switch (dailyForecasts[date].weatherImg) {
                    case "rain":
                        imgSrc = "img/rainy2.png";
                        break;
                    case "clear":
                    case "clear sky":
                        imgSrc = "img/sunny1.png";
                        break;
                    case "snow":
                        imgSrc = "img/snow.png";
                        break;
                    case "clouds":
                    case "smoke":
                        imgSrc = "img/rainy2.png";
                        break;
                    case "mist":
                        imgSrc = "img/mist.png";
                        break;
                    case "haze":
                        imgSrc = "img/haze.png";
                        break;
                    case "thunderstorm":
                        imgSrc = "img/thunderstorm.png";
                        break;
                    default:
                        imgSrc = "img/sunny1.png";
                }

                forecastbox += `
                <div class="weather-forecast-box">
                    <div class="day-weather">
                        <span>${dailyForecasts[date].day_today}</span>
                    </div>
                    <div class="weather-icon-forecast">
                        <img src="${imgSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecast.innerHTML = forecastbox;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        showWeatherAlert("⚠️ Failed to load weather data", "thunderstorm");
    }
},
() => {
    // Handle location retrieval error
    alert("Palihug kog turn-on sa imong location settings aron makuha ang imong lokasyon.");
});