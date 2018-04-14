var test = false;

var starttime = Date.now();

var actualPosition = "";

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

var geo_options = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/*fallback Weather is not at this moment used but remains for case of future test runs*/
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
        updatePage(tempScaleNumber);
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

var tempScaleNumber=1;

var tempScaleArray= [{
  name: "Kelvin",
  sign: "K",
  degrees:function(degK){
            return (degK);
  }
},{
  name: "Celsius",
  sign: "°C",
  degrees:function(degK){
            return (degK-273.15);
  }
},{
  name: "Réaumur",
  sign: "°Ré",
  degrees:function(degK){
            return ((degK-273.15)*0.8);
  }
},{
  name: "Fahrenheit",
  sign: "°F",
  degrees:function(degK){
            return (degK*1.8-459.67);
  }
},{
  name: "Rankine",
  sign: "°Ra",
  degrees:function(degK){
            return (degK*1.8);
  }
},{
  name: "Rømer",
  sign: "°Rø",
  degrees:function(degK){
            return ((degK-273.15)*21/40+7.5);
  }
},{
  name: "Delisle",
  sign: "°De",
  degrees:function(degK){
            return ((373.15-degK)*1.5);
  }
},{
  name: "Newton",
  sign: "°N",
  degrees:function(degK){
            return ((degK-273.15)*0.33);
  }
}]


function updatePage(tsIndex){
  $('#place').html(weatherData['city']+", "+weatherData['country']);
  $('#icon').html('<img src='+weatherData['icon'] +' alt="icon"/>');
  $('#deg').html(precisionRound(tempScaleArray[tsIndex].degrees(weatherData['kelvin']),2));
  console.log(precisionRound(weatherData['kelvin'],2));
  $('#unit').html(tempScaleArray[tsIndex].sign);
  $('#copyright').html(weatherData['copyright']);
  drawScaleDropdown(tempScaleArray);
  console.log("foo");
};

function scaleChangeCallback(i){
  console.log("value of i: "+i);
  /*tempScaleNumber = i;
  updatePage(tempScaleNumber);*/
}

var scaleObject = function(x){
  this.scaleChange = function(){
    tempScaleNumber = x;
    updatePage(tempScaleNumber);
  }
}

function drawScaleDropdown(tsArray){
  if (!document.getElementById("myDropdown").hasChildNodes()){
    for (var i=0; i<tsArray.length; i++){
      var a = document.createElement('button');
      document.getElementById("myDropdown").append(a);
      a.href="#";
      a.id=tsArray[i].name;
      $("#"+tsArray[i].name).html(tsArray[i].name);
      var o = new scaleObject(i);
      document.getElementById(tsArray[i].name).onclick = o.scaleChange;
      var b = document.createElement('br');
      document.getElementById("myDropdown").append(b);
    }
  }
  /*$('#myDropdown').html(text);*/
  return false;
}




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
  /*here is the place to check for testrun and use fallbackweather if demanded -> not implemented at this time */
  $.getJSON(weatherApiArray[weatherApiNumber].link(latitude, longitude), weatherApiArray[weatherApiNumber].normalize);
  starttime = Date.now();
}

function geo_success(position){
  if ((actualPosition != "")&&((actualPosition.coords.latitude  == position.coords.latitude) &&
      (actualPosition.coords.longitude == position.coords.longitude))){
    console.log("Geo_Success: Position not changed: "+position.coords.latitude.toString()+":"+position.coords.longitude.toString());
    if (Date.now()-starttime>=600000){ //if 10 minutes or more passed
      console.log("Geo_Success: morethan 10 minutes have passed.")
      updateWeather(position.coords.latitude,position.coords.longitude);
    }
  } else{
    console.log("Position changed");
    actualPosition = position;
    updateWeather(position.coords.latitude,position.coords.longitude);
  }
}

function geo_error(error) {
  alert('ERROR(' + error.code + '): ' + error.message);
};


$("document").ready(function(){
  if (test) {
    updatePage();
  } else {
    retrieve();
  }
});
