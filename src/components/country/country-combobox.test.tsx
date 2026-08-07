// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CountryCombobox } from "@/components/country/country-combobox";

const countries = [
  { name: "United Kingdom", slug: "united-kingdom", code: "GB", flag: "🇬🇧", aliases: ["UK"] },
  { name: "France", slug: "france", code: "FR", flag: "🇫🇷", aliases: [] },
] as const;

describe("country combobox", () => {
  it("lets a user type over a committed selection without clearing it prematurely", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <CountryCombobox label="Home country" value="united-kingdom" countries={countries} onChange={onChange} />
        <button type="button">Outside</button>
      </div>,
    );

    const input = screen.getByRole("combobox", { name: "Home country" });
    await user.click(input);
    await user.type(input, "France");
    expect((input as HTMLInputElement).value).toBe("France");
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("chooses the first result with a single ArrowDown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CountryCombobox label="Destination" value="" countries={countries} onChange={onChange} />);

    const input = screen.getByRole("combobox", { name: "Destination" });
    await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("united-kingdom");
  });

  it("makes type-to-search and list selection obvious", () => {
    render(<CountryCombobox label="Destination" value="" countries={countries} onChange={vi.fn()} />);

    const input = screen.getByRole("combobox", { name: "Destination" });
    expect(input.getAttribute("placeholder")).toBe("Type a country name…");
    expect(screen.getByText("Start typing a country name, or choose one from the list.")).toBeTruthy();
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });
});
