import { expect } from "chai";
import {normalizeEmail, isValidEmail, getUnpaidMembers, shouldShowReminder,} from "../src/utils/reminders.js";

describe("normalizeEmail", () => {
  it("makes the email lowercase", () => {
    expect(normalizeEmail("Amina@Gmail.COM")).to.equal("amina@gmail.com");
  });

  it("removes spaces around the email", () => {
    expect(normalizeEmail("  amina@gmail.com  ")).to.equal("amina@gmail.com");
  });

  it("returns an empty string when there is no email", () => {
    expect(normalizeEmail(undefined)).to.equal("");
  });
});

describe("isValidEmail", () => {
  it("accepts an email that has an @", () => {
    expect(isValidEmail("amina@gmail.com")).to.equal(true);
  });

  it("rejects an email without an @", () => {
    expect(isValidEmail("amina.gmail.com")).to.equal(false);
  });

  it("rejects an empty email", () => {
    expect(isValidEmail("")).to.equal(false);
  });
});

describe("getUnpaidMembers", () => {
  const members = [
    { id: "1", name: "Amina", paid: true },
    { id: "2", name: "Brian", paid: false },
    { id: "3", name: "Cynthia", paid: false },
  ];

  it("returns only the members who have not paid", () => {
    const result = getUnpaidMembers(members);
    expect(result).to.have.lengthOf(2);
    expect(result.map((m) => m.name)).to.deep.equal(["Brian", "Cynthia"]);
  });

  it("returns an empty list when everyone has paid", () => {
    expect(getUnpaidMembers([{ id: "1", paid: true }])).to.deep.equal([]);
  });

  it("returns an empty list when there are no members", () => {
    expect(getUnpaidMembers([])).to.deep.equal([]);
  });
});

describe("shouldShowReminder", () => {
  it("shows the reminder when one was sent and the member has not paid", () => {
    expect(shouldShowReminder({ paid: false, reminderSentAt: new Date() })).to.equal(true);
  });

  it("hides the reminder when none was sent", () => {
    expect(shouldShowReminder({ paid: false })).to.equal(false);
  });

  it("hides the reminder once the member has paid", () => {
    expect(shouldShowReminder({ paid: true, reminderSentAt: new Date() })).to.equal(false);
  });

  it("hides the reminder when there is no member record", () => {
    expect(shouldShowReminder(null)).to.equal(false);
  });
});