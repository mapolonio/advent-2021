import main from './day11-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 11 part 1', () => {
  it('Returns the number of flashes after 100 steps', async () => {
    const result = await main('day11/test-input', []);

    expect(result).to.equal(1656);
  });
});
