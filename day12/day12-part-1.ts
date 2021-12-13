import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Cave {
  label: string;
  connections: string[];
  isBig: boolean;
}

type CaveMap = Map<string, Cave>;

const inputParser = (inputString: string): CaveMap => {
  const caveMap: CaveMap = new Map<string, Cave>();

  const passageStrings = inputString.split('\n');

  for (const passageString of passageStrings) {
    const [labelA, labelB] = passageString.split('-');

    if (!caveMap.has(labelA)) {
      caveMap.set(labelA, {
        label: labelA,
        connections: [],
        isBig: labelA.toUpperCase() === labelA
      });
    }

    if (!caveMap.has(labelB)) {
      caveMap.set(labelB, {
        label: labelB,
        connections: [],
        isBig: labelB.toUpperCase() === labelB
      });
    }

    caveMap.get(labelA)?.connections.push(labelB);
    caveMap.get(labelB)?.connections.push(labelA);
  }

  return caveMap;
};

const findAllPaths = (
  caveMap: CaveMap,
  path: string[] = ['start'],
  paths: string[][] = []
): string[][] => {
  const lastCave = path[path.length - 1];

  if (lastCave === 'end') {
    paths.push(path);

    return paths;
  }

  const neighbours = (caveMap.get(lastCave)?.connections || []).filter(
    (neighbour) => caveMap.get(neighbour)?.isBig || !path.includes(neighbour)
  );

  if (neighbours.length === 0) {
    return paths;
  }

  for (const neighbour of neighbours) {
    findAllPaths(caveMap, [...path, neighbour], paths);
  }

  return paths;
};

const main: DayFunction = async (inputPath) => {
  const caveMap = await loadInput(inputPath, inputParser);
  const paths = findAllPaths(caveMap);

  return paths.length;
};

export default main;
