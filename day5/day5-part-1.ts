import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Segment {
  start: Point;
  end: Point;
}

interface Point {
  x: number;
  y: number;
}

interface BottomMap {
  [index: string]: number;
}

const inputParser = (inputString: string): Array<Segment> => {
  return inputString.split('\n').map((line) => parseSegment(line));
};

const parseSegment = (inputLine: string): Segment => {
  const [x1, y1, x2, y2] = inputLine.split(/ -> |,/);

  return {
    start: {
      x: parseInt(x1, 10),
      y: parseInt(y1, 10)
    },
    end: {
      x: parseInt(x2, 10),
      y: parseInt(y2, 10)
    }
  };
};

const buildBottomMap = (segments: Array<Segment>): BottomMap => {
  const result: BottomMap = {};

  for (const segment of segments) {
    if (
      segment.start.x !== segment.end.x &&
      segment.start.y !== segment.end.y
    ) {
      continue;
    }

    markPoints(segment, result);
  }

  return result;
};

const markPoints = (segment: Segment, bottomMap: BottomMap) => {
  let xStart = segment.start.x;
  let xEnd = segment.end.x;
  let yStart = segment.start.y;
  let yEnd = segment.end.y;

  if (xEnd < xStart) {
    xEnd = segment.start.x;
    xStart = segment.end.x;
  }

  if (yEnd < yStart) {
    yEnd = segment.start.y;
    yStart = segment.end.y;
  }

  for (let x = xStart; x <= xEnd; x += 1) {
    for (let y = yStart; y <= yEnd; y += 1) {
      const key = `${x},${y}`;

      bottomMap[key] = bottomMap[key] || 0;
      bottomMap[key] += 1;
    }
  }
};

const countIntersections = (bottomMap: BottomMap): number => {
  let total = 0;

  for (const point in bottomMap) {
    if (bottomMap[point] > 1) {
      total += 1;
    }
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const segments = await loadInput(inputPath, inputParser);
  const bottomMap = buildBottomMap(segments);

  return countIntersections(bottomMap);
};

export default main;
