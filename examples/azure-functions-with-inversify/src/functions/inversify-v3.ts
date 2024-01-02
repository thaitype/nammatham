import 'reflect-metadata';
import { interfaces, Container } from 'inversify';
import { DataService } from '../services/data';
import { Service } from '../services/service';
import { Tokens, Option } from '../constants';
import { container } from '../container';
import type { MergeDeep } from 'type-fest';

// https://stackoverflow.com/questions/54243431/how-can-i-produce-an-incremented-version-of-a-numeric-literal-type-in-typescript
type Increment<N extends number> = [
  1,
  2,
  3,
  4,
  5,
  ...number[] // bail out with number
][N];

type MapNumStr = {
  0: { '0': undefined };
  1: { '1': undefined };
  2: { '2': undefined };
  3: { '3': undefined };
  4: { '4': undefined };
} & Record<number, string>;

class Inversify<
  ParamCount extends number = 0,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Items extends Record<string, interfaces.ServiceIdentifier<unknown>> = {}
> {
  items: Items = {} as Items;

  constructor(private readonly container: Container) {}

  inject<OutputType>(serviceIdentifier: interfaces.ServiceIdentifier<OutputType>) {
    return {} as unknown as Inversify<
      Increment<ParamCount>,
      Items & {
        [K in keyof MapNumStr[ParamCount]]: interfaces.ServiceIdentifier<OutputType>;
      }
    >;
  }

  resolve<TReturn>(func: (...args: any[]) => any): TReturn {
    return func();
  }
}

const result = new Inversify(container)
  .inject<Option>(Tokens.Option)
  .inject<DataService>(DataService)
  .inject<Service>(Service);

type Result = typeof result.items;
/*

type Result = {
    '0': interfaces.ServiceIdentifier<Option>;
} & {
    '1': interfaces.ServiceIdentifier<DataService>;
} & {
    '2': interfaces.ServiceIdentifier<Service>;
}

*/

// FIXME: Can't get this to work

