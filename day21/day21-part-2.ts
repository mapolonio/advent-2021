import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

type BoardMapping = Map<string, number>;

interface Board {
  positionOne: number;
  positionTwo: number;
  scoreOne: number;
  scoreTwo: number;
}

const inputParser = (inputString: string): BoardMapping => {
  const gameData = inputString.split('\n');
  const positionOne = getStartingPosition(gameData[0]);
  const positionTwo = getStartingPosition(gameData[1]);
  const boardLabel = getBoardLabel({
    positionOne,
    positionTwo,
    scoreOne: 0,
    scoreTwo: 0
  });

  return new Map<string, number>([[boardLabel, 1]]);
};

const getStartingPosition = (playerString: string): number => {
  const [, positionString] = playerString.split(
    /Player \d+ starting position: /
  );

  return parseInt(positionString, 10);
};

const getBoardLabel = (board: Board) => {
  return [
    board.positionOne,
    board.positionTwo,
    board.scoreOne,
    board.scoreTwo
  ].join('-');
};

const parseBoardLabel = (label: string): Board => {
  const [positionOne, positionTwo, scoreOne, scoreTwo] = label
    .split('-')
    .map((n) => parseInt(n, 10));

  return {
    positionOne,
    positionTwo,
    scoreOne,
    scoreTwo
  };
};

const getAllPossibleDiceResults = (): Map<number, number> => {
  const result = new Map<number, number>();

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        const sum = i + j + k;
        const prevResult = result.get(sum) || 0;

        result.set(sum, prevResult + 1);
      }
    }
  }

  return result;
};

const play = (boardMapping: BoardMapping): number[] => {
  const diceResults = getAllPossibleDiceResults();
  const wins: number[] = [0, 0];
  let currentMapping = boardMapping;
  let currentPlayer = 0;

  while (currentMapping.size) {
    const nextMapping = new Map<string, number>();

    for (const [label, amount] of currentMapping) {
      const board = parseBoardLabel(label);

      for (const [throwResult, throwAmount] of diceResults) {
        const nextBoard = movePlayer(board, currentPlayer, throwResult);

        if (nextBoard.scoreOne >= 21 || nextBoard.scoreTwo >= 21) {
          wins[currentPlayer] += amount * throwAmount;
          continue;
        }

        const boardLabel = getBoardLabel(nextBoard);
        const boardCount = nextMapping.get(boardLabel) || 0;

        nextMapping.set(boardLabel, boardCount + amount * throwAmount);
      }
    }

    currentPlayer = currentPlayer === 0 ? 1 : 0;
    currentMapping = nextMapping;
  }

  return wins;
};

const movePlayer = (
  board: Board,
  playerNumber: number,
  dieThrow: number
): Board => {
  const newBoard: Board = { ...board };

  if (playerNumber === 0) {
    newBoard.positionOne = (board.positionOne + dieThrow) % 10 || 10;
    newBoard.scoreOne = board.scoreOne + newBoard.positionOne;
  } else {
    newBoard.positionTwo = (board.positionTwo + dieThrow) % 10 || 10;
    newBoard.scoreTwo = board.scoreTwo + newBoard.positionTwo;
  }

  return newBoard;
};

const main: DayFunction = async (inputPath) => {
  const boardMapping = await loadInput(inputPath, inputParser);

  const [playerOneWins, playerTwoWins] = play(boardMapping);

  const mostWins =
    playerOneWins > playerTwoWins ? playerOneWins : playerTwoWins;

  return mostWins;
};

export default main;
