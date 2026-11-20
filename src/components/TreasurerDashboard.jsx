import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function TreasurerDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  
  // Added tab state to match the bottom navigation bar in your wireframe
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    if (!user) return;

    const membersQuery = query(
      collection(db, "members"),
      where("treasurerId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(membersQuery, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMembers(list);
    });

    return unsubscribe;
  }, [user]);

  const handleAddMember = async () => {
    if (!name.trim() || !amount) {
      setMessage("Enter a name and an amount.");
      return;
    }
    try {
      await addDoc(collection(db, "members"), {
        name: name.trim(),
        amount: Number(amount),
        paid: false,
        treasurerId: user.uid,
      });
      setName("");
      setAmount("");
      setMessage("Member added.");
    } catch (err) {
      console.error("Error adding member:", err.message);
      setMessage("Could not add the member. Try again.");
    }
  };

  const handleMarkPaid = async (memberId) => {
    try {
      await updateDoc(doc(db, "members", memberId), { paid: true });
    } catch (err) {
      console.error("Error updating member:", err.message);
      setMessage("Could not update the member. Try again.");
    }
  };

  const paidMembers = members.filter((m) => m.paid);
  const unpaidMembers = members.filter((m) => !m.paid);
  const totalCollected = paidMembers.reduce((sum, m) => sum + m.amount, 0);
  const progress =
    members.length === 0
      ? 0
      : Math.round((paidMembers.length / members.length) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-between bg-white text-gray-900">
      {/* Main Content Area */}
      <section className="p-5 pb-24">
        {/* Top Header */}
        <p className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          [GROUP NAME]
        </p>
        <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h2>

        {activeTab === "home" && (
          <>
            {/* Card 1: Total Pot */}
            <div className="mt-5 rounded-xl border border-gray-300 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">Total pot</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                KES {totalCollected.toLocaleString()}
              </p>
            </div>

            {/* Card 2: Cycle Progress */}
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

            {/* Unpaid Members List */}
            <h3 className="mt-6 text-sm font-bold text-gray-900">
              Unpaid members
            </h3>

            {unpaidMembers.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                {members.length === 0
                  ? "No members yet. Go to the Members tab to add someone."
                  : "Everyone has paid for this cycle!"}
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-gray-200">
                {unpaidMembers.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      {/* Grey circular avatar placeholder */}
                      <div className="h-9 w-9 shrink-0 rounded-full bg-gray-300" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {m.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          KES {m.amount.toLocaleString()}
                        </p>
                      </div>
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

            {/* Full-width Bottom Action Button */}
            {unpaidMembers.length > 0 && (
              <button
                type="button"
                onClick={() => setMessage("Reminders sent to unpaid members!")}
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
        )}

        {/* Members Tab: Add Member Form & Full Directory */}
        {activeTab === "members" && (
          <div className="mt-5">
            <h3 className="text-sm font-bold text-gray-900">Add a member</h3>

            <div className="mt-3 flex flex-col gap-1">
              <label htmlFor="member-name" className="text-xs font-semibold text-gray-700">
                Member name
              </label>
              <input
                id="member-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <label htmlFor="member-amount" className="text-xs font-semibold text-gray-700">
                Contribution amount (KES)
              </label>
              <input
                id="member-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            {message && (
              <p role="status" className="mt-3 text-xs text-gray-600">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={handleAddMember}
              className="mt-4 w-full rounded-lg bg-[#1d63b8] py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Add member
            </button>

            <h3 className="mt-8 text-sm font-bold text-gray-900">All members</h3>
            <ul className="mt-2 divide-y divide-gray-200">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gray-300" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">
                        KES {m.amount.toLocaleString()} · {m.paid ? "Paid" : "Unpaid"}
                      </p>
                    </div>
                  </div>
                  {!m.paid && (
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(m.id)}
                      className="rounded-lg border border-[#1d63b8] px-3 py-1.5 text-xs font-semibold text-[#1d63b8]"
                    >
                      Mark paid
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Placeholder views for Payments & Settings tabs */}
        {(activeTab === "payments" || activeTab === "settings") && (
          <p className="mt-6 text-sm text-gray-500 capitalize">
            {activeTab} view coming soon.
          </p>
        )}
      </section>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full max-w-sm border-t border-gray-200 bg-white">
        <div className="grid grid-cols-4 text-center text-xs">
          {["home", "members", "payments", "settings"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setMessage("");
                }}
                className={`border-t-2 py-3 font-medium capitalize transition-colors ${
                  isActive
                    ? "border-[#1d63b8] font-semibold text-[#1d63b8]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default TreasurerDashboard;