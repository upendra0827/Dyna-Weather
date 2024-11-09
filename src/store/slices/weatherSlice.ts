import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherDataType } from "../../utils/constants";

interface WeatherState {
  data: [WeatherDataType, string][];
  error: string;
}

interface AddCityPayload {
  response: WeatherDataType;
  cityName: string;
}

interface RemoveCityPayload {
  name: string;
}

const initialState: WeatherState = {
  data: [],
  error: "",
};

const weatherSlice = createSlice({
  name: "weather",
  initialState: initialState,
  reducers: {
    addCity(state = initialState, action: PayloadAction<AddCityPayload>) {
      return {
        ...state,
        data: [
          [action.payload.response, action.payload.cityName],
          ...state.data,
        ],
      };
    },
    removeCity(state = initialState, action: PayloadAction<RemoveCityPayload>) {
      const newData = state.data.filter(([, name]) => {
        return name != action.payload.name;
      });
      return {
        ...state,
        data: newData,
      };
    },
  },
});

export const { addCity, removeCity } = weatherSlice.actions;

export default weatherSlice.reducer;
