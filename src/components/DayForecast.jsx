import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentLocationWeather } from '../redux/weatherSlice';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const weatherIcons = {
  Clear: <WiDaySunny className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />,
  Clouds: <WiCloudy className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />,
  Rain: <WiRain className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />,
  Snow: <WiSnow className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />,
  Thunderstorm: <WiThunderstorm className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />,
};

const DayForecast = () => {
  const dispatch = useDispatch();
  const { currentLocationWeather, loading, error, unit } = useSelector((state) => state.weather);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchCurrentLocationWeather({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [dispatch, unit]); // Refetch data when unit changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const weatherCondition = currentLocationWeather?.weather[0].main;

  return (
    <div className="text-white flex flex-col items-center md:flex-row md:justify-between p-4 md:p-8 md:pb-1">
      {currentLocationWeather ? (
        <>
          <div className="text-center md:text-left mb-6 md:mb-0 md:w-1/2">
            <h1 className="font-bold text-3xl md:text-5xl mb-2">{currentLocationWeather.name}</h1>
            <p className="text-sm md:text-sm mb-2 capitalize">{currentLocationWeather.weather[0].description}</p>
            <p className="font-semibold text-2xl md:text-4xl">
              {unit === 'metric' ? `${currentLocationWeather.main.temp}°C` : `${currentLocationWeather.main.temp}°F`}
            </p>
          </div>
          <div className="flex justify-center  md:justify-end md:w-1/2">
            {weatherIcons[weatherCondition] || <WiDaySunny className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />}
          </div>
        </>
      ) : (
        <p className="text-center">No weather data available</p>
      )}
    </div>
  );
};

export default DayForecast;
