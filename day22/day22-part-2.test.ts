import main, { parseCuboid, processCuboids } from './day22-part-2';
import { expect } from 'chai';
import 'mocha';

describe('Day 22 part 2', () => {
  describe('processCuboids', () => {
    it('returns the final number of turned on cubes', () => {
      const cuboidsA = [
        'on x=10..12,y=10..12,z=10..12',
        'on x=11..13,y=11..13,z=11..13',
        'off x=9..11,y=9..11,z=9..11',
        'on x=10..10,y=10..10,z=10..10'
      ].map(parseCuboid);
      const cuboidsB = [
        'on x=-20..26,y=-36..17,z=-47..7',
        'on x=-20..33,y=-21..23,z=-26..28',
        'on x=-22..28,y=-29..23,z=-38..16',
        'on x=-46..7,y=-6..46,z=-50..-1',
        'on x=-49..1,y=-3..46,z=-24..28',
        'on x=2..47,y=-22..22,z=-23..27',
        'on x=-27..23,y=-28..26,z=-21..29',
        'on x=-39..5,y=-6..47,z=-3..44',
        'on x=-30..21,y=-8..43,z=-13..34',
        'on x=-22..26,y=-27..20,z=-29..19',
        'off x=-48..-32,y=26..41,z=-47..-37',
        'on x=-12..35,y=6..50,z=-50..-2',
        'off x=-48..-32,y=-32..-16,z=-15..-5',
        'on x=-18..26,y=-33..15,z=-7..46',
        'off x=-40..-22,y=-38..-28,z=23..41',
        'on x=-16..35,y=-41..10,z=-47..6',
        'off x=-32..-23,y=11..30,z=-14..3',
        'on x=-49..-5,y=-3..45,z=-29..18',
        'off x=18..30,y=-20..-8,z=-3..13',
        'on x=-41..9,y=-7..43,z=-33..15'
      ].map(parseCuboid);

      const resultA = processCuboids(cuboidsA);
      const resultB = processCuboids(cuboidsB);

      expect(resultA).to.equal(39);
      expect(resultB).to.equal(590784);
    });
  });

  describe('main', () => {
    it('reads the input returns the number of turned on cubes', async () => {
      const result = await main('day22/test-input', []);

      expect(result).to.equal(2758514936282235);
    });
  });
});
