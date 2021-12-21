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
  const packet: Packet = {
    version,
    type,
    value: 0,
    packets: []
  };
  let length = 6;

  if (type === 4) {
    const parsedValue = parseValue(binary.substring(6));

    length += parsedValue.length;
    packet.value = parsedValue.result;

    return { packet, length };
  } else {
    if (mode === '0') {
      const contentLength = parseInt(binary.substr(7, 15), 2);

      length += 1 + 15 + contentLength;
      packet.packets = parseTypeZeroContent(binary.substr(22, contentLength));
    } else {
      const numberOfPackets = parseInt(binary.substr(7, 11), 2);
      const parsedContent = parseTypeOneContent(
        binary.substring(18),
        numberOfPackets
      );

      length += 1 + 11 + parsedContent.length;
      packet.packets = parsedContent.packets;
    }

    packet.value = calculateValue(type, packet.packets);
  }

  return { packet, length };
};

const calculateValue = (operation: number, packets: Packet[]): number => {
  switch (operation) {
    case 0:
      return sumPackets(packets);
    case 1:
      return multiplyPackets(packets);
    case 2:
      return getMin(packets);
    case 3:
      return getMax(packets);
    case 5:
      return greaterThan(packets);
    case 6:
      return lessThan(packets);
    case 7:
      return areEqual(packets);
    default:
      throw new Error('Operation  not supported');
  }
};

const sumPackets = (packets: Packet[]): number => {
  let result = 0;

  for (const packet of packets) {
    result += packet.value;
  }

  return result;
};

const multiplyPackets = (packets: Packet[]): number => {
  let result = 1;

  for (const packet of packets) {
    result *= packet.value;
  }

  return result;
};

const getMin = (packets: Packet[]): number => {
  let min = Infinity;

  for (const packet of packets) {
    if (packet.value < min) {
      min = packet.value;
    }
  }

  return min;
};

const getMax = (packets: Packet[]): number => {
  let max = -Infinity;

  for (const packet of packets) {
    if (packet.value > max) {
      max = packet.value;
    }
  }

  return max;
};

const greaterThan = (packets: Packet[]): number => {
  const [packetA, packetB] = packets;

  if (packetA.value > packetB.value) {
    return 1;
  }

  return 0;
};

const lessThan = (packets: Packet[]): number => {
  const [packetA, packetB] = packets;

  if (packetA.value < packetB.value) {
    return 1;
  }

  return 0;
};

const areEqual = (packets: Packet[]): number => {
  const [packetA, packetB] = packets;

  if (packetA.value === packetB.value) {
    return 1;
  }

  return 0;
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

const main: DayFunction = async (inputPath) => {
  const binaryString = await loadInput(inputPath, inputParser);
  const { packet } = parsePacket(binaryString);

  return packet.value;
};

export default main;
