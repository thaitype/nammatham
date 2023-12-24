// TODO: Move to @nammatham/dev-server

export class DevServer {
  constructor() {
    console.log('DevServer constructor');
  }

  addFunction() {
    console.log('addFunction');
    return this;
  }

//   addFunctionsFromPath(path: string) {
//     console.log('addFunctionsFromPath', path);
//     return this;
//   }

//   addFunctionsFromPaths(paths: string[]) {
//     for (const path of paths) {
//       this.addFunctionsFromPath(path);
//     }
//     return this;
//   }

  start() {
    console.log('start');
  }
}

export function initDevServer() {
  console.log('initDevServer');
  return new DevServer();
}
