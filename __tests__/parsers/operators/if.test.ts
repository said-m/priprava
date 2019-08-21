import { IfOperatorParser } from '../../../src/parsers/operators';
import { SimpleObjectInterface } from '../../../src/utils/interfaces/common';
import { PripravaModesEnum } from '../../../src/utils/interfaces/priprava';
import { testOperator } from './test';
import { getSettingModes } from './utils/helpers';
import { TestDataInterface, TestDescribeInterface } from './utils/interfaces';

interface DataInterface extends SimpleObjectInterface {
  text: string;
}

const testDescription: TestDescribeInterface<DataInterface> = {
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
      if: 'undefinedKey',
      template: '${ text }',
    },
  },
  settingModes: getSettingModes(IfOperatorParser.key),
};

/** Наличие оператора */
const is: TestDataInterface = [
  {
    title: 'позитив',
    expected: true,
    template: {
      ...testDescription.templates.default,
      if: false,
    },
  },
  {
    title: 'не корректное описание объекта шаблонизации',
    expected: false,
    template: {
      $temp: true,
      if: true,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: false,
    template: NaN,
  },
];

/** Очистки объекта шаблонизации от оператора */
const clear: TestDataInterface = [
  {
    title: 'позитив',
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.default,
      if: true,
    },
  },
  {
    title: 'не объект шаблонизации',
    expected: {
      $temp: true,
      if: true,
    },
    template: {
      $temp: true,
      if: true,
    },
  },
];

/** Парсинг оператора */
const parse: TestDataInterface = [
  {
    title: 'boolean (true)',
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.default,
      if: true,
    },
  },
  {
    title: 'boolean (false)',
    expected: undefined,
    template: {
      ...testDescription.templates.default,
      if: false,
    },
  },
  {
    title: 'string (true)',
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.default,
      if: `text === "${ testDescription.data.text }"`,
    },
  },
  {
    title: 'string (false)',
    expected: undefined,
    template: {
      ...testDescription.templates.default,
      if: `'что-то' === "${ testDescription.data.text }"`,
    },
  },
  {
    title: 'number (true)',
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.default,
      if: '3 > 1',
    },
  },
  {
    title: 'number (false)',
    expected: undefined,
    template: {
      ...testDescription.templates.default,
      if: '1 > Infinity',
    },
  },
  {
    title: 'undefined (true)',
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.default,
      if: 'typeof(undefinedKey) === "undefined"',
    },
  },
  {
    title: `undefiend (false) (режим парсинга "${
      testDescription.settingModes[PripravaModesEnum.ignore].mode[IfOperatorParser.key]
    })"`,
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.mode,
    },
    settings: testDescription.settingModes[PripravaModesEnum.ignore],
  },
  {
    title: `undefined (false) (режим парсинга "${
      testDescription.settingModes[PripravaModesEnum.break].mode[IfOperatorParser.key]
    }")`,
    expected: undefined,
    template: {
      ...testDescription.templates.mode,
    },
    settings: testDescription.settingModes[PripravaModesEnum.break],
  },
  {
    title: 'NaN (true)',
    expected: testDescription.templates.default,
    template: {
      ...testDescription.templates.default,
      if: 'isNaN(NaN)',
    },
  },
  {
    title: 'NaN (false)',
    expected: undefined,
    template: {
      ...testDescription.templates.default,
      if: 'parseInt("test")',
    },
  },
];


testOperator({
  operator: IfOperatorParser,
  data: {
    environment: testDescription.data,
    tests: {
      is,
      clear,
      parse,
    },
  },
});
