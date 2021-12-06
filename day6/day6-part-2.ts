import { DayFunction } from '../interfaces';
import {
  countFish,
  inputParser,
  loadInput,
  simulateFishSchool
} from './day6-part-1';

const main: DayFunction = async (inputPath) => {
  const fishTimes = await loadInput(inputPath, inputParser);
  const fishSchool = simulateFishSchool(fishTimes, 256);

  return countFish(fishSchool);
};

export default main;
