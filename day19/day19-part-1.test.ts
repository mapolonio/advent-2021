import loadInput from '../utils/load-input';
import main, {
  findOverlappingScanners,
  inputParser,
  getTranslator
} from './day19-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 19 part 1', () => {
  describe('findOverlappingScanners', () => {
    it('returns the indexes of scanners that overlap with the target', async () => {
      const scanners = await loadInput('day19/test-input', inputParser);

      const [result] = findOverlappingScanners(
        scanners[0],
        scanners,
        new Set([0])
      );

      expect(result.scannerIndex).to.equal(1);
      expect(result.sharedBeacons).to.deep.equal(
        new Map([
          [
            { x: 404, y: -588, z: -901 },
            { x: -336, y: 658, z: 858 }
          ],
          [
            { x: 528, y: -643, z: 409 },
            { x: -460, y: 603, z: -452 }
          ],
          [
            { x: 390, y: -675, z: -793 },
            { x: -322, y: 571, z: 750 }
          ],
          [
            { x: -537, y: -823, z: -458 },
            { x: 605, y: 423, z: 415 }
          ],
          [
            { x: -485, y: -357, z: 347 },
            { x: 553, y: 889, z: -390 }
          ],
          [
            { x: -345, y: -311, z: 381 },
            { x: 413, y: 935, z: -424 }
          ],
          [
            { x: -661, y: -816, z: -575 },
            { x: 729, y: 430, z: 532 }
          ],
          [
            { x: -618, y: -824, z: -621 },
            { x: 686, y: 422, z: 578 }
          ],
          [
            { x: -447, y: -329, z: 318 },
            { x: 515, y: 917, z: -361 }
          ],
          [
            { x: 544, y: -627, z: -890 },
            { x: -476, y: 619, z: 847 }
          ],
          [
            { x: 423, y: -701, z: 434 },
            { x: -355, y: 545, z: -477 }
          ],
          [
            { x: 459, y: -707, z: 401 },
            { x: -391, y: 539, z: -444 }
          ]
        ])
      );
    });
  });

  describe('getTranslator', () => {
    it('returns a function that translate from one system to another', () => {
      const sharedBeacons = new Map([
        [
          { x: -618, y: -824, z: -621 },
          { x: 686, y: 422, z: 578 }
        ],
        [
          { x: -537, y: -823, z: -458 },
          { x: 605, y: 423, z: 415 }
        ],
        [
          { x: -447, y: -329, z: 318 },
          { x: 515, y: 917, z: -361 }
        ],
        [
          { x: 404, y: -588, z: -901 },
          { x: -336, y: 658, z: 858 }
        ],
        [
          { x: 544, y: -627, z: -890 },
          { x: -476, y: 619, z: 847 }
        ],
        [
          { x: 528, y: -643, z: 409 },
          { x: -460, y: 603, z: -452 }
        ],
        [
          { x: -661, y: -816, z: -575 },
          { x: 729, y: 430, z: 532 }
        ],
        [
          { x: 390, y: -675, z: -793 },
          { x: -322, y: 571, z: 750 }
        ],
        [
          { x: 423, y: -701, z: 434 },
          { x: -355, y: 545, z: -477 }
        ],
        [
          { x: -345, y: -311, z: 381 },
          { x: 413, y: 935, z: -424 }
        ],
        [
          { x: 459, y: -707, z: 401 },
          { x: -391, y: 539, z: -444 }
        ],
        [
          { x: -485, y: -357, z: 347 },
          { x: 553, y: 889, z: -390 }
        ]
      ]);

      const translator = getTranslator(sharedBeacons);

      for (const [pointA, pointB] of sharedBeacons) {
        expect(translator(pointB)).to.deep.equal(pointA);
      }
    });
  });

  describe('main', () => {
    it('returns the number of total beacons', async () => {
      const result = await main('day19/test-input', []);

      expect(result).to.equal(79);
    });
  });
});
