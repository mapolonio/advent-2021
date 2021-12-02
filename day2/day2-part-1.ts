import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Instruction {
  movement: string;
  amount: number;
}

interface Position {
  horizontal: number;
  depth: number;
}

const inputParser = (inputString: string) => {
  return inputString.split('\n').map((line) => parseInstruction(line));
};

const parseInstruction = (inputLine: string): Instruction => {
  const [instruction, amountString] = inputLine.split(' ');

  return { movement: instruction, amount: parseInt(amountString, 10) };
};

const moveSubmarine = (instructions: Array<Instruction>): Position => {
  let horizontal = 0;
  let depth = 0;

  for (const instruction of instructions) {
    const { movement, amount } = instruction;

    switch (movement) {
      case 'forward':
        horizontal += amount;
        break;
      case 'down':
        depth += amount;
        break;
      case 'up':
        depth -= amount;
    }
  }

  return { horizontal, depth };
};

const main: DayFunction = async (inputPath) => {
  const instructions = await loadInput(inputPath, inputParser);
  const { horizontal, depth } = moveSubmarine(instructions);

  return horizontal * depth;
};

export default main;
