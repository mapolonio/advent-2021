import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Point {
  x: number;
  y: number;
}

interface Instruction {
  direction: Direction;
  axis: number;
}

type Direction = 'horizontal' | 'vertical';

interface ParseResult {
  points: Point[];
  instructions: Instruction[];
}

const inputParser = (inputString: string): ParseResult => {
  const [pointLines, instructionLines] = inputString.split('\n\n');
  const points = pointLines
    .split('\n')
    .map((pointLine) => parsePoint(pointLine));
  const instructions = instructionLines
    .split('\n')
    .map((instructionLine) => parseInstruction(instructionLine));

  return {
    points,
    instructions
  };
};

const parsePoint = (pointLine: string): Point => {
  const [xString, yString] = pointLine.split(',');

  return {
    x: parseInt(xString, 10),
    y: parseInt(yString, 10)
  };
};

const parseInstruction = (instructionLine: string): Instruction => {
  const [, directionString, axisValue] = instructionLine.split(/fold along |=/);

  return {
    direction: directionString === 'x' ? 'vertical' : 'horizontal',
    axis: parseInt(axisValue, 10)
  };
};

const fold = (points: Point[], instruction: Instruction): Point[] => {
  const result: Point[] = [];
  const pointMap: Set<string> = new Set<string>();

  for (const point of points) {
    const newPoint = getFoldedPoint(point, instruction);
    const key = `${newPoint.x},${newPoint.y}`;

    if (!pointMap.has(key)) {
      result.push(newPoint);
      pointMap.add(key);
    }
  }

  return result;
};

const getFoldedPoint = (point: Point, instruction: Instruction): Point => {
  const { axis, direction } = instruction;
  const newPoint = { x: point.x, y: point.y };

  if (direction === 'horizontal') {
    if (point.y >= axis) {
      newPoint.y = point.y - 2 * (point.y - axis);
    }
  } else {
    if (point.x >= axis) {
      newPoint.x = point.x - 2 * (point.x - axis);
    }
  }

  return newPoint;
};

const main: DayFunction = async (inputPath) => {
  const { points, instructions } = await loadInput(inputPath, inputParser);
  const foldedPoints = fold(points, instructions[0]);

  return foldedPoints.length;
};

export default main;
