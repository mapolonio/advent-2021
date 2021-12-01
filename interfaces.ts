export type DayFunction = (
  inputPath: string,
  options: Array<string>
) => Promise<any>;

export interface DayMapping {
  [index: string]: DayFunction;
}
