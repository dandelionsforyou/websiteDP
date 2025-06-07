const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')

const apiKey = "72fd87cbfe8ddeb5eab74311dbe8fc18"

const countryTxt = document.querySelector('.country-text')
const tempTxt = document.querySelector('.temp-text')
const conditionTxt = document.querySelector('.condition-text')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const soilDateTxt = document.querySelector('.soil-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-item-container')

const databaseBtn = document.querySelector('.database-btn')
const databaseBtnDown = document.querySelector('.database-btn-download')

const dateLogin = document.querySelector('.database-date-txt')
const urlAPIdate = "https://script.google.com/macros/s/AKfycbyVfaOLHN4CHRe1uFRgb83vVttMQqeH0ORnsK6SvLYK079qt3pNZjw-HXm42icOg3ko/exec"

databaseBtn.addEventListener('click', () => {
    window.open("https://docs.google.com/spreadsheets/d/100XgyOWuTMzw8SHUVTaCR9fzj_BjFGn6TlHRTcG7Q_E/edit?hl=id&gid=0#gid=0", "_blank")
})

databaseBtnDown.addEventListener('click', () => {
    const url = "https://docs.google.com/spreadsheets/d/100XgyOWuTMzw8SHUVTaCR9fzj_BjFGn6TlHRTcG7Q_E/export?format=xlsx"
    const link = document.createElement("a");
      link.href = url;
      link.download = "database.xlsx"; // Nama file saat diunduh
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
})

fetch(urlAPIdate).then(response => response.json().then(data => {
    if (data.latestDate) {
          dateLogin.textContent = data.latestDate;
        } else {
          dateLogin.textContent = "Tidak ada data tanggal.";
        }
      })
      .catch(err => {
        console.error("Gagal mengambil data:", err);
        dateLogin.textContent = "Error mengambil data.";
    })
)

searchBtn.addEventListener('click', () =>{
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) =>{
    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)

    return response.json()
}

updateSoilInfo();

function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod  != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    currentDateTxt.textContent = getCurrentDate()

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city) {
    const forecastData = await getFetchData('forecast', city)

    const todayDate = new Date().toISOString().split('T')[0]
    const uniqueDates = new Set()

    forecastItemsContainer.innerHTML = ''

    forecastData.list.forEach(forecastWeather => {
        const dateStr = forecastWeather.dt_txt.split(' ')[0]

        if (!uniqueDates.has(dateStr) && dateStr !== todayDate) {
            uniqueDates.add(dateStr)
            updateForecastsItems(forecastWeather)
        }
    })
}

function updateForecastsItems(weatherData){
    const{
        dt_txt: date ,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption ={
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                </div> `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display='none')

    section.style.display = 'flex'
}

function updateSoilInfo(){
    soilDateTxt.textContent = getCurrentDate();
}