import { expect } from "chai";
import { getDaysUntilDue, getBadgeStyle } from "../components/MemberDashboard";

describe("MemberDashboard Logic", () => {
  describe("getBadgeStyle", () => {
    it("returns green styles when status is Paid", () => {
      expect(getBadgeStyle("Paid")).to.equal("border-green-600 text-green-700");
    });

    it("returns red styles when status is Late", () => {
      expect(getBadgeStyle("Late")).to.equal("border-red-600 text-red-700");
    });

    it("returns gray styles for any other status", () => {
      expect(getBadgeStyle("Pending")).to.equal("border-gray-500 text-gray-700");
    });
  });

  describe("getDaysUntilDue", () => {
    it("returns 0 when no due date is provided", () => {
      expect(getDaysUntilDue("")).to.equal(0);
      expect(getDaysUntilDue(null)).to.equal(0);
    });

    it("returns a positive number for a future due date", () => {
      expect(getDaysUntilDue("2027-12-31")).to.be.greaterThan(0);
    });

    it("returns a negative number for a past due date", () => {
      expect(getDaysUntilDue("2025-01-01")).to.be.lessThan(0);
    });
  });
});