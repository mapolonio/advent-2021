import main, { getMoves, Label } from './day23-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 23 part 2', () => {
  describe('getMoves', () => {
    it('returns all possible moves for an amphipod', () => {
      const maze = [
        '#############',
        '#AA.....B.BD#',
        '###B#C#.#.###',
        '  #D#C#.#.#',
        '  #D#B#.#C#',
        '  #A#D#C#A#',
        '  #########'
      ];
      const amphipod = {
        row: 2,
        col: 5,
        label: 'C' as Label
      };

      expect(getMoves(maze, amphipod)).to.deep.include({
        amphipod,
        destination: {
          row: 4,
          col: 7,
          steps: 6
        }
      });
    });
  });

  describe('main', () => {
    it('returns the minimum amount of energy required to move all the amphipods', async function () {
      this.timeout(0);
      const result = await main('day23/test-input', []);

      expect(result).to.equal(44169);
    });
  });
});
