// types
import type { IOptions } from './types';

/**
 * Utility function to use an ellipsis in the middle of the text.
 * @param {string} text - the text to ellipse.
 * @param {IOptions} options - [optional] options to customise.
 * @returns {string} an ellipsed text.
 */
export default function ellipseText(text: string, { end = 5, start = 5 }: IOptions): string {
  return `${text.slice(0, start)}...${text.slice(-end)}`;
}
