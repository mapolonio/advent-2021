import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface ScannerData {
  positions: Position[];
  distances: DistanceCount[];
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface OverlapResult {
  scannerIndex: number;
  sharedBeacons: PositionMap;
}

type DistanceCount = Map<number, number>;
type PositionMap = Map<Position, Position>;
type Translator = (position: Position) => Position;

export const inputParser = (inputString: string): ScannerData[] => {
  return inputString.split('\n\n').map(parseScanner);
};

const parseScanner = (inputLines: string): ScannerData => {
  const [, ...positionLines] = inputLines.split('\n');
  const positions = positionLines.map(parsePosition);

  return {
    positions: positions,
    distances: calculateDistances(positions)
  };
};

const parsePosition = (positionLine: string): Position => {
  const [xString, yString, zString] = positionLine.split(',');

  return {
    x: parseInt(xString, 10),
    y: parseInt(yString, 10),
    z: parseInt(zString, 10)
  };
};

const calculateDistances = (positions: Position[]): DistanceCount[] => {
  const result: DistanceCount[] = positions.map(
    () => new Map<number, number>()
  );

  for (let i = 0; i < positions.length - 1; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const distance = getDistance(positions[i], positions[j]);
      const countA = result[i].get(distance) || 0;
      const countB = result[j].get(distance) || 0;

      result[i].set(distance, countA + 1);
      result[j].set(distance, countB + 1);
    }
  }

  return result;
};

const getDistance = (pointA: Position, pointB: Position): number => {
  const xTerm = Math.pow(pointA.x - pointB.x, 2);
  const yTerm = Math.pow(pointA.y - pointB.y, 2);
  const zTerm = Math.pow(pointA.z - pointB.z, 2);

  return Math.sqrt(xTerm + yTerm + zTerm);
};

const getScannerPositions = (scanners: ScannerData[]): Position[] => {
  const translated = new Set([0]);
  const queue = [scanners[0]];
  const scannerPositions: Position[] = [{ x: 0, y: 0, z: 0 }];

  while (queue.length) {
    const scanner = queue.shift();

    if (scanner === undefined) {
      break;
    }

    const overlappingScanners = findOverlappingScanners(
      scanner,
      scanners,
      translated
    );

    for (const overlap of overlappingScanners) {
      const { scannerIndex, sharedBeacons } = overlap;
      const translator = getTranslator(sharedBeacons);

      scannerPositions.push(translator({ x: 0, y: 0, z: 0 }));
      const overlappingScanner = scanners[scannerIndex];

      overlappingScanner.positions =
        overlappingScanner.positions.map(translator);
      translated.add(scannerIndex);
      queue.push(overlappingScanner);
    }
  }

  return scannerPositions;
};

export const findOverlappingScanners = (
  scanner: ScannerData,
  scanners: ScannerData[],
  translated: Set<number>
): OverlapResult[] => {
  const result: OverlapResult[] = [];

  for (let i = 0; i < scanners.length; i += 1) {
    if (translated.has(i)) {
      continue;
    }

    const sharedBeacons = getSharedBeacons(scanner, scanners[i]);

    if (sharedBeacons.size >= 12) {
      result.push({
        scannerIndex: i,
        sharedBeacons
      });
    }
  }

  return result;
};

const getSharedBeacons = (
  scannerA: ScannerData,
  scannerB: ScannerData
): PositionMap => {
  const sharedBeacons = new Map<Position, Position>();

  for (let i = 0; i < scannerA.positions.length; i += 1) {
    for (let j = 0; j < scannerB.positions.length; j += 1) {
      const sharedDistances = countSharedDistances(
        scannerA.distances[i],
        scannerB.distances[j]
      );

      if (sharedDistances >= 11) {
        sharedBeacons.set(scannerA.positions[i], scannerB.positions[j]);
      }
    }
  }

  return sharedBeacons;
};

const countSharedDistances = (
  distancesA: DistanceCount,
  distancesB: DistanceCount
): number => {
  let total = 0;

  for (const [distA, countA] of distancesA) {
    const countB = distancesB.get(distA) || 0;

    total += Math.min(countA, countB);
  }

  return total;
};

export const getTranslator = (sharedBeacons: PositionMap): Translator => {
  const [[point, translatedPoint]] = sharedBeacons;
  const radiuses = [translatedPoint.x, translatedPoint.y, translatedPoint.z];
  const labels = ['x', 'y', 'z'];
  const variations = [
    [1, 1, 1],
    [1, -1, 1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1]
  ];

  for (let i = 0; i < radiuses.length; i += 1) {
    for (let j = 0; j < radiuses.length; j += 1) {
      if (i === j) {
        continue;
      }

      for (let k = 0; k < radiuses.length; k += 1) {
        if (i === k || j === k) {
          continue;
        }

        for (const variation of variations) {
          const origin = {
            x: point.x + variation[0] * radiuses[i],
            y: point.y + variation[1] * radiuses[j],
            z: point.z + variation[2] * radiuses[k]
          };
          const labelMapping = {
            x: labels[i],
            y: labels[j],
            z: labels[k]
          };

          if (isValidScannerPosition(origin, sharedBeacons)) {
            const xFactor = getDirectionFactor(
              origin.x,
              point.x,
              getAxis(translatedPoint, labelMapping.x)
            );
            const yFactor = getDirectionFactor(
              origin.y,
              point.y,
              getAxis(translatedPoint, labelMapping.y)
            );
            const zFactor = getDirectionFactor(
              origin.z,
              point.z,
              getAxis(translatedPoint, labelMapping.z)
            );

            return (originalPoint: Position) => {
              return {
                x:
                  xFactor *
                  (getAxis(originalPoint, labelMapping.x) + xFactor * origin.x),
                y:
                  yFactor *
                  (getAxis(originalPoint, labelMapping.y) + yFactor * origin.y),
                z:
                  zFactor *
                  (getAxis(originalPoint, labelMapping.z) + zFactor * origin.z)
              };
            };
          }
        }
      }
    }
  }

  throw new Error('No translator found');
};

const getAxis = (position: Position, axis: string): number => {
  switch (axis) {
    case 'x':
      return position.x;
    case 'y':
      return position.y;
    case 'z':
      return position.z;
    default:
      throw new Error('Invalid axis');
  }
};

const getDirectionFactor = (
  originCoord: number,
  coord: number,
  translatedCoor: number
): number => {
  // other origin is to the right
  if (originCoord > 0) {
    // point is to the right of both origins
    if (coord > originCoord) {
      return translatedCoor > 0 ? 1 : -1;
      // point is to the right of base origin but to the left of other origin
    } else if (coord > 0) {
      return translatedCoor > 0 ? -1 : 1;
      // point is to the left of both origins
    } else {
      return translatedCoor > 0 ? -1 : 1;
    }
  }

  // other origin is to the left

  // point is to the left of both origins
  if (coord < originCoord) {
    return translatedCoor < 0 ? 1 : -1;
    // point is to the left of base origin but to the right of other orign
  } else if (coord < 0) {
    return translatedCoor > 0 ? 1 : -1;
    // point is to the right of both origins
  } else {
    return translatedCoor > 0 ? 1 : -1;
  }
};

const isValidScannerPosition = (
  candidatePosition: Position,
  sharedBeacons: PositionMap
): boolean => {
  for (const [pointA, pointB] of sharedBeacons) {
    if (
      getDistance(pointB, { x: 0, y: 0, z: 0 }) !==
      getDistance(pointA, candidatePosition)
    ) {
      return false;
    }
  }

  return true;
};

const getFurthestManhattanDistance = (positions: Position[]): number => {
  let maxDistance = 0;

  for (let i = 0; i < positions.length - 1; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const distance = getManhattanDistance(positions[i], positions[j]);

      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
  }

  return maxDistance;
};

const getManhattanDistance = (pointA: Position, pointB: Position): number => {
  return (
    Math.abs(pointA.x - pointB.x) +
    Math.abs(pointA.y - pointB.y) +
    Math.abs(pointA.z - pointB.z)
  );
};

const main: DayFunction = async (inputPath) => {
  const scannerData = await loadInput(inputPath, inputParser);
  const positions = getScannerPositions(scannerData);

  return getFurthestManhattanDistance(positions);
};

export default main;
