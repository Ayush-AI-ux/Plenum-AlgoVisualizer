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

// Request password reset (send email with reset link)
// NOW REQUIRES CURRENT PASSWORD FOR VERIFICATION
export const requestPasswordReset = async (
  email: string,
  currentPassword: string
): Promise<{
  success: boolean;
  message?: string;
  resetUrl?: string;
}> => {
  try {
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email,
        currentPassword // Added current password for verification
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Invalid email or password',
      };
    }

    return {
      success: true,
      message: data.message,
      resetUrl: data.resetUrl, // For development mode
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const res = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    return res.json();
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};