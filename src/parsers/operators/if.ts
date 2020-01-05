import { PartialDeep } from '@said-m/common/dist/interfaces';
import { InputInterface, OutputInterface } from 'iods';
import { defaults, isBoolean } from 'lodash';
import { PRIPRAVA_SETTING_DEFAULTS } from '../../utils/constants/parser';
import { PripravaDescriptionInterface, PripravaModesEnum } from '../../utils/interfaces';
import { PripravaIfDescriptionInterface, PripravaOperatorParseInputInterface, PripravaOperatorParseOutputInterface, PripravaOperatorSettingsInterface } from '../../utils/interfaces/operators';
import { StringParser } from '../types/string';
import { TemplateParser } from './template';
import { AbstractOperatorParser } from './utils/abstract';
import { getMode } from './utils/helpers';

/** Обработка объявленных условий */
export class IfOperatorParser extends AbstractOperatorParser {
  /** Ключ объявления */
  static readonly key = 'if';

  // STATIC

  /** Проверка объекта на описание условия */
  static is(data: unknown): data is PripravaDescriptionInterface<
    unknown,
    PripravaIfDescriptionInterface
  > {
    if (
      TemplateParser.is(data) &&
      data.hasOwnProperty(IfOperatorParser.key)
    ) {
      return true;
    }

    return false;
  }

  /** Очистка объекта от параметров оператора */
  static clear(data: unknown): unknown {
    if (IfOperatorParser.is(data)) {
      delete data[IfOperatorParser.key];
    }

    return data;
  }

  // PUBLIC

  parse(
    input: PripravaOperatorParseInputInterface,
  ): PripravaOperatorParseOutputInterface {
    // Если нет условий
    if (
      !input ||
      !IfOperatorParser.is(input.data)
    ) {
      return input;
    }

    // Если условие - Boolean
    if (isBoolean(input.data.if)) {
      const status = input.data.if;
      // Избавляемся от оператора
      IfOperatorParser.clear(input.data);

      return !status ? undefined : {
        data: input.data,
      };
    }

    // Локально модифицирую настройки интерполяции
    const parseSettings = defaults<
      PartialDeep<PripravaOperatorSettingsInterface>,
      PripravaOperatorSettingsInterface
    >(
      {
        initial: {
          interpolation: PRIPRAVA_SETTING_DEFAULTS.interpolation,
        },
      },
      this.settings,
    );

    // Иначе - парсим строку
    const parsedString = (
      new StringParser({
        data: parseSettings,
      })
    ).parse({
      data: `\$\{ ${input.data.if} \}`,
    });

    // Избавляемся от оператора
    IfOperatorParser.clear(input.data);

    // Результат парсинга пуст
    if (!parsedString) {
      if (
        getMode(
          IfOperatorParser.key,
          this.settings.initial.mode,
        ) === PripravaModesEnum.ignore
      ) {
        return {
          data: input.data,
        };
      }

      return;
    }

    // Условие - ложно
    if (this.isFalseString(parsedString).data) {
      return;
    }

    // Условие - верно
    return {
      data: input.data,
    };
  }

  // PRIVATE

  private isFalseString(
    {
      data,
    }: InputInterface<string | undefined>,
  ): OutputInterface<boolean> {
    return {
      data: [
        undefined,
        '',
        'false',
        'undefined',
        'null',
        'NaN',
      ].includes(data),
    };
  }
}
