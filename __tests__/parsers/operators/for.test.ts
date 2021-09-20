import { ObjectInterface } from '@said-m/common/dist/interfaces';
import omit from 'lodash.omit';
import { ForOperatorParser } from '../../../src/parsers/operators';
import { PripravaModesEnum } from '../../../src/utils/interfaces';
import { testOperator } from './test';
import { getSettingModes } from './utils/helpers';
import { TestDescribeInterface } from './utils/interfaces';

interface TestDataInterface extends ObjectInterface {
  list: Array<string>;
}

const testDescription: TestDescribeInterface<TestDataInterface> = {
  data: {
    list: [
      'Sigrid',
      'K.Flay',
      'Au/Ra',
    ],
  },
  templates: {
    default: {
      $temp: true,
      for: {
        item: 'thisItem',
        mode: 'of',
        data: 'list',
      },
      template: '${ thisItem }',
    },
    mode: {
      $temp: true,
      for: {
        item: 'thisItem',
        mode: 'of',
        data: 'undefinedKey',
      },
      template: '${ thisItem }',
    },
  },
  settingModes: getSettingModes(ForOperatorParser.key),
};

/** Наличие оператора */
const is = [
  {
    title: 'позитив',
    expected: true,
    template: {
      ...testDescription.templates.default,
    },
  },
  {
    title: 'отсутствуют параметры оператора',
    expected: false,
    // @ts-ignore
    template: {
      ...testDescription.templates.default,
      for: {},
    },
  },
  {
    title: 'не все обязательные поля объекта шаблонизации',
    expected: false,
    template: {
      $temp: true,
      for: testDescription.templates.default.for,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: false,
    template: {
      another: 'content',
    },
  },
];

/** Очистки объекта шаблонизации от оператора */
const clear = [
  {
    title: 'позитив',
    expected: omit(testDescription.templates.default, ForOperatorParser.key),
    template: {
      ...testDescription.templates.default,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: {
      for: {
        ...testDescription.templates.default.for,
      },
    },
    template: {
      for: {
        ...testDescription.templates.default.for,
      },
    },
  },
];

/** Парсинг оператора */
const parse = [
  {
    title: 'позитив (шаблон - строка)',
    expected: testDescription.data.list,
    template: {
      ...testDescription.templates.default,
    },
  },
  {
    title: 'позитив (шаблон - объект шаблонизации)',
    expected: testDescription.data.list
      .filter(thisItem => thisItem.length < 6)
      .map(thisItem => ({
        artist: thisItem,
        count: `${thisItem.length}`,
      })),
    template: {
      ...testDescription.templates.default,
      template: {
        $temp: true,
        if: 'thisItem.length < 6',
        template: {
          artist: {
            $temp: true,
            template: '${ thisItem }',
          },
          count: {
            $temp: true,
            template: '${ thisItem.length }',
          },
        },
      },
    },
  },
  {
    title: `данные не итерируются (режим парсинга "${
      testDescription.settingModes[PripravaModesEnum.ignore].mode[ForOperatorParser.key]
    })"`,
    expected: omit(
      testDescription.templates.mode,
      ForOperatorParser.key,
    ),
    template: {
      ...testDescription.templates.mode,
    },
    settings: testDescription.settingModes[PripravaModesEnum.ignore],
  },
  {
    title: `данные не итерируются (режим парсинга "${
      testDescription.settingModes[PripravaModesEnum.break].mode[ForOperatorParser.key]
    }")`,
    expected: undefined,
    template: {
      ...testDescription.templates.mode,
    },
    settings: testDescription.settingModes[PripravaModesEnum.break],
  },
  {
    title: 'отсутствуем описание оператора',
    expected: undefined,
    template: omit(testDescription.templates.default, ForOperatorParser.key),
  },
];

testOperator({
  operator: ForOperatorParser,
  data: {
    environment: testDescription.data,
    tests: {
      is,
      clear,
      parse,
    },
  },
});
