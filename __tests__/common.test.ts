import { cloneDeep } from 'lodash';
import { Priprava } from '../src';
import { PripravaParserOutputInterface } from '../src/utils/interfaces/priprava';
import { TEST_SETTINGS } from './utils/constants';

describe('Общая проверка', () => {
  const data = cloneDeep(TEST_SETTINGS.scope);
  const settings = cloneDeep(TEST_SETTINGS.initial);

  const priprava = new Priprava({
    data,
    settings,
  });

  const env = environment();

  const parsed = priprava.parse({
    data: env.template,
  });

  const expected: Exclude<
    PripravaParserOutputInterface,
    undefined
  > = {
    data: env.expected,
    settings: {},
  };

  test('Результат', () => {
    expect(parsed).toStrictEqual(expected);
  });

  test('Иммутабельность', () => {
    expect(env.template).toStrictEqual(environment().template);
    expect(data).toStrictEqual(TEST_SETTINGS.scope);
    expect(settings).toStrictEqual(TEST_SETTINGS.initial);
  });
});

/**
 * Переменные окружения. \
 * Вынесены, чтобы не мозолить глаза в описаниях тестов.
 */
function environment() {
  const template = {
    content: [
      {
        component: 'title',
        content: {
          $temp: true,
          template: '${ title }',
        },
      },
      {
        $temp: true,
        for: {
          item: 'thisText',
          mode: 'of',
          data: 'text',
        },
        template: {
          component: 'text',
          content: {
            $temp: true,
            template: '${ thisText }',
          },
        },
      },
      {
        component: 'list',
        content: {
          $temp: true,
          for: {
            item: 'thisItem',
            mode: 'of',
            data: 'list',
          },
          template: '${ thisItem }',
        },
      },
      {
        component: 'input',
        content: {
          title: 'Заголовок поля',
          text: {
            $temp: true,
            template: '${ input }',
          },
          description: 'Дополнительное описание',
        },
      },
    ],
  };

  const expected = {
    content: [
      {
        component: 'title',
        content: 'Пример объекта, который должен сформировать класс.',
      },
      {
        component: 'text',
        content: 'Это описание компоненты текста.',
      },
      {
        component: 'text',
        content: 'Полагаю, таких параграфов может быть несколько, '
        + 'поэтому необходимо это всё описывать циклом.',
      },
      {
        component: 'text',
        content: 'А в объекте ниже - списке, '
        + 'необходимо массив формировать прям во внутрь описания.',
      },
      {
        component: 'list',
        content: [
          'Элемент списка 1',
          'Элемент списка 2',
          '...',
          'Тут ещё может быть куча элементов',
        ],
      },
      {
        component: 'input',
        content: {
          title: 'Заголовок поля',
          text: 'Текст поля',
          description: 'Дополнительное описание',
        },
      },
    ],
  };

  return {
    template,
    expected,
  };
}
