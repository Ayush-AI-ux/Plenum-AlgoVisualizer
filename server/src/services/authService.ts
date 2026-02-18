// src/services/authService.ts

const TOKEN_KEY = "token";

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const logout = (): void => {
  removeToken();
  window.location.href = "/login";
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Fetch current user data
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data.data || data.user || data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};