import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const inputParser = (inputString: string): string[][] => {
  return inputString.split('\n').map((line) => parseInputLine(line));
};

const parseInputLine = (inputLine: string): string[] => {
  const [, outputDigitsString] = inputLine.split(' | ');

  return outputDigitsString.split(' ');
};

const countSpecialDigits = (outputs: string[][]): number => {
  let total = 0;

  for (const output of outputs) {
    for (const segments of output) {
      if ([2, 4, 3, 7].includes(segments.length)) {
        total += 1;
      }
    }
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const outputs = await loadInput(inputPath, inputParser);
  const specialDigitsCount = countSpecialDigits(outputs);

  return specialDigitsCount;
};

export default main;
