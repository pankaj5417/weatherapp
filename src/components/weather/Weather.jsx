import axios from "axios";
import { useEffect } from "react";
import { debounce } from "lodash";
import { DateTime } from "luxon";
import Chart from "react-apexcharts";
import moment from "moment";

import { useState } from "react";
import "./weather.css";
//const city='delhi'
function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forcast, setForcast] = useState([]);
  const [city, setCity] = useState("Patna");
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  var options = {
    chart: {
      type: "line",
    },
    stroke: {
      curve: "smooth",
    },
    series: [
      {
        name: "weather",
        data: data.slice(0, 25),
      },
    ],
    xaxis: {
      categories: [
        12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12,
      ],
    },
  };

  var options2 = {
    chart: {
      type: "line",
    },
    stroke: {
      curve: "smooth",
    },
    series: [
      {
        name: "dayinfo",
        data: ['6am','12pm','7pm'],
      },
    ],
    xaxis: {
      categories: [
        '5am','6am','7am','12pm','6pm'
      ],
    },
  };
  console.log("data", data.slice(0, 12));


  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        setStatus(null);
        setLatitude(position.coords.latitude);
        setLng(position.coords.longitude);
        getAddress()
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
  }

  const getAddress=async()=>{
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${lng}&exclude=current,minutelyalerts&units=metric&appid=1fe85b3ad8fa502e23bf446831171936`);
    console.log('data',res);
  }
  
  const handleChange = (e) => {
    const inputVal = e.target.value;
    // setCity(prev=>prev=inputVal)
    // debounce(getWeather,1000)
    setCity(inputVal)
    debounceWeather(inputVal);
  };
  async function getWeather(cityname) {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=1fe85b3ad8fa502e23bf446831171936`
      );
      console.log(res.data);
      setWeatherData(await res.data);
    } catch (err) {
      console.log(err);
    }
  }

// useEffect(()=>{
//   getWeather()
// },[city])
  useEffect(() => {
    weatherData && getWeather2();
  }, [weatherData]);
  // weatherData && getWeather2()

  const debounceWeather = debounce((query) => {
    getWeather(query);
  }, 1000);

  console.log("weatherData", weatherData?.coord.lon);

  async function getWeather2() {
    let lat = await weatherData?.coord.lat;
    let lon = await weatherData?.coord.lon;
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutelyalerts&units=metric&appid=1fe85b3ad8fa502e23bf446831171936`
    );
    console.log(res.data.daily);
    console.log(res);
    setData(res.data.hourly.map((d) => Math.round(d.temp)));
    setForcast(res.data.daily);
  }

  const formatToLocaleTime = (
    secs,
    zone,
    format = "cccc,dd LLL yyyy' | Local time: 'hh:mm a"
  ) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

  return (
    <>
      <div className="weather">
        <div className="weatherContainer">
          <div className="searchContainer">
            <img
            onClick={getLocation}
              className="locationIcon"
              src="https://www.freeiconspng.com/thumbs/location-icon-png/location-icon-png-0.png"
              alt=""
            />
            <input
              type="search"
              value={city}
              className="searchBox"
              placeholder="Search..."
              onChange={handleChange}
            />
            <img
              className="searchIcon"
              src="https://cdn-icons-png.flaticon.com/128/54/54481.png"
              alt=""
            />
          </div>
          {weatherData && (
                  <>
          <section className="searchOutputContainer">
            <ul className="searchListContainer">
              <li className="searchList">
                <span>{weatherData?.name}</span>
                <div className="searchListItem">
                  <div className="countryCode">
                    <span>{weatherData?.sys.country}</span>&nbsp;
                    <span>{Math.round(weatherData?.main.temp)} &deg;C</span>
                    <p>{weatherData?.weather[0].main}</p>
                  </div>
                  <img
                    src={
                      `https://openweathermap.org/img/wn/` +
                      weatherData?.weather[0].icon +
                      `.png`
                    }
                    alt=""
                  />
                </div>
              </li>
            </ul>
          </section>
          </>
          )}
          <div className="dailyForcastContainer">
            {forcast?.map((fdata) => (
              <>
                <div className="dailyForcast">
                  <p>
                    {formatToLocaleTime(fdata.dt, weatherData?.timezone, "ccc")}
                  </p>
                  <span> {Math.round(fdata.temp.max)} &deg;C</span>&nbsp;
                  <span> {Math.round(fdata.temp.min)} &deg;C</span>
                  <img
                    className="icon"
                    src={
                      `https://openweathermap.org/img/wn/` +
                      fdata.weather[0].icon +
                      `.png`
                    }
                    alt=""
                  />
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="weatherBottom">
          {weatherData && (
            <>
              <p>Weather Information</p>
              <p>{weatherData?.name}</p>
              <p>{weatherData?.coord.lat}</p>
              <p>{weatherData?.coord.lon}</p>
              <p>Temprature: {weatherData.main.temp} &deg;C</p>
              <p>
                Sunrise:{" "}
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
                  "en-IN"
                )}
              </p>
              <p>
                Sunset:{" "}
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
                  "en-IN"
                )}
              </p>
              <p>Description: {weatherData.weather[0].main}</p>
              <p>Humidity: {weatherData.main.humidity} %</p>
              <p>Day: {moment().format("dddd")}</p>
              <p>Date: {moment().format("LL")}</p>
            </>
          )}
          <div className="chartContainer">
            <Chart
              className="chart"
              options={options}
              type="area"
              width="100%"
              series={options.series}
            />
          </div>
          <div className="humidPressContainer flex">
            <div className="pressure">
          <p>Pressure</p><p>{weatherData?.main.pressure}&nbsp; hpa</p>

            </div>
            <div className="humidity">
          <p>Humidity</p><p> {weatherData?.main.humidity} &nbsp; %</p>

            </div>

          </div>

          <div className="sunriseSunsetContainer flex">
            <div className="sunrise">
          <p>Sunrise</p><p>{weatherData&&new Date(weatherData?.sys.sunrise * 1000).toLocaleTimeString(
                  "en-IN"
                )}</p>

            </div>
            <div className="sunset">
          <p>Sunset</p><p> {weatherData && new Date(weatherData?.sys.sunset * 1000).toLocaleTimeString(
                  "en-IN"
                )}</p>

            </div>

          </div>
          <br />
          <br />

          <Chart
              className="chart"
              options={options2}
              type="area"
              width="100%"
              series={options2.series}
            />

        </div>
      </div>
    </>
  );
}

export default Weather;
