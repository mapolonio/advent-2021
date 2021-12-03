import main, { getRates } from './day3-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 3 part 2', () => {
  it('Should return the multiplication of oxygen and CO2 rating', async () => {
    const result = await main('day3/test-input', []);

    expect(result).to.equal(230);
  });

  describe('getRates', () => {
    describe('when looking for the most common digits', () => {
      it('returns an array filtered by the most common digit at given position', async () => {
        const input = [
          '00100',
          '11110',
          '10110',
          '10111',
          '10101',
          '01111',
          '00111',
          '11100',
          '10000',
          '11001',
          '00010',
          '01010'
        ];

        const result = getRates(input, 'most-common');

        expect(result).to.deep.equal(['10111']);
      });
    });

    describe('when looking for the least common digits', () => {
      it('returns an array filtered by the least common digit at given position', async () => {
        const input = [
          '00100',
          '11110',
          '10110',
          '10111',
          '10101',
          '01111',
          '00111',
          '11100',
          '10000',
          '11001',
          '00010',
          '01010'
        ];

        const result = getRates(input, 'least-common');

        expect(result).to.deep.equal(['01010']);
      });
    });
  });
});
