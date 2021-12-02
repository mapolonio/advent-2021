import fs from 'fs/promises';

const loadInput = async (
  path: string,
  parser: (loadedString: string) => any
) => {
  const input = await fs.readFile(path, 'utf8');

  return parser(input);
};

export default loadInput;
