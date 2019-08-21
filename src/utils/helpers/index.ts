import { isArray as lodashIsArray, isNumber, isPlainObject as lodashIsPlainObject, isString } from 'lodash';
import { SimpleObjectInterface, TextInterface } from '../interfaces/common';

/**
 * В Lodash проверка на объект возвращает булево,
 * т.е. если делать if, то ide принимает object за boolean
 */
export function isPlainObject(value: unknown): value is SimpleObjectInterface {
  return lodashIsPlainObject(value);
}

/** Lodash в текущей версии возвращает any[], хотя появился unknown */
export function isArray(value: unknown): value is Array<unknown> {
  return lodashIsArray(value);
}

/** Текстом считается строка или число */
export function isText(value: unknown): value is TextInterface {
  return isString(value) || isNumber(value);
}
