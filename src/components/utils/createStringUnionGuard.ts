export default function createStringUnionGuard<const T extends readonly string[]>(values: T) {
  return (value: string | undefined): value is T[number] | undefined => value === undefined || values.includes(value);
}