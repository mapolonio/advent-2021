import main, {
  getTotalVersion,
  hexToBinary,
  parsePacket
} from './day16-part-1';
import { expect } from 'chai';
import 'mocha';

describe('Day 16 part 1', () => {
  describe('hexToBinary', () => {
    it('returns the binary representation of an hexadecimal value', async () => {
      expect(hexToBinary('D2FE28')).to.equal('110100101111111000101000');
      expect(hexToBinary('38006F45291200')).to.equal(
        '00111000000000000110111101000101001010010001001000000000'
      );
      expect(hexToBinary('EE00D40C823060')).to.equal(
        '11101110000000001101010000001100100000100011000001100000'
      );
    });
  });

  describe('parsePacket', () => {
    it('returns a literal value packet and the amount of read bits', async () => {
      expect(parsePacket('110100101111111000101000')).to.deep.equal({
        length: 21,
        packet: {
          version: 6,
          type: 4,
          value: 2021,
          packets: []
        }
      });
    });

    describe('operator packets', () => {
      it('returns a type zero packet and the amount of read bits', async () => {
        expect(
          parsePacket(
            '00111000000000000110111101000101001010010001001000000000'
          )
        ).to.deep.equal({
          length: 49,
          packet: {
            version: 1,
            type: 6,
            value: 0,
            packets: [
              {
                version: 6,
                type: 4,
                value: 10,
                packets: []
              },
              {
                version: 2,
                type: 4,
                value: 20,
                packets: []
              }
            ]
          }
        });
      });

      it('returns a type one packet and the amount of read bits', async () => {
        expect(
          parsePacket(
            '11101110000000001101010000001100100000100011000001100000'
          )
        ).to.deep.equal({
          length: 51,
          packet: {
            version: 7,
            type: 3,
            value: 0,
            packets: [
              {
                version: 2,
                type: 4,
                value: 1,
                packets: []
              },
              {
                version: 4,
                type: 4,
                value: 2,
                packets: []
              },
              {
                version: 1,
                type: 4,
                value: 3,
                packets: []
              }
            ]
          }
        });
      });
    });
  });

  describe('getTotalVersion', () => {
    it('return the sum of all the versions contained in all the internal packets', async () => {
      const binaryStringA = hexToBinary('8A004A801A8002F478');
      const binaryStringB = hexToBinary('620080001611562C8802118E34');
      const binaryStringC = hexToBinary('C0015000016115A2E0802F182340');
      const binaryStringD = hexToBinary('A0016C880162017C3686B18A3D4780');
      const { packet: packetA } = parsePacket(binaryStringA);
      const { packet: packetB } = parsePacket(binaryStringB);
      const { packet: packetC } = parsePacket(binaryStringC);
      const { packet: packetD } = parsePacket(binaryStringD);

      expect(getTotalVersion(packetA)).to.equal(16);
      expect(getTotalVersion(packetB)).to.equal(12);
      expect(getTotalVersion(packetC)).to.equal(23);
      expect(getTotalVersion(packetD)).to.equal(31);
    });
  });

  describe('main', () => {
    it('reads a file input and returns the sum of all the contained packets', async () => {
      const result = await main('day16/test-input', []);

      expect(result).to.equal(31);
    });
  });
});
