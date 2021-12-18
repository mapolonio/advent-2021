import main from './day14-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 14 part ', () => {
  it('Returns the subtraction of the most common and least common component after 40 steps', async function () {
    this.timeout(0);
    const result = await main('day14/test-input', []);

    expect(result).to.equal(2188189693529);
  });
});
