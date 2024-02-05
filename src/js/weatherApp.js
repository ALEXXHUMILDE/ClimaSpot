import { createHourlyCards, createDailyCards } from "./weatherForecastCards.js";
import { startLoadingState, endLoadingState } from "./setLoadingState.js";
import { handleError } from "./handleError.js";
import { currentWeatherData } from "./currentWeatherData.js";
import { weatherForecastData } from "./weatherForecastData.js";

const API_KEY = "TU API KEY";

const searchBoxInput = document.querySelector(".search-box-input");
const gpsButton = document.querySelector(".gps-button");
const ctaButton = document.querySelector(".cta-button");
const topButton = document.querySelector(".top-button");

createHourlyCards();
createDailyCards();

const fetchWeatherData = async (data) => {
  try {
    await startLoadingState();
    await currentWeatherData(data, API_KEY);
    await weatherForecastData(data, API_KEY);
    await endLoadingState();
  } catch (error) {
    if (error.message === "Fallo en recuperar") {
      await handleError(
        "¡UH oh! Parece que no estás conectado a Internet. Por favor, compruebe la conexión y vuelva a intentarlo.",
        "Actualizar página"
      );
    } else {
      await handleError(error.message, "Intentar otra vez");
    }
  }
};

const getUserLocation = async () => {
  const successCallback = async (position) => {
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    await fetchWeatherData(data);
  };

  const errorCallback = (error) => {
    console.log(error);
    fetchWeatherData("Istanbul");
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

searchBoxInput.addEventListener("keyup", async (event) => {
  if (event.keyCode === 13) {
    await fetchWeatherData(searchBoxInput.value);
  }
});

gpsButton.addEventListener("click", getUserLocation);

ctaButton.addEventListener("click", () => {
  window.open("https://github.com/ALEXXHUMILDE/ClimaSpot");
});

topButton.addEventListener("click", scrollToTop);

getUserLocation();
