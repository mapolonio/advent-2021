import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type Program = Instruction[];
type Operation = 'inp' | 'add' | 'mul' | 'div' | 'mod' | 'eql';
type Variable = 'w' | 'x' | 'y' | 'z';

interface Instruction {
  operation: Operation;
  lhs: Variable;
  rhs: Variable | number;
}

interface ProgramData {
  divValue: number;
  addValueOne: number;
  addValueTwo: number;
}

const inputParser = (inputString: string): Program => {
  return inputString.split('\n').map(parseInstruction);
};

export const parseInstruction = (instruction: string): Instruction => {
  const [operation, lhs, rhs] = instruction.split(' ');
  let value: Variable | number = 0;

  if (rhs) {
    if ('wxyz'.includes(rhs)) {
      value = rhs as Variable;
    } else {
      value = parseInt(rhs, 10);
    }
  }

  return {
    operation: operation as Operation,
    lhs: lhs as Variable,
    rhs: value
  };
};

const findLargestModelNumber = (
  programData: ProgramData[],
  targetZ = 0,
  digits = '',
  index = 13
): string | null => {
  if (index < 0) {
    return targetZ === 0 ? digits : null;
  }

  const currentProgramData = programData[index];
  const { divValue, addValueOne, addValueTwo } = currentProgramData;

  for (let n = 1; n <= 9; n++) {
    const possiblePrevZs = findPossiblePrevZ(
      targetZ,
      n,
      divValue,
      addValueOne,
      addValueTwo
    );

    for (const candidate of possiblePrevZs) {
      const result = findLargestModelNumber(
        programData,
        candidate,
        n + digits,
        index - 1
      );

      if (result !== null) {
        return result;
      }
    }
  }

  return null;
};

const getProgramData = (program: Program): ProgramData => {
  return {
    divValue: program[4].rhs as number,
    addValueOne: program[5].rhs as number,
    addValueTwo: program[15].rhs as number
  };
};

const getSubprograms = (program: Program): Program[] => {
  const subprograms: Program[] = [];
  const chunkSize = program.length / 14;

  for (let chunkNumber = 0; chunkNumber < 14; chunkNumber++) {
    const start = chunkNumber * chunkSize;
    const end = start + chunkSize;
    const subprogram = program.slice(start, end);

    subprograms.push(subprogram);
  }

  return subprograms;
};

const findPossiblePrevZ = (
  targetZ: number,
  input: number,
  divValue: number,
  addValueOne: number,
  addValueTwo: number
) => {
  const possibilities = [];

  if (divValue === 26) {
    const start = targetZ - input - addValueTwo;

    possibilities.push(targetZ * 26 + input - addValueOne);

    for (let prevZ = start; prevZ <= start + 25; prevZ++) {
      if (
        prevZ % 26 !== input - addValueOne &&
        Math.floor(prevZ / 26) === start / 26
      ) {
        possibilities.push(prevZ);
      }
    }
  } else {
    if ((targetZ % 26) + addValueOne === input) {
      possibilities.push(targetZ);
    } else {
      const candidate = (targetZ - input - addValueTwo) / 26;

      if (candidate === Math.floor(candidate)) {
        possibilities.push(candidate);
      }
    }
  }

  return possibilities;
};

const main: DayFunction = async (inputPath) => {
  const program = await loadInput(inputPath, inputParser);
  const subprograms = getSubprograms(program);
  const programData = subprograms.map(getProgramData);

  return findLargestModelNumber(programData);
};

export default main;
