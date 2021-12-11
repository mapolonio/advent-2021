import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Point {
  row: number;
  col: number;
}

const inputParser = (inputString: string): number[][] => {
  return inputString
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n, 10)));
};
const getBasinSizes = (heights: number[][]): number[] => {
  const basinSizes: number[] = [];

  for (let row = 0; row < heights.length; row += 1) {
    for (let col = 0; col < heights[row].length; col += 1) {
      if (isLocalLowest(heights, row, col)) {
        basinSizes.push(getBasinSize(heights, row, col));
      }
    }
  }

  return basinSizes;
};

const isLocalLowest = (heights: number[][], row: number, col: number) => {
  const value = heights[row][col];

  if (heights[row - 1]?.[col] <= value) {
    return false;
  }

  if (heights[row + 1]?.[col] <= value) {
    return false;
  }

  if (heights[row][col - 1] <= value) {
    return false;
  }

  if (heights[row][col + 1] <= value) {
    return false;
  }

  return true;
};

const getBasinSize = (
  heights: number[][],
  row: number,
  col: number
): number => {
  const queue: Point[] = [{ row, col }];
  const queued = new Set<string>([`${row},${col}`]);
  let size = 0;

  while (queue.length) {
    const currentPoint = queue.shift();

    if (!currentPoint) {
      break;
    }

    const height = heights[currentPoint.row][currentPoint.col];

    if (height === 9) {
      continue;
    }

    size += 1;

    const neighbours = [
      { row: currentPoint.row - 1, col: currentPoint.col },
      { row: currentPoint.row + 1, col: currentPoint.col },
      { row: currentPoint.row, col: currentPoint.col - 1 },
      { row: currentPoint.row, col: currentPoint.col + 1 }
    ];

    for (const point of neighbours) {
      if (
        heights[point.row] === undefined ||
        heights[point.row][point.col] === undefined ||
        queued.has(`${point.row},${point.col}`)
      ) {
        continue;
      }

      queue.push(point);
      queued.add(`${point.row},${point.col}`);
    }
  }

  return size;
};

const multiplyMaxSizes = (sizes: number[], quantity: number): number => {
  let result = 1;
  const sortedSizes = [...sizes].sort((a, b) => a - b);

  for (const size of sortedSizes.slice(sizes.length - quantity)) {
    result *= size;
  }

  return result;
};

const main: DayFunction = async (inputPath) => {
  const caveHeights = await loadInput(inputPath, inputParser);
  const basinSizes = getBasinSizes(caveHeights);

  return multiplyMaxSizes(basinSizes, 3);
};

export default main;
