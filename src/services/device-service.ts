import devicesJson from "@/data/devices.json";
import { deviceProfilesSchema } from "@/lib/schemas";
import type { DeviceProfile } from "@/types";
import { deepFreeze, type DeepReadonly } from "@/utils/deep-freeze";
import { normalizeSearchTerm } from "@/utils/normalize-search-term";

export type DeviceRecord = DeepReadonly<DeviceProfile>;

const devices = deepFreeze(deviceProfilesSchema.parse(devicesJson));

const FEATURED_DEVICE_IDS = [
  "phone-charger",
  "laptop",
  "smartwatch",
  "camera-charger",
  "electric-toothbrush",
  "hair-dryer",
  "hair-straightener",
  "gaming-console",
] as const;

export function getDeviceProfiles(): readonly DeviceRecord[] {
  return devices;
}

export function getFeaturedDeviceProfiles(): readonly DeviceRecord[] {
  return FEATURED_DEVICE_IDS.map((id) => requireDeviceProfile(id));
}

export function getDeviceProfile(id: string): DeviceRecord | undefined {
  const normalizedId = normalizeSearchTerm(id);
  return devices.find((device) => device.id === normalizedId);
}

export function requireDeviceProfile(id: string): DeviceRecord {
  const device = getDeviceProfile(id);
  if (!device) {
    throw new Error(`Unknown device profile: ${id}`);
  }
  return device;
}
