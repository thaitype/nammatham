export function pascalCase(str: string | undefined): string {
  if (str === undefined) {
    return '';
  }
  return str
    .split(/[^a-zA-Z0-9]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
