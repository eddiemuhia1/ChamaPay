import { expect } from "chai";
import {getGroupNameToSave, isGroupNameMissing, getGroupLabel,} from "../src/utils/groupName.js";

describe("getGroupNameToSave", () => {
  it("keeps the group name for a treasurer", () => {
    expect(getGroupNameToSave("treasurer", "Umoja Savings")).to.equal("Umoja Savings");
  });

  it("removes spaces around the name", () => {
    expect(getGroupNameToSave("treasurer", "  Umoja Savings  ")).to.equal("Umoja Savings");
  });

  it("returns an empty string for a member", () => {
    expect(getGroupNameToSave("member", "Umoja Savings")).to.equal("");
  });

  it("returns an empty string when the treasurer typed nothing", () => {
    expect(getGroupNameToSave("treasurer", undefined)).to.equal("");
  });
});

describe("isGroupNameMissing", () => {
  it("is missing when a treasurer leaves the name empty", () => {
    expect(isGroupNameMissing("treasurer", "")).to.equal(true);
  });

  it("is missing when a treasurer types only spaces", () => {
    expect(isGroupNameMissing("treasurer", "   ")).to.equal(true);
  });

  it("is not missing when a treasurer types a name", () => {
    expect(isGroupNameMissing("treasurer", "Umoja Savings")).to.equal(false);
  });

  it("is never missing for a member", () => {
    expect(isGroupNameMissing("member", "")).to.equal(false);
  });
});

describe("getGroupLabel", () => {
  it("shows the group name when there is one", () => {
    expect(getGroupLabel("Umoja Savings", "Your group")).to.equal("Umoja Savings");
  });

  it("shows the fallback when the name is empty", () => {
    expect(getGroupLabel("", "Your group")).to.equal("Your group");
  });

  it("shows the fallback when there is no name at all", () => {
    expect(getGroupLabel(undefined, "Your group")).to.equal("Your group");
  });

  it("shows the fallback when the name is only spaces", () => {
    expect(getGroupLabel("   ", "Your group")).to.equal("Your group");
  });
});
