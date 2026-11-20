import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function TreasurerDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

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

      <button type="button" onClick={handleAddMember} className="mt-4 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white">
        Add member
      </button>
    </section>
  );
}

export default TreasurerDashboard;