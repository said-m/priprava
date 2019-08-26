import { isPlainObject } from '@said-m/common';
import { ObjectInterface } from '@said-m/common/dist/interfaces';
import { InputInterface } from 'iods';
import Priprava from '../..';
import { PripravaOperatorParseOutputInterface } from '../../utils/interfaces/operators';
import { ForOperatorParser, IfOperatorParser } from '../operators';
import { TemplateParser } from '../operators/template';
import { AbstractTypeParser } from './utils/abstract';

/** Обработчик объектов */
export class ObjectParser extends AbstractTypeParser {

  // PUBLIC

  parse(
    input: InputInterface<ObjectInterface>,
  ): PripravaOperatorParseOutputInterface {
    if (!isPlainObject(input.data)) {
      return;
    }

    // Работаем с объектом шаблонизации
    if (TemplateParser.is(input.data)) {
      return this.parsePriprava(input);
    }

    // Работаем с обычным объектом
    return this.parseDefault(input);
  }

  // PRIVATE

  /** Обработка объекта шаблонизации */
  private parsePriprava(
    input: InputInterface<ObjectInterface>,
  ): PripravaOperatorParseOutputInterface {
    /** Результат применения If */
    const ifParsed = (
      new IfOperatorParser({
        data: this.settings,
      })
    ).parse(input);

    // Результат парсинга пуст
    if (!ifParsed) {
      return;
    }

    /** Результат применения For */
    const forParsed = (
      new ForOperatorParser({
        data: this.settings,
      })
    ).parse(ifParsed);

    // Исполнение цикла - исчерпывающая задача
    // (template и/или другие параметры и так будут в ней обработаны)
    if (forParsed) {
      return forParsed;
    }

    // Если нет операторов, то тупо парсим template
    const templateParsed = (
      new TemplateParser({
        data: this.settings,
      })
    ).parse(ifParsed);

    if (templateParsed) {
      return templateParsed;
    }

    // Возвращаю результат
    return {
      data: {},
    };
  }

  /** Обработка обычного объекта */
  private parseDefault(
    input: InputInterface<ObjectInterface>,
  ): PripravaOperatorParseOutputInterface {
    const result: ObjectInterface = {};

    // Поиск и обработка вложенных объектов
    for (const [thisItemKey, thisItem] of Object.entries(input.data)) {

      // Содержимое может быть любым
      const subParsering = new Priprava({
        data: this.settings.scope,
        settings: {
          ...this.settings.initial,
          showStatus: false,
        },
      });

      const parsed = subParsering.parse({
        data: thisItem,
      });

      // Результат парсинга пуст
      if (!parsed) {
        continue;
      }

      // Заносим результат парсинга элемента
      result[thisItemKey] = parsed.data;
    }

    // Возвращаем результат парсинга массива
    return {
      data: result,
    };
  }
}
