import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface RatesResult {
  gamma: number;
  epsilon: number;
}

interface BinaryRatesResult {
  gammaBinary: string;
  epsilonBinary: string;
}

const inputParser = (inputString: string) => {
  return inputString.split('\n');
};

const getRates = (binaryNumbers: Array<string>): RatesResult => {
  const counts = [...new Array(binaryNumbers[0].length)].map(() => 0);

  for (let i = 0; i < binaryNumbers.length; i += 1) {
    const binary = binaryNumbers[i];

    for (let j = 0; j < binary.length; j += 1) {
      const digit = binary[j];

      counts[j] += parseInt(digit, 10);
    }
  }

  const { gammaBinary, epsilonBinary } = getBinaryRates(
    counts,
    binaryNumbers.length
  );

  return {
    gamma: parseInt(gammaBinary, 2),
    epsilon: parseInt(epsilonBinary, 2)
  };
};

const getBinaryRates = (
  bitCounts: Array<number>,
  totalEntries: number
): BinaryRatesResult => {
  let gammaBinary = '';
  let epsilonBinary = '';

  for (const count of bitCounts) {
    if (count >= totalEntries / 2) {
      gammaBinary += '1';
      epsilonBinary += '0';
    } else {
      gammaBinary += '0';
      epsilonBinary += '1';
    }
  }

  return { gammaBinary, epsilonBinary };
};

const main: DayFunction = async (inputPath) => {
  const binaryNumbers = await loadInput(inputPath, inputParser);
  const { gamma, epsilon } = getRates(binaryNumbers);

  return gamma * epsilon;
};

export default main;
