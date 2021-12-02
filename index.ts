import { DayFunction } from './interfaces';
const [, , scriptArg, ...options] = process.argv;

const runDay = async () => {
  const [day, part] = scriptArg.split('-');
  const { default: main } = await import(`./day${day}/day${day}-part-${part}`);

  console.log(`Running Day ${day} - Part ${part}\n`);
  console.time('Runtime');

  const result = await (main as DayFunction)(`day${day}/input`, options);

  console.log(`Result: ${result}`);
  console.timeEnd('Runtime');
};

runDay();
