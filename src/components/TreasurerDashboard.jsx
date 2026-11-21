import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import OverviewTab from "./OverviewTab";
import MembersTab from "./MembersTab";

function TreasurerDashboard() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-between bg-white text-gray-900">
      <section className="p-5 pb-24">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Treasurer dashboard
        </h2>

        {activeTab === "overview" && <OverviewTab members={members} />}
        {activeTab === "members" && <MembersTab members={members} />}
      </section>

      <nav className="fixed bottom-0 w-full max-w-sm border-t border-gray-200 bg-white">
        <div className="grid grid-cols-2 text-center text-xs">
          {["overview", "members"].map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`border-t-2 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-[#1d63b8] font-semibold text-[#1d63b8]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default TreasurerDashboard;