import main from './day7-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 7 part 2', () => {
  it('Returns the minumum amount of fuel to align the subs', async () => {
    const result = await main('day7/test-input', []);

    expect(result).to.equal(168);
  });
});
