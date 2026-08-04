import type {
  ComparisonResult,
  CompatibilityLevel,
  DeviceComparison,
  DeviceProfile,
  FrequencyComparison,
  PlugComparison,
  PlugType,
  VoltageComparison,
} from "@/types";

interface CountryElectricalProfile {
  readonly code: string;
  readonly plugTypes: readonly PlugType[];
  readonly voltages: readonly number[];
  readonly frequencies: readonly number[];
}

interface DeviceElectricalProfile {
  readonly id: string;
  readonly name: string;
  readonly voltageProfile: DeviceProfile["voltageProfile"];
  readonly highPower: boolean;
  readonly guidance: string;
}

const PLUG_SOCKET_COMPATIBILITY: Readonly<Record<PlugType, readonly PlugType[]>> = {
  A: ["A", "B"],
  B: ["B"],
  C: ["C", "E", "F", "H", "J", "K", "L", "N", "O"],
  D: ["D"],
  E: ["E", "F"],
  F: ["E", "F"],
  G: ["G"],
  H: ["H"],
  I: ["I"],
  J: ["J"],
  K: ["K"],
  L: ["L"],
  M: ["M"],
  N: ["N"],
  O: ["O"],
};

const levelRank: Readonly<Record<CompatibilityLevel, number>> = {
  safe: 0,
  warning: 1,
  danger: 2,
};

const highestLevel = (levels: readonly CompatibilityLevel[]): CompatibilityLevel =>
  levels.reduce((highest, level) =>
    levelRank[level] > levelRank[highest] ? level : highest,
  );

const intersection = <Value>(left: readonly Value[], right: readonly Value[]) => {
  const rightValues = new Set(right);
  return left.filter((value) => rightValues.has(value));
};

const voltageBand = (voltage: number): "low" | "high" | "other" => {
  if (voltage >= 100 && voltage <= 127) return "low";
  if (voltage >= 220 && voltage <= 240) return "high";
  return "other";
};

const formatValues = (values: readonly number[], unit: "V" | "Hz") =>
  values.map((value) => `${value} ${unit}`).join(" or ");

export function comparePlugCompatibility(
  originPlugTypes: readonly PlugType[],
  destinationPlugTypes: readonly PlugType[],
): PlugComparison {
  const destinationSockets = new Set(destinationPlugTypes);
  const compatibleOriginPlugTypes = originPlugTypes.filter((originType) =>
    PLUG_SOCKET_COMPATIBILITY[originType].some((socketType) =>
      destinationSockets.has(socketType),
    ),
  );

  if (compatibleOriginPlugTypes.length === originPlugTypes.length) {
    return {
      aspect: "plug",
      status: "not-required",
      level: "safe",
      title: "Your plugs should fit",
      summary: "The plug types used at home are supported by sockets at your destination.",
      originPlugTypes,
      destinationPlugTypes,
      compatibleOriginPlugTypes,
    };
  }

  if (compatibleOriginPlugTypes.length > 0) {
    return {
      aspect: "plug",
      status: "check-specific-plug",
      level: "warning",
      title: "Check the plug on each device",
      summary: "Some home plug types should fit, but others will need a travel adapter.",
      originPlugTypes,
      destinationPlugTypes,
      compatibleOriginPlugTypes,
    };
  }

  return {
    aspect: "plug",
    status: "required",
    level: "warning",
    title: "A plug adapter is required",
    summary: "Your home plug types do not fit the socket types at your destination.",
    originPlugTypes,
    destinationPlugTypes,
    compatibleOriginPlugTypes,
  };
}

export function compareVoltage(
  originVoltages: readonly number[],
  destinationVoltages: readonly number[],
): VoltageComparison {
  const sharedVoltages = intersection(originVoltages, destinationVoltages);

  if (destinationVoltages.length > 1) {
    return {
      aspect: "voltage",
      status: "variable-destination",
      level: "warning",
      title: "Confirm the voltage at your accommodation",
      summary: `The destination uses more than one nominal supply (${formatValues(destinationVoltages, "V")}).`,
      originVoltages,
      destinationVoltages,
      sharedVoltages,
    };
  }

  if (sharedVoltages.length > 0) {
    return {
      aspect: "voltage",
      status: "same",
      level: "safe",
      title: "The nominal voltage matches",
      summary: `Both locations use ${sharedVoltages.map((value) => `${value} V`).join(" or ")}.`,
      originVoltages,
      destinationVoltages,
      sharedVoltages,
    };
  }

  const originBands = new Set(originVoltages.map(voltageBand));
  const sharesVoltageBand = destinationVoltages.some((voltage) =>
    originBands.has(voltageBand(voltage)),
  );

  if (sharesVoltageBand) {
    return {
      aspect: "voltage",
      status: "check-device",
      level: "warning",
      title: "The nominal voltage is similar, not identical",
      summary: `Check that each device label includes ${formatValues(destinationVoltages, "V")} before use.`,
      originVoltages,
      destinationVoltages,
      sharedVoltages,
    };
  }

  return {
    aspect: "voltage",
    status: "converter-may-be-required",
    level: "danger",
    title: "The voltage system is different",
    summary: `Your destination uses ${formatValues(destinationVoltages, "V")}. Single-voltage devices may need a suitable converter.`,
    originVoltages,
    destinationVoltages,
    sharedVoltages,
  };
}

export function compareFrequency(
  originFrequencies: readonly number[],
  destinationFrequencies: readonly number[],
): FrequencyComparison {
  const sharedFrequencies = intersection(originFrequencies, destinationFrequencies);

  if (destinationFrequencies.length > 1) {
    return {
      aspect: "frequency",
      status: "variable-destination",
      level: "warning",
      title: "Frequency varies by region",
      summary: `The destination uses ${formatValues(destinationFrequencies, "Hz")}. Check the device label and local supply.`,
      originFrequencies,
      destinationFrequencies,
      sharedFrequencies,
    };
  }

  if (sharedFrequencies.length > 0) {
    return {
      aspect: "frequency",
      status: "same",
      level: "safe",
      title: "The frequency matches",
      summary: `Both locations use ${sharedFrequencies.join("/ ")} Hz.`,
      originFrequencies,
      destinationFrequencies,
      sharedFrequencies,
    };
  }

  return {
    aspect: "frequency",
    status: "check-device",
    level: "warning",
    title: "The frequency is different",
    summary: `Check that each device supports ${formatValues(destinationFrequencies, "Hz")}, especially motors, clocks, and medical equipment.`,
    originFrequencies,
    destinationFrequencies,
    sharedFrequencies,
  };
}

export function compareDevice(
  device: DeviceElectricalProfile,
  voltage: VoltageComparison,
  frequency: FrequencyComparison,
): DeviceComparison {
  let level: CompatibilityLevel = "warning";
  let summary = "Check the exact device label before connecting it.";

  if (device.voltageProfile === "check-manufacturer-guidance") {
    summary = "Follow the manufacturer's travel guidance for this exact device.";
  } else if (voltage.status === "converter-may-be-required") {
    if (device.voltageProfile === "typically-dual-voltage") {
      summary = "It often supports both voltage systems, but the input label must confirm this.";
    } else {
      level = "danger";
      summary = device.highPower
        ? "Do not connect it unless its label supports the destination voltage; high-power devices need special care."
        : "It may need a voltage converter unless its input label supports the destination voltage.";
    }
  } else if (
    voltage.status === "same" &&
    frequency.status === "same" &&
    device.voltageProfile !== "check-device-label"
  ) {
    level = "safe";
    summary = "The nominal supply matches, but confirm the device rating label before use.";
  } else if (device.voltageProfile === "typically-dual-voltage") {
    summary = "It commonly supports a broad input range; confirm the range on its label.";
  }

  return {
    aspect: "device",
    deviceId: device.id,
    deviceName: device.name,
    level,
    title: level === "danger" ? "Extra equipment may be needed" : "Check before you pack",
    summary,
    guidance: device.guidance,
  };
}

export function compareCountries(
  origin: CountryElectricalProfile,
  destination: CountryElectricalProfile,
  devices: readonly DeviceElectricalProfile[] = [],
): ComparisonResult {
  const plug = comparePlugCompatibility(origin.plugTypes, destination.plugTypes);
  const voltage = compareVoltage(origin.voltages, destination.voltages);
  const frequency = compareFrequency(origin.frequencies, destination.frequencies);
  const deviceResults = devices.map((device) => compareDevice(device, voltage, frequency));
  const level = highestLevel([plug.level, voltage.level, frequency.level]);

  const summary =
    level === "danger"
      ? `${plug.title}. The voltage systems differ, so check every device before use.`
      : level === "warning"
        ? `${plug.title}. Review the voltage and frequency notes before you travel.`
        : "The plug and nominal power standards align. Check each device label before use.";

  return {
    fromCountryCode: origin.code,
    toCountryCode: destination.code,
    level,
    summary,
    plug,
    voltage,
    frequency,
    devices: deviceResults,
  };
}
