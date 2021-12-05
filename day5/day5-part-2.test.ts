import main from './day5-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 5 part 2', () => {
  it('Returns the number of points were two or more segments intersect', async () => {
    const result = await main('day5/test-input', []);

    expect(result).to.equal(12);
  });
});
