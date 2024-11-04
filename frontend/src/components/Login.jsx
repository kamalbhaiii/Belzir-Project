// src/components/Login.js
import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserContext } from "../App";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const Login = () => {
  const { setAuthToken } = useContext(AuthContext);
  const { userDetail, setUserDetail } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLoginSuccess = async (response) => {
    try {
      const tokenId = response.credential;

      const result = await axios.post(
        `${process.env.REACT_APP_AUTH_SERVICE_URL}/verify-token`,
        { tokenId }
      );
      setAuthToken(result.data.token); // Save the JWT token
      setUserDetail({
        userName: result.data.name,
        userEmail: result.data.email,
      });
      navigate("/dashboard");

      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: result.data.email,
          subject: "Login Success",
          text: `Hello ${result.data.name}, You're successfully logged in.`,
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in. Please try again.");
    }
  };

  const handleLoginFailure = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "40px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box mt={2}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
