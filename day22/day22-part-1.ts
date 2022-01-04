import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Step {
  action: string;
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  zStart: number;
  zEnd: number;
}

type CubeMap = Map<string, boolean>;

const inputParser = (inputString: string): Step[] => {
  return inputString.split('\n').map(parseStep);
};

const parseStep = (stepString: string): Step => {
  const [action, xStart, xEnd, yStart, yEnd, zStart, zEnd] =
    stepString.split(/ x=|\.{2}|,y=|,z=/);

  return {
    action,
    xStart: parseInt(xStart, 10),
    xEnd: parseInt(xEnd, 10),
    yStart: parseInt(yStart, 10),
    yEnd: parseInt(yEnd, 10),
    zStart: parseInt(zStart, 10),
    zEnd: parseInt(zEnd, 10)
  };
};

const applySteps = (steps: Step[]): CubeMap => {
  const cubeMap = new Map<string, boolean>();

  for (const step of steps) {
    for (let x = step.xStart; x <= step.xEnd; x++) {
      if (x < -50 || x > 50) {
        continue;
      }

      for (let y = step.yStart; y <= step.yEnd; y++) {
        if (y < -50 || y > 50) {
          continue;
        }

        for (let z = step.zStart; z <= step.zEnd; z++) {
          if (z < -50 || z > 50) {
            continue;
          }

          cubeMap.set(`${x},${y},${z}`, step.action === 'on');
        }
      }
    }
  }

  return cubeMap;
};

const countActiveCubes = (cubeMap: CubeMap): number => {
  let total = 0;

  for (const [, value] of cubeMap) {
    if (value) {
      total++;
    }
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const steps = await loadInput(inputPath, inputParser);
  const cubeMap = applySteps(steps);

  return countActiveCubes(cubeMap);
};

export default main;
