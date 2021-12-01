import fs from 'fs/promises';

const [, , dayNumber] = process.argv;

const run = async () => {
  const dirPath = `./day${dayNumber}`;
  const filesToCreate = [
    `${dirPath}/day${dayNumber}-part-1.ts`,
    `${dirPath}/day${dayNumber}-part-1.test.ts`,
    `${dirPath}/day${dayNumber}-part-2.ts`,
    `${dirPath}/day${dayNumber}-part-2.test.ts`,
    `${dirPath}/input`,
    `${dirPath}/test-input`
  ];

  await createDirectory(dirPath);
  await Promise.all(filesToCreate.map(createFile));

  console.log('Process finished');
};

const createDirectory = async (path: string): Promise<void> => {
  if (await dirExists(path)) {
    return console.log(`Directory "${path}" already exists. Skipping...`);
  }
  await fs.mkdir(path);

  console.log(`${path} created successfully`);
};

const createFile = async (path: string): Promise<void> => {
  if (await dirExists(path)) {
    return console.log(`File "${path}" already exists. Skipping...`);
  }

  const file = await fs.open(path, 'w');
  await file.close();

  console.log(`${path} created successfully`);
};

const dirExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }

    throw error;
  }

  return true;
};

run();
