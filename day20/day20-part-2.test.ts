import main from './day20-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 20 part 2', () => {
  describe('main', () => {
    it('returns the number of lit pixels', async () => {
      const result = await main('day20/test-input', []);

      expect(result).to.equal(3351);
    });
  });
});
