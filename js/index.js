var test = false;

var starttime = Date.now();

var actualPosition = "";

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

var weatherData ={
  set:function(acity, acountry, anicon, degrees,crnotice){
        this.city=acity;
        this.country=acountry;
        this.icon=anicon;
        this.kelvin=degrees;
        this.copyright=crnotice;
        updatePage();
      },
  city:"",
  country:"",
  icon:"",
  kelvin:"",
  copyright:""
}

var weatherApiNumber=0;

var weatherApiArray = [
  {
    copyright:"weather data retrieved from the <a href='https://fcc-weather-api.glitch.me/'>FCC Weather API</a>",
    link:function(latitude, longitude){
          return "https://fcc-weather-api.glitch.me/api/current?lat="+latitude+"&lon="+longitude;
        },
    normalize:function(data){
          weatherData.set(data['name'],
                          data['sys']['country'],
                          data['weather'][0]['icon'],
                          Number(data['main']['temp'])+273.15,
                          weatherApiArray[weatherApiNumber].copyright);
        },
    },
]




function updatePage(){
  $('#place').html(weatherData['city']+", "+weatherData['country']);
  $('#icon').html('<img src='+weatherData['icon'] +' alt="icon"/>');
  $('#temp').html(weatherData['kelvin']+"°K");
  $('#copyright').html(weatherData['copyright']);
};

function retrieve(){
  if ("geolocation" in navigator) {
    /* geolocation is available */
    watchID = navigator.geolocation.watchPosition(geo_success,geo_error,geo_options);
  } else {
    /*geolocation is not available*/
    console.log("Geolocation is not supported by your browser.");
  }
};

function updateWeather(latitude, longitude){
  console.log("Latitude: "+latitude+"");
  $.getJSON(weatherApiArray[weatherApiNumber].link(latitude, longitude), weatherApiArray[weatherApiNumber].normalize);
  starttime = Date.now();
}

function geo_success(position){
  if (actualPosition == position){
    if (Date.now()-starttime>=600000){ //if 10 minutes or more passed
      updateWeather(position.coords.latitude,position.coords.longitude);
    }
  } else{
    actualPosition = position;
    updateWeather(position.coords.latitude,position.coords.longitude);
  }
}

function geo_error(error) {
  alert('ERROR(' + error.code + '): ' + error.message);
};


$("document").ready(function(){
  if (test) {
    updatePage(fallbackWeather);
  } else {
    retrieve();
  }
});
