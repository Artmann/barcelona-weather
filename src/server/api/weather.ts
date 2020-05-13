import { Context } from 'koa';
import moment from 'moment';
import { injectable } from 'tsyringe';

import WeatherService, { WeatherDataPoint } from '../weather';

@injectable()
export default class WeatherController {
  constructor(private weatherService: WeatherService) {}

  async getWeather(context: Context): Promise<void> {
    const now = moment();

    const currentWeather: WeatherDataPoint = {
      datetime: now.format('YYYY-MM-DD HH:mm:00'),
      humidity: 0.7,
      precipitation: 0,
      pressure: 1005,
      temperature: 19,
      weather: 'Partly cloudy',
      windSpeed: 16
    };

    const forecast = await this.weatherService.predictWeather(currentWeather, 12);

    const response = {
      current: currentWeather,
      forecast
    };

    context.body = JSON.stringify(response);
  }
}
