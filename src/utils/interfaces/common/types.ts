
/** Объект. Лень каждый раз писать это */
export interface SimpleObjectInterface {
  [key: string]: unknown;
  [key: number]: unknown;
}

/** Текст может состоять из букв и цифр */
export type TextInterface = string | number;

/** Один элемент или несколько - не важно */
export type CastArrayInterface<T> = T | Array<T>;

/** Рекурсивный `Partial` */
export type PartialDeep<T> = {
  [ P in keyof T ]?: PartialDeep<T[ P ]>;
};
