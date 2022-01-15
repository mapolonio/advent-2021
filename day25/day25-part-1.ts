import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type FloorMap = string[][];
type Direction = 'east' | 'south';

interface CucumberMapping {
  eastFacing: Cucumber[];
  southFacing: Cucumber[];
}

interface Cucumber {
  row: number;
  col: number;
  facing: Direction;
}

const directionMapping = {
  east: '>',
  south: 'v'
};

const inputParser = (inputString: string): FloorMap => {
  return inputString.split('\n').map((line) => line.split(''));
};

const moveCucumbers = (floorMap: FloorMap): number => {
  let step = 0;
  let moves = 0;
  let currentFloorMap = [...floorMap];

  do {
    const result = simulateStep(currentFloorMap);
    moves = result.moves;
    currentFloorMap = result.floorMap;

    step++;
  } while (moves > 0);

  return step;
};

const simulateStep = (floorMap: FloorMap) => {
  const cucumbers = getCucumberPositions(floorMap);

  const firstResult = move(floorMap, cucumbers.eastFacing, 'east');
  const secondResult = move(
    firstResult.floorMap,
    cucumbers.southFacing,
    'south'
  );

  return {
    floorMap: secondResult.floorMap,
    moves: firstResult.moves + secondResult.moves
  };
};

const getCucumberPositions = (floorMap: FloorMap): CucumberMapping => {
  const positions: CucumberMapping = {
    eastFacing: [],
    southFacing: []
  };

  for (let row = 0; row < floorMap.length; row++) {
    for (let col = 0; col < floorMap[row].length; col++) {
      const char = floorMap[row][col];

      if (char === '>') {
        positions.eastFacing.push({ row, col, facing: 'east' });
      } else if (char === 'v') {
        positions.southFacing.push({ row, col, facing: 'south' });
      }
    }
  }

  return positions;
};

const move = (
  floorMap: FloorMap,
  cucumbers: Cucumber[],
  facing: Direction
): { floorMap: FloorMap; moves: number } => {
  let moves = 0;
  const newMap = floorMap.map((row) => [...row]);

  for (const cucumber of cucumbers) {
    const nextPosition = getNextPosition(cucumber, floorMap);

    if (floorMap[nextPosition.row][nextPosition.col] === '.') {
      newMap[nextPosition.row][nextPosition.col] = directionMapping[facing];
      newMap[cucumber.row][cucumber.col] = '.';
      moves++;
    }
  }

  return {
    floorMap: newMap,
    moves
  };
};

const getNextPosition = (cucumber: Cucumber, floorMap: FloorMap): Cucumber => {
  const nextPosition = { ...cucumber };

  if (cucumber.facing === 'east') {
    nextPosition.col++;
    nextPosition.col = nextPosition.col % floorMap[0].length;
  } else {
    nextPosition.row++;
    nextPosition.row = nextPosition.row % floorMap.length;
  }

  return nextPosition;
};

const main: DayFunction = async (inputPath) => {
  const floorMap = await loadInput(inputPath, inputParser);
  const numberOfSteps = moveCucumbers(floorMap);

  return numberOfSteps;
};

export default main;
