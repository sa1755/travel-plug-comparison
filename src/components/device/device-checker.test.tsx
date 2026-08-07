// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DeviceChecker } from "@/components/device/device-checker";
import { getCountries } from "@/services/country-service";
import { getDeviceProfiles } from "@/services/device-service";

describe("device checker", () => {
  it("returns cautious high-power guidance for a different voltage system", async () => {
    const user = userEvent.setup();
    render(<DeviceChecker countries={getCountries()} devices={getDeviceProfiles()} />);

    const origin = screen.getByRole("combobox", { name: /Where does your device come from/ });
    await user.click(origin);
    await user.type(origin, "United Kingdom");
    await user.click(screen.getByRole("option", { name: /United Kingdom GB/ }));
    const destination = screen.getByRole("combobox", { name: /Where will you use it/ });
    await user.click(destination);
    await user.type(destination, "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));
    await user.click(screen.getByRole("radio", { name: "Hair dryer" }));
    await user.click(screen.getByRole("button", { name: "Check this device" }));

    expect(await screen.findByText(/Do not connect it unless its label supports/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "View the full trip guide" }).getAttribute("href")).toBe(
      "/compare/united-kingdom/japan",
    );
  });

  it("prevents a same-country request and explains how to recover", async () => {
    const user = userEvent.setup();
    render(<DeviceChecker countries={getCountries()} devices={getDeviceProfiles()} />);

    const selectors = screen.getAllByRole("combobox");
    await user.click(selectors[0]);
    await user.type(selectors[0], "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));
    await user.click(selectors[1]);
    await user.type(selectors[1], "Japan");
    await user.click(screen.getByRole("option", { name: /Japan JP/ }));
    await user.click(screen.getByRole("radio", { name: "Phone charger" }));
    await user.click(screen.getByRole("button", { name: "Check this device" }));

    expect(await screen.findByText("Choose two different countries to compare")).toBeTruthy();
  });

  it("identifies every missing field on a blank submission", async () => {
    const user = userEvent.setup();
    render(<DeviceChecker countries={getCountries()} devices={getDeviceProfiles()} />);

    await user.click(screen.getByRole("button", { name: "Check this device" }));

    expect(await screen.findByText("Choose where your device comes from")).toBeTruthy();
    expect(screen.getByText("Choose where you will use it")).toBeTruthy();
    expect(screen.getByText("Choose a device")).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /Where does your device come from/ }).getAttribute("aria-invalid")).toBe("true");
  });
});
