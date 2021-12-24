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
    explode(number, pathToNestedPair);

    return reduceNumber(number);
  }

  const pathForSplitting = getPathForSplitting(number);

  if (pathForSplitting !== '') {
    split(number, pathForSplitting);

    return reduceNumber(number);
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

export const explode = (number: SnailfishNumber, targetPath: string): void => {
  const numberPaths = getPreOrderPaths(number);
  const value = getValue(number, targetPath);

  if (typeof value === 'number') {
    return;
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
    const currentLeft = getValue(number, numberPaths[leftTarget]) as number;
    setValue(
      number,
      numberPaths[leftTarget],
      currentLeft + (value[0] as number)
    );
  }

  if (numberPaths[rightTarget]) {
    const currentRight = getValue(number, numberPaths[rightTarget]) as number;
    setValue(
      number,
      numberPaths[rightTarget],
      currentRight + (value[1] as number)
    );
  }

  setValue(number, targetPath, 0);
};

export const split = (number: SnailfishNumber, targetPath: string): void => {
  const value = getValue(number, targetPath);

  if (typeof value != 'number') {
    throw new Error('Value is not a number, cannot be split');
  }

  setValue(number, targetPath, [Math.floor(value / 2), Math.ceil(value / 2)]);
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

const main: DayFunction = async (inputPath) => {
  const numbers = await loadInput(inputPath, inputParser);
  const result = sumList(numbers);

  return getMagnitude(result);
};

export default main;
