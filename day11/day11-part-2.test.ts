import main from './day11-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 11 part 2', () => {
  it('Returns the step number where all octopuses flash', async () => {
    const result = await main('day11/test-input', []);

    expect(result).to.equal(195);
  });
});
