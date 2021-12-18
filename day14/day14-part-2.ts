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
type RuleExpansionMapping = Map<string, ComponentCount>;

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

const expandRules = (
  rules: RuleMapping,
  levels: number
): RuleExpansionMapping => {
  const result = new Map<string, ComponentCount>();

  for (const [rule] of rules) {
    const componentCount = expandRule(rule, rules, levels);

    result.set(rule, componentCount);
  }

  return result;
};

const expandRule = (
  rule: string,
  rules: RuleMapping,
  levels: number
): ComponentCount => {
  const polymer = applyRules([...rule], rules, levels);

  return countComponents(polymer);
};

const extrapolatePolymer = (
  polymer: string[],
  rulesExpansionMapping: RuleExpansionMapping
): ComponentCount => {
  const result = new Map<string, number>();

  for (let i = 0; i < polymer.length - 1; i += 1) {
    const rule = `${polymer[i]}${polymer[i + 1]}`;
    const extrapolation = rulesExpansionMapping.get(rule);

    for (const [component, count] of extrapolation as ComponentCount) {
      const prevCount = result.get(component) || 0;
      result.set(component, prevCount + count);
    }

    if (i > 0) {
      result.set(polymer[i], (result.get(polymer[i]) || 0) - 1);
    }
  }

  return result;
};

const main: DayFunction = async (inputPath) => {
  const { template, rules } = await loadInput(inputPath, inputParser);
  const rulesExpansionMapping = expandRules(rules, 20);
  const incompletePolymer = applyRules(template, rules, 20);
  const componentsCount = extrapolatePolymer(
    incompletePolymer,
    rulesExpansionMapping
  );
  const { mostCommon, leastCommon } = findMostAndLeastCommon(componentsCount);

  return (
    (componentsCount.get(mostCommon) as number) -
    (componentsCount.get(leastCommon) as number)
  );
};

export default main;
