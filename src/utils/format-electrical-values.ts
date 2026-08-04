export function formatElectricalValues(
  values: readonly number[],
  unit: "V" | "Hz",
): string {
  return `${values.join(" / ")} ${unit}`;
}
