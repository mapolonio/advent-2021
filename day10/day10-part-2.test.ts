import main from './day10-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 10 part 2', () => {
  it('Returns the middle score after getting the missing characters', async () => {
    const result = await main('day10/test-input', []);

    expect(result).to.equal(288957);
  });
});
