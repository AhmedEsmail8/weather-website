var locationBtn = document.getElementById('locationBtn');
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var today = document.getElementById('date');
var area = document.getElementById('area');
var currentWeather = document.getElementById('currentWeather');
var currentState = document.getElementById('currentState');
var feelsLike = document.getElementById('feelsLike');
var humidity = document.getElementById('humidity');
var wind = document.getElementById('wind');
var cBtn = document.getElementById('cBtn');
var fBtn = document.getElementById('fBtn');
var daysContainer = document.getElementsByClassName('days-container')[0];
var searchCity = document.getElementsByTagName('input')[0];
var searchCountry = document.getElementsByTagName('input')[1];
var cities = []
var currentRespose = -1

function getCities(){
    let citiesConn = new XMLHttpRequest()
    citiesConn.open('GET', 'https://gist.githubusercontent.com/bhatmand/fe7b44bfe6174b4fe368b9032a00d8a1/raw/610f638910019d1e4b9283b4f143688ca4b55169/all-countries-cities-array.json')
    citiesConn.send()
    citiesConn.addEventListener('load', function(e){
        cities = JSON.parse(citiesConn.response);
        console.log(cities)
    })
}

getCities();

searchCity.addEventListener('input', function(e){
    
    if (e.target.value.length >= 3){
        // area.innerHTML = e.target.value;
        
        let citiesTmp = cities;
        if (citiesTmp.filter(matchCity).length == 0)
            return;
        let res = citiesTmp.filter(matchCity)[0];
        res = res.toString().replace(/ \([A-Za-z]*\)/, '')
        console.log(res);
        getForecast(res)
    }
})

function matchCity(city){
    let inputTmp = searchCity.value;
    let words = inputTmp.split(' ')
    for (let i=0; i<words.length; i++){
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(' ');
    return city.startsWith(words);
}

function getForecast(q='cairo', days=4){
    var xml = new XMLHttpRequest()
    xml.open('GET', `https://api.weatherapi.com/v1/forecast.json?key=1782423c5204415fa11174236241706&q=${q}&days=${days}`)
    xml.send()
    xml.addEventListener('load', function (e) {
        currentRespose = JSON.parse(xml.response);
        display(JSON.parse(xml.response));
    });
}

var lat = 0
var lon = 0
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            getForecast(`${lat}, ${lon}`);
            // getForecast(`london`);
            console.log("Latitude: " + lat +
                "  Longitude: " + lon);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

locationBtn.addEventListener('click', function(e){
    getCurrentLocation();
})

function display(response){
    let dateObj = new Date(response.location.localtime.split(' ')[0]);
    let time = formatTime(response.location.localtime.split(' ')[1]);
    let date = `${dayNames[dateObj.getDay()]}, ${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} | ${time}`
    today.innerHTML = date;
    area.innerHTML = response.location.name;
    cBtn.classList.add('fw-bolder', 'text-white');
    fBtn.classList.remove('fw-bolder', 'text-white');
    currentWeather.innerHTML = parseInt(currentRespose.current.temp_c);
    currentState.innerHTML = response.current.condition.text;
    wind.innerHTML = response.current.wind_kph;
    humidity.innerHTML = response.current.humidity;
    feelsLike.innerHTML = response.current.feelslike_c;

    let daysData = response.forecast.forecastday;
    box = ``
    for (let i=0; i<daysData.length; i++){
        let dayDate = new Date(daysData[i].date);
        box += `
        <div class="col-md-3">
                <div class="weather-card text-center w-100 d-flex flex-column justify-content-center align-items-center rounded-4 p-md-0 p-4">
                    <span class="weather-card-day text-white-50">${dayNames[dayDate.getDay()]}</span>
                    <img class="weather-card-icon mb-2" src="${daysData[i].day.condition.icon}" alt="">
                    <span class="fs-5 weather-card-weather">${parseInt(daysData[i].day.maxtemp_c)}° - ${parseInt(daysData[i].day.mintemp_c)}°</span>
                    <span class="weather-card-status text-white-50">${daysData[i].day.condition.text}</span>
                </div>
            </div>
            `
    }
    daysContainer.innerHTML = box;
}

function formatTime(time){
    let ans = ``
    let timeArr = time.split(':');
    let hours = Number(timeArr[0]), mins = Number(timeArr[1])
    console.log(hours);
    let tmp = hours;

    if (tmp > 12)
        tmp -= 12;

    if (tmp.toString().length < 2)
        ans += `0${tmp}:`;
    else
        ans += `${tmp}:`
    
    if (mins < 10)
        ans += `0${mins}`
    else
        ans += `${mins}`

    if (hours <= 12)
        ans += ' AM'
    else
        ans += ' PM'
    return ans;
}

document.addEventListener('DOMContentLoaded', function(e){
    getCurrentLocation();
    let weatherContainer = document.getElementsByClassName('weather-container')[0];
    console.log(weatherContainer);
    if (isDayTime()){
        weatherContainer.style.backgroundImage = 'url(../images/background-day.png)';
    }
    else{
        weatherContainer.style.backgroundImage = 'url(../images/background-night.png)';
    }
    console.log('HIIII');
});


function isDayTime(){
    const now = new Date();
    const currentHour = now.getHours();
    const dayStart = 6;
    const dayEnd = 18;

    if (currentHour >= dayStart && currentHour < dayEnd)
        return true; // It's daytime
    else 
        return false; // It's nighttime
}

cBtn.addEventListener('click', function(e){
    cBtn.classList.add('fw-bolder', 'text-white');
    fBtn.classList.remove('fw-bolder', 'text-white');
    currentWeather.innerHTML = parseInt(currentRespose.current.temp_c);
})

fBtn.addEventListener('click', function(e){
    fBtn.classList.add('fw-bolder', 'text-white');
    cBtn.classList.remove('fw-bolder', 'text-white');
    currentWeather.innerHTML = parseInt(currentRespose.current.temp_f);
})
// var geocoder = new google.maps.Geocoder();
// var address = "new york";

// geocoder.geocode( { 'address': address}, function(results, status) {

// if (status == google.maps.GeocoderStatus.OK) {
//     var latitude = results[0].geometry.location.lat();
//     var longitude = results[0].geometry.location.lng();
//     alert(latitude);
//     } 
// }); 

// function getLocation(text){
//     let locConn = new XMLHttpRequest()
//     locConn.open('GET', `https://nominatim.openstreetmap.org/search?format=json&q=${text}`)
//     locConn.send()
//     locConn.addEventListener('load', function(){
//         let res = locConn.response;
//         console.log(res);
//     })
// }