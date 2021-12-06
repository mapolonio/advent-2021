import main from './day6-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 6 part 1', () => {
  it('Returns the number fish in the school after 80 days', async () => {
    const result = await main('day6/test-input', []);

    expect(result).to.equal(5934);
  });
});
