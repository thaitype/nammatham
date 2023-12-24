export interface DevServerOption {
  port: number;
}
export function devServer(option: DevServerOption) {
  if (process.env.NODE_ENV !== 'development') {
    console.debug('Not in development mode, skip starting dev server');
    return;
  }
  console.log(`Starting dev server on port ${option.port}`);
}
