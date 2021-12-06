import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type FishMapping = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const inputParser = (inputString: string): Array<number> => {
  const [firstLine] = inputString.split('\n');

  return firstLine.split(',').map((n) => parseInt(n, 10));
};

const simulateFishSchool = (
  fishTimes: Array<number>,
  days: number
): FishMapping => {
  const fishMapping: FishMapping = buildFishMapping(fishTimes);
  let prevDayCount = 0;

  for (let day = 0; day < days; day += 1) {
    for (let fishTime = 8; fishTime >= 0; fishTime -= 1) {
      const currentFishCount = fishMapping[fishTime];
      fishMapping[fishTime] = prevDayCount;

      if (fishTime === 0) {
        fishMapping[6] += currentFishCount;
        fishMapping[8] += currentFishCount;
        prevDayCount = 0;
      } else {
        prevDayCount = currentFishCount;
      }
    }
  }

  return fishMapping;
};

const buildFishMapping = (fishTimes: Array<number>): FishMapping => {
  const fishMapping: FishMapping = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (const fishTime of fishTimes) {
    fishMapping[fishTime] += 1;
  }

  return fishMapping;
};

const countFish = (fishSchool: FishMapping): number => {
  let total = 0;

  for (let day = 0; day <= 8; day += 1) {
    total += fishSchool[day];
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const fishTimes = await loadInput(inputPath, inputParser);
  const fishSchool = simulateFishSchool(fishTimes, 80);

  return countFish(fishSchool);
};

export default main;
