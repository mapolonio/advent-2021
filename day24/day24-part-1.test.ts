import { parseInstruction, runProgram } from './day24-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 24 part 1', () => {
  describe('runProgram', () => {
    it('processes programs correctly', () => {
      const programA = ['inp x', 'mul x -1'].map(parseInstruction);
      const programB = ['inp z', 'inp x', 'mul z 3', 'eql z x'].map(
        parseInstruction
      );
      const programC = [
        'inp w',
        'add z w',
        'mod z 2',
        'div w 2',
        'add y w',
        'mod y 2',
        'div w 2',
        'add x w',
        'mod x 2',
        'div w 2',
        'mod w 2'
      ].map(parseInstruction);

      expect(runProgram(programA, [5]).get('x')).to.equal(-5);
      expect(runProgram(programA, [-5]).get('x')).to.equal(5);
      expect(runProgram(programB, [2, 6]).get('z')).to.equal(1);
      expect(runProgram(programB, [2, 7]).get('z')).to.equal(0);
      expect(runProgram(programC, [parseInt('1111', 2)])).to.deep.equal(
        new Map([
          ['w', 1],
          ['x', 1],
          ['y', 1],
          ['z', 1]
        ])
      );
      expect(runProgram(programC, [parseInt('0111', 2)])).to.deep.equal(
        new Map([
          ['w', 0],
          ['x', 1],
          ['y', 1],
          ['z', 1]
        ])
      );
      expect(runProgram(programC, [parseInt('1011', 2)])).to.deep.equal(
        new Map([
          ['w', 1],
          ['x', 0],
          ['y', 1],
          ['z', 1]
        ])
      );
      expect(runProgram(programC, [parseInt('1101', 2)])).to.deep.equal(
        new Map([
          ['w', 1],
          ['x', 1],
          ['y', 0],
          ['z', 1]
        ])
      );
      expect(runProgram(programC, [parseInt('1110', 2)])).to.deep.equal(
        new Map([
          ['w', 1],
          ['x', 1],
          ['y', 1],
          ['z', 0]
        ])
      );
    });
  });
});
