import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function MemberDashboard() {
  const { user } = useAuth();
  
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  // We will keep history as mock data for now until you build a payment history feature
  const history = [
    { id: 1, amount: 1000, date: "2026-10-30", status: "Paid" },
    { id: 2, amount: 1000, date: "2026-09-30", status: "Paid" },
  ];

  useEffect(() => {
    const fetchMyData = async () => {
      if (!user) return;
      
      try {
        // 1. Try to find the specific member linked to this login
        const q = query(collection(db, "members"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setMemberData(querySnapshot.docs[0].data());
        } else {
          // 2. BOOTCAMP FALLBACK: If no link is found, just grab the first member in the database so we can see the UI!
          console.log("No linked account found. Loading fallback data for testing...");
          const fallbackSnapshot = await getDocs(collection(db, "members"));
          
          if (!fallbackSnapshot.empty) {
            setMemberData(fallbackSnapshot.docs[0].data());
          } else {
            console.log("Database is completely empty.");
          }
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [user]);


  // Helper to calculate days remaining
  const getDaysUntilDue = (dateString) => {
    if (!dateString) return 0;
    const due = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBadgeStyle = (status) => {
    if (status === "Paid") return "border-green-600 text-green-700";
    if (status === "Late") return "border-red-600 text-red-700";
    return "border-gray-500 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  // If no data was found, show a friendly empty state
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

  return (
    <div className="flex min-h-screen flex-col bg-white pb-20">
      
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          [My Chama Group]
        </p>
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
          <p className="mt-1 text-sm text-gray-500">
            {memberData.dueDate ? `Due ${memberData.dueDate}` : "No due date set"}
          </p>
        </div>

        {/* Dynamic Reminder Banner */}
        {memberData.dueDate && (
          <div className={`mt-5 rounded-lg border border-dashed px-4 py-3 text-sm font-medium ${
            isLate 
              ? "border-red-300 bg-red-50 text-red-800" 
              : "border-orange-300 bg-orange-50 text-orange-800"
          }`}>
            {isLate 
              ? `Your contribution is overdue by ${Math.abs(daysRemaining)} days. Please contact the treasurer to remit payment.`
              : `Reminder: your contribution is due in ${daysRemaining} days. Please contact the treasurer to remit payment.`
            }
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
                <span className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getBadgeStyle(record.status)}`}>
                  {record.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white px-2 py-3 pb-safe">
        <button className="flex flex-1 flex-col items-center gap-1 text-[#1d63b8]">
          <span className="text-[10px] font-bold">Home</span>
          <div className="h-1 w-8 rounded-full bg-[#1d63b8] mt-1" />
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-gray-400">
          <span className="text-[10px] font-bold">History</span>
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-gray-400">
          <span className="text-[10px] font-bold">Group</span>
        </button>
      </div>
      
    </div>
  );
}

export default MemberDashboard;