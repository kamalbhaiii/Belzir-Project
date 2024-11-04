import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext, UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";

const Dashboard = () => {
  const { authToken, setAuthToken } = useContext(AuthContext);
  const { userDetail, setUserDetail } = useContext(UserContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    urgency: "",
    superiorEmail: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/get-requests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        setRequests(res.data.requests);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_REQUEST_SERVICE_URL}/create-request`,
        formData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: userDetail.userEmail,
          subject: "Request Created!",
          text: `Hello ${userDetail.userName}, your ${formData.type} request has been submitted successfully.`,
        }
      );
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: formData.superiorEmail,
          subject: `New request from ${userDetail.userName}`,
          text: `Hello, you have a new ${formData.type} request from ${userDetail.userName}.`,
        }
      );
      alert("Request created successfully!");
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const handleApproveRequest = async (
    requestId,
    requestorEmail,
    requestorName,
    superiorEmail,
    superiorName,
    requestType
  ) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_REQUEST_SERVICE_URL}/approve-request/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: requestorEmail,
          subject: "Your request has been approved",
          text: `Hello ${requestorName}, your ${requestType} request has been approved by ${superiorName}.`,
        }
      );
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: superiorEmail,
          subject: "You approved a request",
          text: `Hello ${superiorName}, You have approved ${requestType} request from ${requestorName} (${requestorEmail}).`,
        }
      );
      alert("Request approved!");
      setRequests(
        requests.map((r) =>
          r._id === requestId ? { ...r, status: "Approved" } : r
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (
    requestId,
    requestorEmail,
    requestorName,
    superiorEmail,
    superiorName,
    requestType
  ) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_REQUEST_SERVICE_URL}/reject-request/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: requestorEmail,
          subject: "Your request has been rejected",
          text: `Hello ${requestorName}, your ${requestType} request has been rejected by ${superiorName}.`,
        }
      );
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: superiorEmail,
          subject: "You rejected a request",
          text: `Hello ${superiorName}, You have rejected ${requestType} request from ${requestorName} (${requestorEmail}).`,
        }
      );
      alert("Request rejected!");
      setRequests(
        requests.map((r) =>
          r._id === requestId ? { ...r, status: "Rejected" } : r
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setAuthToken(null);
      await axios.post(
        `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/send-email`,
        {
          to: userDetail.userEmail,
          subject: "Successful Logged out",
          text: `Hello ${userDetail.userName}, You have been successfully logged out.`,
        }
      );
      setUserDetail(null);
      navigate("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                variant="outlined"
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                variant="outlined"
                multiline
                rows={4}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                displayEmpty
                required
              >
                <MenuItem value="">Select Request Type</MenuItem>
                <MenuItem value="Leave">Leave</MenuItem>
                <MenuItem value="Equipment">Equipment</MenuItem>
                <MenuItem value="Overtime">Overtime</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                displayEmpty
                required
              >
                <MenuItem value="">Select Urgency</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Superior's Email"
                name="superiorEmail"
                variant="outlined"
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="secondary"
              >
                Create Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Box mt={5}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.urgency}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.isUserSuperior && request.status === "Pending" ? (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleApproveRequest(
                              request._id,
                              request.requestorEmail,
                              request.requestorName,
                              userDetail.userEmail,
                              userDetail.userName,
                              request.type
                            )
                          }
                          style={{ marginRight: 8 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() =>
                            handleRejectRequest(
                              request._id,
                              request.requestorEmail,
                              request.requestorName,
                              userDetail.userEmail,
                              userDetail.userName,
                              request.type
                            )
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      request.status
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Dashboard;
