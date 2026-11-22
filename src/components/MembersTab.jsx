import { useState } from "react";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getRemoveConfirmMessage, canRemoveMember } from "../utils/members";

function MembersTab({ members }) {
  const { user, groupName } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(""); 
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [removeError, setRemoveError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); 

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (filter === "paid") matchesFilter = member.paid === true;
    if (filter === "unpaid") matchesFilter = member.paid === false;
    return matchesSearch && matchesFilter;
  });

  const handleAddMember = async () => {
    if (!name.trim() || !amount || !dueDate || !email.includes("@")) {
       setMessage("Enter name, amount, a due date and a valid email.");
       return;
    }
    try {
      await addDoc(collection(db, "members"), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        amount: Number(amount),
        dueDate: dueDate,
        paid: false,
        treasurerId: user.uid, groupName
      });
      
      //clear the box
      setName("");
      setAmount("");
      setDueDate("");
      setEmail("");
      setMessage("");
      setIsAdding(false); 
    } catch (err) {
      console.error("Error adding member:", err.message);
      setMessage("Could not add the member. Try again.");
    }
  };

  //Helper logic for Dates and Badges 
  const isLate = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for a fair comparison
    const due = new Date(dateString);
    return due < today;
  };

  const getBadgeStyle = (member) => {
    if (member.paid) return "border-green-600 text-green-700";
    if (isLate(member.dueDate)) return "border-red-600 text-red-700";
    return "border-gray-500 text-gray-700"; // Standard unpaid
  };
  const handleRemoveMember = async (member) => {
  if (!canRemoveMember(member, user.uid)) return;
  if (!window.confirm(getRemoveConfirmMessage(member))) return;

  setRemoveError("");
  try {
    await deleteDoc(doc(db, "members", member.id));
  } catch (err) {
    console.error("Error removing member:", err.message);
    setRemoveError("Could not remove the member. Try again.");
  }
};

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Members</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-lg border border-[#1d63b8] bg-white px-4 py-1.5 text-sm font-semibold text-[#1d63b8]" >
          {isAdding ? "Cancel" : "Add member"}
        </button>
      </div>

      {isAdding && (
        <div className="mt-4 rounded-xl border border-gray-300 bg-gray-50 p-4">
          <h3 className="text-sm font-bold text-gray-900">New Member Details</h3>
          
          <div className="mt-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <label htmlFor="member-email" className="text-xs font-semibold text-gray-700">
             Member's email (the one they log in with) </label>
            <input id="member-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"/>
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

      <div className="mt-6">
        <label className="text-sm font-bold text-gray-900">Search members</label>
        <input type="text" placeholder="Search by name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />

        <div className="mt-3 flex gap-2">
          {["all", "paid", "unpaid"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-[#1d63b8] border-[#1d63b8] text-white"
                  : "bg-white border-gray-300 text-gray-600 hover:border-[#1d63b8]"
              }`} >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* The Actual Member List */}
      {removeError && <p role="alert" className="mt-3 text-xs text-red-600">{removeError}</p>}
      <ul className="mt-4 divide-y divide-gray-200">
        {filteredMembers.length === 0 ? (
          <p className="py-4 text-sm text-gray-500">No members match your search.</p>
           ) : (
          filteredMembers.map((m) => {
            const late = !m.paid && isLate(m.dueDate);
            return (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-gray-300" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">
                      KES {m.amount.toLocaleString()} - {late ? "Overdue since" : "Due"} {m.dueDate || "N/A"}
                    </p>
                  </div>
                </div>
                
               <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getBadgeStyle(m)}`}>
                    {m.paid ? "Paid" : late ? "Late" : "Unpaid"}
                  </span>
                  <button type="button" onClick={() => handleRemoveMember(m)} aria-label={`Remove ${m.name}`}
                    className="rounded-lg border border-red-600 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50" >
                    Remove
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default MembersTab;