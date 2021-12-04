import main from './day4-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 4 part 1', () => {
  it('finds the winner board and returns the multiplication last number and unmarked board numbers', async () => {
    const result = await main('day4/test-input', []);

    expect(result).to.equal(4512);
  });
});
