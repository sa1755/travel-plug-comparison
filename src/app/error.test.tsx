// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const trackEventMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics", () => ({ trackEvent: trackEventMock }));

import ErrorPage from "@/app/error";

describe("application error page", () => {
  it("offers retry and home recovery without exposing raw errors", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("private diagnostic detail")} reset={reset} />);

    expect(screen.getByRole("heading", { name: "This travel guide could not be displayed." })).toBeTruthy();
    const announcement = screen.getByRole("alert");
    expect(announcement.textContent).toContain("Try loading this view again");
    expect(announcement.querySelector("button, a")).toBeNull();
    expect(screen.queryByText("private diagnostic detail")).toBeNull();
    expect(screen.getByRole("link", { name: "Return home" }).getAttribute("href")).toBe("/");
    expect(trackEventMock).toHaveBeenCalledWith("error_encountered", {
      error_type: "application_render_failed",
    });

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
