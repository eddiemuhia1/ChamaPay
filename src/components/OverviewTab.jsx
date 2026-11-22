import { useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import CurrencyEquivalent from "./CurrencyEquivalent";

function OverviewTab({ members }) {
  const [message, setMessage] = useState("");

  const paidMembers = members.filter((m) => m.paid);
  const unpaidMembers = members.filter((m) => !m.paid);
  const totalCollected = paidMembers.reduce((sum, m) => sum + m.amount, 0);
  const progress =
    members.length === 0 ? 0 : Math.round((paidMembers.length / members.length) * 100);

  const handleMarkPaid = async (memberId) => {
    try {
      await updateDoc(doc(db, "members", memberId), { paid: true });
    } catch (err) {
      console.error("Error updating member:", err.message);
      setMessage("Could not update the member. Try again.");
    }
  };

  const handleRemindAll = async () => {
    try {
      await Promise.all(
        unpaidMembers.map((m) =>
          updateDoc(doc(db, "members", m.id), { reminderSentAt: serverTimestamp() })
        )
      );
      setMessage(`Reminder sent to ${unpaidMembers.length} member(s).`);
    } catch (err) {
      console.error("Error sending reminders:", err.message);
      setMessage("Could not send reminders. Try again.");
    }
  };

  return (
    <>
      <div className="mt-5 rounded-xl border border-gray-300 bg-white p-4">
        <p className="text-xs font-medium text-gray-500">Total pot</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          KES {totalCollected.toLocaleString()}
        </p>
        <CurrencyEquivalent amountKES={totalCollected} />
      </div>

      <div className="mt-3 rounded-xl border border-gray-300 bg-white p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">This cycle</span>
          <span className="font-bold text-gray-900">
            {paidMembers.length} of {members.length} members paid
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Members who have paid"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2 w-full rounded-full bg-gray-200"
        >
          <div
            className="h-2 rounded-full bg-[#1d63b8] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-bold text-gray-900">Unpaid members</h3>

      {unpaidMembers.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          {members.length === 0
            ? "No members yet. Go to the Members tab to add someone."
            : "Everyone has paid for this cycle!"}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-200">
          {unpaidMembers.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500">KES {m.amount.toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={() => handleMarkPaid(m.id)}
                aria-label={`Mark ${m.name} as paid`}
                className="rounded-lg border border-[#1d63b8] px-3.5 py-1.5 text-xs font-semibold text-[#1d63b8] hover:bg-blue-50"
              >
                Mark paid
              </button>
            </li>
          ))}
        </ul>
      )}

      {unpaidMembers.length > 0 && (
        <button
          type="button"
          onClick={handleRemindAll}
          className="mt-6 w-full rounded-lg bg-[#1d63b8] py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Send reminder to all unpaid
        </button>
      )}

      {message && (
        <p role="status" className="mt-3 text-center text-xs text-gray-600">
          {message}
        </p>
      )}
    </>
  );
}

export default OverviewTab;