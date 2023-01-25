import './App.css';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Button, Card } from 'semantic-ui-react';

export default function App() {
  const weekDay = DateTime.now().weekdayLong;
  const dateToday = DateTime.now().toFormat('MMMM dd. yyyy');
  const timeNow = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS);
  /*  const refreshPage = () => {
    window.location.reload();
  }; */

  /* Get the current position */
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState('');

  useEffect(() => {
    /* declaring the async data fetching function */
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
      /* getting the data from the api */
      const url = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API_KEY}`,
      );
      /* converting the data to json */
      const json = await url.json();
      /* setting state with the result */
      setData(json);
    };
    fetchData().catch(console.error);
  }, [lat, long]);

  return (
    <div className="App">
      {typeof data.main !== 'undefined' ? (
        <Card.Content>
          {/* HEADER ROW */}
          <div className="top">
            <header className="header">{data.name}</header>
            <p className="time">{timeNow}</p>
            <Button
              className="button"
              inverted
              color="blue"
              circular
              icon="refresh"
              /* onClick={refreshPage} */
            />
          </div>
          {/* First Row in the Card */}
          <div className="flex-first">
            <p className="day">
              {weekDay}, <span className="day">{dateToday}</span>
            </p>
            <img
              className="image"
              alt=""
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            />
          </div>
          {/* Second Row in the Card */}
          <div className="flex">
            <p className="time">Temperature: {data.main.temp}&deg;C</p>
            <p className="time">Clouds: {data.clouds.all}%</p>
          </div>
          {/* Third Row in the Card */}
          <div className="flex">
            <p className="time">Humidity: {data.main.humidity}%</p>
            <p className="time">
              Wind Speed: {data.wind.speed}
              <span className="time">Wind direction: {data.wind.deg}&deg;</span>
            </p>
          </div>
        </Card.Content>
      ) : (
        <h1>Error</h1>
      )}
    </div>
  );
}
