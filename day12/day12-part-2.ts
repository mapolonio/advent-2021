import path from 'path/posix';
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
  paths: string[][] = [],
  smallCaveRepeated = false
): string[][] => {
  const lastCave = path[path.length - 1];

  if (lastCave === 'end') {
    paths.push(path);

    return paths;
  }

  const neighbours = getVisitableNeighbours(
    caveMap,
    lastCave,
    path,
    smallCaveRepeated
  );

  if (neighbours.length === 0) {
    return paths;
  }

  for (const neighbour of neighbours) {
    findAllPaths(
      caveMap,
      [...path, neighbour],
      paths,
      smallCaveRepeated ||
        (!caveMap.get(neighbour)?.isBig && path.includes(neighbour))
    );
  }

  return paths;
};

const getVisitableNeighbours = (
  caveMap: CaveMap,
  label: string,
  path: string[],
  smallCaveRepeated: boolean
): string[] => {
  const neighbours = caveMap.get(label)?.connections || [];
  const result: string[] = [];

  for (const neighbour of neighbours) {
    if (caveMap.get(neighbour)?.isBig) {
      result.push(neighbour);
    } else {
      if (path.includes(neighbour)) {
        if (!smallCaveRepeated && !['start', 'end'].includes(neighbour)) {
          result.push(neighbour);
        }
      } else {
        result.push(neighbour);
      }
    }
  }

  return result;
};

const main: DayFunction = async (inputPath) => {
  const caveMap = await loadInput(inputPath, inputParser);
  const paths = findAllPaths(caveMap);

  return paths.length;
};

export default main;
