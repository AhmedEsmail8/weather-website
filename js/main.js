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


function isDayTime(){
    const now = new Date();
    const currentHour = now.getHours();
    const dayStart = 6;
    const dayEnd = 18;

    if (currentHour >= dayStart && currentHour < dayEnd){
        return true; // It's daytime
    }
    else {
        return false; // It's nighttime
    }
}



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
        getForecast(e.target.value)
    }
})

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

window.addEventListener('DOMContentLoaded', function(e){
    getForecast();
    let weatherContainer = document.getElementsByClassName('weather-container')[0];
    console.log(weatherContainer);
    if (isDayTime()){
        weatherContainer.style.backgroundImage = 'url(https://img.freepik.com/free-photo/sunshine-clouds-sky-morning-background-blue-white-pastel-heaven-soft-focus-lens-flare-sunlight-abstract-blurred-cyan-gradient-peaceful-nature-open-view-out-windows-beautiful-summer-spring_1253-1094.jpg?t=st=1718737059~exp=1718740659~hmac=48e33efaee7cbec4d7a83ad9ec9975a396a3596dbc43500cf3f9b9e305e81e70&w=106)';
    }
    else{
        weatherContainer.style.backgroundImage = 'url(https://img.freepik.com/free-photo/beautiful-night-sky-with-shiny-stars_53876-138570.jpg?w=1060&t=st=1718736763~exp=1718737363~hmac=87286b28cae139d00c0e34732fcde36b1499723465ece4b0b7dcf0a0d62e1ba9)';
    }
    console.log('HIIII');
});





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