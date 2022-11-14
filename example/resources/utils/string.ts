export function getFirstChar(string: string): string {
  return string.charAt(0);
}

export function capitalize(string: string): string {
  return getFirstChar(string).toUpperCase() + string.slice(1);
}

export function clsx(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ");
}
