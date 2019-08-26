import { TemplateParser } from '../../../src/parsers/operators';
import { PripravaModesEnum } from '../../../src/utils/interfaces';
import { testOperator } from './test';
import { getSettingModes } from './utils/helpers';
import { TestDataInterface, TestDescribeInterface } from './utils/interfaces';

const testDescription: TestDescribeInterface = {
  data: {
    text: 'Party with your fears',
  },
  templates: {
    default: {
      $temp: true,
      template: '${ text }',
    },
    mode: {
      $temp: true,
      template: '${ undefinedKey }',
    },
  },
  settingModes: getSettingModes(TemplateParser.key),
};

/** Наличие оператора */
const is: TestDataInterface = [
  {
    title: 'позитив',
    expected: true,
    template: {
      ...testDescription.templates.default,
    },
  },
  {
    title: 'не корректное описание объекта шаблонизации',
    expected: false,
    template: {
      template: true,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: false,
    template: Infinity,
  },
];

/** Очистки объекта шаблонизации от оператора */
const clear: TestDataInterface = [
  {
    title: 'позитив',
    expected: testDescription.templates.default.template,
    template: {
      ...testDescription.templates.default,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: {
      template: 'lol',
    },
    template: {
      template: 'lol',
    },
  },
];

/** Парсинг оператора */
const parse: TestDataInterface = [
  {
    title: 'позитив (шаблон - строка)',
    expected: testDescription.data.text,
    template: {
      ...testDescription.templates.default,
    },
  },
  {
    title: 'позитив (шаблон - объект шаблонизации)',
    expected: testDescription.data.text,
    template: {
      ...testDescription.templates.default,
      template: {
        $temp: true,
        template: '${ text }',
      },
    },
  },
  {
    title: 'не корректное описание объекта шаблонизации',
    expected: {
      template: true,
    },
    template: {
      template: true,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: Infinity,
    template: Infinity,
  },
  {
    title: `данные не итерируются (режим парсинга "${
      testDescription.settingModes[PripravaModesEnum.ignore].mode.template
    })"`,
    expected: testDescription.templates.mode.template,
    template: testDescription.templates.mode,
    settings: testDescription.settingModes[PripravaModesEnum.ignore],
  },
  {
    title: `данные не итерируются (режим парсинга "${
      testDescription.settingModes[PripravaModesEnum.break].mode.template
    }")`,
    expected: undefined,
    template: testDescription.templates.mode,
    settings: testDescription.settingModes[PripravaModesEnum.break],
  },
];


testOperator({
  operator: TemplateParser,
  data: {
    environment: testDescription.data,
    tests: {
      is,
      clear,
      parse,
    },
  },
});
