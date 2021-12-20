import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

const HEXMAP: Map<string, string> = new Map([
  ['0', '0000'],
  ['1', '0001'],
  ['2', '0010'],
  ['3', '0011'],
  ['4', '0100'],
  ['5', '0101'],
  ['6', '0110'],
  ['7', '0111'],
  ['8', '1000'],
  ['9', '1001'],
  ['A', '1010'],
  ['B', '1011'],
  ['C', '1100'],
  ['D', '1101'],
  ['E', '1110'],
  ['F', '1111']
]);

interface Packet {
  version: number;
  type: number;
  value: number;
  packets: Packet[];
}

interface ParsePacketResult {
  packet: Packet;
  length: number;
}

interface ParseValueResult {
  result: number;
  length: number;
}

interface ParseTypeOneResult {
  packets: Packet[];
  length: number;
}

const inputParser = (inputString: string): string => {
  return hexToBinary(inputString);
};

export const hexToBinary = (hex: string): string => {
  let result = '';

  for (const char of hex) {
    result += HEXMAP.get(char);
  }

  return result;
};

export const parsePacket = (binary: string): ParsePacketResult => {
  const version = parseInt(binary.substr(0, 3), 2);
  const type = parseInt(binary.substr(3, 3), 2);
  const mode = binary.charAt(6);
  const result: Packet = {
    version,
    type,
    value: 0,
    packets: []
  };
  let length = 6;

  switch (type) {
    case 4:
      {
        const parsedValue = parseValue(binary.substring(6));

        length += parsedValue.length;
        result.value = parsedValue.result;
      }
      break;
    default: {
      if (mode === '0') {
        const contentLength = parseInt(binary.substr(7, 15), 2);

        length += 1 + 15 + contentLength;
        result.packets = parseTypeZeroContent(binary.substr(22, contentLength));
      } else {
        const numberOfPackets = parseInt(binary.substr(7, 11), 2);
        const parsedContent = parseTypeOneContent(
          binary.substring(18),
          numberOfPackets
        );

        length += 1 + 11 + parsedContent.length;
        result.packets = parsedContent.packets;
      }
    }
  }

  return { packet: result, length };
};

const parseValue = (binary: string): ParseValueResult => {
  let bitString = '';
  let length = 0;

  for (let i = 0; i < binary.length; i += 5) {
    const group = binary.substring(i, i + 5);

    bitString += group.substring(1);
    length += 5;

    if (binary[i] === '0') {
      break;
    }
  }

  return { result: parseInt(bitString, 2), length };
};

const parseTypeZeroContent = (binary: string): Packet[] => {
  const result: Packet[] = [];
  let currentBinary = binary;

  while (currentBinary.length) {
    const { packet, length } = parsePacket(currentBinary);
    result.push(packet);
    currentBinary = currentBinary.substring(length);
  }

  return result;
};

const parseTypeOneContent = (
  binary: string,
  numberOfPackets: number
): ParseTypeOneResult => {
  const packets: Packet[] = [];
  let length = 0;
  let currentBinary = binary;

  while (packets.length < numberOfPackets) {
    const currentResult = parsePacket(currentBinary);
    currentBinary = currentBinary.substring(currentResult.length);
    length += currentResult.length;
    packets.push(currentResult.packet);
  }

  return { packets, length };
};

export const getTotalVersion = (packet: Packet): number => {
  let total = 0;
  const queue: Packet[] = [packet];

  while (queue.length) {
    const current = queue.shift() as Packet;

    total += current.version;

    queue.push(...current.packets);
  }

  return total;
};

const main: DayFunction = async (inputPath) => {
  const binaryString = await loadInput(inputPath, inputParser);
  const { packet } = parsePacket(binaryString);

  return getTotalVersion(packet);
};

export default main;
