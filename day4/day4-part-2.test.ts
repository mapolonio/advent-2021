import main from './day4-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 4 part 2', () => {
  it('finds the last winner board and returns the multiplication last number and unmarked board numbers', async () => {
    const result = await main('day4/test-input', []);

    expect(result).to.equal(1924);
  });
});
