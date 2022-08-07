import { MODELS, SUB_MODELS } from '../../core';

function getRandomHelper(list: Array<string>): string {
  const i: number = Math.floor(Math.random() * list.length);
  return list[i];
}

/**
 * The util generates random name
 * Source: https://jsfiddle.net/katowulf/3gtDf/
 */
export function generateRandomName(): string {
  return `${getRandomHelper(MODELS)} ${getRandomHelper(SUB_MODELS)}`;
}
