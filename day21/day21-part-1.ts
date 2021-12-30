import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface Game {
  playerOne: Player;
  playerTwo: Player;
}

interface Player {
  score: number;
  position: number;
}

const inputParser = (inputString: string): Game => {
  const gameData = inputString.split('\n');

  return {
    playerOne: {
      score: 0,
      position: getStartingPosition(gameData[0])
    },
    playerTwo: {
      score: 0,
      position: getStartingPosition(gameData[1])
    }
  };
};

const getStartingPosition = (playerString: string): number => {
  const [, positionString] = playerString.split(
    /Player \d+ starting position: /
  );

  return parseInt(positionString, 10);
};

const play = (game: Game): number => {
  const { playerOne, playerTwo } = game;
  let currentPlayer = playerOne;
  let dieThrows = 0;

  while (playerOne.score < 1000 && playerTwo.score < 1000) {
    const currentThrow = dieThrows * 3 + 6;
    dieThrows += 3;
    currentPlayer.position = (currentPlayer.position + currentThrow) % 10 || 10;
    currentPlayer.score += currentPlayer.position;
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  return dieThrows;
};

const main: DayFunction = async (inputPath) => {
  const game = await loadInput(inputPath, inputParser);
  const dieThrows = play(game);
  const loosingPlayer =
    game.playerOne.score < 1000 ? game.playerOne : game.playerTwo;

  return dieThrows * loosingPlayer.score;
};

export default main;
