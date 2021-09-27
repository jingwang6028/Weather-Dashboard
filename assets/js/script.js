var apiKey = "5f5e0927811003462d3815d929284f6e";

var cityNameInputEl = $("#city-name-input");
var cityNameListEl = $("#cityNameList");
var cityNameEl = $("#city-name");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var uvIndexEl = $("#uvIndex");
// btn selector
var searchBtnEl = $("#searchBtn");

var city;
var queryUrl;
var queryUrlLonLat;

// functions to convert openWeather data to readable data format
function convertTempToF(K) {
  return (K - 273.15) * 1.8 + 32;
}

function convertWindToMPH(m) {
  return m * 2.236937;
}
function convertToLocalDate(unixTime) {
  return new Date(unixTime * 1000).toLocaleDateString("en-US");
}

//fetch and localStorage openWeather
function fetchStorageCityInfo() {
  city = cityNameInputEl.val();
  console.log(city);
  queryUrlCity =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  //fetch city weather data
  fetch(queryUrlCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCityWeatherInfo(data.name, data);
      fetchAndDisplayUVIndex(data.coord.lon, data.coord.lat);
      // var cityWeather = {
      //   cityName: data.name,
      //   cityDate: convertToLocalDate(data.dt),
      //   weatherIcon: data.weather[0].icon,
      //   cityLon: data.coord.lon,
      //   cityLat: data.coord.lat,
      //   cityTemp: convertTempToF(data.main.temp).toFixed(2),
      //   cityWind: convertWindToMPH(data.wind.speed).toFixed(2),
      //   cityHumidity: data.main.humidity,
      // };
      // console.log(cityWeather);

      // localStorage city weather
      //localStorage.setItem(cityWeather.cityName, JSON.stringify(cityWeather));
    });
}

function displayCityWeatherInfo(cityName, dataInfo) {
  var iconEl = $("<img>");
  var iconCode = dataInfo.weather[0].icon;
  var codeImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
  iconEl.attr("src", codeImage);

  var cityNameHeader = cityName + " " + convertToLocalDate(dataInfo.dt);
  cityNameEl.text(cityNameHeader);
  cityNameEl.append(iconEl);
  tempEl.text(convertTempToF(dataInfo.main.temp).toFixed(2) + "°F");
  windEl.text(convertWindToMPH(dataInfo.wind.speed).toFixed(2) + " MPH");
  humidityEl.text(dataInfo.main.humidity + " %");
}

//get lon and lat info and fetch uv index data and display
function fetchAndDisplayUVIndex(lon, lat) {
  queryUrlLonLat =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=daily&appid=" +
    apiKey;

  fetch(queryUrlLonLat)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      uvIndexEl.text(data.current.uvi);
    });
}

// create list of city button and add it to ul cityNameList
function addCityNameBtn() {
  var nameLiEl = $("<li>");
  nameLiEl.addClass("list-group-item");
  var nameBtn = $("<button>");
  nameBtn.addClass("listBtn");
  nameBtn.text(city);
  nameLiEl.append(nameBtn);
  cityNameListEl.append(nameLiEl);
}

//search button add event listener
searchBtnEl.on("click", submitCityInfo);

function submitCityInfo(event) {
  fetchStorageCityInfo();
  addCityNameBtn();
  cityNameInputEl.val("");
}
