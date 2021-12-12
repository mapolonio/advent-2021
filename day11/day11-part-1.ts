import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Position {
  row: number;
  col: number;
}

const inputParser = (inputString: string): number[][] => {
  return inputString
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n)));
};

const countTotalFlashes = (
  octopuses: number[][],
  iterations: number
): number => {
  let total = 0;

  for (let i = 0; i < iterations; i += 1) {
    total += simulateStep(octopuses);
  }

  return total;
};

const simulateStep = (octopuses: number[][]): number => {
  updateEnergy(octopuses);

  const flashes = simulateFlashes(octopuses);

  updateEnergy(octopuses, { depleteFlashed: true });

  return flashes;
};

const updateEnergy = (
  octopuses: number[][],
  { depleteFlashed = false } = {}
) => {
  for (let rowNumber = 0; rowNumber < octopuses.length; rowNumber += 1) {
    for (
      let colNumber = 0;
      colNumber < octopuses[rowNumber].length;
      colNumber += 1
    ) {
      if (depleteFlashed) {
        if (octopuses[rowNumber][colNumber] >= 10) {
          octopuses[rowNumber][colNumber] = 0;
        }
      } else {
        octopuses[rowNumber][colNumber] += 1;
      }
    }
  }
};

const simulateFlashes = (octopuses: number[][]): number => {
  const queue: Position[] = [];
  let flashes = 0;

  for (let rowNumber = 0; rowNumber < octopuses.length; rowNumber += 1) {
    for (
      let colNumber = 0;
      colNumber < octopuses[rowNumber].length;
      colNumber += 1
    ) {
      if (octopuses[rowNumber][colNumber] === 10) {
        queue.push({ row: rowNumber, col: colNumber });
      }
    }
  }

  while (queue.length) {
    const { row, col } = queue.pop() as Position;
    octopuses[row][col] += 1;
    flashes += 1;

    const neighbourPositions = getNeighbourPositions(octopuses, row, col);

    for (const neighbour of neighbourPositions) {
      octopuses[neighbour.row][neighbour.col] += 1;

      if (octopuses[neighbour.row][neighbour.col] === 10) {
        queue.push(neighbour);
      }
    }
  }

  return flashes;
};

const getNeighbourPositions = (
  octopuses: number[][],
  row: number,
  col: number
): Position[] => {
  return [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col },
    { row: row - 1, col: col + 1 },
    { row, col: col - 1 },
    { row, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col },
    { row: row + 1, col: col + 1 }
  ].filter((neighbour) => {
    return (
      neighbour.row >= 0 &&
      neighbour.row < octopuses.length &&
      neighbour.col >= 0 &&
      neighbour.col < octopuses[0].length
    );
  });
};

const main: DayFunction = async (inputPath) => {
  const octopuses = await loadInput(inputPath, inputParser);
  const flashCount = countTotalFlashes(octopuses, 100);

  return flashCount;
};

export default main;
