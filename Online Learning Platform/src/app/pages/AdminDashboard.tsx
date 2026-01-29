import { useEffect, useState } from "react";
import { InstructorStatsDto } from "../types/InstructorStatsDto";
import AddInstructorModal from "../../app/components/admin/AddInstructorModal";
import { InstructorCard } from "../components/admin/InstructorCard";

export default function AdminDashboard() {
  const [instructors, setInstructors] = useState<InstructorStatsDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch instructors data from backend
  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7000/api/Admin/Instructors", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch instructors");
      }

      const data = await res.json();
      // Handle if data is wrapped in $values (for EF Core)
      const instructorsData = Array.isArray(data) ? data : data?.$values ?? [];
      setInstructors(instructorsData);

    } catch (err) {
      console.error("Failed to fetch instructors", err);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add Instructor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((inst) => (
          <div
            className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            <InstructorCard key={inst.id} instructor={inst} />
            
          </div>
        ))}
      </div>

      {/* Add Instructor Modal */}
      {isModalOpen && (
        <AddInstructorModal
          onClose={() => setIsModalOpen(false)}
          onInstructorAdded={fetchInstructors}
        />
      )}
    </div>
  );
}
