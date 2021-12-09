import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface InputLine {
  patterns: PatternSet[];
  output: string[];
}

type PatternSet = Set<string>;

const inputParser = (inputString: string): InputLine[] => {
  return inputString.split('\n').map((line) => parseInputLine(line));
};

const parseInputLine = (inputLine: string): InputLine => {
  const [patternsString, outputDigitsString] = inputLine.split(' | ');
  const patternSets: PatternSet[] = [];

  for (const pattern of patternsString.split(' ')) {
    patternSets.push(new Set([...pattern]));
  }

  return {
    patterns: patternSets,
    output: outputDigitsString.split(' ')
  };
};

const getNumbers = (inputLines: InputLine[]): number[] => {
  const result: number[] = [];

  for (const inputLine of inputLines) {
    result.push(decodeInput(inputLine));
  }

  return result;
};

const decodeInput = (inputLine: InputLine): number => {
  const { patterns, output } = inputLine;
  const segmentMapping = getSegmentMapping(patterns);

  return decodeOutput(segmentMapping, output);
};

const getSegmentMapping = (patterns: PatternSet[]): PatternSet[] => {
  const digitOne = patterns.find((pattern) => pattern.size === 2);
  const digitFour = patterns.find((pattern) => pattern.size === 4);
  const digitSeven = patterns.find((pattern) => pattern.size === 3);
  const digitEight = patterns.find((pattern) => pattern.size === 7);
  const digitNine = patterns.find(
    (pattern) => pattern.size === 6 && isSubset(pattern, digitFour)
  );
  const digitThree = patterns.find(
    (pattern) => pattern.size === 5 && isSubset(pattern, digitSeven)
  );
  const digitZero = patterns.find(
    (pattern) =>
      pattern.size === 6 &&
      pattern !== digitNine &&
      isSubset(pattern, digitSeven)
  );
  const digitSix = patterns.find(
    (pattern) =>
      pattern.size === 6 && pattern !== digitNine && pattern !== digitZero
  );
  const digitTwo = patterns.find(
    (pattern) =>
      pattern.size === 5 && getIntersection(pattern, digitFour).size === 2
  );
  const digitFive = patterns.find(
    (pattern) =>
      pattern.size === 5 && pattern !== digitTwo && pattern !== digitThree
  );

  return [
    digitZero as PatternSet,
    digitOne as PatternSet,
    digitTwo as PatternSet,
    digitThree as PatternSet,
    digitFour as PatternSet,
    digitFive as PatternSet,
    digitSix as PatternSet,
    digitSeven as PatternSet,
    digitEight as PatternSet,
    digitNine as PatternSet
  ];
};

const isSubset = (setA: Set<string>, setB: Set<string> | undefined) => {
  if (setB === undefined) {
    return false;
  }

  for (const item of setB) {
    if (!setA.has(item)) {
      return false;
    }
  }

  return true;
};

const getIntersection = (
  setA: Set<string>,
  setB: Set<string> | undefined
): Set<string> => {
  const intersection = new Set<string>();

  if (setB === undefined) {
    return intersection;
  }

  const smallerSet = setA.size > setB.size ? setB : setA;
  const otherSet = setA === smallerSet ? setB : setA;

  for (const item of smallerSet) {
    if (otherSet.has(item)) {
      intersection.add(item);
    }
  }

  return intersection;
};

const decodeOutput = (segmentMapping: PatternSet[], output: string[]) => {
  let result = '';

  for (const outputDigit of output) {
    const outputSet = new Set<string>([...outputDigit]);

    for (let digit = 0; digit <= 9; digit += 1) {
      const currentSet = segmentMapping[digit];

      if (hasSameSegments(currentSet, outputSet)) {
        result += digit;
        break;
      }
    }
  }

  return parseInt(result, 10);
};

const hasSameSegments = (setA: Set<string>, setB: Set<string>): boolean => {
  return (
    setA.size === setB.size && getIntersection(setA, setB).size === setA.size
  );
};

const sumValues = (values: number[]): number => {
  let total = 0;

  for (const value of values) {
    total += value;
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const parsedLines = await loadInput(inputPath, inputParser);
  const values = getNumbers(parsedLines);
  const totalSum = sumValues(values);

  return totalSum;
};

export default main;
