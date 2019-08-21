import { ForOperatorParser, IfOperatorParser, TemplateParser } from '../../../../src/parsers/operators';
import { SimpleObjectInterface } from '../../../../src/utils/interfaces/common';
import { PripravaDescriptionInterface, PripravaInputSettingsInterface, PripravaTemplateInterface } from '../../../../src/utils/interfaces/priprava';
import { GetSettingModesOutputInterface } from './helpers';

// COMMON

export type TestInterface<Class, Environment> = (
  input: TestInputInterface<Class, Environment>,
) => void;

export interface TestDescribeInterface<Input = SimpleObjectInterface> {
  data: Input;
  templates: {
    default: PripravaDescriptionInterface;
    mode: PripravaDescriptionInterface;
  };
  settingModes: GetSettingModesOutputInterface;
}

export interface TestInputInterface<Class, Data> {
  operator: Class;
  data: Data;
}

export type TestDataInterface = Array<{
  title: string;
  expected: unknown;
  template: PripravaTemplateInterface;
  settings?: PripravaInputSettingsInterface;
}>;

// OPERATORS

export type TestOperatorListInterface =
  typeof TemplateParser |
  typeof IfOperatorParser |
  typeof ForOperatorParser;

export type TestOperatorInterface = TestInterface<
  TestOperatorListInterface,
  {
    environment: SimpleObjectInterface,
    tests: {
      is: TestDataInterface,
      clear: TestDataInterface,
      parse: TestDataInterface,
    },
  }
>;
