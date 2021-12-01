import day1part1 from './day1/day1-part-1';
import { DayMapping } from './interfaces';
const [, , scriptArg, ...options] = process.argv;

const CHALLENGE_MAP: DayMapping = {
  '1-1': day1part1
};

const run = async () => {
  const [day, part] = scriptArg.split('-');
  const main = CHALLENGE_MAP[scriptArg];

  console.log(`Running Day ${day} - Part ${part}\n`);
  console.time('Runtime');

  const result = await main(`day${day}/input`, options);

  console.log(`Result: ${result}`);
  console.timeEnd('Runtime');
};

run();
