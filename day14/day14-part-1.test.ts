import main from './day14-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 14 part 1', () => {
  it('Returns the subtraction of the most common and least common component after 10 steps', async () => {
    const result = await main('day14/test-input', []);

    expect(result).to.equal(1588);
  });
});
