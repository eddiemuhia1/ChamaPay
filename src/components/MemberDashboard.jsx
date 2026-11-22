import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getGroupLabel } from "../utils/groupName";
import CurrencyEquivalent from "./CurrencyEquivalent";

export const getDaysUntilDue = (dateString) => {
  if (!dateString) return 0;

  const due = new Date(dateString);
  const today = new Date();
  const oneDayInMs = 1000 * 60 * 60 * 24;

  return Math.ceil((due - today) / oneDayInMs);
};

export const getBadgeStyle = (status) => {
  if (status === "Paid") return "border-green-600 text-green-700";
  if (status === "Late") return "border-red-600 text-red-700";
  return "border-gray-500 text-gray-700";
};

function MemberDashboard() {
  const { user } = useAuth();

  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = [
    { id: 1, amount: 1000, date: "2026-10-30", status: "Paid" },
    { id: 2, amount: 1000, date: "2026-09-30", status: "Paid" },
  ];

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "members"),
      where("email", "==", user.email.toLowerCase())
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setMemberData(snap.empty ? null : snap.docs[0].data());
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching member data:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
        <h1 className="text-xl font-bold text-gray-900">Welcome to ChamaPay</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your treasurer hasn't set up your contribution profile yet, or your account isn't linked.
        </p>
      </div>
    );
  }

  const daysRemaining = getDaysUntilDue(memberData.dueDate);
  const isLate = daysRemaining < 0;

  let bannerStyle = "border-orange-300 bg-orange-50 text-orange-800";
  let bannerMessage = `Reminder: your contribution is due in ${daysRemaining} days. Please contact the treasurer to remit payment.`;

  if (isLate) {
    bannerStyle = "border-red-300 bg-red-50 text-red-800";
    bannerMessage = `Your contribution is overdue by ${Math.abs(daysRemaining)} days. Please contact the treasurer to remit payment.`;
  }

  const showReminder = memberData.reminderSentAt && !memberData.paid;

  return (
    <div className="flex min-h-screen flex-col bg-white pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <p>{getGroupLabel(memberData.groupName, "Your chama group")}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Hi, {memberData.name || user.email}
        </h1>
      </div>

      <div className="px-5">
        {/* Next Contribution Card */}
        <div className="rounded-xl border border-gray-300 p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">Next contribution</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            KES {memberData.amount ? memberData.amount.toLocaleString() : "0"}
          </p>
          <CurrencyEquivalent amountKES={memberData.amount || 0} />
          <p className="mt-1 text-sm text-gray-500">
            {memberData.dueDate ? `Due ${memberData.dueDate}` : "No due date set"}
          </p>
        </div>

        {/* Reminder sent by the treasurer */}
        {showReminder && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800" >
            Your treasurer sent you a payment reminder
            {memberData.reminderSentAt.toDate
              ? ` on ${memberData.reminderSentAt.toDate().toLocaleDateString()}`
              : ""}
            . Please contact the treasurer to remit payment.
          </div>
        )}

        {/* Dynamic Reminder Banner */}
        {memberData.dueDate && (
          <div className={`mt-5 rounded-lg border border-dashed px-4 py-3 text-sm font-medium ${bannerStyle}`}>
            {bannerMessage}
          </div>
        )}

        {/* History Section */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-gray-900">My history</h2>

          <ul className="mt-2 divide-y divide-gray-200">
            {history.map((record) => (
              <li key={record.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    KES {record.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{record.date}</p>
                </div>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${getBadgeStyle(record.status)}`}>
                  {record.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;