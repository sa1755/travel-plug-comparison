export const PLUG_TYPES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
] as const;

export const DEVICE_VOLTAGE_PROFILES = [
  "typically-dual-voltage",
  "check-device-label",
  "typically-single-voltage",
  "check-manufacturer-guidance",
] as const;

export const COMPATIBILITY_LEVELS = ["safe", "warning", "danger"] as const;

export const COMPARISON_ASPECTS = ["plug", "voltage", "frequency", "device"] as const;
