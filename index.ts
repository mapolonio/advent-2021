import day1part1 from './day1/day1-part-1';
import day1part2 from './day1/day1-part-2';
import { DayMapping } from './interfaces';
const [, , scriptArg, ...options] = process.argv;

const CHALLENGE_MAP: DayMapping = {
  '1-1': day1part1,
  '1-2': day1part2
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
