import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { CopyBlobFunction } from './functions/copy-blob.function';

const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(CopyBlobFunction);
builder.build();

export default builder.getApp();
