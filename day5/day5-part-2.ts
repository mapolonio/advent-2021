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
    markPoints(segment, result);
  }

  return result;
};

const markPoints = (segment: Segment, bottomMap: BottomMap) => {
  let xStep = 1;
  let yStep = 1;

  if (segment.start.x > segment.end.x) {
    xStep = -1;
  }

  if (segment.start.y > segment.end.y) {
    yStep = -1;
  }

  if (isHorizontal(segment)) {
    yStep = 0;
  } else if (isVertical(segment)) {
    xStep = 0;
  }

  const endCondition = (x: number, y: number) => {
    let xCondition = true;
    let yCondition = true;

    if (xStep > 0) {
      xCondition = x <= segment.end.x;
    } else if (xStep < 0) {
      xCondition = x >= segment.end.x;
    }

    if (yStep > 0) {
      yCondition = y <= segment.end.y;
    } else if (yStep < 0) {
      yCondition = y >= segment.end.y;
    }

    return xCondition && yCondition;
  };

  for (
    let x = segment.start.x, y = segment.start.y;
    endCondition(x, y);
    x += xStep, y += yStep
  ) {
    const key = `${x},${y}`;

    bottomMap[key] = bottomMap[key] || 0;
    bottomMap[key] += 1;
  }
};

const isHorizontal = (segment: Segment): boolean => {
  return segment.start.y === segment.end.y;
};

const isVertical = (segment: Segment): boolean => {
  return segment.start.x === segment.end.x;
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
