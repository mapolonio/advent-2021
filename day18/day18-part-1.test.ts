import loadInput from '../utils/load-input';
import {
  explode,
  getNestedPairPath,
  getPathForSplitting,
  inputParser,
  split,
  SnailfishNumber,
  sumList
} from './day18-part-1';

import { expect } from 'chai';
import 'mocha';

describe('Day 18 part 1', () => {
  describe('getNestedPairPath', () => {
    it('returns path were a nested pair is first found', () => {
      expect(getNestedPairPath([[[[[9, 8], 1], 2], 3], 4])).to.equal('0000');
      expect(getNestedPairPath([7, [6, [5, [4, [3, 2]]]]])).to.equal('1111');
      expect(getNestedPairPath([[6, [5, [4, [3, 2]]]], 1])).to.equal('0111');
      expect(
        getNestedPairPath([
          [3, [2, [1, [7, 3]]]],
          [6, [5, [4, [3, 2]]]]
        ])
      ).to.equal('0111');
      expect(
        getNestedPairPath([
          [3, [2, [8, 0]]],
          [9, [5, [4, [3, 2]]]]
        ])
      ).to.equal('1111');
    });

    it('returns an empty string when there are no nested pairs', () => {
      expect(getNestedPairPath([1, 2])).to.equal('');
      expect(getNestedPairPath([[[[0, 1], 2], 3], 4])).to.equal('');
      expect(getNestedPairPath([7, [6, [5, [4, 5]]]])).to.equal('');
      expect(getNestedPairPath([[6, [5, [4, 5]]], 1])).to.equal('');
      expect(
        getNestedPairPath([
          [3, [2, [1, 0]]],
          [6, [5, [4, 0]]]
        ])
      ).to.equal('');
      expect(
        getNestedPairPath([
          [3, [2, [8, 0]]],
          [9, [5, [4, 1]]]
        ])
      ).to.equal('');
      expect(
        getNestedPairPath([
          [
            [[0, 7], 4],
            [15, [0, 13]]
          ],
          [1, 1]
        ])
      ).to.equal('');
    });
  });

  describe('getPathForSplitting', () => {
    it('returns path where the first split target is found', () => {
      expect(
        getPathForSplitting([
          [
            [[0, 7], 4],
            [15, [0, 13]]
          ],
          [1, 1]
        ])
      ).to.equal('010');
      expect(
        getPathForSplitting([
          [
            [[0, 7], 4],
            [
              [7, 8],
              [0, 13]
            ]
          ],
          [1, 1]
        ])
      ).to.equal('0111');
    });

    it('returns an empty string if there is no number to split', () => {
      expect(getPathForSplitting([1, 2])).to.equal('');
      expect(getPathForSplitting([[[[[9, 8], 1], 2], 3], 4])).to.equal('');
      expect(getPathForSplitting([7, [6, [5, [4, [3, 2]]]]])).to.equal('');
      expect(getPathForSplitting([[6, [5, [4, [3, 2]]]], 1])).to.equal('');
      expect(
        getPathForSplitting([
          [3, [2, [1, [7, 3]]]],
          [6, [5, [4, [3, 2]]]]
        ])
      ).to.equal('');
      expect(
        getPathForSplitting([
          [3, [2, [8, 0]]],
          [9, [5, [4, [3, 2]]]]
        ])
      ).to.equal('');
    });
  });

  describe('split', () => {
    it('splits the number at target path', () => {
      const numberA: SnailfishNumber = [
        [
          [[0, 7], 4],
          [15, [0, 13]]
        ],
        [1, 1]
      ];
      const numberB: SnailfishNumber = [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, 13]
          ]
        ],
        [1, 1]
      ];

      split(numberA, '010');
      split(numberB, '0111');

      expect(numberA).to.deep.equal([
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, 13]
          ]
        ],
        [1, 1]
      ]);
      expect(numberB).to.deep.equal([
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, [6, 7]]
          ]
        ],
        [1, 1]
      ]);
    });
  });

  describe('explode', () => {
    it('explodes the array at the target path', () => {
      const numberA: SnailfishNumber = [[[[[9, 8], 1], 2], 3], 4];
      const numberB: SnailfishNumber = [7, [6, [5, [4, [3, 2]]]]];
      const numberC: SnailfishNumber = [[6, [5, [4, [3, 2]]]], 1];
      const numberD: SnailfishNumber = [
        [3, [2, [1, [7, 3]]]],
        [6, [5, [4, [3, 2]]]]
      ];
      const numberE: SnailfishNumber = [
        [3, [2, [8, 0]]],
        [9, [5, [4, [3, 2]]]]
      ];

      explode(numberA, '0000');
      explode(numberB, '1111');
      explode(numberC, '0111');
      explode(numberD, '0111');
      explode(numberE, '1111');

      expect(numberA).to.deep.equal([[[[0, 9], 2], 3], 4]);
      expect(numberB).to.deep.equal([7, [6, [5, [7, 0]]]]);
      expect(numberC).to.deep.equal([[6, [5, [7, 0]]], 3]);
      expect(numberD).to.deep.equal([
        [3, [2, [8, 0]]],
        [9, [5, [4, [3, 2]]]]
      ]);
      expect(numberE).to.deep.equal([
        [3, [2, [8, 0]]],
        [9, [5, [7, 0]]]
      ]);
    });
  });

  describe('sumList', () => {
    it('returns the result of adding all the numbers', async () => {
      const numbers = await loadInput('day18/test-input', inputParser);

      expect(sumList(numbers)).to.deep.equal([
        [
          [
            [8, 7],
            [7, 7]
          ],
          [
            [8, 6],
            [7, 7]
          ]
        ],
        [
          [
            [0, 7],
            [6, 6]
          ],
          [8, 7]
        ]
      ]);
    });
  });
});
