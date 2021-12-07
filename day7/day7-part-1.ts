import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const inputParser = (inputString: string): Array<number> => {
  const [firstLine] = inputString.split('\n');

  return firstLine.split(',').map((n) => parseInt(n, 10));
};

const getOptimalFuelConsumption = (positions: Array<number>): number => {
  const candidatePoint = getCandidatePoint(positions);
  const radius = Math.floor(positions.length / 3);
  let fuelConsumption: number | undefined = undefined;

  for (
    let position = candidatePoint - radius;
    position <= candidatePoint + radius;
    position += 1
  ) {
    const fuel = calculateFuel(positions, position);

    if (fuelConsumption === undefined || fuel < fuelConsumption) {
      fuelConsumption = fuel;
    }
  }

  return fuelConsumption as number;
};

const calculateFuel = (positions: Array<number>, target: number) => {
  let fuel = 0;

  for (const position of positions) {
    fuel += Math.abs(position - target);
  }

  return fuel;
};

const getCandidatePoint = (positions: Array<number>) => {
  let total = 0;

  for (const position of positions) {
    total += position;
  }

  return Math.floor(total / positions.length);
};

const main: DayFunction = async (inputPath) => {
  const positions = await loadInput(inputPath, inputParser);
  const fuelConsumption = getOptimalFuelConsumption(positions);

  return fuelConsumption;
};

export default main;
