import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext"; // ✅ Correctly importing

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  // Function to handle login
  const login = (newToken) => setToken(newToken);

  // Function to handle logout
  const logout = async () => {
    if (token) {
      try {
        const response = await fetch("https://game-of-life-api-2bbe83eb66ac.herokuapp.com/api/v1/users/sign_out", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Error revoking token on backend:", await response.json());
        }
      } catch (error) {
        console.error("Error in logout request:", error);
      }
    }
    // Remove the token locally after the logout attempt (regardless of the API response)
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
