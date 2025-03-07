interface User {
  id: string;
  email: string;
  role_id: number;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log("Sending login request:", { email, password }); // 🔍 Debugging

    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Raw response:", response); // 🔍 Debugging

    const data: LoginResponse = await response.json();

    if (!response.ok)
      throw new Error(data.user ? data.user.email : "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Login error:", error); // 🔍 Debugging
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};
