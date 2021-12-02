import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const inputParser = (inputString: string) => {
  return inputString.split('\n').map((line) => parseInt(line, 10));
};

const countIncreasingDepths = (depths: Array<number>): number => {
  let total = 0;

  for (let i = 1; i < depths.length; i += 1) {
    if (depths[i - 1] < depths[i]) {
      total += 1;
    }
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const depths = await loadInput(inputPath, inputParser);
  const increasingDepths = countIncreasingDepths(depths);

  return increasingDepths;
};

export default main;
