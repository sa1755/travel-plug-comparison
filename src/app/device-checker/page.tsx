import type { Metadata } from "next";

import { DeviceChecker } from "@/components/device/device-checker";
import { createPageMetadata } from "@/lib/site-config";
import { getCountries } from "@/services/country-service";
import { getDeviceProfiles } from "@/services/device-service";

export const metadata: Metadata = createPageMetadata({
  title: "Travel Device Compatibility Checker",
  description: "Check general voltage and frequency guidance for common travel devices between two countries.",
  path: "/device-checker",
});

export default function DeviceCheckerPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-surface">
        <div className="page-container py-14 sm:py-20">
          <p className="section-label">Device checker</p>
          <h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Will your device work when you travel?</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Choose the journey and device for a cautious, plain-language answer. Always confirm the exact model before use.</p>
        </div>
      </section>
      <section className="page-container py-12 sm:py-16">
        <DeviceChecker countries={getCountries()} devices={getDeviceProfiles()} />
      </section>
    </>
  );
}
