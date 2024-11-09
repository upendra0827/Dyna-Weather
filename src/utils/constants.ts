export const VITE_API_KEY: string = import.meta.env.VITE_API_KEY;

export const FETCH_CITY_WEATHER_API: string = `https://api.openweathermap.org/data/2.5/weather?q={q}&appid={appid}`;

export interface WeatherDataType {
  [x: string]: any;
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface errorMsg {
  cod: string;
  message: string;
  searchedCity: string;
}

interface ToastMessage {
  type: "info" | "warning" | "error" | string;
  message: string;
}

export const errorMessagesObjFn = ({
  cod,
  message,
  searchedCity,
}: errorMsg): ToastMessage => {
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
