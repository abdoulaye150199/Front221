export function hasTextValue(value: string | null | undefined): boolean {
  return `${value ?? ''}`.trim().length > 0;
}

export function hasRequiredTextValues(...values: Array<string | null | undefined>): boolean {
  return values.every(hasTextValue);
}

export function parseAllowedNumberOption(
  value: string | number,
  allowedValues: readonly number[]
): number | null {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue) || !allowedValues.includes(parsedValue)) {
    return null;
  }

  return parsedValue;
}
