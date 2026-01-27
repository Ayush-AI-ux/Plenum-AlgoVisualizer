const API_URL = "http://localhost:5000/api/auth";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
