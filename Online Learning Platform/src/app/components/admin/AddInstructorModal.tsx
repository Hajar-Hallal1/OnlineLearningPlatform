import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  onClose: () => void;
  onInstructorAdded: () => void;
}

export default function AddInstructorModal({
  onClose,
  onInstructorAdded,
}: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const handleAdd = async () => {
//     try {
//       if (!username || !email || !password) {
//         toast.error("All fields are required");
//         return;
//       }

//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/api/Admin/Instructors",
//         { fullName: username, email, password: "Instructor@123" },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       toast.success("Instructor added successfully");
//       onInstructorAdded();
//       onClose();
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data || "Failed to add instructor");
//     }
//   };
  const handleAdd = async () => {
  try {
    if (!username || !email || !password) {
         toast.error("All fields are required");
         return;
    }
    const token = localStorage.getItem("token");

    const response = await fetch("https://localhost:7000/api/Admin/Instructors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName: username, email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to add instructor");
    }

    toast.success("Instructor added successfully");
    onInstructorAdded();
    onClose();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message);
  }
};


  return (
    <div className="fixed inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Instructor</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
