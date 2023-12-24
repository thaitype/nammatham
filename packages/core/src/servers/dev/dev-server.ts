export interface DevServerOption {
  port: number;
}
export function devServer(option: DevServerOption) {
  console.log(`Starting dev server on port ${option.port}`);
}
