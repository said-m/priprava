
/** Объявление цикла */
export interface PripravaForDescriptionInterface {
  /** Параметр описания цикла */
  for: PripravaForOperatorInterface;
}

/** Оператор цикла */
export interface PripravaForOperatorInterface {
  /** Название для итерируемого значение */
  item: string;
  /** Тип цика */
  mode: 'in' | 'of';
  /** Путь до данных в сторе */
  data: string;
}
