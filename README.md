# Priprava

Шаблонизатор, позволяющий описывать JSON-ы с динамическим данными, подставляемыми в рантайме, путём описания специальных параметров.

[![npm version](https://badge.fury.io/js/priprava.svg)](https://npmjs.com/package/priprava)
[![Build Status](https://travis-ci.com/said-m/priprava.svg?branch=master)](https://travis-ci.com/said-m/priprava)
[![Coverage Status](https://coveralls.io/repos/github/said-m/priprava/badge.svg?branch=master)](https://coveralls.io/github/said-m/priprava?branch=master)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![npm type definitions](https://img.shields.io/npm/types/priprava)](http://www.typescriptlang.org/)
[![npm license](https://img.shields.io/npm/l/priprava)](LICENSE)

> [EN documentation](https://bit.ly/18gECvy) or [en](#english)

## Навигация

<img align="right" src="./assets/priprava.svg" width="130">

* [Геттинг Стартед](#Геттинг-Стартед)
  * [Установка](#Установка)
  * [Пример использования](#Пример-использования)
  * [Параметры](#Параметры)
    * [Инициализация](#Инициализация)
    * [Операторы](#Операторы)
      * [Объявление](#Объявление)
      * [Условия](#Условия)
      * [Циклы](#Циклы)
      * [Шаблоны](#Шаблоны)
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
          "template": "${ title }",
        },
      },
      {
        "$temp": true,
        "if": "promo.has",
        "template": {
          "component": "promo",
          "content": {
            "$temp": true,
            "template": "Осторожно, продакт-плейсмент: ${ promo.text }",
          },
        },
      },
      "В объектах ниже меняется только строка. Вывод, шаблонизируем его.",
      {
        "$temp": true,
        "for": {
          "item": "thisText",
          "mode": "of",
          "data": "text",
        },
        "template": {
          "component": "text",
          "content": {
            "$temp": true,
            "template": "${ thisText }",
          },
        },
      },
      "Сформировать массив - мало, хочется организовать условия на его содержимое!",
      {
        "component": "list",
        "content": {
          "$temp": true,
          "for": {
            "item": "thisItem",
            "mode": "of",
            "data": "list",
          },
          "template": {
            "$temp": true,
            "if": "thisItem.length <= 70",
            "template": "${ thisItem }",
          },
        },
      },
      {
        "component": "input",
        "content": {
          "title": "Заголовок поля",
          "text": {
            "$temp": true,
            "template": "\"${ input }\" - интерполяция в строках в деле!",
          },
          "description": "Дополнительное описание",
        },
      },
    ],
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
    "promo": {
      "has": true,
      "text": "Сомневаетесь? Даже повара согласны, что priprava - это клёво!",
    },
    "text": [
      "Это описание компоненты текста.",
      "Полагаю, таких параграфов может быть несколько, поэтому необходимо это всё описывать циклом.",
      "А в объекте ниже - списке, необходимо массив формировать прям во внутрь описания."
    ],
    "list": [
      "Элемент списка 1",
      "Элемент списка 2",
      "...",
      "Тут ещё может быть куча элементов",
      "А эта строка не будет выведена, так как длина текста превышает описанные в шаблоне условия."
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
import { settings } from './settings';

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

console.log(parsed.data);  // см. в пример результата
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
        component: 'promo',
        content: "Осторожно, продакт-плейсмент: Сомневаетесь? Даже повара согласны, что priprava - это клёво!",
      },
      'В объектах ниже меняется только строка. Вывод, шаблонизируем его.',
      {
        component: 'text',
        content: 'Это описание компоненты текста.',
      },
      {
        component: 'text',
        content: 'Полагаю, таких параграфов может быть несколько, поэтому необходимо это всё описывать циклом.',
      },
      {
        component: 'text',
        content: 'А в объекте ниже - списке, необходимо массив формировать прям во внутрь описания.',
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
          text: '"Текст поля" - интерполяция в строках в деле!',
          description: 'Дополнительное описание',
        },
      },
    ],
  }
  ```
</details>

### Параметры

#### Инициализация

```ts
// ... - объявление всех данные.

const priprava = new Priprava({
  data,
  settings,
});

// ...
```

* `data` - стор (хранилище), `object` со всеми динамическими данными;
* `settings` - [настройки парсера](#Настройки-парсера).

У `Priprava` имеется публичный метод `parse`, которому нужно передать шаблон, требующий обработки:

```ts
// продолжение листинга выше:

const parsed = priprava.parse({
  data: template
});

// ... - дальнейшие действия с результатом.
```

Шаблонами могут являться данные любого типа. Либо парсер сможет найти в них шаблонизацию, либо не сможет. Конечно же, логичнее всего отправлять туда что-то интерфейса `[key: string]: any`, чтобы в парсинге был смысл.

В случае безрезультатной обработки - вернётся `undefined`. Если не получится найти шаблонизацию в данных, то они будут возращены в том виде, в котором были отосланы, как успешная обработка.

> [Про интерфейс данных, с которым работают все методы Priprava.](#Инпут-Аутпут-Дата-Сеттингс-IO-DS)

Распарсенный шаблон следует искать в `data` результата. Ссылочка выше - не просто так.

#### Операторы

##### Объявление
> `$temp` = `boolean`

Флаг (`true`, `false` - не важно), указывающий парсеру на то, что данный объект является объектом шаблонизации.

Интерфейс: [`PripravaDescriptionInterface`](src/utils/interfaces/priprava/parser.ts)

Шаблонизация без шаблона - глупость, поэтому для объявления обязателен оператор [`template`](#Шаблоны).

<span id="example-object"></span>
<details>
  <summary>Пример</summary>

  ```json
  {
    "$temp": true,
    "template": "# ${ title }"
  }
  ```
</details>

##### Условия
> `if` = `string` | `boolean`

Интерфейс: [`PripravaIfOperatorInterface`](src/utils/interfaces/priprava/operators/if.ts)

Строка интерполируется по умолчанию, т.е. исполняется целиком.

<span id="example-if"></span>
<details>
  <summary>Пример</summary>

  ```json
  {
    "$temp": true,
    "if": "isPromo",
    "template": "Реклама: ${ ad }"
  }
  ```
</details>

##### Циклы
> `for` = { `item`, `mode`, `data` }

Интерфейс: [`PripravaForOperatorInterface`](src/utils/interfaces/priprava/operators/for.ts)

* `item` = `string`;
* `mode` = `"in"` | `"of"`;
* `data` = `string`;

> `item` - название переменной итерируемого значения, \
`mode` - режим итерации, типа `for...in` или `for...of`, \
`data` - ключ итерируемого объекта в сторе.

<span id="example-for"></span>
<details>
  <summary>Пример</summary>

  ```json
  {
    "$temp": true,
    "for": {
      "item": "thisArticle",
      "mode": "of",
      "data": "articles"
    },
    "template": "## ${ thisArticle.title }",
  }
  ```
</details>

##### Шаблоны
> `template` = `string` | `object`

Интерфейс: [`PripravaTemplateInterface`](src/utils/interfaces/priprava/parser.ts)

По умолчанию, интерполяция строки осуществляется по формату [шаблонных строк ES6](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings) - `${...}`. Однако, если вам хочется что-то другое, например Angular-овская интерполяция - `{{...}}`, то в [настройках парсера](#Настройки-парсера) можно задать кастомное регулярное выражение, пример: `/{{([\s\S]+?)}}/g`.

<span id="example-template"></span>
<details>
  <summary>Пример</summary>

  ```json
  {
    "$temp": true,
    "template": "ES${ 3 + 3 } template string"
  }
  ```
</details>

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

Соблюдение [SemVer](http://semver.org/) не гарантируется, однако постараюсь. Но лучше фиксируйте версию.

> Сорс, так-то, открытый, а вот полную гит-историю никто не обещал. Сорри. На GitHub-е с версии [0.4.1](https://github.com/said-m/priprava/commit/e5e4c44375f4a3c774ccb4e59cb15918a5cc8fff). История до того - в [GitLab](http://gitlab.com)-е.

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

#### Defining

* [Priprava-object](#example-object)
* [If-operator](#example-if)
* [For-operator](#example-for)
* [Template](#example-template)

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
