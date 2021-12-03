import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const inputParser = (inputString: string) => {
  return inputString.split('\n');
};

const getRates = (
  binaryNumbers: Array<string>,
  filterBy: 'most-common' | 'least-common',
  position = 0
): Array<string> => {
  if (binaryNumbers.length === 1) {
    return binaryNumbers;
  }

  const onesCount = countOnes(binaryNumbers, position);
  const middleMark = binaryNumbers.length / 2;
  let targetBit: string;

  if (filterBy === 'most-common') {
    if (onesCount >= middleMark) {
      targetBit = '1';
    } else {
      targetBit = '0';
    }
  } else {
    if (onesCount < middleMark) {
      targetBit = '1';
    } else {
      targetBit = '0';
    }
  }

  return getRates(
    binaryNumbers.filter((binary) => binary.charAt(position) === targetBit),
    filterBy,
    position + 1
  );
};

const countOnes = (binaryNumbers: Array<string>, position: number): number => {
  let total = 0;

  for (const binary of binaryNumbers) {
    total += parseInt(binary.charAt(position), 10);
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const binaryNumbers = await loadInput(inputPath, inputParser);
  const [oxygenRating] = getRates(binaryNumbers, 'most-common');
  const [co2Rating] = getRates(binaryNumbers, 'least-common');

  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
};

export default main;
export { getRates };
