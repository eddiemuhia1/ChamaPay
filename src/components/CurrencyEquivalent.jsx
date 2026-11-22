import { useEffect, useState } from "react";
import { convertFromKES, getRate, isRatesResponseValid } from "../utils/currency";

const CURRENCIES = ["USD", "GBP", "EUR"];

function CurrencyEquivalent({ amountKES }) {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/KES");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        if (!isRatesResponseValid(data)) {
          throw new Error("Unexpected response");
        }
        setRates(data.rates);
      } catch (err) {
        console.error("Error fetching exchange rates:", err.message);
        setError("Could not load exchange rates.");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);
  if (loading) {
    return <p className="mt-2 text-sm text-gray-500">Loading exchange rate...</p>;
  }
  if (error) {
    return <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>;
  }
  const converted = convertFromKES(amountKES, getRate(rates, currency));
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
      <span>
        ≈ {currency} {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
      <label htmlFor="currency-select" className="sr-only">Show amount in</label>
      <select id="currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-sm"> {CURRENCIES.map((c) => (
        <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="text-xs text-blue-700 underline">
        Rates by Exchange Rate API
      </a>
    </div>
  );
}

export default CurrencyEquivalent;