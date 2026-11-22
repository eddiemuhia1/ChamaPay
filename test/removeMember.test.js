import { expect } from "chai";
import { getRemoveConfirmMessage, canRemoveMember } from "../src/utils/members.js";

describe("getRemoveConfirmMessage", () => {
  it("includes the member's name", () => {
    expect(getRemoveConfirmMessage({ name: "Amina" })).to.include("Amina");
  });

  it("warns that it cannot be undone", () => {
    expect(getRemoveConfirmMessage({ name: "Amina" })).to.include("cannot be undone");
  });
});

describe("canRemoveMember", () => {
  it("allows a treasurer to remove their own member", () => {
    expect(canRemoveMember({ id: "1", treasurerId: "abc" }, "abc")).to.equal(true);
  });

  it("does not allow removing another treasurer's member", () => {
    expect(canRemoveMember({ id: "1", treasurerId: "abc" }, "xyz")).to.equal(false);
  });

  it("does not allow removing when there is no member", () => {
    expect(canRemoveMember(null, "abc")).to.equal(false);
  });

  it("does not allow removing when the treasurer id is missing", () => {
    expect(canRemoveMember({ id: "1" }, undefined)).to.equal(false);
  });
});
