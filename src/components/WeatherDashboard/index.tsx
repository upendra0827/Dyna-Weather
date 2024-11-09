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

interface Error {
  cod: string;
  message: string;
}

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

  const errorMessagesObjFn = ({
    cod,
    message,
  }: Error): { type: string; message: string } => {
    const val = searchedCity;
    if (!cod) {
      return {
        type: "info",
        message: "Please check the city name and try again.",
      };
    }

    if (cod === "404") {
      if (message === "Already exists") {
        return {
          type: "warning",
          message: `${val}'s weather report already exists in the dashboard.`,
        };
      } else if (message === "city not found") {
        return {
          type: "error",
          message: `The city '${val}' could not be found. Please make sure the city name is correct and try again.`,
        };
      } else if (message === "Internal error") {
        return {
          type: "error",
          message:
            "Oops! Something went wrong on our end. Please try again later.",
        };
      }
    }

    return {
      type: "error",
      message:
        "We encountered an unexpected issue. Please try again after a moment.",
    };
  };

  useEffect(() => {
    if (error.cod === "404") {
      setToastMessage(errorMessagesObjFn(error));
    }
  }, [error]);

  const handleSearch = (e: React.FormEvent) => {
    const cityName = searchedCity.replace(/\s+/g, " ").trim();
    e.preventDefault();
    fetchWeather({ city: cityName });
  };

  useEffect(() => {
    if (isFetched) setSearchedCity("");
  }, [isFetched]);

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
              ? errorMessagesObjFn(error).message
              : ""
          }
          handleClearErrorMessage={handleClearErrorMessage}
        />
        <div className="weatherBoard">
          {weatherData.map(([city, name]: [any, any], index: number) => {
            return (
              <WeatherCard
                originalName={name}
                key={`${city.name}-${index}`}
                cityData={city}
                handleRemoveCity={handleRemoveCity}
                existingCities={existingCities}
              />
            );
          })}
        </div>
      </div>
      {error.cod === "404" && (
        <Toast message={toastMessage} handleToastClose={handleToastClose} />
      )}
    </ErrorBoundary>
  );
};

export default WeatherDashboard;
