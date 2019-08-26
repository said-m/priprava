import { InputInterface } from 'iods';
import { cloneDeep, defaults } from 'lodash';
import { ObjectParser } from './parsers/types';
import { PRIPRAVA_SETTING_DEFAULTS } from './utils/constants/parser';
import { isArray, isPlainObject } from './utils/helpers';
import { SimpleObjectInterface } from './utils/interfaces/common';
import { PripravaInitInterface, PripravaInputSettingsInterface, PripravaParserOutputInterface } from './utils/interfaces/priprava';

/** Priprava - парсер динамических JSON-ов */
export default class Priprava {
  /** Переменные окружения */
  readonly store: SimpleObjectInterface;
  /** Опции */
  readonly settings: PripravaInputSettingsInterface;

  /** Инициализация парсера */
  constructor(
    {
      data,
      settings,
    }: PripravaInitInterface,
  ) {
    this.store = cloneDeep(data);
    this.settings = defaults(
      cloneDeep(settings),
      PRIPRAVA_SETTING_DEFAULTS,
    );

    this.status(0);
  }

  // PUBLIC

  /** Функция парсинга */
  parse(
    {
      /** Шаблон */
      data: originData,
    }: InputInterface,
  ): PripravaParserOutputInterface {
    const data = cloneDeep(originData);

    // Обработка объектов
    if (isPlainObject(data)) {
      return this.parseObject({
        data,
      });
    }

    // Обработка массивов
    if (isArray(data)) {
      return this.parseArray({
        data,
      });
    }

    this.status(1);

    // Что-то другое
    return {
      data,
      settings: {},
    };
  }

  // PRIVATE

  /** Финальная обработка результатов парсинга `Object` */
  private parseObject(
    {
      data,
    }: InputInterface<SimpleObjectInterface>,
  ): PripravaParserOutputInterface {
    const parsed = (
      new ObjectParser({
        data: {
          scope: this.store,
          initial: this.settings,
        },
      })
    ).parse({
      data,
    });

    // Парсинг не дал результатов
    if (!parsed) {
      this.status(2);

      return;
    }

    // Если объект объявления массива,
    // то возвращаемый массив нужно раскрыть
    if (isArray(parsed.data)) {
      return {
        data: parsed.data,
        settings: {
          isFlatten: true,
        },
      };
    }

    this.status(1);

    // Возвращаем результат парсинга
    return {
      data: parsed.data,
      settings: {},
    };
  }

  /** Финальная обработка результатов парсинга `Array` */
  private parseArray(
    {
      data,
    }: InputInterface<Array<unknown>>,
  ): PripravaParserOutputInterface {
    const result: Array<unknown> = [];

    // Обработка каждого элемента массива
    for (const thisDataItem of data) {
      const parsed = this.parse({ data: thisDataItem });

      // Парсинг не дал результатов для текущего элемента
      if (!parsed) {
        this.status(2);

        continue;
      }

      // Если объект - объявления массива,
      // то возвращаемый массив нужно раскрыть
      if (
        isArray(parsed.data) &&
        parsed.settings.isFlatten
      ) {
        result.push(...parsed.data);
      // Иначе, просто кладём в массив
      } else {
        result.push(parsed.data);
      }
    }

    this.status(1);

    // Возвращаем результат парсинга
    return {
      data: result,
      settings: {},
    };
  }

  /** Вывод сообщений прогресса */
  private status(code: number): void {
    if (this.settings.showStatus === true) {
      switch (code) {
        case 0:
          console.info('Priprava has been initialized!');
          break;
        case 1:
          console.info('Priprava has finished job!');
          break;
        case 2:
          console.info('Priprava says: "Nothing Makes Sense Anymore!"');
          break;
        default:
          console.warn('Priprava: undefined status code');
          break;
      }
    }
  }
}
