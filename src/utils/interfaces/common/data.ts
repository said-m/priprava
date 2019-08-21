
/** Входные параметры методов и функций */
export type InputInterface<
  Data = unknown,
  Settings = undefined
> = Settings extends undefined  // проверка наличия Опции
? {
  /** Входные данные */
  data: Data;
}
: {
  /** Входные данные */
  data: Data;
  /** Опции */
  settings: Settings;
};

/** Выходные параметры методов и функций */
export type OutputInterface<
  Data = unknown,
  Settings = undefined
> = Settings extends undefined
? InputInterface<Data>
: InputInterface<Data, Settings>;
