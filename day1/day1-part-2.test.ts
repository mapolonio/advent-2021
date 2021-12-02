import main from './day1-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 1 part 2', () => {
  it('Should return the number of increasing windows', async () => {
    const result = await main('day1/test-input', []);

    expect(result).to.equal(5);
  });
});
