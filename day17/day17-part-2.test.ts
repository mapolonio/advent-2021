import main from './day17-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 17 part 2', () => {
  describe('main', () => {
    it('returns the number of speed pairs that hit the target zone', async () => {
      const result = await main('day17/test-input', []);

      expect(result).to.equal(112);
    });
  });
});
