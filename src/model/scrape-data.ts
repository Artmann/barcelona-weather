import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';

interface WeatherDataPoint {
  datetime: string;
  humidity: number;
  precipitation: number;
  pressure: number;
  temperature: number;
  weather: string;
  windSpeed: number;
}

async function fetchDataAtDate(date: string): Promise<WeatherDataPoint[]> {
  const apiKey = '3c8dc60435a047518c590934201305';

  const url = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?tp=1&format=json&q=Barcelona&date=${ date }&key=${ apiKey }`;

  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    }
  });
  const data = await response.json();
  const [ weather ] = data.data.weather;

  return weather.hourly.map((row: any) => {
    const datetime = `${ date } ${ row.time }`;

    const humidity = parseInt(row.humidity, 10) / 100;
    const precipitation = parseFloat(row.precipMM);
    const pressure = parseInt(row.pressure, 10);
    const temperature = parseInt(row.tempC, 10);
    const weather = row.weatherDesc[0].value;
    const windSpeed = parseInt(row.windspeedKmph, 10);

    return {
      datetime,
      humidity,
      precipitation,
      pressure,
      temperature,
      weather,
      windSpeed
    };
  });
}

function wait(duration: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

(async function(): Promise<void> {
  const year = 2019;
  const month = 5;
  const numberOfDays = new Date(year, month, 0).getDate();
  const paddedMonth = `${month}`.padStart(2, '0');
  const dataPoints: WeatherDataPoint[] = [];

  for (let day = 1; day <= numberOfDays; day++) {
    const date = [year, paddedMonth, `${day}`.padStart(2, '0')].join('-');
    console.log(date);

    const points = await fetchDataAtDate(date);

    points.forEach(point => dataPoints.push(point));

    await wait(200);
  }

  const outputPath = join(__dirname, 'data', `historical-${ year }-${ paddedMonth }.json`);

  console.log(`Saving data into ${ outputPath }.`);

  fs.writeFile(outputPath, JSON.stringify(dataPoints), 'utf-8');
})();
