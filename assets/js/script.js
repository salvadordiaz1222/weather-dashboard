//momentjs for the date
var format = "MM/DD/YYYY"
var currentDay = moment().format(format);
console.log(currentDay);
$("#currentDay").text(currentDay);

renderSearch()


//This will store the value of the "city-input" in var searchCity
var searchBtn = $(".searchBtn");
var searchCity = ""

searchBtn.on("click", function(){
    searchCity = $("#city-input").val()
    if(searchCity){
        searchWeather(searchCity)
        // Use JSON.parse and JSON.stringify to store an array, localStorage only accepts strings
        var savedCities = JSON.parse(localStorage.getItem('citySearch'))
        if(!savedCities){
            savedCities = []
        }
        savedCities.push(searchCity)
        localStorage.setItem('citySearch', JSON.stringify(savedCities))
        renderSearch()
    }
})


function renderSearch(){
    var rootRecentSearch = document.getElementById('recent-search')
    // Reset search ul, delete all items prev added
    rootRecentSearch.innerText = ""
    var recentSearch = JSON.parse(localStorage.getItem('citySearch'))
    // if there is no data on local storage start an empty array
    if(!recentSearch){
        recentSearch = []
    }
    // Set all the new items
    for(let i = 0; i < recentSearch.length; i++){
        var historySearch = document.createElement("ul")
        historySearch.classList.add("list-group")
        historySearch.innerText = recentSearch[i]
        rootRecentSearch.appendChild(historySearch)
    }
}


//Get "lon" and "lat"
var weatherKey = "259bd6474c5faa56865476f0e7617266";


function render(data) {
       /*
        <h5>Name of city<span>moment</span></h5>
        <p>Temp: F</p>
        <p>Wind: MPH</p>
        <p>Humidity: %</p>
        <p>UV Index:</p>
          
        */
    var searchedCity = document.createElement("h3")
    searchedCity.innerText = searchCity + " : " + " " + " "
    var mainDateEl = document.createElement("span")
    mainDateEl.innerText = moment().format(format)
    searchedCity.appendChild(mainDateEl)
    var mainIconEl = document.createElement("img")
    mainIconEl.classList.add("sizeIcon")
    mainIconEl.innerText = "https://openweathermap.org/img/wn/" + data[0].tempIcon + "@2x.png"
    searchedCity.appendChild(mainIconEl)
    var mainTempEl = document.createElement("p")
    mainTempEl.innerText = "temp: " + data[0].tempCurrent +" ˚F"
    var mainWindEl = document.createElement("p")
    mainWindEl.innerText = "wind: " + data[0].windSpeedCurrent + " MPH"
    var mainHumidityEl = document.createElement("p")
    mainHumidityEl.innerText = "humidity: " + data[0].humidityCurrent + "%"
    var mainUviEl = document.createElement("p")
    mainUviEl.innerText = "UV Index: " + data[0].uviCurrent + "" 

    var main = document.getElementById("mainParent")
    main.innerHTML = ""
    main.appendChild(searchedCity)
    main.appendChild(mainTempEl)
    main.appendChild(mainWindEl)
    main.appendChild(mainHumidityEl)
    main.appendChild(mainUviEl)

    //Loop over the rest of the array to fill in the 5-day forecast
    for (let i = 1; i < data.length; i++) {
        //use data[i] to fill each span
            /*
                <div class="col">
                    <p>Date</p>
                    <img class:"sizeIcon"> 
                    <p>Temp:<span id="temp1"></span>F</p>
                    <p>Wind:<span id="wind1"></span>MPH</p>
                    <p>Humidity:<span id="humidity1"></span>%</p>
                </div>
            */
            var root = document.createElement('div')
            root.classList.add('col')
            var dateEl = document.createElement('p')
            dateEl.innerText = moment().add(i, 'days').format(format)
            var iconEl = document.createElement('img')
            iconEl.classList.add("sizeIcon")
            iconEl.src = "https://openweathermap.org/img/wn/" + data[i].icon + "@2x.png"
            var tempEl = document.createElement("p")
            tempEl.innerText = "Temp: " + data[i].temp + " ˚F"
            var windEl = document.createElement("p")
            windEl.innerText = "Wind: " + data[i].wind_speed + " MPH"
            var humidityEl = document.createElement("p")
            humidityEl.innerText = "Humidity: " + data[i].humidity + " %"

            root.appendChild(dateEl)
            root.appendChild(iconEl)
            root.appendChild(tempEl)
            root.appendChild(windEl)
            root.appendChild(humidityEl)

            document.getElementById("rowParent").appendChild(root)
    }
}

function searchWeather(city){

    var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + weatherKey + "";

    fetch(weatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lon = data.coord.lon;
            var lat = data.coord.lat;
            console.log({lon, lat});
            var dataWeatherAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + weatherKey + "";
            fetch(dataWeatherAPI)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data2){
                    console.log(data2);
                    //"data2.current" will give us the current weather conditions.
                    var tempCurrent = data2.current.temp;
                    var humidityCurrent = data2.current.humidity;
                    var uviCurrent = data2.current.uvi;
                    var windSpeedCurrent = data2.current.wind_speed;
                    var tempIcon = data2.current.weather[0].icon;
                    console.log({tempCurrent, humidityCurrent, uviCurrent, windSpeedCurrent, tempIcon});
                    //The following will give us the forecast of the next five days. 
                    //we don't count index "0" because "0" is the current weather.
                    var arr = [];
                    arr.push({tempCurrent, humidityCurrent, uviCurrent, windSpeedCurrent, tempIcon})
                    for (let index = 1; index < 6; index++) {
                        var day = data2.daily[index];
                        var obj = {
                            temp: day.temp.day, 
                            uvi: day.uvi, 
                            wind_speed: day.wind_speed, 
                            humidity: day.humidity,
                            icon: day.weather[0].icon
                        }
                        arr.push(obj)
                        console.log({obj});
                    }
                    console.log(arr)
                    render(arr)
                })
        })
}
// This is where we can get the icon for the weather
//https://openweathermap.org/img/wn/{here it goes the tempIcon var}@2x.png

