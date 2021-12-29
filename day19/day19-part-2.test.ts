import main from './day19-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 19 part 2', () => {
  describe('main', () => {
    it('returns the maximum manhattan distance between all scanners', async () => {
      const result = await main('day19/test-input', []);

      expect(result).to.equal(3621);
    });
  });
});
