import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Cuboid {
  isOn: boolean;
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  zStart: number;
  zEnd: number;
}

interface Segment {
  start: number;
  end: number;
}

const inputParser = (inputString: string): Cuboid[] => {
  return inputString.split('\n').map(parseCuboid);
};

export const parseCuboid = (stepString: string): Cuboid => {
  const [status, xStart, xEnd, yStart, yEnd, zStart, zEnd] =
    stepString.split(/ x=|\.{2}|,y=|,z=/);

  return {
    isOn: status === 'on',
    xStart: parseInt(xStart, 10),
    xEnd: parseInt(xEnd, 10),
    yStart: parseInt(yStart, 10),
    yEnd: parseInt(yEnd, 10),
    zStart: parseInt(zStart, 10),
    zEnd: parseInt(zEnd, 10)
  };
};

export const processCuboids = (
  cuboids: Cuboid[],
  skipOffCuboids = true
): number => {
  let total = 0;

  for (let i = 0; i < cuboids.length; i++) {
    const cuboidA = cuboids[i];
    const intersections: Cuboid[] = [];

    if (!cuboidA.isOn && skipOffCuboids) {
      continue;
    }

    for (let j = i + 1; j < cuboids.length; j++) {
      const cuboidB = cuboids[j];

      const intersection = getIntersection(cuboidA, cuboidB);

      if (intersection !== null) {
        intersections.push(intersection);
      }
    }

    total += getCuboidSize(cuboidA) - processCuboids(intersections, false);
  }

  return total;
};

const getIntersection = (cuboidA: Cuboid, cuboidB: Cuboid): Cuboid | null => {
  const xIntersection = getAxisIntersection(
    cuboidA.xStart,
    cuboidA.xEnd,
    cuboidB.xStart,
    cuboidB.xEnd
  );

  if (xIntersection === null) {
    return null;
  }

  const yIntersection = getAxisIntersection(
    cuboidA.yStart,
    cuboidA.yEnd,
    cuboidB.yStart,
    cuboidB.yEnd
  );

  if (yIntersection === null) {
    return null;
  }

  const zIntersection = getAxisIntersection(
    cuboidA.zStart,
    cuboidA.zEnd,
    cuboidB.zStart,
    cuboidB.zEnd
  );

  if (zIntersection === null) {
    return null;
  }

  return {
    isOn: cuboidB.isOn,
    xStart: xIntersection.start,
    xEnd: xIntersection.end,
    yStart: yIntersection.start,
    yEnd: yIntersection.end,
    zStart: zIntersection.start,
    zEnd: zIntersection.end
  };
};

const getAxisIntersection = (
  startA: number,
  endA: number,
  startB: number,
  endB: number
): Segment | null => {
  if (startA > endB || startB > endA) {
    return null;
  }

  return {
    start: startA > startB ? startA : startB,
    end: endA < endB ? endA : endB
  };
};

const getCuboidSize = (cuboid: Cuboid): number => {
  const { xStart, xEnd, yStart, yEnd, zStart, zEnd } = cuboid;

  return (
    (Math.abs(xEnd - xStart) + 1) *
    (Math.abs(yEnd - yStart) + 1) *
    (Math.abs(zEnd - zStart) + 1)
  );
};

const main: DayFunction = async (inputPath) => {
  const cuboids = await loadInput(inputPath, inputParser);
  const activeCubes = processCuboids(cuboids);

  return activeCubes;
};

export default main;
