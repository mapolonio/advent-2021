import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type CaveMap = number[][];

class ExtendedMap {
  caveMap: CaveMap;
  rowLength: number;
  colLength: number;
  private realRowLength: number;
  private realColLength: number;

  constructor(caveMap: CaveMap, multiplier: number) {
    this.caveMap = caveMap;
    this.realRowLength = caveMap.length;
    this.realColLength = caveMap[0].length;
    this.rowLength = this.realRowLength * multiplier;
    this.colLength = this.realColLength * multiplier;
  }

  getRisk(row: number, col: number) {
    const rowSection = Math.floor(row / this.realRowLength);
    const colSection = Math.floor(col / this.realColLength);
    const originalRow = row % this.realRowLength;
    const originalCol = col % this.realColLength;
    const baseValue = this.caveMap[originalRow][originalCol];
    const extendedValue = baseValue + rowSection + colSection;

    return extendedValue > 9 ? extendedValue - 9 : extendedValue;
  }
}

const inputParser = (inputString: string): CaveMap => {
  return inputString
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n, 10)));
};

const findMinimumRiskPath = (caveMap: ExtendedMap): number => {
  const prevMapping = new Map<string, string>();
  const riskMapping = new Map<string, number>([['0,0', 0]]);
  const remaining: string[] = ['0,0'];
  const visited = new Set<string>(['0,0']);

  while (remaining.length) {
    const current = remaining.sort(sortByRisk(riskMapping)).shift() ?? '';
    const riskSoFar = riskMapping.get(current) ?? Infinity;
    const neighbours = getNeighbours(current, visited, caveMap);

    for (const neighbour of neighbours) {
      const [row, col] = neighbour.split(',').map((n) => parseInt(n, 10));
      const risk = riskMapping.get(neighbour) ?? Infinity;
      const riskFromHere = riskSoFar + caveMap.getRisk(row, col);
      remaining.push(neighbour);
      visited.add(neighbour);

      if (riskFromHere < risk) {
        riskMapping.set(neighbour, riskFromHere);
        prevMapping.set(neighbour, current);
      }
    }
  }

  return (
    riskMapping.get(`${caveMap.rowLength - 1},${caveMap.colLength - 1}`) ??
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
  caveMap: ExtendedMap
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
      position.row < caveMap.rowLength &&
      position.col < caveMap.colLength &&
      !visited.has(`${position.row},${position.col}`)
    ) {
      result.push(`${position.row},${position.col}`);
    }
  }

  return result;
};

const main: DayFunction = async (inputPath) => {
  const caveMap = await loadInput(inputPath, inputParser);
  const extendedMap = new ExtendedMap(caveMap, 5);
  const bestPathRisk = findMinimumRiskPath(extendedMap);

  return bestPathRisk;
};

export default main;
