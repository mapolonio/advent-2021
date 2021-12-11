import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type ChunkChar = '(' | '[' | '{' | '<' | ')' | ']' | '}' | '>';

const CHUNK_MAP = new Map<ChunkChar, ChunkChar>([
  [')', '('],
  [']', '['],
  ['}', '{'],
  ['>', '<'],
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>']
]);

const CHARACTER_SCORE = new Map<ChunkChar, number>([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4]
]);

const inputParser = (inputString: string): string[] => {
  return inputString.split('\n');
};

const getMissingCharactersPerLine = (lines: string[]): ChunkChar[][] => {
  const result: ChunkChar[][] = [];

  for (const line of lines) {
    const missingCharacters = findMissingCharacters(line);

    if (missingCharacters === null) {
      continue;
    }

    result.push(missingCharacters);
  }

  return result;
};

const findMissingCharacters = (line: string): ChunkChar[] | null => {
  const stack: string[] = [];
  const result: ChunkChar[] = [];

  for (const char of line) {
    if (['(', '[', '{', '<'].includes(char)) {
      stack.push(char);
    } else {
      if (CHUNK_MAP.get(char as ChunkChar) !== stack.pop()) {
        return null;
      }
    }
  }

  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const char = stack[i];

    result.push(CHUNK_MAP.get(char as ChunkChar) as ChunkChar);
  }

  return result;
};

const getScore = (missingCharacters: ChunkChar[]): number => {
  let total = 0;

  for (const char of missingCharacters) {
    total *= 5;
    total += CHARACTER_SCORE.get(char as ChunkChar) || 0;
  }

  return total;
};

const getMiddleScore = (scores: number[]): number => {
  return [...scores].sort((a, b) => a - b)[Math.floor(scores.length / 2)];
};

const main: DayFunction = async (inputPath) => {
  const lines = await loadInput(inputPath, inputParser);
  const missingCharactersPerLine = getMissingCharactersPerLine(lines);
  const scores = missingCharactersPerLine.map((missingCharacters) =>
    getScore(missingCharacters)
  );

  return getMiddleScore(scores);
};

export default main;
