import main from './day15-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 15 part 1', () => {
  it('Returns the total risk of the less risky path', async () => {
    const result = await main('day15/test-input', []);

    expect(result).to.equal(40);
  });
});
