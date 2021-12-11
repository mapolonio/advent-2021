import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type OpeningChar = '(' | '[' | '{' | '<';
type ClosingChar = ')' | ']' | '}' | '>';

const CHUNK_MAP = new Map<ClosingChar, OpeningChar>([
  [')', '('],
  [']', '['],
  ['}', '{'],
  ['>', '<']
]);

const CHARACTER_SCORE = new Map<ClosingChar, number>([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137]
]);

const inputParser = (inputString: string): string[] => {
  return inputString.split('\n');
};

const findIllegalCharacters = (lines: string[]): ClosingChar[] => {
  const result: ClosingChar[] = [];

  for (const line of lines) {
    const firstIllegalCharacter = findIllegalCharacter(line);

    if (firstIllegalCharacter !== undefined) {
      result.push(firstIllegalCharacter);
    }
  }

  return result;
};

const findIllegalCharacter = (line: string): ClosingChar | undefined => {
  const stack: string[] = [];

  for (const char of line) {
    if (['(', '[', '{', '<'].includes(char)) {
      stack.push(char);
    } else {
      if (CHUNK_MAP.get(char as ClosingChar) !== stack.pop()) {
        return char as ClosingChar;
      }
    }
  }
};

const getScore = (illegalCharacters: ClosingChar[]): number => {
  let total = 0;

  for (const char of illegalCharacters) {
    total += CHARACTER_SCORE.get(char as ClosingChar) || 0;
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const lines = await loadInput(inputPath, inputParser);
  const illegalCharacters = findIllegalCharacters(lines);

  return getScore(illegalCharacters);
};

export default main;
