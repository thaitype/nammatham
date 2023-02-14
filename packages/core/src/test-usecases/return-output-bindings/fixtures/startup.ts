import 'reflect-metadata';
import { NammathamApp } from '../../../main';
import { ReturnHttpResponseFunction } from './functions/return-http-response.function';

export const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(ReturnHttpResponseFunction);

builder.build();

export default builder.getApp();
