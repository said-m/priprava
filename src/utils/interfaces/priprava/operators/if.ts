
/** Объявление условия */
export interface PripravaIfDescriptionInterface {
  /** Параметр описания условия */
  if: PripravaIfOperatorInterface;
}

/** Оператор условия */
export type PripravaIfOperatorInterface = string | boolean;
