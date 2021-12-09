import main from './day8-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 8 part 2', () => {
  it('Returns the sum of all the output values', async () => {
    const result = await main('day8/test-input', []);

    expect(result).to.equal(61229);
  });
});
