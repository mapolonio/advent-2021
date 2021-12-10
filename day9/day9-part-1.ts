import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const inputParser = (inputString: string): number[][] => {
  return inputString
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n, 10)));
};
const getRiskLevel = (heights: number[][]): number => {
  const lowestPoints: number[] = [];

  for (let row = 0; row < heights.length; row += 1) {
    for (let col = 0; col < heights[row].length; col += 1) {
      if (isLocalLowest(heights, row, col)) {
        lowestPoints.push(heights[row][col]);
      }
    }
  }

  return sumRisks(lowestPoints);
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

const sumRisks = (lowestPoints: number[]): number => {
  let total = 0;

  for (const height of lowestPoints) {
    total += height + 1;
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const caveHeights = await loadInput(inputPath, inputParser);
  const totalRiskLevel = getRiskLevel(caveHeights);

  return totalRiskLevel;
};

export default main;
