const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoTxt = document.querySelector('.info-txt');
const inputField = document.querySelector('input');
const locationBtn = inputPart.querySelector('#getLoc');
let weatherIcon = document.querySelector('.weather-part img');
let backBtn = wrapper.querySelector('header i');

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    //check if geolocation is supported
    navigator.geolocation.getCurrentPosition(onSucess, onError);
  } else {
    alert('Your browser does not support geolocation'); //if not supported
  }
});

function onSucess(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = config.W_API_KEY;
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetchData(api);
}

function onError(err) {
  infoTxt.innerText = err.message;
  infoTxt.classList.add('error');
}

inputField.addEventListener('keypress', (e) => {
  //check if enter key is pressed and input not equal to null
  if (e.key === 'Enter' && inputField.value !== '') {
    requestApi(inputField.value);
  }
});

function requestApi(city) {
  let apiKey = config.W_API_KEY;
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetchData(api);
}

function fetchData(api) {
  infoTxt.innerText = 'Getting weather details...';
  infoTxt.classList.add('pending');
  fetch(api)
    .then((res) => res.json())
    .then((data) => weatherDetails(data));
}

function weatherDetails(data) {
  if (data.cod == '404') {
    infoTxt.innerText = `${inputField.value} is not a valid city name.`;
    infoTxt.classList.replace('pending', 'error');
  } else {
    //GET REAL VALUES FROM API
    let city = data.name;
    let country = data.sys.country;
    let description = data.weather[0].description;
    let temp = Math.round(data.main.temp - 273.15);
    let humidity = data.main.humidity;
    let feelsLike = Math.round(data.main.feels_like - 273.15);
    let weatherID = data.weather[0].id;

    if (weatherID >= 200 && weatherID <= 232) {
      //thunderstorm
      weatherIcon.src = './img/storm.svg';
    } else if (weatherID >= 300 && weatherID <= 321) {
      //drizzle
      weatherIcon.src = './img/drizzle.svg';
    } else if (weatherID >= 500 && weatherID <= 531) {
      //rain
      weatherIcon.src = './img/rain.svg';
    } else if (weatherID >= 600 && weatherID <= 622) {
      //snow
      weatherIcon.src = './img/snow.svg';
    } else if (weatherID >= 701 && weatherID <= 781) {
      //atmosphere
      weatherIcon.src = './img/haze.svg';
    } else if (weatherID == 800) {
      //clear
      weatherIcon.src = './img/clear.svg';
    } else if (weatherID >= 801 && weatherID <= 804) {
      //clouds
      weatherIcon.src = './img/cloud.svg';
    }

    //PASS THE VALUES
    wrapper.querySelector('.temp .numb').innerText = temp;
    wrapper.querySelector('.weather').innerText = description.toUpperCase();
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
    wrapper.querySelector('.temp .numb-2').innerText = feelsLike;
    wrapper.querySelector('.humidity span').innerText = humidity;

    infoTxt.classList.remove('pending', 'error');
    wrapper.classList.add('active');
  }
}

backBtn.addEventListener('click', () => {
  wrapper.classList.remove('active');
});
