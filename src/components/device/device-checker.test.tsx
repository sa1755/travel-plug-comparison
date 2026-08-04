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

    await user.selectOptions(
      screen.getByRole("combobox", { name: /Where does your device come from/ }),
      "united-kingdom",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /Where will you use it/ }),
      "japan",
    );
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
    await user.selectOptions(selectors[0], "japan");
    await user.selectOptions(selectors[1], "japan");
    await user.click(screen.getByRole("radio", { name: "Phone charger" }));
    await user.click(screen.getByRole("button", { name: "Check this device" }));

    expect(await screen.findByText("Choose two different countries to compare")).toBeTruthy();
  });
});
