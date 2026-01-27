import { useState } from "react";
import { signup } from "../services/authService";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signup(form);

    if (res.token) {
      localStorage.setItem("token", res.token);
      alert("Signup successful 🎉");
    } else {
      setError(res.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-white text-2xl font-bold text-center">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
