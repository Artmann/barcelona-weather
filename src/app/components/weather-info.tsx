import React, { ReactElement } from 'react';

interface WeatherInfoProps {
  icon: ReactElement;
  text: string;
}

export default function WeatherInfo({ icon, text }: WeatherInfoProps): ReactElement {
  return (
    <div className="text-center">
      <div className="flex justify-center text-gray-500 text-3xl mb-4">
        { icon }
      </div>
      <div className="leading-lose text-gray-800 tracking-wide uppercase">
        { text }
      </div>
    </div>
  )
}
