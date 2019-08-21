import { ObjectParser } from '../../../src/parsers/types';
import { PripravaDescriptionInterface } from '../../../src/utils/interfaces/priprava';
import { TEST_SETTINGS } from '../../utils/constants';

describe(ObjectParser.name, () => {
  // COMMON

  const env = environment();

  // TESTS

  describe('parse', () => {
    for (const thisSituation of env.tests.parse) {
      test(thisSituation.title, () => {
        const parsed = (
          new ObjectParser({
            data: {
              initial: TEST_SETTINGS.initial,
              scope: {},
            },
          })
        ).parse({
          // @ts-ignore
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

/**
 * Переменные окружения. \
 * Вынесены, чтобы не мозолить глаза в описаниях тестов.
 */
function environment() {
  const template: PripravaDescriptionInterface = {
    $temp: true,
    template: 'I am your father!',
  };

  /** Парсинг оператора */
  const parse = [
    {
      title: 'позитив',
      expected: template.template,
      template: {
        ...template,
      },
    },
    {
      title: 'не объект шаблонизации',
      expected: {
        $temp: true,
      },
      template: {
        $temp: true,
      },
    },
    {
      title: 'обработка вложенный объектов',
      expected: {
        template: template.template,
      },
      template: {
        template,
      },
    },
    {
      title: 'вовсе не объект',
      expected: undefined,
      template: Infinity,
    },
  ];

  return {
    tests: {
      parse,
    },
  };
}
