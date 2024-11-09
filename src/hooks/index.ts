import { useDispatch, useSelector } from "react-redux";
import { FETCH_CITY_WEATHER_API } from "../utils/constants";
import { addCity, removeCity } from "../store/slices/weatherSlice";
import { VITE_API_KEY } from "../utils/constants";
import { useRef, useState } from "react";

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface CityPayload {
  response: WeatherResponse;
  cityName: string;
}

export const useWeatherDispatch = () => {
  const dispatch = useDispatch();

  const handleAddCity = ({ response, cityName }: CityPayload) => {
    dispatch(addCity({ response, cityName }));
  };

  const handleRemoveCity = ({
    name,
    existingCities,
    cityName,
  }: {
    name: string;
    existingCities: any;
    cityName: string;
  }) => {
    existingCities.current.delete(name);
    existingCities.current.delete(cityName);
    dispatch(removeCity({ name }));
  };

  return {
    handleAddCity,
    handleRemoveCity,
  };
};

export const useWeatherSelector = () => {
  const weatherData = useSelector(
    (state: { weather: { data: any } }) => state.weather.data
  );
  return { weatherData };
};

export const useFetchWeather = () => {
  const existingCities = useRef(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState({
    cod: "",
    message: "",
  });
  const { handleAddCity } = useWeatherDispatch();

  const handleCheckDuplicates = ({ city }: { city: string }) => {
    return existingCities.current.has(city);
  };

  const handleClearErrorMessage = () => {
    setError({
      cod: "",
      message: "",
    });
  };

  const fetchWeather = ({ city }: { city: string }) => {
    const fetchCityWeather = async () => {
      try {
        setIsFetched(false);
        setIsFetching(true);
        const response = await fetch(
          FETCH_CITY_WEATHER_API.replace("{appid}", VITE_API_KEY).replace(
            "{q}",
            city
          )
        );

        if (!response.ok) {
          const errorBody = await response.text();

          throw new Error(`${errorBody}`);
        }

        const responseJson = await response.json();
        setIsFetching(false);

        if (!handleCheckDuplicates({ city: responseJson.name })) {
          handleAddCity({ response: responseJson, cityName: city });
        } else {
          setError({
            cod: "404",
            message: "Already exists",
          });
        }

        existingCities.current.add(responseJson.name);
        existingCities.current.add(city);
        setIsFetched(true);
      } catch (error) {
        const parsedError = JSON.parse((error as any).message);
        setError(parsedError);
      } finally {
        setIsFetching(false);
      }
    };

    if (!handleCheckDuplicates({ city })) {
      fetchCityWeather();
    } else {
      setError({
        cod: "404",
        message: "Already exists",
      });
    }
  };

  return {
    fetchWeather,
    isFetching,
    error,
    isFetched,
    handleClearErrorMessage,
    existingCities,
  };
};
