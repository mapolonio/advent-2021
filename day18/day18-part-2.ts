import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

export type SnailfishNumber = number | [SnailfishNumber, SnailfishNumber];

export const inputParser = (inputString: string): SnailfishNumber[] => {
  return inputString.split('\n').map(parseNumber);
};

const parseNumber = (inputLine: string): SnailfishNumber => {
  return JSON.parse(inputLine);
};

const sum = (
  numberA: SnailfishNumber,
  numberB: SnailfishNumber
): SnailfishNumber => {
  return [numberA, numberB];
};

const reduceNumber = (number: SnailfishNumber): SnailfishNumber => {
  const pathToNestedPair = getNestedPairPath(number);

  if (pathToNestedPair !== '') {
    return reduceNumber(explode(number, pathToNestedPair));
  }

  const pathForSplitting = getPathForSplitting(number);

  if (pathForSplitting !== '') {
    return reduceNumber(split(number, pathForSplitting));
  }

  return number;
};

export const getNestedPairPath = (
  number: SnailfishNumber,
  currentLevel = 1,
  currentPath = ''
): string => {
  if (typeof number === 'number') {
    return '';
  }

  if (currentLevel === 5) {
    return currentPath;
  }

  return (
    getNestedPairPath(number[0], currentLevel + 1, currentPath + '0') ||
    getNestedPairPath(number[1], currentLevel + 1, currentPath + '1')
  );
};

export const getPathForSplitting = (
  number: SnailfishNumber,
  currentPath = ''
): string => {
  if (typeof number === 'number') {
    return number >= 10 ? currentPath : '';
  }

  return (
    getPathForSplitting(number[0], currentPath + '0') ||
    getPathForSplitting(number[1], currentPath + '1')
  );
};

export const explode = (
  number: SnailfishNumber,
  targetPath: string
): SnailfishNumber => {
  const result = clone(number);
  const numberPaths = getPreOrderPaths(result);
  const value = getValue(result, targetPath);

  if (typeof value === 'number') {
    return result;
  }

  const leftPath = targetPath + '0';
  const rightPath = targetPath + '1';
  let leftTarget = -1;
  let rightTarget = -1;

  for (let i = 0; i < numberPaths.length; i += 1) {
    const currentPath = numberPaths[i];

    if (currentPath === leftPath) {
      leftTarget = i - 1;
    }

    if (currentPath === rightPath) {
      rightTarget = i + 1;
      break;
    }
  }

  if (numberPaths[leftTarget]) {
    const currentLeft = getValue(result, numberPaths[leftTarget]) as number;
    setValue(
      result,
      numberPaths[leftTarget],
      currentLeft + (value[0] as number)
    );
  }

  if (numberPaths[rightTarget]) {
    const currentRight = getValue(result, numberPaths[rightTarget]) as number;
    setValue(
      result,
      numberPaths[rightTarget],
      currentRight + (value[1] as number)
    );
  }

  setValue(result, targetPath, 0);

  return result;
};

export const split = (
  number: SnailfishNumber,
  targetPath: string
): SnailfishNumber => {
  const result = clone(number);
  const value = getValue(result, targetPath);

  if (typeof value != 'number') {
    throw new Error('Value is not a number, cannot be split');
  }

  setValue(result, targetPath, [Math.floor(value / 2), Math.ceil(value / 2)]);

  return result;
};

const getValue = (number: SnailfishNumber, path: string): SnailfishNumber => {
  let current = number;

  for (const index of path) {
    if (typeof current != 'number') {
      current = index === '0' ? current[0] : current[1];
    }
  }

  return current;
};

const setValue = (
  number: SnailfishNumber,
  path: string,
  value: SnailfishNumber
): void => {
  let current = number;

  for (let i = 0; i < path.length; i += 1) {
    const index = path.charAt(i);

    if (typeof current != 'number') {
      if (i === path.length - 1) {
        current[parseInt(index, 10)] = value;
      } else {
        current = current[parseInt(index, 10)];
      }
    }
  }
};

const getPreOrderPaths = (
  number: SnailfishNumber,
  currentPath = '',
  result: string[] = []
): string[] => {
  if (typeof number === 'number') {
    result.push(currentPath);
    return result;
  }

  getPreOrderPaths(number[0], currentPath + '0', result);
  getPreOrderPaths(number[1], currentPath + '1', result);

  return result;
};

export const sumList = (numbers: SnailfishNumber[]): SnailfishNumber => {
  let [current] = numbers;

  for (let i = 1; i < numbers.length; i += 1) {
    current = sum(current, numbers[i]);
    current = reduceNumber(current);
  }

  return current;
};

const getMagnitude = (number: SnailfishNumber): number => {
  if (typeof number === 'number') {
    return number;
  }

  return 3 * getMagnitude(number[0]) + 2 * getMagnitude(number[1]);
};

const clone = (number: SnailfishNumber): SnailfishNumber => {
  return JSON.parse(JSON.stringify(number));
};

const getMaxMagnitude = (numbers: SnailfishNumber[]): number => {
  let maxMagnitude = 0;

  for (let i = 0; i < numbers.length - 1; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      const magnitudeA = getMagnitude(
        reduceNumber(sum(numbers[i], numbers[j]))
      );

      if (magnitudeA > maxMagnitude) {
        maxMagnitude = magnitudeA;
      }

      const magnitudeB = getMagnitude(
        reduceNumber(sum(numbers[j], numbers[i]))
      );

      if (magnitudeB > maxMagnitude) {
        maxMagnitude = magnitudeB;
      }
    }
  }

  return maxMagnitude;
};

const main: DayFunction = async (inputPath) => {
  const numbers = await loadInput(inputPath, inputParser);
  const maxMagnitude = getMaxMagnitude(numbers);

  return maxMagnitude;
};

export default main;
