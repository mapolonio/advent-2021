import main from './day21-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 21 part 1', () => {
  describe('main', () => {
    it('returns the multiplication of the losing score and the number of die throws', async () => {
      const result = await main('day21/test-input', []);

      expect(result).to.equal(739785);
    });
  });
});
