import { SimpleObjectInterface } from './types';

/** Расширение интерфейса всех объектов внутри объекта */
export type ApplyDeepInterface<RootObject, ExtendObject> = RootObject extends Array<infer U>
// если массив
? ApplyDeepArrayInterface<U, ExtendObject>
// не массив
: (
  RootObject extends SimpleObjectInterface
  // если объект
  ? (
    Partial<ExtendObject> & {
      [RootKey in keyof RootObject]: ApplyDeepInterface<RootObject[RootKey], ExtendObject>
    }
  )
  // если не массив и не объект
  : RootObject
);

/** Расширение интерфейса всех объектов внутри массива из объектов */
interface ApplyDeepArrayInterface<Extendable, Addend>
extends Array<ApplyDeepInterface<Extendable, Addend>> {}
