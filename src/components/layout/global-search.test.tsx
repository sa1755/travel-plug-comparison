// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GlobalSearch } from "@/components/layout/global-search";
import { getCatalogSearchEntries } from "@/services/search-service";

describe("global search", () => {
  it("finds a country and closes with Escape while restoring focus", async () => {
    const user = userEvent.setup();
    render(<GlobalSearch entries={getCatalogSearchEntries()} />);

    const trigger = screen.getByRole("button", { name: "Search" });
    await user.click(trigger);
    const input = screen.getByRole("searchbox", {
      name: "Search countries and plug types",
    });
    await user.type(input, "Japan");

    const results = await screen.findAllByRole("link");
    const countryResult = results.find(
      (result) => result.getAttribute("href") === "/country/japan",
    );
    expect(countryResult).toBeTruthy();

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.getAttribute("href")).toBe("/country/japan");

    await user.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("presents a useful empty state for unmatched searches", async () => {
    const user = userEvent.setup();
    render(<GlobalSearch entries={getCatalogSearchEntries()} />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Search countries and plug types" }),
      "Atlantis",
    );

    expect(await screen.findByText("No matching guide found")).toBeTruthy();
  });
});
