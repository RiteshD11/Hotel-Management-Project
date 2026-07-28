import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roomName: "",
    roomType: "",
    roomRent: "",
    roomCapacity: "",
    roomSize: "",
    roomDescription: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/addroom", form);

      alert("Room Added ✅");

      navigate("/viewroom");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Add Room</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="roomName" placeholder="Room Name" onChange={handleChange} className="w-full p-2 border rounded" required />

          <input name="roomType" placeholder="Room Type" onChange={handleChange} className="w-full p-2 border rounded" />

          <input type="number" name="roomRent" placeholder="Room Rent" onChange={handleChange} className="w-full p-2 border rounded" required />

          <input type="number" name="roomCapacity" placeholder="Capacity" onChange={handleChange} className="w-full p-2 border rounded" />

          <input type="number" name="roomSize" placeholder="Room Size" onChange={handleChange} className="w-full p-2 border rounded" />

          <textarea name="roomDescription" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Add Room
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddRoom;