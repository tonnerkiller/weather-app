var test = false;
var geo_options = {
  enableHighAccuracy: true, 
  maximumAge        : 30000, 
  timeout           : 27000
};
var fallbackWeather = {
    "coord": {
        "lon": -0.13,
        "lat": 51.51
    },
    "weather": [
        {
            "id": 500,
            "main": "Rain",
            "description": "light rain",
            "icon": "http://openweathermap.org/img/w/10n.png"
        }
    ],
    "base": "cmc stations",
    "main": {
        "temp": 286.164,
        "pressure": 1017.58,
        "humidity": 96,
        "temp_min": 286.164,
        "temp_max": 286.164,
        "sea_level": 1027.69,
        "grnd_level": 1017.58
    },
    "wind": {
        "speed": 3.61,
        "deg": 165.001
    },
    "rain": {
        "3h": 0.185
    },
    "clouds": {
        "all": 80
    },
    "dt": 1446583128,
    "sys": {
        "message": 0.003,
        "country": "GB",
        "sunrise": 1446533902,
        "sunset": 1446568141
    },
    "id": 2643743,
    "name": "London",
    "cod": 200
}

function updatePage(data){
  $('#place').html(data['name']);
  $('#icon').html('<img src='+data['weather'][0]['icon'] +' alt="icon"/>');
  $('#temp').html(data['main']['temp']+"°K");
  console.log(data['weather']);
};

function retrievePosition(){
  if ("geolocation" in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position){
      retrieveWeather(position.coords.latitude, position.coords.longitude);
    },errorCallback,geo_options);
  } else {
    console.log("geolocation not available");
  }
};
function retrieveWeather(latitude, longitude){
  //JSON(position,function{updatePage})
  $.getJSON("https://fcc-weather-api.glitch.me/api/current?lat="+latitude+"&lon="+longitude, updatePage);
};

function errorCallback(error) {
  alert('ERROR(' + error.code + '): ' + error.message);
};


$("document").ready(function(){
  if (test) {
    updatePage(fallbackWeather);
  } else {
    retrievePosition();
  }
});