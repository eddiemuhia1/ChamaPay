import { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function TreasurerDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const membersQuery = query(
      collection(db, "members"),
      where("treasurerId", "==", user.uid)
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
 
  return (
    <section className="mt-6 max-w-sm">
      <h2 className="text-xl font-semibold">Treasurer dashboard</h2>
      <h3 className="mt-4 font-semibold">Add a member</h3>

      <div className="mt-2 flex flex-col gap-1">
        <label htmlFor="member-name" className="text-sm font-semibold">Member name</label>
        <input
          id="member-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-gray-400 px-3 py-3"
        />
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <label htmlFor="member-amount" className="text-sm font-semibold">Contribution amount (KES)</label>
        <input
          id="member-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-gray-400 px-3 py-3"
        />
      </div>

      {message && <p role="status" className="mt-3 text-sm text-gray-700">{message}</p>}

      <button
        type="button"
        onClick={handleAddMember}
        className="mt-4 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white"
      >
        Add member
      </button>

      <h3 className="mt-8 font-semibold">Members</h3>
      {members.length === 0 && (
        <p className="mt-2 text-gray-600">No members yet. Add your first one above.</p>
      )}
      <ul className="mt-2">
        {members.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 border-b border-gray-300 py-3">
            <div>
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-gray-700">KES {m.amount} · {m.paid ? "Paid" : "Unpaid"}</p>
            </div>
            {!m.paid && (
              <button
                type="button"
                onClick={() => handleMarkPaid(m.id)}
                aria-label={`Mark ${m.name} as paid`}
                className="rounded-lg border-2 border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700"
              >
                Mark paid
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TreasurerDashboard;