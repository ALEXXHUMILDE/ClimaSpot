import { roundDegree, formatDate, mpsToKmh, metersToKm, capitalize } from "./convertUnits.js";

export const currentWeatherData = async (data, key) => {
  const currentWeatherIcon = document.querySelector(".current-weather-icon");
  const currentWeatherTemperature = document.querySelector(".current-weather-temperature");
  const currentWeatherDescription = document.querySelector(".current-weather-description");
  const currentLocation = document.querySelector(".current-location");
  const currentDate = document.querySelector(".current-date");

  const windSpeedValue = document.querySelector(".wind-speed-value");
  const pressureValue = document.querySelector(".pressure-value");
  const sunriseValue = document.querySelector(".sunrise-value");
  const humidityValue = document.querySelector(".humidity-value");
  const visibilityValue = document.querySelector(".visibility-value");
  const sunsetValue = document.querySelector(".sunset-value");

  let API_URL;

  if (data.lat && data.lon) {
    API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${key}&units=metric&lang=es`;
  } else {
    API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${key}&units=metric&lang=es`;
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Lo siento, no pudimos encontrar ${data}. Por favor, verifica la ortografía y vuelve a intentarlo.`);
    } else {
      throw new Error(
        "¡Ups! Estamos teniendo problemas para obtener la información meteorológica más reciente en este momento. Por favor, inténtalo de nuevo más tarde o contacta con el soporte si el problema persiste."
      );
    }
  }

  const currentWeatherData = await response.json();

  currentWeatherIcon.src = `src/img/animated/${currentWeatherData.weather[0].icon}.svg`;
  currentWeatherTemperature.innerHTML = await roundDegree(currentWeatherData.main.temp);
  currentWeatherDescription.innerHTML = await capitalize(currentWeatherData.weather[0].description);
  currentLocation.innerHTML = currentWeatherData.name;
  currentDate.innerHTML = await formatDate(currentWeatherData.dt, "full");

  windSpeedValue.innerHTML = await mpsToKmh(currentWeatherData.wind.speed);
  pressureValue.innerHTML = `${currentWeatherData.main.pressure} hPa`;
  sunriseValue.innerHTML = await formatDate(currentWeatherData.sys.sunrise, "hour");
  humidityValue.innerHTML = `${currentWeatherData.main.humidity}%`;
  visibilityValue.innerHTML = await metersToKm(currentWeatherData.visibility);
  sunsetValue.innerHTML = await formatDate(currentWeatherData.sys.sunset, "hour");
};
