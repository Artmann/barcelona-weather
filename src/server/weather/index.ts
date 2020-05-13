import { recurrent, NeuralNetwork } from 'brain.js';
import { promises as fs } from 'fs';
import moment from 'moment';
import { join } from 'path';
import { singleton } from 'tsyringe';

import { dataPointToNetworkData, networkDataToDataPoint } from './prediction';

export interface WeatherDataPoint {
  datetime?: string;
  humidity: number;
  precipitation: number;
  pressure: number;
  temperature: number;
  weather: string;
  windSpeed: number;
}

@singleton()
export default class WeatherService {
  private network?: NeuralNetwork;

  async predictWeather(initalWeather: WeatherDataPoint, iterations = 12): Promise<WeatherDataPoint[]> {
    if (!this.network) {
      this.network = await this.loadNetwork();
    }

    const predictions: WeatherDataPoint[] = [];

    new Array(iterations).fill(null).reduce((carry) => {
      if (!this.network) {
        return carry;
      }

      const data = this.network.run([ dataPointToNetworkData(carry) ]) as number[];
      const prediction = networkDataToDataPoint(data);

      carry = {
        ...prediction,
        datetime: moment(carry.datetime).add(1, 'hour').format('YYYY-MM-DD HH:mm:00')
      };

      predictions.push(carry);

      return carry;
    }, initalWeather);

    return predictions;
  }

  private async loadNetwork(): Promise<NeuralNetwork> {
    const network = new recurrent.LSTMTimeStep({
      inputSize: 5,
      hiddenLayers: [10, 10],
      outputSize: 5
    });

    const networkPath = join(__dirname, 'network.json');
    const json = await fs.readFile(networkPath, 'utf-8');
    const data = JSON.parse(json);

    network.fromJSON(data);

    return network;
  }
}
