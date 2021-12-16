import { DayFunction } from '../interfaces';
import loadInput from '../utils/load-input';

interface ParseResult {
  template: string[];
  rules: RuleMapping;
}

interface RarityResult {
  mostCommon: string;
  leastCommon: string;
}

type ComponentCount = Map<string, number>;
type RuleMapping = Map<string, string>;

const inputParser = (inputString: string): ParseResult => {
  const [templateString, rulesString] = inputString.split('\n\n');

  return {
    template: templateString.split(''),
    rules: parseRules(rulesString)
  };
};

const parseRules = (rulesString: string): RuleMapping => {
  const result: RuleMapping = new Map<string, string>();
  const rules = rulesString.split('\n');

  for (const rule of rules) {
    const [pair, component] = rule.split(' -> ');

    result.set(pair, component);
  }

  return result;
};

const applyRules = (
  template: string[],
  rules: RuleMapping,
  steps: number
): string[] => {
  let currentPolymer: string[] = [...template];

  for (let i = 0; i < steps; i += 1) {
    currentPolymer = polymeryzate(currentPolymer, rules);
  }

  return currentPolymer;
};

const polymeryzate = (polymer: string[], rules: RuleMapping): string[] => {
  const result: string[] = [];

  for (let i = 0; i < polymer.length - 1; i += 1) {
    result.push(polymer[i]);

    const component = rules.get(`${polymer[i]}${polymer[i + 1]}`);

    if (component) {
      result.push(component);
    }
  }

  result.push(polymer[polymer.length - 1]);

  return result;
};

const countComponents = (polymer: string[]): ComponentCount => {
  const count: ComponentCount = new Map<string, number>();

  for (const component of polymer) {
    const componentCount = count.get(component) || 0;

    count.set(component, componentCount + 1);
  }

  return count;
};

const findMostAndLeastCommon = (
  componentCount: ComponentCount
): RarityResult => {
  let mostCommon = '';
  let leastCommon = '';
  let mostCommonCount = 0;
  let leastCommonCount = 0;

  for (const [key, count] of componentCount) {
    if (mostCommon === '' || count > mostCommonCount) {
      mostCommonCount = count;
      mostCommon = key;
    }

    if (leastCommon === '' || count < leastCommonCount) {
      leastCommonCount = count;
      leastCommon = key;
    }
  }

  return {
    mostCommon,
    leastCommon
  };
};

const main: DayFunction = async (inputPath) => {
  const { template, rules } = await loadInput(inputPath, inputParser);
  const polymer = applyRules(template, rules, 10);
  const componentsCount = countComponents(polymer);
  const { mostCommon, leastCommon } = findMostAndLeastCommon(componentsCount);

  return (
    (componentsCount.get(mostCommon) as number) -
    (componentsCount.get(leastCommon) as number)
  );
};

export default main;
