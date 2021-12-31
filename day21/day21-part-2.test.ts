import main from './day21-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 21 part 2', () => {
  describe('main', () => {
    it('returns the number of universes a player wins the most', async () => {
      const result = await main('day21/test-input', []);

      expect(result).to.equal(444356092776315);
    });
  });
});
