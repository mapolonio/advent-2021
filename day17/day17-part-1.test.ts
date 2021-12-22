import { findMaxHeight } from './day17-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 17 part 1', () => {
  describe('findMaxHeight', () => {
    it('returns the maximum height that the probe can reach', async () => {
      const targetArea = {
        minX: 20,
        maxX: 30,
        minY: -10,
        maxY: -5
      };

      expect(findMaxHeight(targetArea)).to.equal(45);
    });
  });
});
