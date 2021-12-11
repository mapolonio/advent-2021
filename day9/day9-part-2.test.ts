import main from './day9-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 9 part 2', () => {
  it('Returns the multiplication of the sizes of the 3 largest basins', async () => {
    const result = await main('day9/test-input', []);

    expect(result).to.equal(1134);
  });
});
