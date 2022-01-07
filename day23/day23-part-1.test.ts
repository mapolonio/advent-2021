import main, { getMoves, moveAmphipod, Label } from './day23-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 23 part 1', () => {
  describe('getMoves', () => {
    it('returns all possible moves for an amphipod', () => {
      const mazes = [
        [
          '#############',
          '#...........#',
          '###B#C#B#D###',
          '  #A#D#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#...B.......#',
          '###B#C#.#D###',
          '  #A#D#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#...B.......#',
          '###B#.#C#D###',
          '  #A#D#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#...B.D.....#',
          '###B#.#C#D###',
          '  #A#.#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.....#',
          '###B#.#C#D###',
          '  #A#B#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.....#',
          '###.#B#C#D###',
          '  #A#B#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.D...#',
          '###.#B#C#.###',
          '  #A#B#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.D.A.#',
          '###.#B#C#.###',
          '  #A#B#C#.#',
          '  #########'
        ],
        [
          '#############',
          '#.....D...A.#',
          '###.#B#C#.###',
          '  #A#B#C#D#',
          '  #########'
        ],
        [
          '#############',
          '#.........A.#',
          '###.#B#C#D###',
          '  #A#B#C#D#',
          '  #########'
        ],
        [
          '#############',
          '#...........#',
          '###A#B#C#D###',
          '  #A#B#C#D#',
          '  #########'
        ]
      ];
      const expectedMoves = [
        {
          amphipod: {
            row: 2,
            col: 7,
            label: 'B' as Label
          },
          destination: {
            row: 1,
            col: 4,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 2,
            col: 5,
            label: 'C' as Label
          },
          destination: {
            row: 2,
            col: 7,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 3,
            col: 5,
            label: 'D' as Label
          },
          destination: {
            row: 1,
            col: 6,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 1,
            col: 4,
            label: 'B' as Label
          },
          destination: {
            row: 3,
            col: 5,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 2,
            col: 3,
            label: 'B' as Label
          },
          destination: {
            row: 2,
            col: 5,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 2,
            col: 9,
            label: 'D' as Label
          },
          destination: {
            row: 1,
            col: 8,
            steps: 2
          }
        },
        {
          amphipod: {
            row: 3,
            col: 9,
            label: 'A' as Label
          },
          destination: {
            row: 1,
            col: 10,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 1,
            col: 8,
            label: 'D' as Label
          },
          destination: {
            row: 3,
            col: 9,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 1,
            col: 6,
            label: 'D' as Label
          },
          destination: {
            row: 2,
            col: 9,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 1,
            col: 10,
            label: 'A' as Label
          },
          destination: {
            row: 2,
            col: 3,
            steps: 8
          }
        }
      ];

      for (let i = 0; i < expectedMoves.length; i++) {
        expect(getMoves(mazes[i], expectedMoves[i].amphipod)).to.deep.include(
          expectedMoves[i]
        );
      }
    });
  });

  describe('moveAmphipod', () => {
    it('returns an updated maze and the energy used to execute a move', () => {
      const mazes = [
        [
          '#############',
          '#...........#',
          '###B#C#B#D###',
          '  #A#D#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#...B.......#',
          '###B#C#.#D###',
          '  #A#D#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#...B.......#',
          '###B#.#C#D###',
          '  #A#D#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#...B.D.....#',
          '###B#.#C#D###',
          '  #A#.#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.....#',
          '###B#.#C#D###',
          '  #A#B#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.....#',
          '###.#B#C#D###',
          '  #A#B#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.D...#',
          '###.#B#C#.###',
          '  #A#B#C#A#',
          '  #########'
        ],
        [
          '#############',
          '#.....D.D.A.#',
          '###.#B#C#.###',
          '  #A#B#C#.#',
          '  #########'
        ],
        [
          '#############',
          '#.....D...A.#',
          '###.#B#C#.###',
          '  #A#B#C#D#',
          '  #########'
        ],
        [
          '#############',
          '#.........A.#',
          '###.#B#C#D###',
          '  #A#B#C#D#',
          '  #########'
        ],
        [
          '#############',
          '#...........#',
          '###A#B#C#D###',
          '  #A#B#C#D#',
          '  #########'
        ]
      ];
      const moves = [
        {
          amphipod: {
            row: 2,
            col: 7,
            label: 'B' as Label
          },
          destination: {
            row: 1,
            col: 4,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 2,
            col: 5,
            label: 'C' as Label
          },
          destination: {
            row: 2,
            col: 7,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 3,
            col: 5,
            label: 'D' as Label
          },
          destination: {
            row: 1,
            col: 6,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 1,
            col: 4,
            label: 'B' as Label
          },
          destination: {
            row: 3,
            col: 5,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 2,
            col: 3,
            label: 'B' as Label
          },
          destination: {
            row: 2,
            col: 5,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 2,
            col: 9,
            label: 'D' as Label
          },
          destination: {
            row: 1,
            col: 8,
            steps: 2
          }
        },
        {
          amphipod: {
            row: 3,
            col: 9,
            label: 'A' as Label
          },
          destination: {
            row: 1,
            col: 10,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 1,
            col: 8,
            label: 'D' as Label
          },
          destination: {
            row: 3,
            col: 9,
            steps: 3
          }
        },
        {
          amphipod: {
            row: 1,
            col: 6,
            label: 'D' as Label
          },
          destination: {
            row: 2,
            col: 9,
            steps: 4
          }
        },
        {
          amphipod: {
            row: 1,
            col: 10,
            label: 'A' as Label
          },
          destination: {
            row: 2,
            col: 3,
            steps: 8
          }
        }
      ];

      expect(moveAmphipod(mazes[0], moves[0])).to.deep.equal({
        energy: 40,
        maze: mazes[1]
      });
      expect(moveAmphipod(mazes[1], moves[1])).to.deep.equal({
        energy: 400,
        maze: mazes[2]
      });
      expect(moveAmphipod(mazes[2], moves[2])).to.deep.equal({
        energy: 3000,
        maze: mazes[3]
      });
      expect(moveAmphipod(mazes[3], moves[3])).to.deep.equal({
        energy: 30,
        maze: mazes[4]
      });
      expect(moveAmphipod(mazes[4], moves[4])).to.deep.equal({
        energy: 40,
        maze: mazes[5]
      });
      expect(moveAmphipod(mazes[5], moves[5])).to.deep.equal({
        energy: 2000,
        maze: mazes[6]
      });
      expect(moveAmphipod(mazes[6], moves[6])).to.deep.equal({
        energy: 3,
        maze: mazes[7]
      });
      expect(moveAmphipod(mazes[7], moves[7])).to.deep.equal({
        energy: 3000,
        maze: mazes[8]
      });
      expect(moveAmphipod(mazes[8], moves[8])).to.deep.equal({
        energy: 4000,
        maze: mazes[9]
      });
      expect(moveAmphipod(mazes[9], moves[9])).to.deep.equal({
        energy: 8,
        maze: mazes[10]
      });
    });
  });

  describe('main', () => {
    it('returns the minimum amount of energy required to move all the amphipods', async () => {
      const result = await main('day23/test-input', []);

      expect(result).to.equal(12521);
    });
  });
});
