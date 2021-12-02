import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const inputParser = (inputString: string) => {
  return inputString.split('\n').map((line) => parseInt(line, 10));
};

const countIncreasingWindows = (depths: Array<number>): number => {
  let window = 0;
  let total = 0;

  for (let i = 0; i < depths.length; i += 1) {
    const prevWindow = window;
    window += depths[i];

    if (i > 2) {
      window -= depths[i - 3];

      if (prevWindow < window) {
        total += 1;
      }
    }
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const depths = await loadInput(inputPath, inputParser);
  const increasingDepths = countIncreasingWindows(depths);

  return increasingDepths;
};

export default main;
