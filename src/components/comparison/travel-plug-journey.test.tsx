// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TravelPlugJourney, type JourneyCountry } from "@/components/comparison/travel-plug-journey";
import { getCountries } from "@/services/country-service";
import { getFeaturedDeviceProfiles } from "@/services/device-service";

const pushMock = vi.hoisted(() => vi.fn());
const replaceMock = vi.hoisted(() => vi.fn());
const trackEventMock = vi.hoisted(() => vi.fn());
const navigationState = vi.hoisted(() => ({ pathname: "/compare/united-kingdom/japan" }));

vi.mock("@/lib/analytics", () => ({ trackEvent: trackEventMock }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const countries: JourneyCountry[] = getCountries().map((country) => ({
  name: country.name,
  slug: country.slug,
  code: country.code,
  numericCode: country.numericCode,
  flag: country.flag,
  plugTypes: country.plugTypes,
  voltages: country.voltages,
  frequencies: country.frequencies,
  coordinates: country.coordinates,
  aliases: country.aliases,
}));

describe("travel plug journey", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
    replaceMock.mockClear();
    trackEventMock.mockClear();
    navigationState.pathname = "/compare/united-kingdom/japan";
  });

  it("leads a dangerous result with a visible voltage warning and all featured devices", () => {
    render(
      <TravelPlugJourney
        countries={countries}
        devices={getFeaturedDeviceProfiles()}
        initialFrom="united-kingdom"
        initialTo="japan"
        mode="result"
      />,
    );

    expect(screen.getByRole("heading", { name: "A voltage converter may be required" })).toBeTruthy();
    const socketComparison = screen.getByLabelText("United Kingdom and Japan plug and socket types");
    expect(within(socketComparison).getByRole("img", { name: "Simplified Type G plug diagram" })).toBeTruthy();
    expect(within(socketComparison).getByRole("img", { name: "Simplified Type A plug diagram" })).toBeTruthy();
    expect(within(socketComparison).getByRole("img", { name: "Simplified Type B plug diagram" })).toBeTruthy();
    expect(screen.getAllByText(/United Kingdom/).length).toBeGreaterThan(0);
    for (const device of ["Phone", "Laptop", "Smartwatch", "Camera", "Electric toothbrush", "Hair dryer", "Hair straightener", "Gaming console"]) {
      expect(screen.getByRole("heading", { name: device })).toBeTruthy();
    }
  });

  it("leads a variable-voltage destination with a local voltage warning", () => {
    render(
      <TravelPlugJourney
        countries={countries}
        devices={getFeaturedDeviceProfiles()}
        initialFrom="united-states"
        initialTo="brazil"
        mode="result"
      />,
    );

    expect(screen.getByRole("heading", { name: "Confirm the local voltage" })).toBeTruthy();
    expect(screen.getByText(/Ask your accommodation which voltage/i)).toBeTruthy();
  });

  it("clears a destination that becomes the home country", async () => {
    const user = userEvent.setup();
    render(<TravelPlugJourney countries={countries} devices={getFeaturedDeviceProfiles()} />);
    let selectors = screen.getAllByRole("combobox");
    await user.click(selectors[1]);
    await user.type(selectors[1], "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));

    selectors = screen.getAllByRole("combobox");
    await user.click(selectors[0]);
    await user.type(selectors[0], "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));

    expect((screen.getAllByRole("combobox")[1] as HTMLInputElement).value).toBe("");
    expect(screen.queryByText("No plug adapter required")).toBeNull();
  });

  it("keeps an existing result internally consistent during an invalid staged edit", async () => {
    const user = userEvent.setup();
    render(<TravelPlugJourney countries={countries} devices={getFeaturedDeviceProfiles()} initialFrom="united-kingdom" initialTo="japan" mode="result" />);

    await user.click(screen.getByText("Change or swap countries"));
    const originField = screen.getAllByRole("combobox")[0];
    await user.click(originField);
    await user.type(originField, "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));

    expect(screen.getByLabelText("United Kingdom and Japan plug and socket types")).toBeTruthy();
    expect(screen.queryByLabelText("Japan and Japan plug and socket types")).toBeNull();
  });

  it("provides actionable power safety guidance", () => {
    render(<TravelPlugJourney countries={countries} devices={getFeaturedDeviceProfiles()} />);

    expect(screen.getByRole("heading", { name: "Check the label before you plug in." })).toBeTruthy();
    expect(screen.getByText(/plug adapter only changes the plug shape/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Check a specific device" }).getAttribute("href")).toBe("/device-checker");
  });

  it("records a completed comparison only after its result route is displayed", async () => {
    const user = userEvent.setup();
    navigationState.pathname = "/";
    const home = render(<TravelPlugJourney countries={countries} devices={getFeaturedDeviceProfiles()} />);

    const fields = screen.getAllByRole("combobox");
    await user.type(fields[0], "United Kingdom");
    await user.click(screen.getByRole("option", { name: /United Kingdom GB/ }));
    await user.type(fields[1], "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));

    expect(trackEventMock.mock.calls.filter(([name]) => name === "comparison_completed")).toHaveLength(0);
    home.unmount();

    navigationState.pathname = "/compare/united-kingdom/japan";
    render(
      <TravelPlugJourney
        countries={countries}
        devices={getFeaturedDeviceProfiles()}
        initialFrom="united-kingdom"
        initialTo="japan"
        mode="result"
      />,
    );

    expect(trackEventMock.mock.calls.filter(([name]) => name === "comparison_completed")).toHaveLength(1);
  });

  it("offers Globe view from the hero", () => {
    render(<TravelPlugJourney countries={countries} devices={getFeaturedDeviceProfiles()} />);

    expect(screen.getByRole("button", { name: /Explore destinations Open Globe view/i })).toBeTruthy();
  });
});
