import axios from "axios";

export const getInstructors = async () => {
  const res = await axios.get("/api/Admin/Instructors");
  return res.data;
};

export const addInstructor = async (data: any) => {
  return axios.post("/api/Admin/Instructors", data);
};
