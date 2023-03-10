import axios from 'axios';

const APIKEY = '4fd80105d8d352f05f6ab1b4df3becad';

const svgIcon = `<svg class="city-icon" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2A11.013 11.013 0 0 0 5 13a10.889 10.889 0 0 0 2.216 6.6s.3.395.349.452L16 30l8.439-9.953c.044-.053.345-.447.345-.447l.001-.003A10.885 10.885 0 0 0 27 13A11.013 11.013 0 0 0 16 2Zm0 15a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4Z"/><circle cx="16" cy="13" r="4" fill="none"/></svg>`;

let latitude = 50.449749;
let longitude = 30.523718;
const date = new Date();

export async function createWidget(weatherWidgetContainer) {
  await fetchCurrentWeather().then(({ weatherData, city }) => {
    const month = getMonth();
    const day = new Date().toDateString().split(' ')[2];
    const weekDay = new Date().toDateString().slice(0, 3);
    const fullYear = new Date().toDateString().split(' ')[3];

    const markup = `
    <div class="degree-container"><p class="temperature">${Math.round(
      weatherData.data.main.temp
    )}\u00B0</p>
      <ul class="city-container">
        <li class="weather-condition">${weatherData.data.weather[0].main}</li>
        <li class="weather-city"> ${svgIcon}<p>${city}</p></li>
      </ul></div>
      <img class="weather-icon" src="http://openweathermap.org/img/wn/${
        weatherData.data.weather[0].icon
      }@2x.png" alt="" width="164" height="153">    
      <div class="date-container"><p>${weekDay}</p>
      <p>${day} ${month} ${fullYear}</p>
      <button class="weatherBtn" type="button">weather for week</button></div>`;

    
    weatherWidgetContainer.innerHTML = markup;
   const weatherWeekBtnRef = document.querySelector('.weatherBtn');

   weatherWeekBtnRef.removeEventListener('click', onWeatherWeekBtnClick);
    function onWeatherWeekBtnClick() {
      fetchWeekWeather({
        city,
        longitude,
        latitude,
        weatherWidgetContainer,
        weatherWeekBtnRef,
        
      });
    }
  

    weatherWeekBtnRef.addEventListener('click', onWeatherWeekBtnClick);
  });

}

async function fetchCurrentWeather() {
  try {
    const position = await getCoordinates();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  } catch (error) {console.log(error.message);}
  // получаем название города
  
  const cityData = await axios.get(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${APIKEY}`
  );
  // название города
  const city = cityData.data[0].name;
  // погода в это месте
  const weatherData = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`
  );

  return { weatherData, city };
}

function getMonth() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[date.getMonth()];
}

function getCoordinates() {

  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function fetchWeekWeather({
  city,
  longitude,
  latitude,
  weatherWidgetContainer,
}) {
  const weekData = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=metric&appid=${APIKEY}`
  );

  let markupWeek = `
    <p class="weather-city weather-city--week">Weekly forecast for ${city}</p><ul class="days-list">`;

  weekData.data.daily.forEach(day => {
    const date = new Date(day.dt * 1000);

    markupWeek += `<li class="week-day__item"><span class="week-day">${date
      .toDateString()
      .slice(0, 3)}</span><p class="day-condition">${
      day.weather[0].main
    }</p><p class="day-temp">
    day: ${Math.round(
      day.temp.day
    )}\u00B0</p> <p class="night-temp">night: ${Math.round(
      day.temp.night
    )}\u00B0  </p></li>`;
  });
  markupWeek += `</ul> <button class="weatherBtn" type="button">current weather</button></div>`;
  
  weatherWidgetContainer.innerHTML = markupWeek;
  
  const weatherCurrentBtnRef = document.querySelector('.weatherBtn');
  weatherCurrentBtnRef.addEventListener('click', () => {
    createWidget(weatherWidgetContainer);
  });

}
