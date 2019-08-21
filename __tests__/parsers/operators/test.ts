import { isPlainObject } from '../../../src/utils/helpers';
import { TEST_SETTINGS } from '../../utils/constants';
import { TestOperatorInterface } from './utils/interfaces';

export const testOperator: TestOperatorInterface = (
  {
    operator,
    data,
  },
) => {
  // Тестируемый оператор
  describe(operator.name, () => {
    // Проверка на оператор
    describe('is', () => {
      for (const thisSituation of data.tests.is) {
        test(thisSituation.title, () => {
          const result = operator.is(thisSituation.template);

          expect(result).toBe(thisSituation.expected);
        });
      }
    });

    // Проверка очищения объект от оператора
    describe('clear', () => {
      for (const thisSituation of data.tests.clear) {
        test(thisSituation.title, () => {
          const cleared = operator.clear(thisSituation.template);

          if (isPlainObject(thisSituation.expected)) {
            return expect(cleared).toStrictEqual(thisSituation.expected);
          }

          expect(cleared).toBe(thisSituation.expected);
        });
      }
    });

    // Проверка работы парсинга
    describe('parse', () => {
      for (const thisSituation of data.tests.parse) {
        test(thisSituation.title, () => {
          const parsed = (
            new operator({
              data: {
                initial: thisSituation.settings || TEST_SETTINGS.initial,
                scope: data.environment,
              },
            })
          ).parse({
            data: thisSituation.template,
          });

          if (thisSituation.expected === undefined) {
            return expect(parsed).toBeUndefined();
          }

          expect(parsed).toStrictEqual({
            data: thisSituation.expected,
          });
        });
      }
    });
  });
};
