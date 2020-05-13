import { recurrent } from 'brain.js';
// @ts-ignore
import similarity from 'cosine-similarity';
import { promises as fs } from 'fs';
import { join } from 'path';

import { WeatherDataPoint } from './index';

interface DataPoint {
  [index: string]: number;
  humidity: number;
  precipitation: number;
  pressure: number;
  temperature: number;
  windSpeed: number;
}

function formatData(rows: WeatherDataPoint[]): number[][] {
  const points: DataPoint[] = rows.map(row => ({
    humidity: row.humidity,
    precipitation: row.precipitation,
    pressure: row.pressure,
    temperature: row.temperature,
    windSpeed: row.windSpeed
  }));

  return points.map(point => {
    const normalize = (key: string): number => {
      const max = Math.max(...points.map(row => row[key]));

      if (max <= 0) {
        return 0;
      }

      return point[key] / max;
    };

    return [normalize('humidity'), normalize('precipitation'), normalize('pressure'), normalize('temperature'), normalize('windSpeed')];
  });
}

(async function(): Promise<void> {
  const data = await fs.readFile(join(__dirname, 'data', 'historical-2019.json'), 'utf-8');
  const rows = (JSON.parse(data) as WeatherDataPoint[]);

  const delimiter = rows.length * 0.7;
  const trainingSet = formatData(rows.slice(0, delimiter));
  const testSet = formatData(rows.slice(delimiter, rows.length));

  const trainingData = [];
  const timeStep = 5;

  for (let i = 0; i < trainingSet.length - timeStep - 1; i++) {
    trainingData.push(trainingSet.slice(i, i + timeStep));
  }

  const config = {
    inputSize: 5,
    hiddenLayers: [10, 10],
    outputSize: 5
  };
  const trainingConfig = {
    iterations: 20000,
    learningRate: 0.3,
    log: true,
    logPeriod: 50,
  };


  const networkPath = join(__dirname, 'network.json');
  const net= new recurrent.LSTMTimeStep(config);

  let networkExists = true;

  try {
    await fs.stat(networkPath);
  } catch (error) {
    networkExists = false;
  }

  if (networkExists) {
    const json = await fs.readFile(networkPath, 'utf-8');
    const data = JSON.parse(json);

    net.fromJSON(data);
  } else {
    console.log(`Traning on ${ trainingSet.length } samples.`);

    console.log('Example');
    console.log(trainingData[3]);

    net.train(trainingData, trainingConfig);

    const networkJson = JSON.stringify(net.toJSON());

    await fs.writeFile(networkPath, networkJson, 'utf-8');
  }

  const tests = [];

  for (let i = 0; i < testSet.length - timeStep - 3; i++) {
    const input = testSet.slice(i, i + timeStep);
    const expected = testSet[i + timeStep + 1];
    const output = net.run(input);

    tests.push(similarity(expected, output));
  }

  const accuracy = Math.round(tests.reduce((sum, value) => sum + value, 0) / tests.length * 100 * 1000) / 1000;

  console.log(`Accuracy of ${ accuracy }%.`);

  console.log('Example');
  console.log('');
  console.log(testSet[77]);
  console.log(net.run([
    testSet[76]
  ]));
})();
