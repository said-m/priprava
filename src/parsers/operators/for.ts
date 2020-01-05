import { isArray, isPlainObject } from '@said-m/common';
import { cloneDeep, isString } from 'lodash';
import { PripravaDescriptionInterface, PripravaModesEnum } from '../../utils/interfaces';
import { PripravaForDescriptionInterface, PripravaOperatorParseInputInterface, PripravaOperatorParseOutputInterface } from '../../utils/interfaces/operators';
import { TemplateParser } from './template';
import { AbstractOperatorParser } from './utils/abstract';
import { getMode } from './utils/helpers';

/** Обработка объявленных циклов */
export class ForOperatorParser extends AbstractOperatorParser {
  /** Ключ объявления */
  static readonly key = 'for';

  // STATIC

  /** Проверка объекта на описание цикла */
  static is(data: unknown): data is PripravaDescriptionInterface<
    unknown,
    PripravaForDescriptionInterface
  > {
    // Исключаем объекты без шаблонизации
    if (!TemplateParser.is(data)) {
      return false;
    }

    const params = data[ForOperatorParser.key];

    // Проверка объекта шаблонизации на параметры цикла
    if (
      isPlainObject(params) &&
      isString(params.item) &&
      params.mode && ['in', 'of'].includes(params.mode) &&
      isString(params.data)
    ) {
      return true;
    }

    // Во всех остальных случаях
    return false;
  }

  /** Очистка объекта от параметров оператора */
  static clear(data: unknown): unknown {
    if (ForOperatorParser.is(data)) {
      delete data[ForOperatorParser.key];
    }

    return data;
  }

  // PUBLIC

  parse(
    input: PripravaOperatorParseInputInterface,
  ): PripravaOperatorParseOutputInterface {
    // Если нет описания цикла
    if (
      !input ||
      !ForOperatorParser.is(input.data)
    ) {
      return;
    }

    /** Результирующий массив цикла */
    const result: Array<unknown> = [];
    /** Итерируемый объект */
    const iteratee = this.settings.scope[input.data.for.data];

    // Если данные не итерируются
    if (
        !isPlainObject(iteratee) &&
        !isArray(iteratee)
    ) {
      if (
        getMode(
          ForOperatorParser.key,
          this.settings.initial.mode,
        ) === PripravaModesEnum.ignore
      ) {
        return {
          data: ForOperatorParser.clear(input.data),
        };
      }

      return;
    }

    for (const thisIndex in iteratee) {
      // Изменения в скоупе, добавление итерируемого значения
      const thisScope = {
        ...this.settings.scope,
        // Если 'of' - то содержимое, иначе 'in' - ключ
        [input.data.for.item]: input.data.for.mode === 'of'
          ? (
            isPlainObject(iteratee)
              ? iteratee[thisIndex]
              : iteratee[parseInt(thisIndex)]
          )
          : thisIndex,
      };

      // Парсинг шаблона
      const parsed = (
        new TemplateParser({
          data: {
            initial: this.settings.initial,
            scope: thisScope,
          },
        })
      ).parse({
        data: cloneDeep(input.data),
      });

      // Результат парсинга пуст
      if (!parsed) {
        continue;
      }

      // Успешная обработка элемента
      result.push(parsed.data);
    }

    // Очистка описания оператора
    ForOperatorParser.clear(input.data);

    // Возврат результата парсинга
    return {
      data: result,
    };
  }
}
