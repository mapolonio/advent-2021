import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';
import { countLitPixels, inputParser, processImage } from './day20-part-1';

const main: DayFunction = async (inputPath) => {
  const inputData = await loadInput(inputPath, inputParser);
  const processedImage = processImage(inputData, 50);
  const litPixels = countLitPixels(processedImage);

  return litPixels;
};

export default main;
