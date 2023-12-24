// TODO: Move to nammatham/dev-server, @see example: https://github.com/total-typescript/ts-reset/blob/main/package.json

export interface DevServerOption {
  port: number;
}

export function devServer(option: DevServerOption) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  console.log('Starting dev server on port', option.port);
}
