import main from './day12-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 12 part 1', () => {
  it('Returns the number available paths', async () => {
    const result = await main('day12/test-input', []);

    expect(result).to.equal(10);
  });
});
