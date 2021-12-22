import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface TargetArea {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const inputParser = (inputString: string): TargetArea => {
  return parseTargetArea(inputString);
};

const parseTargetArea = (inputLine: string): TargetArea => {
  const [, minX, maxX, minY, maxY] = inputLine.split(
    /target area: x=|\.{2}|, y=/
  );

  return {
    minX: parseInt(minX, 10),
    maxX: parseInt(maxX, 10),
    minY: parseInt(minY, 10),
    maxY: parseInt(maxY, 10)
  };
};

export const countValidInitialSpeeds = (targetArea: TargetArea): number => {
  const { maxX, minX, minY } = targetArea;
  const minXSpeed = minInitialXSpeed(minX);
  // If initial speed is greated than maxX, then at first step we will have passed the area
  const maxXSpeed = maxX;
  // After going up, the probe will reach speed = 0 and then will start falling
  // when it reached height = 0 the ySpeed will be equal to the initial ySpeed but in the other direction.
  // Same as maxXSpeed, if speed at height = 0 is greater than the abs value of minY, we will pass the target zone
  // in the next step
  const maxYSpeed = Math.abs(minY);
  const minYSpeed = minY;
  let validPairs = 0;

  for (let xSpeed = minXSpeed; xSpeed <= maxXSpeed; xSpeed += 1) {
    for (let ySpeed = minYSpeed; ySpeed <= maxYSpeed; ySpeed += 1) {
      if (hitsArea(xSpeed, ySpeed, targetArea)) {
        validPairs += 1;
      }
    }
  }

  return validPairs;
};

const minInitialXSpeed = (target: number): number => {
  // As acceleration is -1, each step the object advanced distance is
  // initSpeed + (initSpeed - 1) + (initSpeed - 2) + ... + 0
  // So we can use formula for sum from 1 to N [ totalDist = (N(N + 1)) / 2 ] and clear for target value
  // 0 = n^2 + n - 2(target)

  return Math.ceil(solveQuadratic(1, 1, -2 * target)[0]);
};

/**
 * Solve quadratic formula by using x = (-b +- √(b^2-4ac))/2a
 */
const solveQuadratic = (a: number, b: number, c: number): number[] => {
  const rootTerm = Math.sqrt(Math.pow(b, 2) - 4 * a * c);

  return [(-b + rootTerm) / (2 * a), (-b - rootTerm) / (2 * a)];
};

const hitsArea = (
  xSpeed: number,
  ySpeed: number,
  targetArea: TargetArea
): boolean => {
  const { minX, maxX, minY, maxY } = targetArea;
  let xPos = 0;
  let yPos = 0;
  let currentXspeed = xSpeed;
  let currentYspeed = ySpeed;

  for (let t = 1; ; t += 1) {
    xPos += currentXspeed;
    yPos += currentYspeed;
    currentXspeed -= 1;
    currentYspeed -= 1;

    if (xPos >= minX && xPos <= maxX && yPos <= maxY && yPos >= minY) {
      return true;
    }

    if (xPos > maxX || yPos < minY) {
      break;
    }

    if (currentXspeed < 0) {
      currentXspeed = 0;
    }
  }

  return false;
};

const main: DayFunction = async (inputPath) => {
  const targetArea = await loadInput(inputPath, inputParser);
  const validInitialSpeeds = countValidInitialSpeeds(targetArea);

  return validInitialSpeeds;
};

export default main;
