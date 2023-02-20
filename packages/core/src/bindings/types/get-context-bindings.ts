import { ContextBindings } from '@azure/functions';
import { FunctionBinding } from '../interfaces/function-binding';
import { BindingType } from './binding';
import { Zipper } from '../../types';
import { Binding, DirectionType } from '../../main';

type GetTypeTuple<T extends readonly FunctionBinding<unknown>[]> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? [BindingType<Head['type']>, ...GetTypeTuple<Tail>]
      : []
    : []
  : [];

type GetNameTuple<T extends readonly FunctionBinding<unknown>[]> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? [Head['name'], ...GetNameTuple<Tail>]
      : []
    : []
  : [];

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
  Binding.http_withReturn(),
  Binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
  Binding.cosmosDBTrigger_v2({
    name: 'document_trigger_v2' as const,
    collectionName: '',
    connection: '',
    connectionStringSetting: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDBTrigger_v4({
    name: 'document_trigger_v4' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDBTrigger({
    name: 'document_trigger_default' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDB_output_v2({
    name: 'document_output_v2' as const,
    collectionName: '',
    connectionStringSetting: '',
    createIfNotExists: true,
    databaseName: '',
  }),
  Binding.cosmosDB_output_v4({
    name: 'document_output_v4' as const,
    createIfNotExists: true,
    databaseName: '',
    connection: '',
    containerName: '',
  }),
  Binding.cosmosDB_output({
    name: 'document_output_default' as const,
    createIfNotExists: true,
    databaseName: '',
    connection: '',
    containerName: '',
  }),
  Binding.cosmosDB_input_v2({
    name: 'document_input_v2' as const,
    collectionName: '',
    connectionStringSetting: '',
    databaseName: '',
    id: '',
    partitionKey: '',
    sqlQuery: '',
  }),
  Binding.cosmosDB_input_v4({
    name: 'document_input_v4' as const,
    databaseName: '',
    id: '',
    partitionKey: '',
    sqlQuery: '',
    connection: '',
    containerName: '',
  }),
  Binding.cosmosDB_input({
    name: 'document_input_default' as const,
    databaseName: '',
    id: '',
    partitionKey: '',
    sqlQuery: '',
    connection: '',
    containerName: '',
  }),
] as const;

type FilterBindingsDirection<T extends readonly FunctionBinding<unknown>[], Direction extends DirectionType> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? Head['direction'] extends Direction
        ? [Head, ...FilterBindingsDirection<Tail, Direction>]
        : [...FilterBindingsDirection<Tail, Direction>]
      : []
    : []
  : [];

type A = FilterBindingsDirection<typeof bindings, 'out'>;
  // ^?
/**
 * `GetBindings`, extract type from `FunctionBinding<unknown>[]`
 */
export type GetBindings<T extends readonly FunctionBinding<unknown>[]> = ContextBindings &
  Zipper<GetNameTuple<T>, GetTypeTuple<T>>;

type B = GetBindings<FilterBindingsDirection<typeof bindings, 'out'>>;
  // ^?