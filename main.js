const API_KEY = "ef5f033b7952505cd5835b94d60c3c9a";

const DAY_OF_THE_WEEK =  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let selectedCityText;
let selectedCity;

const getCitiesUsingGeoLocation = async(searchText) => {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=5&appid=${API_KEY}`)
    return response.json()
}

const getCurrentWeatherData = async({ lat, lon, name: city})=>{
    const url = lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` ;
    const response = await fetch(url);
    return response.json()
}

const getHourlyForecast = async ({name : city}) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    return data.list.map(forecast => {
        const {main : {temp, temp_max, temp_min}, dt, dt_txt, weather : [{ description, icon }]} = forecast;
        return { temp, temp_max, temp_min, dt, dt_txt, description, icon }
    })
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`
const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{description}]}) => {
    const currentForecastElement  = document.querySelector("#current-forecast");
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = formatTemperature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".min-max-temp").textContent = `High: ${formatTemperature(temp_max)} Low: ${formatTemperature(temp_min)}`;
}

const loadHourlyForecast = ({main : {temp: tempNow}, weather: [{icon: iconNow}]}, hourlyForecast) => {

    const timeFormatter = Intl.DateTimeFormat("en", {
        hour12:true, hour:"numeric"
    })
    let dataFor12Hours = hourlyForecast.slice(2, 14);
    const hourlyContainer = document.querySelector(".hourly-container");
    let innerHTMLString = `<article>
                                <h3 class="time">Now</h3>
                                <img class="icon" src="${createIconUrl(iconNow)}" alt="">
                                <p class="hour">${formatTemperature(tempNow)}</p>
                            </article>`;

    for(let {temp, icon, dt_txt} of dataFor12Hours){

        innerHTMLString += `<article>
                        <h3 class="time">${timeFormatter.format(new Date(dt_txt))}</h3>
                        <img class="icon" src="${createIconUrl(icon)}" alt="">
                        <p class="hour">${formatTemperature(temp)}</p>
                    </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString;
}

const calculateDayWiseForecast = (hourlyForecast) => {
    let dayWiseForecast = new Map();
    for(let forecast of hourlyForecast){
        const [date] = forecast.dt_txt.split(" ");
        const dayOfTheWeek = DAY_OF_THE_WEEK[new Date(date).getDay()];
        console.log(dayOfTheWeek);
        if(dayWiseForecast.has(dayOfTheWeek)){
            let forecastForTheDay = dayWiseForecast.get(dayOfTheWeek);
            forecastForTheDay.push(forecast);
            dayWiseForecast.set(dayOfTheWeek, forecastForTheDay);
        }else{
            dayWiseForecast.set(dayOfTheWeek, [forecast]);
        }    
    }
    console.log(dayWiseForecast);

    for(let [key, value] of dayWiseForecast){
        let temp_min = Math.min(...Array.from(value, val => val.temp_min));
        let temp_max = Math.max(...Array.from(value, val => val.temp_max));

        dayWiseForecast.set(key, {temp_min, temp_max, icon: value.find(v => v.icon).icon });

    }
    console.log(dayWiseForecast);
    return dayWiseForecast;
    
}

const loadFiveDayForecast = (hourlyForecast) => {
    console.log(hourlyForecast);
    const dayWiseForecast = calculateDayWiseForecast(hourlyForecast);
    const container = document.querySelector(".five-day-forecast-container");
    let dayWiseInfo = "";

    Array.from(dayWiseForecast).map(([ day, { temp_max, temp_min, icon } ], index) => {

        if(index < 5){
            dayWiseInfo += `<article class="day-wise-forecast">
                            <h3 class = "day">${index === 0 ? "Today" : day } </h3>
                            <img class="icon" src="${createIconUrl(icon)}" alt="icon for the forecast">
                            <p class="min-temp">${formatTemperature(temp_min)}</p>
                            <p class="max-temp">${formatTemperature(temp_max)}</p>
                        </article>`;
        }
    });

    container.innerHTML = dayWiseInfo;
}

const loadFeelsLike = ({ main : { feels_like }}) => {
    let container = document.querySelector("#feels-like");
    container.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
}

const loadHumidity = ({ main : { humidity }}) => {
    let container = document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = `${humidity}%`;
}

const loadForecastUsingGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(({coords}) => {
        const {latitude: lat, longitude:lon} = coords;
        selectedCity = {lat, lon};
        loadData();
    }, error => console.log(error))
}

const loadData = async () => {
    const currentWeather = await getCurrentWeatherData(selectedCity);
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecast(currentWeather);
    loadHourlyForecast(currentWeather, hourlyForecast);
    loadFiveDayForecast(hourlyForecast);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
}

function debounce(func) {
    let timer;
    return (...args) => {
        clearTimeout(timer); // clear the existing timer
        // create a new time till user is typing
        timer = setTimeout(() => {
            func.apply(this, args)
        }, 500);
    }
}

const onSearchChange = async (event) => {
    let { value } = event.target;
    if(!value){
        selectedCity = null;
        selectedCityText = "";
    }
    if(value && (selectedCityText !== value)){
        const listOfCities = await getCitiesUsingGeoLocation(value);
        let options = "";
        for (let { lat, lon, name, state, country } of listOfCities) {
            options += `<option data-city-details = '${JSON.stringify({lat, lon, name})}' value="${name}, ${state}, ${country}"></option>`
        }
        document.querySelector("#cities").innerHTML = options;
        console.log(listOfCities);
    }
}

const handleCitySelection = (event) => {
    selectedCityText = event.target.value;
    let options = document.querySelectorAll("#cities > option");
    if (options?.length) {
        let selectedOption = Array.from(options).find(opt => opt.value === selectedCityText);
        selectedCity = JSON.parse(selectedOption.getAttribute("data-city-details"));
        loadData();
    }
}

const debounceSearch = debounce((event) => onSearchChange(event))

document.addEventListener("DOMContentLoaded", async ()=>{

    loadForecastUsingGeoLocation();

    const searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", debounceSearch);
    searchInput.addEventListener("change", handleCitySelection);
})