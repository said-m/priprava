import { ObjectInterface } from '@said-m/common/dist/interfaces';
import { ForOperatorParser, IfOperatorParser, TemplateParser } from '../../../../src/parsers/operators';
import { PripravaDescriptionInterface, PripravaInputSettingsInterface, PripravaTemplateInterface } from '../../../../src/utils/interfaces';
import { GetSettingModesOutputInterface } from './helpers';

// COMMON

export type TestInterface<Class, Environment> = (
  input: TestInputInterface<Class, Environment>,
) => void;

export interface TestDescribeInterface<Input = ObjectInterface> {
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
    environment: ObjectInterface,
    tests: {
      is: TestDataInterface,
      clear: TestDataInterface,
      parse: TestDataInterface,
    },
  }
>;
