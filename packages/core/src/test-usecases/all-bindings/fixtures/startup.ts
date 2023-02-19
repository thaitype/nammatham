import 'reflect-metadata';
import { NammathamApp } from '../../../main';
import { AllBindingsFunction } from './functions/all-bindings.function';

export const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(AllBindingsFunction);

builder.build();

export default builder.getApp();
