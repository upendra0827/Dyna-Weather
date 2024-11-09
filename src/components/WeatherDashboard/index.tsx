import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  useFetchWeather,
  useWeatherDispatch,
  useWeatherSelector,
} from "../../hooks";
import WeatherCard from "./WeatherCard";
import ErrorBoundary from "./ErrorBoundary";
import "./style.css";
import Toast from "../../common/Toast";
import { WeatherDataType } from "../../utils/constants";
import { errorMessagesObjFn } from "../../utils/constants";

interface ToastMessage {
  type: "info" | "warning" | "error" | string;
  message: string;
}

const WeatherDashboard: React.FC = () => {
  const {
    fetchWeather,
    isFetching,
    error,
    isFetched,
    handleClearErrorMessage,
    existingCities,
  } = useFetchWeather();
  const { weatherData } = useWeatherSelector();
  const { handleRemoveCity } = useWeatherDispatch();
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    type: "",
    message: "",
  });
  const [searchedCity, setSearchedCity] = useState<string>("");

  useEffect(() => {
    if (error.cod === "404") {
      setToastMessage(errorMessagesObjFn({ ...error, searchedCity }));
    }
  }, [error]);

  useEffect(() => {
    if (isFetched) setSearchedCity("");
  }, [isFetched]);

  const handleSearch = (e: React.FormEvent) => {
    const cityName = searchedCity.replace(/\s+/g, " ").trim();
    e.preventDefault();
    fetchWeather({ city: cityName });
  };

  const handleToastClose = () => {
    handleClearErrorMessage();
    setSearchedCity("");
  };

  return (
    <ErrorBoundary>
      <div className="weatherDashboard">
        <h1>Find the weather status of your desired City</h1>
        <Header
          isFetching={isFetching}
          handleSearch={handleSearch}
          searchedCity={searchedCity}
          setSearchedCity={setSearchedCity}
          errorMessage={
            error.message !== "Already exists" && error.message != ""
              ? errorMessagesObjFn({ ...error, searchedCity }).message
              : ""
          }
          handleClearErrorMessage={handleClearErrorMessage}
        />
        <div className="weatherBoard">
          {weatherData.map(
            ([city, name]: [WeatherDataType, string], index: number) => {
              return (
                <WeatherCard
                  originalName={name}
                  key={`${city.name}-${index}`}
                  cityData={city}
                  handleRemoveCity={handleRemoveCity}
                  existingCities={existingCities}
                />
              );
            }
          )}
        </div>
      </div>
      {error.cod === "404" && (
        <Toast message={toastMessage} handleToastClose={handleToastClose} />
      )}
    </ErrorBoundary>
  );
};

export default WeatherDashboard;
