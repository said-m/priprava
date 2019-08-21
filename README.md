# Priprava

Шаблонизатор, позволяющий описывать JSON-ы с динамическим данными, подставляемыми в рантайме, путём описания специальных параметров.

## Навигация

> [EN documentation](https://bit.ly/18gECvy) or [en](#english)

* [Геттинг Стартед](#Геттинг-Стартед)
  * [Установка](#Установка)
  * [Пример использования](#Пример-использования)
  * [Параметры](#Параметры)
    * [Настройки парсера](#Настройки-парсера)
    * [Инпут-Аутпут Дата-Сеттингс (IO-DS)](#Инпут-Аутпут-Дата-Сеттингс-IO-DS)
      * [Исключения](#Исключения)
  * [Кейс применения](#Кейс-применения)
* [Версионирование](#Версионирование)
* [Автор](#Автор)
* [Лицензия](#Лицензия)

## Геттинг Стартед

### Установка

```
yarn add priprava
```

### Пример использования

<details>
  <summary>
    <span id="template-json">template.json</span>
    - Описание объекта
    // <i>(раскрыть/закрыть)</i>
  </summary>

  ```json
  {
    "content": [
      {
        "component": "title",
        "content": {
          "$temp": true,
          "template": "${ title }"
        }
      },
      {
        "$temp": true,
        "for": {
          "item": "thisText",
          "mode": "of",
          "data": "text"
        },
        "template": {
          "component": "text",
          "content": {
            "$temp": true,
            "template": "${ thisText }"
          }
        }
      },
      {
        "component": "list",
        "content": {
          "$temp": true,
          "for": {
            "item": "thisItem",
            "mode": "of",
            "data": "list"
          },
          "template": "${ thisItem }"
        }
      },
      {
        "component": "input",
        "content": {
          "title": "Заголовок поля",
          "text": {
            "$temp": true,
            "template": "${ input }"
          },
          "description": "Дополнительное описание"
        }
      }
    ]
  }
  ```
</details>

<details>
  <summary>
    <span id="data-json">data.json</span>
    - Динамические данные
    // <i>(раскрыть/закрыть)</i>
  </summary>

  ```json
  {
    "title": "Пример объекта, который должен сформировать класс.",
    "text": [
      "Это описание компоненты текста.",
      "Полагаю, таких параграфов может быть несколько, поэтому необходимо это всё описывать циклом.",
      "А в объекте ниже - списке, необходимо массив формировать прям во внутрь описания."
    ],
    "list": [
      "Элемент списка 1",
      "Элемент списка 2",
      "...",
      "Тут ещё может быть куча элементов"
    ],
    "input": "Текст поля"
  }
  ```
</details>

<details>
  <summary>
    <span id="settings-ts">settings.ts</span>
    - Параметры парсера
    // <i>(раскрыть/закрыть)</i>
  </summary>

  ```ts
  export const settings: PripravaInputSettingsInterface = {
    mode: {
      default: PripravaModesEnum.ignore,
      if: PripravaModesEnum.inherit,
      for: PripravaModesEnum.break,
      template: PripravaModesEnum.inherit,
    },
    interpolation: /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
    showStatus: false,
  };
  ```
</details>

<span id="usage-code"></span>
```ts
import Priprava from 'priprava';
import template from './template.json';
import data from './data.json';
import settings from './settings';

const priprava = new Priprava({
  data,
  settings,
});

const parsed = priprava.parse({
  data: template,
});

if (!parsed) {  // undefined
  console.log('Результат парсинга - ничего');
}

console.log(parsed);  // см. в пример результата
```

<details>
  <summary>
    <span id="parsed-result">parsed<span>
    - Результат парсинга
    // <i>(раскрыть/закрыть)</i>
  </summary>

  ```js
  {
    content: [
      {
        component: 'title',
        content: 'Пример объекта, который должен сформировать класс.',
      },
      {
        component: 'text',
        content: 'Это описание компоненты текста.',
      },
      {
        component: 'text',
        content: 'Полагаю, таких параграфов может быть несколько, '
        + 'поэтому необходимо это всё описывать циклом.',
      },
      {
        component: 'text',
        content: 'А в объекте ниже - списке, '
        + 'необходимо массив формировать прям во внутрь описания.',
      },
      {
        component: 'list',
        content: [
          'Элемент списка 1',
          'Элемент списка 2',
          '...',
          'Тут ещё может быть куча элементов',
        ],
      },
      {
        component: 'input',
        content: {
          title: 'Заголовок поля',
          text: 'Текст поля',
          description: 'Дополнительное описание',
        },
      },
    ],
  }
  ```
</details>

### Параметры

#### Настройки парсера

* **`mode`** - Режимы работы парсера*
  * **`default`** - общий режим \
    *по умолчанию: `ignore`*
  * **`if`** - для оператора условий \
    *по умолчанию: `inherit`*
  * **`for`** - для оператора цикла \
    *по умолчанию: `break`*
  * **`template`** - для оператора шаблона \
    *по умолчанию: `inherit`*
* **`interpolation`** - RegExp интерполяции в строке шаблона \
  *по умолчанию: `/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g` - эт тип так будет: `'ES${ 3 + 3 } template strings'` -> `'ES6 template strings'`*
* **`showStatus`** - Вывод логов (их почти нет, а те что есть - бесполезные) \
  *по умолчанию: `false`*

> \* значения режимов задаются enum-ом `PripravaModesEnum`:
> * `ignore` - игнорирование исключительных ситуаций, "делаем, как можем";
> * `break` - переход к следующему объекту, "кладём на текущий";
> * `inherit` - наследование режима от `mode.default`.

#### Инпут-Аутпут Дата-Сеттингс (IO-DS)

Решил замутить свой паттерн, на основе RORO. Суть в том, что методы принимают и возвращают объект следующего вида:

<span id="io-ds"></span>
```ts
type InputInterface<
  Data = unknown,
  Settings = undefined
> = {
  /** Входные данные */
  data: Data;
  /** Опции */
  settings?: Settings;
};
```

Обязательность `settings` определяется передачей дженерику интерфейса `Settings` (2-ой).

##### Исключения

* Правило не распространяется на статичные методы;
* Методы могут возвращать `undefined`, вместо описанного объекта.

### Кейс применения

Имеем 2 сервиса. Один из них получает данные от второго, маппит их определённым образом, а затем над результатом какие-то дополнительные операции. А теперь представим, что второй сервис чутка меняет структуру данных.
Если маппинг реализован на современного ES или TS, то для правильной работы первого сервиса потребуется сбилдить новую версию с обновлённым маппигом. Ибо в проде спецификация ES не последних лет, компиляция и всё такое.
Если же юзать JSON-ы для того, чтобы маппить данные, то достаточно будет в него внести соответствующие правки, после чего замаунтить в контейнер первого сервиса.
> А может случиться так, что на каком-то серваке нужен первый сервис старой версии, тогда при маппинге в .js/.ts потребуется внесение обновлений в старую версию, так и в свежую.

## Версионирование

Соблюдение [SemVer](http://semver.org/) не гарантируется, однако постараюсь.

> Сорс, так-то, открытый, а вот полную гит-историю никто не обещал. Сорри.

## Автор

* Саид Магомедов - [Said-M][github] // [vk](https://vk.com/id266788473)

Если у кого-то возникнет желание поконтрибьютить немного - welcome.

## Лицензия

Данный проект распространяется по **MIT License** - текст лицензии можно найти в файле [LICENSE](LICENSE).

---

## ENglish

Template engine for describing JSON with dynamic data.

### Getting Started

#### Installation

```
yarn add priprava
```

#### Usage

* [Template](#template-json)
* [Dynamic data](#data-json)
* [Parser settings](#settings-ts)
* [Usage example](#usage-code)
* [Results](#parsed-result)

#### Receive-Return

My own pattern is used - IO-DS, based on RORO. Methods receives and returns [object](#io-ds). \
The rule does not apply to:
  * `static` methods;
  * `undefined` can be returned.

### Author

* Said Magomedov - [Said-M][github]

### License

This project is licensed under the [MIT License](LICENSE).

[github]: https://github.com/Said-M
