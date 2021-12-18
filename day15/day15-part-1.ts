import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type CaveMap = number[][];

const inputParser = (inputString: string): CaveMap => {
  return inputString
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n, 10)));
};

const findMinimumPathRisk = (caveMap: CaveMap): number => {
  const prevMapping = new Map<string, string>();
  const riskMapping = new Map<string, number>([['0,0', 0]]);
  const remaining: string[] = [];
  const visited = new Set<string>(['0,0']);

  for (let row = 0; row < caveMap.length; row += 1) {
    for (let col = 0; col < caveMap[row].length; col += 1) {
      remaining.push(`${row},${col}`);
    }
  }

  while (remaining.length) {
    const current = remaining.sort(sortByRisk(riskMapping)).shift() ?? '';
    const riskSoFar = riskMapping.get(current) ?? Infinity;
    visited.add(current);
    const neighbours = getNeighbours(current, visited, caveMap);

    for (const neighbour of neighbours) {
      const [row, col] = neighbour.split(',').map((n) => parseInt(n, 10));
      const risk = riskMapping.get(neighbour) ?? Infinity;
      const riskFromHere = riskSoFar + caveMap[row][col];

      if (riskFromHere < risk) {
        riskMapping.set(neighbour, riskFromHere);
        prevMapping.set(neighbour, current);
      }
    }
  }

  return (
    riskMapping.get(`${caveMap.length - 1},${caveMap[0].length - 1}`) ??
    Infinity
  );
};

const sortByRisk =
  (riskMapping: Map<string, number>) =>
  (pointA: string, pointB: string): number => {
    const riskA = riskMapping.get(pointA) ?? Infinity;
    const riskB = riskMapping.get(pointB) ?? Infinity;

    return riskA - riskB;
  };

const getNeighbours = (
  point: string,
  visited: Set<string>,
  caveMap: CaveMap
): string[] => {
  const [row, col] = point.split(',').map((n) => parseInt(n, 10));
  const positions = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 }
  ];
  const result: string[] = [];

  for (const position of positions) {
    if (
      position.row >= 0 &&
      position.col >= 0 &&
      position.row < caveMap.length &&
      position.col < caveMap[0].length &&
      !visited.has(`${position.row},${position.col}`)
    ) {
      result.push(`${position.row},${position.col}`);
    }
  }

  return result;
};

const main: DayFunction = async (inputPath) => {
  const caveMap = await loadInput(inputPath, inputParser);
  const bestPathRisk = findMinimumPathRisk(caveMap);

  return bestPathRisk;
};

export default main;
