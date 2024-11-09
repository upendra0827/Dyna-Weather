import React, { ChangeEvent, useState } from "react";

interface HeaderProps {
  handleSearch: (e: any) => void;
  setSearchedCity: React.Dispatch<React.SetStateAction<string>>;
  searchedCity: string;
  errorMessage: string;
  handleClearErrorMessage: () => void;
  isFetching: boolean;
}

const Header: React.FC<HeaderProps> = ({
  handleSearch,
  setSearchedCity,
  searchedCity,
  errorMessage,
  handleClearErrorMessage,
  isFetching,
}) => {
  const [isCityNameValid, setIsCityNameValid] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const regex = /^[A-Za-z\s]+$/;

    if (!regex.test(val) && val != "") {
      setIsCityNameValid(false);
    } else {
      setIsCityNameValid(true);
    }

    if (errorMessage) handleClearErrorMessage();
    setSearchedCity(val);
  };

  return (
    <div className="weatherInput">
      <form onSubmit={handleSearch}>
        <input
          placeholder="Enter city name"
          type="text"
          value={searchedCity}
          required
          onChange={handleChange}
          className="inputField"
        />
        <button disabled={!isCityNameValid} type="submit">
          Search
        </button>
      </form>
      <div className="inputHelpers">
        {isFetching && <div>Loading.......</div>}
        {!isCityNameValid && (
          <div className="error">Oops! only alphabets are allowed</div>
        )}
      </div>
    </div>
  );
};

export default Header;
