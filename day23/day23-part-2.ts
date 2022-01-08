import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Amphipod extends Position {
  label: Label;
}

interface Destination extends Position {
  steps: number;
}

interface Position {
  row: number;
  col: number;
}

interface Move {
  amphipod: Amphipod;
  destination: Destination;
}

export type Label = 'A' | 'B' | 'C' | 'D';

const destinationMapping = {
  A: 3,
  B: 5,
  C: 7,
  D: 9
};

const energyConsumptionMapping = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000
};

const movesCache = new Map<string, Move[]>();
const statesMap = new Map<string, number>();

const inputParser = (inputString: string): string[] => {
  return inputString.split('\n');
};

const moveAmphipods = (maze: string[], usedEnergy = 0): number | null => {
  if (isMazeFinished(maze)) {
    return usedEnergy;
  }

  const moves = getPossibleMoves(maze);

  if (moves.length === 0) {
    return null;
  }

  let minEnergy: null | number = null;

  for (const move of moves) {
    const { maze: mazeCopy, energy } = moveAmphipod(maze, move);
    const candidateEnergy = usedEnergy + energy;
    const hash = mazeCopy.join('');
    const energyAlreadyMeaasured = statesMap.get(hash);

    if (energyAlreadyMeaasured && energyAlreadyMeaasured <= candidateEnergy) {
      continue;
    }

    statesMap.set(hash, candidateEnergy);

    const result = moveAmphipods(mazeCopy, candidateEnergy);

    if (result !== null && (minEnergy === null || result < minEnergy)) {
      minEnergy = result;
    }
  }

  return minEnergy;
};

const getAmphipods = (maze: string[]): Amphipod[] => {
  const positions: Amphipod[] = [];

  for (let r = 0; r < maze.length; r++) {
    const row = maze[r];

    for (let col = 0; col < row.length; col++) {
      const label = row.charAt(col) as Label;

      if ('ABCD'.includes(label)) {
        positions.push({
          col,
          row: r,
          label
        });
      }
    }
  }

  return positions;
};

const isMazeFinished = (maze: string[]): boolean => {
  return (
    maze[2].charAt(3) === 'A' &&
    maze[3].charAt(3) === 'A' &&
    maze[4].charAt(3) === 'A' &&
    maze[5].charAt(3) === 'A' &&
    maze[2].charAt(5) === 'B' &&
    maze[3].charAt(5) === 'B' &&
    maze[4].charAt(5) === 'B' &&
    maze[5].charAt(5) === 'B' &&
    maze[2].charAt(7) === 'C' &&
    maze[3].charAt(7) === 'C' &&
    maze[4].charAt(7) === 'C' &&
    maze[5].charAt(7) === 'C' &&
    maze[2].charAt(9) === 'D' &&
    maze[3].charAt(9) === 'D' &&
    maze[4].charAt(9) === 'D' &&
    maze[5].charAt(9) === 'D'
  );
};

const getPossibleMoves = (maze: string[]): Move[] => {
  const amphipods = getAmphipods(maze);
  const hash = maze.join('');

  if (movesCache.has(hash)) {
    return movesCache.get(hash) as Move[];
  }

  const moves: Move[] = [];

  for (const amphipod of amphipods) {
    moves.push(...getMoves(maze, amphipod));
  }

  movesCache.set(hash, moves);

  return moves;
};

export const getMoves = (maze: string[], amphipod: Amphipod): Move[] => {
  const { col, row, label } = amphipod;
  const finalCol = destinationMapping[label];
  const moves: Move[] = [];

  if (col === finalCol) {
    const roomStatus =
      maze[2].charAt(col) +
      maze[3].charAt(col) +
      maze[4].charAt(col) +
      maze[5].charAt(col);
    // Already in destination at bottom OR partners already at the bottom
    if (
      row === 5 ||
      (row === 4 && roomStatus.charAt(3) === label) ||
      (row === 3 && roomStatus.substring(2)) === label.repeat(2) ||
      (row === 2 && roomStatus.substring(1) === label.repeat(3))
    ) {
      return [];
    }
  }

  const queue: Destination[] = [
    ...getNeighbours({
      row,
      col,
      steps: 0
    })
  ];
  const queued = new Set<string>([
    `${row},${col}`,
    `${row - 1},${col}`,
    `${row + 1},${col}`,
    `${row},${col - 1}`,
    `${row},${col + 1}`
  ]);

  while (queue.length) {
    const destination = queue.shift();

    if (
      !destination ||
      !maze[destination.row] ||
      maze[destination.row].charAt(destination.col) !== '.'
    ) {
      continue;
    }

    // Hallway. Not in front of a room. Amphipod has not left the initial room
    if (
      destination.row === 1 &&
      ![3, 5, 7, 9].includes(destination.col) &&
      row > 1
    ) {
      moves.push({
        amphipod,
        destination
      });
    }

    // Room. Is final destination.
    if (destination.col === finalCol) {
      const roomStatus =
        maze[2].charAt(destination.col) +
        maze[3].charAt(destination.col) +
        maze[4].charAt(destination.col) +
        maze[5].charAt(destination.col);

      if (
        // Room is empty and destination is at bottom
        (destination.row === 5 && roomStatus === '....') ||
        // Room is filled with fellow amphipods
        (destination.row === 4 && roomStatus.charAt(3) === label) ||
        (destination.row === 3 &&
          roomStatus.substring(2) === label.repeat(2)) ||
        (destination.row === 2 && roomStatus.substring(1) === label.repeat(3))
      ) {
        moves.push({
          amphipod,
          destination
        });
      }
    }

    for (const neighbour of getNeighbours(destination)) {
      const key = `${neighbour.row},${neighbour.col}`;

      if (queued.has(key)) {
        continue;
      }

      queue.push(neighbour);
      queued.add(key);
    }
  }

  return moves;
};

const getNeighbours = (position: Destination): Destination[] => {
  const { col, row, steps } = position;

  return [
    { row: row - 1, col, steps: steps + 1 },
    { row: row + 1, col, steps: steps + 1 },
    { row, col: col - 1, steps: steps + 1 },
    { row, col: col + 1, steps: steps + 1 }
  ];
};

export const moveAmphipod = (
  maze: string[],
  move: Move
): { maze: string[]; energy: number } => {
  const { amphipod, destination } = move;
  const newMaze = [...maze];

  newMaze[amphipod.row] = replaceCharAt(
    newMaze[amphipod.row],
    amphipod.col,
    '.'
  );

  newMaze[destination.row] = replaceCharAt(
    newMaze[destination.row],
    destination.col,
    amphipod.label
  );

  return {
    maze: newMaze,
    energy: energyConsumptionMapping[amphipod.label] * destination.steps
  };
};

const replaceCharAt = (
  origin: string,
  position: number,
  char: string
): string => {
  return `${origin.substring(0, position)}${char}${origin.substring(
    position + 1
  )}`;
};

const main: DayFunction = async (inputPath) => {
  const maze = await loadInput(inputPath, inputParser);
  const patch = ['  #D#C#B#A#', '  #D#B#A#C#'];

  maze.splice(3, 0, ...patch);

  const minEnergy = moveAmphipods(maze);

  return minEnergy;
};

export default main;
