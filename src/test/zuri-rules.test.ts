import { describe, expect, it } from "vitest";
import { needsApproval, shortage, orderTotal } from "@/lib/zuri-logic";
import { seedProducts } from "@/lib/zuri-data";

describe("ZURI business rules", () => {
  it("field rep discount above 2% needs approval", () => { expect(needsApproval(3, "Commercial terrain")).toBe(true); expect(needsApproval(2, "Commercial terrain")).toBe(false); });
  it("sales manager can give up to 5%", () => { expect(needsApproval(5, "Responsable Commercial")).toBe(false); expect(needsApproval(6, "Responsable Commercial")).toBe(true); });
  it("ordering 500 with 200 in stock reports 300 missing", () => { expect(shortage({ ...seedProducts[0], stock: 200 }, 500)).toBe(300); });
  it("applies discount to total", () => { expect(orderTotal({ lines: [{ productId: "p1", qty: 10, unit: 1000 }], discount: 10 })).toBe(9000); });
});
