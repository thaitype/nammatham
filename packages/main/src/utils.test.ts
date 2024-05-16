import { describe, expect, test } from 'vitest';
import { pascalCase } from './utils';

describe('pascalCase', () => {
  test('converts undefined to an empty string', () => {
    expect(pascalCase(undefined)).toBe('');
  });
  test('converts a simple sentence to PascalCase', () => {
    expect(pascalCase('convert any string to pascal case')).toBe('ConvertAnyStringToPascalCase');
  });

  test('handles special characters correctly', () => {
    expect(pascalCase('convert_any string-to!pascal@case')).toBe('ConvertAnyStringToPascalCase');
  });

  test('handles a single word correctly', () => {
    expect(pascalCase('hello')).toBe('Hello');
  });

  test('handles an empty string correctly', () => {
    expect(pascalCase('')).toBe('');
  });

  test('handles multiple spaces correctly', () => {
    expect(pascalCase('  multiple   spaces  in  string  ')).toBe('MultipleSpacesInString');
  });

  test('handles numbers correctly', () => {
    expect(pascalCase('convert 123 number')).toBe('Convert123Number');
  });
});
