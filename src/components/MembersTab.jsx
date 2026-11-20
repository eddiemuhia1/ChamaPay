import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function MembersTab({ members }) {
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(""); 
  const [message, setMessage] = useState("");

  const handleAddMember = async () => {
    if (!name.trim() || !amount || !dueDate) {
      setMessage("Enter name, amount, and a due date.");
      return;
    }
    try {
      await addDoc(collection(db, "members"), {
        name: name.trim(), amount: Number(amount), dueDate: dueDate, paid: false, treasurerId: user.uid,
      });
      
      setName("");
      setAmount("");
      setDueDate("");
      setMessage("");
      setIsAdding(false); 
    } catch (err) {
      console.error("Error adding member:", err.message);
      setMessage("Could not add the member. Try again.");
    }
  };

  return (
    <div className="mt-5">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Members</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-lg border-2 border-[#1d63b8] bg-white px-4 py-1.5 text-sm font-semibold text-[#1d63b8]">
          {isAdding ? "Cancel" : "Add member"}
        </button>
      </div>

      {/* The Toggleable Form */}
      {isAdding && (
        <div className="mt-4 rounded-xl border border-gray-300 bg-gray-50 p-4">
          <h3 className="text-sm font-bold text-gray-900">New Member Details</h3>
          
          <div className="mt-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Amount (KES)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>

          {message && <p className="mt-2 text-xs text-red-600">{message}</p>}

          <button onClick={handleAddMember} className="mt-4 w-full rounded-lg bg-[#1d63b8] py-2 text-sm font-semibold text-white">
            Save Member
          </button>
        </div>
      )}

      {/* Temporary placeholder for our list */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">We have {members.length} members.</p>
      </div>
    </div>
  );
}

export default MembersTab;