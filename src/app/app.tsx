import React from 'react';

import { FiCloudRain, FiDroplet, FiWind } from 'react-icons/fi';
import Illustration from './components/illustration';
import WeatherInfo from './components/weather-info';

export default function App() {
  const weatherInfo = [
    { icon: <FiWind />, text: '18km/h' },
    { icon: <FiCloudRain />, text: '0mm' },
    { icon: <FiDroplet />, text: '70%' }
  ];

  return (
    <div className="container flex flex-col font-normal justify-between mx-auto py-8 px-16 text-gray-700 h-screen">
      <h1 className="text-center">
        It's partly cloudy
      </h1>

      <div className="text-center">
        <Illustration hourOfDay={ 22 } />
      </div>

      <div>
        <div className="font-bold text-5xl mb-4">
          21°
        </div>
        <div className="flex justify-between">
          { weatherInfo.map(info => <WeatherInfo icon={ info.icon } text={ info.text } key={ info.text } />) }
        </div>
      </div>

      <div className="text-center">
        Slider
      </div>
    </div>
  )
}
