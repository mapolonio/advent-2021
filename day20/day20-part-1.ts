import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface InputData {
  algorithm: string;
  image: string[];
}

export const inputParser = (inputString: string): InputData => {
  const [algorithm, imageString] = inputString.split('\n\n');

  return {
    algorithm,
    image: imageString.split('\n')
  };
};

export const processImage = (inputData: InputData, times: number): string[] => {
  const { algorithm, image } = inputData;
  const margin = 2;
  let result: string[] = [...image];
  let defaultPixel = '.';

  for (let i = 0; i < times; i += 1) {
    const currentImage = [];
    const rows = result.length;
    const cols = result[0].length;
    const defaultImage = [...new Array(3)].map(() => defaultPixel.repeat(3));

    for (let row = -margin; row < rows + margin; row += 1) {
      currentImage.push('');

      for (let col = -margin; col < cols + margin; col += 1) {
        const pixelValue = processPixel(
          result,
          row,
          col,
          algorithm,
          defaultPixel
        );

        currentImage[currentImage.length - 1] += pixelValue;
      }
    }

    result = currentImage;
    defaultPixel = processPixel(defaultImage, 1, 1, algorithm);
  }

  return result;
};

const processPixel = (
  image: string[],
  row: number,
  col: number,
  algorithm: string,
  defaultPixel = ''
): string => {
  let binary = '';

  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = col - 1; c <= col + 1; c += 1) {
      const char = image[r]?.charAt(c) || defaultPixel;

      binary += char === '#' ? '1' : '0';
    }
  }

  return algorithm.charAt(parseInt(binary, 2));
};

export const countLitPixels = (image: string[]): number => {
  let total = 0;

  for (const row of image) {
    for (const char of row) {
      if (char === '#') {
        total += 1;
      }
    }
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const inputData = await loadInput(inputPath, inputParser);
  const processedImage = processImage(inputData, 2);
  const litPixels = countLitPixels(processedImage);

  return litPixels;
};

export default main;
