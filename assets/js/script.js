var apiKey = "5f5e0927811003462d3815d929284f6e";

var cityNameInputEl = $("#city-name-input");
var cityNameListEl = $("#cityNameList");
var cityNameEl = $("#city-name");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var uvIndexEl = $("#uvIndex");
var forecastDateEl = $(".forecastDate");
var forecastIconEl = $(".forecastIcon");
var forecastTempEl = $(".forecastTemp");
var forecastWindEl = $(".forecastWind");
var forecastHumidityEl = $(".forecastHumidity");
// btn selector
var searchBtnEl = $("#searchBtn");

var city;
var queryUrl;
var queryUrlLonLat;
var day;

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

//fetch and display openWeather
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

//fetch 5 days forecast data
function forecast5day() {
  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apiKey;

  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      display5dayForecast(data.list);
    });
}

function display5dayForecast(dataList) {
  //each day 9am forecast weather list
  listNum = [2, 10, 18, 26, 34];
  forecastDateEl
    .each(function (index) {
      $(this).text(convertToLocalDate(dataList[listNum[index]].dt));
    })
    .addClass("h3");
  forecastIconEl.each(function (index) {
    var icon = dataList[listNum[index]].weather[0].icon;
    var image = "http://openweathermap.org/img/w/" + icon + ".png";
    $(this).children().attr("src", image);
  });
  forecastTempEl.each(function (index) {
    $(this).text(
      "Temp: " +
        convertTempToF(dataList[listNum[index]].main.temp).toFixed(2) +
        "°F"
    );
  });
  forecastWindEl.each(function (index) {
    $(this).text(
      "Wind: " +
        convertWindToMPH(dataList[listNum[index]].wind.speed).toFixed(2) +
        " MPH"
    );
  });
  forecastHumidityEl.each(function (index) {
    $(this).text("Humidity: " + dataList[listNum[index]].main.humidity + " %");
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
  forecast5day();
}
