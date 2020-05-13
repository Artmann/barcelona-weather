import { WeatherDataPoint } from '.';

// Max values in historical data
// [ 0.93, 32.7, 1035, 34, 48 ]

const featureLimits: { [index: string]: number } = {
  humidity: 1,
  precipitation: 100,
  pressure: 2000,
  temperature: 100,
  windSpeed: 100
};

export function dataPointToNetworkData(dataPoint: WeatherDataPoint): number[] {
  return Object.keys(featureLimits).map(key => {
    return (dataPoint as any)[key] / featureLimits[key];
  });
}

export function networkDataToDataPoint(data: number[]): WeatherDataPoint {
  const dataPoint: { [index: string]: number } = {};

  Object.keys(featureLimits).forEach((key, index) => {
    dataPoint[key] = data[index] * featureLimits[key];
  });

  return (dataPoint as unknown) as WeatherDataPoint;
}
