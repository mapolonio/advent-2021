import main from './day25-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 24 part 1', () => {
  describe('main', () => {
    it('returns the number of steps it takes for the cucumbers to stop moving', async () => {
      const result = await main('day25/test-input', []);

      expect(result).to.equal(58);
    });
  });
});
