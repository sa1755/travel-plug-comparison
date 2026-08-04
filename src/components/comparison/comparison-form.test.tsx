// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ComparisonForm } from "@/components/comparison/comparison-form";
import { getCountries } from "@/services/country-service";

const pushMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const options = getCountries().map(({ name, slug, flag }) => ({ name, slug, flag }));

describe("comparison form", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("explains missing selections", async () => {
    const user = userEvent.setup();
    render(<ComparisonForm countries={options} />);

    await user.click(screen.getByRole("button", { name: "Compare countries" }));

    expect(await screen.findByText("Choose where you are travelling from")).toBeTruthy();
    expect(screen.getByText("Choose your destination")).toBeTruthy();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("creates a shareable comparison URL", async () => {
    const user = userEvent.setup();
    render(<ComparisonForm countries={options} />);
    const selectors = screen.getAllByRole("combobox");

    await user.selectOptions(selectors[0], "united-kingdom");
    await user.selectOptions(selectors[1], "japan");
    await user.click(screen.getByRole("button", { name: "Compare countries" }));

    expect(pushMock).toHaveBeenCalledWith("/compare/united-kingdom/japan");
  });
});
