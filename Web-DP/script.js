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
const urlAPIdate = "https://script.google.com/macros/s/AKfycbwrHvZYr_9OMCpjGM47qOHhavat9tKwJ2o1LgBCSV8bwsfBNTH8FmbsPyFVvAc7SNscQQ/exec"

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

function fetchDateLogin() {
  fetch(urlAPIdate)
    .then(response => response.json())
    .then(data => {
      if (data.latestDate) {
        dateLogin.textContent = data.latestDate;
      } else {
        dateLogin.textContent = "Tidak ada data tanggal.";
      }
    })
    .catch(err => {
      console.error("Gagal mengambil data:", err);
      dateLogin.textContent = "Error mengambil data.";
    });
}

// Jalankan pertama kali saat halaman dimuat
fetchDateLogin();

// Jalankan setiap 10 detik
setInterval(fetchDateLogin, 10000);
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

// Broker connection Configuration
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const host = 'ws://broker.emqx.io:8083/mqtt'
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
}

//Status connection
console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)
client.on('connect', () => {
  console.log('Connected to MQTT broker!')
  console.log(clientId)
})
client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})
client.on('reconnect', () => {
  console.log('Reconnecting...')
})

//Subscribe & display topic
const topic_Soil1 = 'SmartGardenBludDawg/Soil1';
const topic_Soil2 = 'SmartGardenBludDawg/Soil2';
const topic_Api = 'SmartGardenBludDawg/Api';
const topic_Asap = 'SmartGardenBludDawg/Asap';
const topic_Water = 'SmartGardenBludDawg/Water';
const Soil1 = document.getElementById('soil1');
const Soil2 = document.getElementById('soil2');
const Soil1_Analog = document.getElementById('soil1-analog');
const Soil2_Analog = document.getElementById('soil2-analog');
const Soil1_Persen = document.getElementById('soil1-persen');
const Soil2_Persen= document.getElementById('soil2-persen');
const Pump1 = document.getElementById('pump1');
const Pump2 = document.getElementById('pump2');
const Api = document.getElementById('api');
let Value_Api = null;
const Asap = document.getElementById('asap');
const Asap_Analog = document.getElementById('asap-analog');
let Value_Asap = null;
const Status_Udara = document.getElementById('status-udara')
const Water = document.getElementById('water');
const Water_Analog = document.getElementById('water-analog');
const Water_Persen = document.getElementById('water-persen');
const Img_Api = document.getElementById('img-api');
const Img_Asap = document.getElementById('img-asap');
const Img_Water = document.getElementById('img-water');
const Img_Emote = document.getElementById('img-emote');

client.subscribe([topic_Soil1, topic_Soil2, topic_Api, topic_Asap, topic_Water]);

client.on('message', function (topic, message) { // message is Buffer
    
  if(topic === topic_Soil1){
    console.log('Soil1 = ', message.toString());
    Soil1_Analog.innerHTML = message.toString();
    const calculate_persen = Math.round((1-(Number(message.toString())/4095))*100);
    Soil1_Persen.innerHTML = calculate_persen;
    if(Number(message.toString()) > 2000){
        Soil1.innerHTML = "Dry";
        Pump1.innerHTML = "On";
    }
    else{
        Soil1.innerHTML = "Wet";
        Pump1.innerHTML = "Off";
    }
  }
  else if(topic === topic_Soil2){
    console.log('Soil2 = ', message.toString());
    Soil2_Analog.innerHTML = message.toString();
    const calculate_persen = Math.round((1-(Number(message.toString())/4095))*100);
    Soil2_Persen.innerHTML = calculate_persen;
    if(Number(message.toString()) > 2000){
        Soil2.innerHTML = "Dry";
        Pump2.innerHTML = "On";
    }
    else{
        Soil2.innerHTML = "Wet";
        Pump2.innerHTML = "Off";
    }
  }
  else if(topic === topic_Api){
    console.log('Api = ', message.toString());
    Value_Api = message.toString();
    if(message.toString() === "0"){
        Api.innerHTML = "Ada Api";
        Img_Api.src = "assets/fire/emergency fire.svg";
    }
    else{
        Api.innerHTML = "Normal"
        Img_Api.src = "assets/fire/fire.svg";
    }
  }
  else if(topic === topic_Asap){
    console.log('Asap = ', message.toString());
    Value_Asap = Number(message.toString());
    Asap_Analog.innerHTML = message.toString();
    if(Number(message.toString()) > 1100){
        Asap.innerHTML = "Banyak Asap";
        Img_Asap.src = "assets/air/emergency air.svg";
    }
    else{
        Asap.innerHTML = "Normal";
        Img_Asap.src = "assets/air/air.svg";
    }
  }
  else if(topic === topic_Water){
    console.log('Water = ', message.toString());
    const calculate_ml = Math.round(Math.PI*16*(10-Number(message.toString())));     //Rumus dari cm ke ml
    const calculate_persen = Math.round(((10-Number(message.toString()))/10)*100);   //rumus dari cm ke persen
    Water_Analog.innerHTML = calculate_ml;
    Water_Persen.innerHTML = calculate_persen;
    if(calculate_persen > 80){
        Water.innerHTML = "Full";
        Img_Water.src = "assets/water/water-high.svg";
    }
    else if(calculate_persen > 30){
        Water.innerHTML = "Medium";
        Img_Water.src = "assets/water/water-medium.svg";
    }
    else{
        Water.innerHTML = "Low";
        Img_Water.src = "assets/water/water-low.svg";
    }
  }

  //Status udara dari value asap dan api
if (Value_Asap > 1100 && Value_Api === "1") {
    Status_Udara.innerHTML = "Smoke detected, possible smoldering";
    Img_Emote.src = "assets/emot/stressed.svg";
  }
  else if (Value_Asap < 1100 && Value_Api === "0") {
    Status_Udara.innerHTML = "Heat detected, risk of fire";
    Img_Emote.src = "assets/emot/unsmile.svg";
  }
  else if (Value_Asap > 1100 && Value_Api === "0") {
    Status_Udara.innerHTML = "Active fire detected";
    Img_Emote.src = "assets/emot/sick.svg";
  }
  else if (Value_Asap < 1100 && Value_Api === "1") {
    Status_Udara.innerHTML = "Air is fresh and safe";
    Img_Emote.src = "assets/emot/smile.svg";
  }
});