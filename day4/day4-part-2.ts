import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface ParseResult {
  numbers: Array<number>;
  boards: Array<Board>;
}

interface Board {
  mapping: BoardMapping;
  numbers: Array<Array<number>>;
}

interface BoardMapping {
  [key: number]: BoardNumber;
}

interface BoardNumber {
  col: number;
  row: number;
  marked: boolean;
}

const inputParser = (inputString: string): ParseResult => {
  const [numberStrings, ...boardStrings] = inputString.split('\n\n');

  return {
    numbers: numberStrings.split(',').map((n) => parseInt(n, 10)),
    boards: boardStrings.map((boardString) => parseBoard(boardString))
  };
};

const parseBoard = (boardString: string): Board => {
  const boardMapping: BoardMapping = {};
  const boardNumbers = [];
  const rows = boardString.split('\n');

  for (let rowNumber = 0; rowNumber < rows.length; rowNumber += 1) {
    const columns = rows[rowNumber].trim().split(/\s+/);
    const parsedRow = [];

    for (let colNumber = 0; colNumber < columns.length; colNumber += 1) {
      const number = parseInt(columns[colNumber]);
      boardMapping[number] = {
        row: rowNumber,
        col: colNumber,
        marked: false
      };

      parsedRow.push(number);
    }

    boardNumbers.push(parsedRow);
  }

  return {
    mapping: boardMapping,
    numbers: boardNumbers
  };
};

const playBingo = (numbers: Array<number>, boards: Array<Board>) => {
  let [lastWinner] = boards;
  let lastNumber = -1;
  const remainingBoards: Set<Board> = new Set();

  for (const board of boards) {
    remainingBoards.add(board);
  }

  for (const number of numbers) {
    if (remainingBoards.size === 0) {
      break;
    }

    for (const board of boards) {
      const boardNumber = board.mapping[number];

      if (!boardNumber || !remainingBoards.has(board)) {
        continue;
      }

      const { row, col } = boardNumber;
      boardNumber.marked = true;

      if (isWinner(board, row, col)) {
        lastWinner = board;
        remainingBoards.delete(board);
      }
    }

    lastNumber = number;
  }

  return {
    lastNumber,
    winnerBoard: lastWinner
  };
};

const isWinner = (board: Board, row: number, col: number) => {
  let winnerCol = true;
  let winnerRow = true;

  for (let r = 0; r < 5; r += 1) {
    const number = board.numbers[r][col];

    if (!board.mapping[number].marked) {
      winnerCol = false;
      break;
    }
  }

  for (let c = 0; c < 5; c += 1) {
    const number = board.numbers[row][c];

    if (!board.mapping[number].marked) {
      winnerRow = false;
      break;
    }
  }

  return winnerCol || winnerRow;
};

const sumUnmarkedNumbers = (board: Board): number => {
  let sum = 0;

  for (const row of board.numbers) {
    for (const number of row) {
      const { marked } = board.mapping[number];

      if (marked) {
        continue;
      }

      sum += number;
    }
  }

  return sum;
};

const main: DayFunction = async (inputPath) => {
  const { numbers, boards } = await loadInput(inputPath, inputParser);
  const { lastNumber, winnerBoard } = playBingo(numbers, boards);
  const boardSum = sumUnmarkedNumbers(winnerBoard);

  return lastNumber * boardSum;
};

export default main;
