import { z } from "zod";

import {
  DEVICE_VOLTAGE_PROFILES,
  PLUG_TYPES,
} from "@/types/constants";

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected a lowercase kebab-case slug");

const uniqueBy = <T extends Record<string, unknown>>(
  records: T[],
  key: keyof T,
  context: z.RefinementCtx,
) => {
  const seen = new Set<unknown>();

  records.forEach((record, index) => {
    const value = record[key];
    if (seen.has(value)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate ${String(key)}: ${String(value)}`,
        path: [index, key as string],
      });
    }
    seen.add(value);
  });
};

const requireUniqueValues = (
  values: readonly unknown[],
  path: string,
  context: z.RefinementCtx,
) => {
  if (new Set(values).size !== values.length) {
    context.addIssue({
      code: "custom",
      message: `Expected unique ${path}`,
      path: [path],
    });
  }
};

export const plugTypeSchema = z.enum(PLUG_TYPES);

export const countrySchema = z
  .object({
    name: z.string().min(2),
    slug: slugSchema,
    code: z.string().regex(/^[A-Z]{2}$/, "Expected an ISO 3166-1 alpha-2 code"),
    numericCode: z.string().regex(/^\d{3}$/, "Expected an ISO 3166-1 numeric code"),
    region: z.string().min(1),
    capital: z.string().min(1),
    coordinates: z.tuple([
      z.number().min(-90).max(90),
      z.number().min(-180).max(180),
    ]),
    flag: z.string().min(1),
    aliases: z.array(z.string().min(1)).default([]),
    voltages: z.array(z.number().int().min(50).max(300)).min(1),
    frequencies: z.array(z.union([z.literal(50), z.literal(60)])).min(1),
    plugTypes: z.array(plugTypeSchema).min(1),
    powerNote: z.string().min(10).optional(),
    travelAdvice: z.string().min(20),
  })
  .superRefine((record, context) => {
    requireUniqueValues(record.aliases, "aliases", context);
    requireUniqueValues(record.voltages, "voltages", context);
    requireUniqueValues(record.frequencies, "frequencies", context);
    requireUniqueValues(record.plugTypes, "plugTypes", context);
  });

export const countriesSchema = z.array(countrySchema).min(1).superRefine((records, context) => {
  uniqueBy(records, "name", context);
  uniqueBy(records, "slug", context);
  uniqueBy(records, "code", context);
});

export const comparisonFormSchema = z
  .object({
    fromCountry: slugSchema,
    toCountry: slugSchema,
  })
  .superRefine((values, context) => {
    if (values.fromCountry === values.toCountry) {
      context.addIssue({
        code: "custom",
        message: "Choose two different countries to compare",
        path: ["toCountry"],
      });
    }
  });

export const deviceCheckerFormSchema = comparisonFormSchema.safeExtend({
  deviceId: slugSchema,
});

export const plugSchema = z
  .object({
    type: plugTypeSchema,
    slug: slugSchema,
    name: z.string().min(3),
    description: z.string().min(20),
    pinCounts: z.array(z.number().int().min(2).max(3)).min(1),
    pinShape: z.enum(["flat", "round", "rectangular", "mixed"]),
    grounding: z.enum(["grounded", "ungrounded", "variants"]),
    polarized: z.enum(["yes", "no", "sometimes"]),
    typicalCurrentAmps: z.array(z.number().positive().max(32)).min(1),
    technicalStandard: z.string().min(2),
    imageKey: slugSchema,
  })
  .superRefine((record, context) => {
    requireUniqueValues(record.pinCounts, "pinCounts", context);
    requireUniqueValues(record.typicalCurrentAmps, "typicalCurrentAmps", context);
  });

export const plugsSchema = z.array(plugSchema).min(1).superRefine((records, context) => {
  uniqueBy(records, "type", context);
  uniqueBy(records, "slug", context);
  uniqueBy(records, "imageKey", context);
});

export const deviceProfileSchema = z.object({
  id: slugSchema,
  name: z.string().min(2),
  category: z.enum(["charger", "personal-care", "entertainment", "medical"]),
  voltageProfile: z.enum(DEVICE_VOLTAGE_PROFILES),
  highPower: z.boolean(),
  summary: z.string().min(15),
  guidance: z.string().min(30),
});

export const deviceProfilesSchema = z
  .array(deviceProfileSchema)
  .min(1)
  .superRefine((records, context) => {
    uniqueBy(records, "id", context);
    uniqueBy(records, "name", context);
  });
