import { PRIPRAVA_KEY } from '../../utils/constants/parser';
import { isPlainObject, isText } from '../../utils/helpers';
import { InputInterface, SimpleObjectInterface, TextInterface } from '../../utils/interfaces/common';
import { PripravaDescriptionInterface, PripravaModesEnum } from '../../utils/interfaces/priprava';
import { PripravaOperatorParseInputInterface, PripravaOperatorParseOutputInterface } from '../../utils/interfaces/priprava/operators';
import { ObjectParser, StringParser } from '../types';
import { AbstractOperatorParser } from './utils/abstract';
import { getMode } from './utils/helpers';

/** Обработка шаблона */
export class TemplateParser extends AbstractOperatorParser {
  /** Ключ объявления */
  static readonly key = 'template';

  // STATIC

  /** Проверка на объект шаблонизации */
  static is(
    data: unknown,
  ): data is PripravaDescriptionInterface {
    if (
      isPlainObject(data) &&
      data.hasOwnProperty(PRIPRAVA_KEY) &&
      data.hasOwnProperty(TemplateParser.key)
    ) {
      return true;
    }

    return false;
  }

  // необходимо для обеспечения единого стиля работы с методами
  /** Очистка объекта от параметров оператора */
  static clear(data: unknown): unknown {
    if (TemplateParser.is(data)) {
      return data.template;
    }

    return data;
  }

  // PUBLIC

  parse(
    input: PripravaOperatorParseInputInterface,
  ): PripravaOperatorParseOutputInterface {
    // Если объект не является объектом шаблонизации
    if (
      !input ||
      !TemplateParser.is(input.data)
    ) {
      return input;
    }

    // Шаблон - строка
    if (isText(input.data.template)) {
      return this.parseString({
        data: input.data.template,
      });
    }

    // Шаблон - объект
    if (isPlainObject(input.data.template)) {
      return this.parseObject({
        data: input.data.template,
      });
    }
  }

  // PRIVATE

  // Обработка строковых шаблонов
  private parseString(
    {
      data,
    }: InputInterface<TextInterface>,
  ): PripravaOperatorParseOutputInterface {
    const parsed = (
      new StringParser({
        data: this.settings,
      })
    ).parse({
      data,
    });

    // Результат парснига пуст
    if (!parsed) {
      if (
        getMode(
          TemplateParser.key,
          this.settings.initial.mode,
        ) === PripravaModesEnum.ignore
      ) {
        return {
          data,
        };
      }

      return;
    }

    // Возвращаем результат парсинга
    return parsed;
  }

  // Обработка сложных шаблонов - вложенные объекты
  private parseObject(
    {
      data,
    }: InputInterface<SimpleObjectInterface>,
  ): PripravaOperatorParseOutputInterface {
    const parsed = (
      new ObjectParser({
        data: this.settings,
      })
    ).parse({
      data,
    });

    if (!parsed) {
      return;
    }

    return {
      data: parsed.data,
    };
  }
}
