import { WeatherDataType } from "../../../utils/constants";

interface WeatherCardType {
  cityData: WeatherDataType;
  handleRemoveCity: ({
    name,
    existingCities,
    cityName,
  }: {
    name: string;
    existingCities: React.MutableRefObject<Set<string>>;
    cityName: string;
  }) => void;
  originalName: string;
  existingCities: React.MutableRefObject<Set<string>>;
}

const WeatherCard = ({
  cityData,
  handleRemoveCity,
  originalName,
  existingCities,
}: WeatherCardType) => {
  const { weather, main, visibility, wind, clouds, sys } = cityData;

  const weatherInfo = weather[0];
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

  return (
    <div className="weatherCard">
      <h2>
        {cityData.name.toLowerCase() !== originalName.toLowerCase()
          ? `${cityData.name}(${originalName})`
          : cityData.name}
      </h2>
      <div className="weatherDisplay">
        <div>
          <strong>Temperature:</strong> {(main.temp - 273.15).toFixed(2)}°C
        </div>
        <div>
          <strong>Feels Like:</strong> {(main.feels_like - 273.15).toFixed(2)}°C
        </div>
        <div>
          <strong>Condition:</strong> {weatherInfo.main} -{" "}
          {weatherInfo.description}
        </div>
        <div>
          <strong>Humidity:</strong> {main.humidity}%
        </div>
        <div>
          <strong>Wind:</strong> {wind.speed} m/s at {wind.deg}°
        </div>
        <div>
          <strong>Visibility:</strong> {visibility} meters
        </div>
        <div>
          <strong>Cloudiness:</strong> {clouds.all}%
        </div>
        <div>
          <strong>Sunrise:</strong> {sunrise}
          <br />
          <strong>Sunset:</strong> {sunset}
        </div>
      </div>
      <button
        className="deleteBtn"
        onClick={() =>
          handleRemoveCity({
            name: originalName,
            existingCities,
            cityName: cityData.name,
          })
        }
      >
        Delete
      </button>
    </div>
  );
};

export default WeatherCard;
