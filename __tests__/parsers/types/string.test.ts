import { StringParser } from '../../../src/parsers/types';
import { InputInterface } from '../../../src/utils/interfaces/common';
import { TEST_DATA, TEST_SETTINGS } from '../../utils/constants';

describe(StringParser.name, () => {
  // COMMON

  const stringParser = new StringParser({
    data: TEST_SETTINGS,
  });

  // TESTS

  describe('Интерполяция', () => {
    test('Успешный парсинг', () => {
      const parsed = stringParser.parse({
        data: '${ title }',
      });

      const expected: InputInterface<string> = {
        data: TEST_DATA.title,
      };

      expect(parsed).toMatchObject(expected);
    });

    test('Undefined-переменная', () => {
      const parsed = stringParser.parse({
        data: '${ undefinedVariable }',
      });

      expect(parsed).toBeUndefined();
    });
  });
});
