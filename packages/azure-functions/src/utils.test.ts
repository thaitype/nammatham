import { expect, test, describe } from 'vitest';
import * as utils from './utils';
describe(`Test utils: ${utils.getMethods.name}`, () => {
  test(`${utils.getMethods.name} should parsed to uppercase array`, async () => {
    // Arrange
    const func = {
      endpointOption: {
        type: 'http',
        methods: ['get', 'post', 'put', 'delete'],
      },
    } as any;

    // Act
    const result = utils.getMethods(func);

    // Assert
    expect(result).toEqual(['GET', 'POST', 'PUT', 'DELETE']);
  });

  test(`${utils.getMethods.name} should return empty array if methods is not defined`, async () => {
    // Arrange
    const func = {
      endpointOption: {
        type: 'http',
      },
    } as any;

    // Act
    const result = utils.getMethods(func);

    // Assert
    expect(result).toEqual([]);
  });
});

describe(`Test utils: ${utils.getFullUrl.name}`, () => {
  test(`${utils.getFullUrl.name} should return full url`, async () => {
    // Arrange
    const func = {
      endpointOption: {
        route: 'test',
      },
    } as any;

    // Act
    const result = utils.getFullUrl(func, 'localhost', 3000);

    // Assert
    expect(result).toEqual('http://localhost:3000/api/test');
  });

  test(`${utils.getFullUrl.name} should return full url with prefix slash in route`, async () => {
    // Arrange
    const func = {
      endpointOption: {
        route: '/test',
      },
    } as any;

    // Act
    const result = utils.getFullUrl(func, 'localhost', 3000);

    // Assert
    expect(result).toEqual('http://localhost:3000/api/test');
  });

  test(`${utils.getFullUrl.name} should return empty string if route is not defined`, async () => {
    // Arrange
    const func = {
      endpointOption: {},
    } as any;

    // Act
    const result = utils.getFullUrl(func, '', 3000);

    // Assert
    expect(result).toEqual('');
  });
});

describe(`Test utils: ${utils.delay.name}`, () => {
  test(`${utils.delay.name} should delay`, async () => {
    // Arrange
    const start = Date.now();

    // Act
    await utils.delay(10);

    // Assert
    expect(Date.now() - start).toBeGreaterThanOrEqual(10);
  });
});

describe(`Test utils: ${utils.printRegisteredFunctions.name}`, () => {
  test(`${utils.printRegisteredFunctions.name} should print functions`, async () => {
    // Arrange
    const app = {
      functions: [
        {
          type: 'azure-functions',
          name: 'test',
          endpointOption: {
            type: 'http',
            route: 'test',
            methods: ['get', 'post', 'put', 'delete'],
          },
        },
        {
          type: 'azure-functions',
          name: 'test2',
          endpointOption: {
            type: 'timer',
            route: 'test2',
            methods: ['get', 'post', 'put', 'delete'],
          },
        },
      ],
    } as any;
    const option = {
      port: 3000,
    } as any;

    // Act
    const result = await utils.printRegisteredFunctions(app, option);

    // Assert
    expect(result).toEqual(app.functions.filter((func: any) => func?.endpointOption?.type === 'http'));
  });

  test(`${utils.printRegisteredFunctions.name} should not print functions if there is no function`, async () => {
    // Arrange
    const app = {
      functions: [],
    } as any;
    const option = {
      port: 3000,
    } as any;

    // Act
    const result = await utils.printRegisteredFunctions(app, option);

    // Assert
    expect(result).toEqual([]);
  });
});

describe(`Test utils: ${utils.printRegisteredNonHttpFunctions.name}`, () => {
  test(`${utils.printRegisteredNonHttpFunctions.name} should print functions`, async () => {
    // Arrange
    const app = {
      functions: [
        {
          type: 'azure-functions',
          name: 'test',
          endpointOption: {
            type: 'http',
            route: 'test',
            methods: ['get', 'post', 'put', 'delete'],
          },
        },
        {
          type: 'azure-functions',
          name: 'test2',
          endpointOption: {
            type: 'timer',
            route: 'test2',
            methods: ['get', 'post', 'put', 'delete'],
          },
        },
      ],
    } as any;
    const option = {
      port: 3000,
    } as any;

    // Act
    const result = await utils.printRegisteredNonHttpFunctions(app, option);

    // Assert
    expect(result).toEqual(app.functions.filter((func: any) => func?.endpointOption?.type !== 'http'));
  });

  test(`${utils.printRegisteredNonHttpFunctions.name} should not print functions if there is no function`, async () => {
    // Arrange
    const app = {
      functions: [],
    } as any;
    const option = {
      port: 3000,
    } as any;

    // Act
    const result = await utils.printRegisteredNonHttpFunctions(app, option);

    // Assert
    expect(result).toEqual([]);
  });
});
