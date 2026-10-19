import { describe, expect, it } from "vitest";
import { visibleNavigation } from "@/components/navigation";

describe("role-specific navigation", () => {
  it("lets technicians reach their own reports and assigned jobs", () => {
    const paths = visibleNavigation("technician").map((item) => item.to);

    expect(paths).toContain("/complaints");
    expect(paths).toContain("/technician");
    expect(paths).not.toContain("/manager");
    expect(paths).not.toContain("/reports");
    expect(paths).not.toContain("/admin");
  });

  it("limits reporting and administration links to staff roles", () => {
    for (const role of ["student", "faculty", "technician"] as const) {
      const paths = visibleNavigation(role).map((item) => item.to);
      expect(paths).not.toContain("/reports");
      expect(paths).not.toContain("/admin");
    }

    for (const role of ["estate_manager", "admin"] as const) {
      const paths = visibleNavigation(role).map((item) => item.to);
      expect(paths).toContain("/reports");
      expect(paths).toContain("/manager");
    }
  });
});
