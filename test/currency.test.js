import { expect } from "chai";
import {convertFromKES, getRate, isRatesResponseValid,} from "../src/utils/currency.js";

describe("convertFromKES", () => {
  it("converts shillings using the rate", () => {
    expect(convertFromKES(1000, 0.01)).to.equal(10);
  });

  it("rounds to two decimal places", () => {
    expect(convertFromKES(1234.56, 0.01)).to.equal(12.35);
  });

  it("returns 0 for an amount of 0", () => {
    expect(convertFromKES(0, 0.01)).to.equal(0);
  });

  it("accepts an amount given as text", () => {
    expect(convertFromKES("500", 0.01)).to.equal(5);
  });

  it("returns 0 when the amount is not a number", () => {
    expect(convertFromKES("abc", 0.01)).to.equal(0);
  });

  it("returns 0 when there is no rate", () => {
    expect(convertFromKES(1000, undefined)).to.equal(0);
  });
});

describe("getRate", () => {
  const rates = { USD: 0.0077, GBP: 0.0058 };

  it("returns the rate for a currency in the list", () => {
    expect(getRate(rates, "USD")).to.equal(0.0077);
  });

  it("returns 0 for a currency that is not in the list", () => {
    expect(getRate(rates, "EUR")).to.equal(0);
  });

  it("returns 0 when there are no rates at all", () => {
    expect(getRate(null, "USD")).to.equal(0);
  });
});

describe("isRatesResponseValid", () => {
  it("accepts a successful response with rates", () => {
    expect(isRatesResponseValid({ result: "success", rates: { USD: 0.0077 } })).to.equal(true);
  });

  it("rejects a response that reports an error", () => {
    expect(isRatesResponseValid({ result: "error" })).to.equal(false);
  });

  it("rejects a response with no rates", () => {
    expect(isRatesResponseValid({ result: "success" })).to.equal(false);
  });

  it("rejects an empty response", () => {
    expect(isRatesResponseValid(null)).to.equal(false);
  });
});
