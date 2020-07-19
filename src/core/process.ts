// eslint-disable-next-line
declare var process: any;

export function isRendererProcess(): boolean {
  return process != null && process.type === 'renderer';
}
