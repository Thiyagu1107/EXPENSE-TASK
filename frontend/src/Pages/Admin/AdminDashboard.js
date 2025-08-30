import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoader } from '../../Context/LoaderContext';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const { showLoader, hideLoader } = useLoader();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchSummary = async () => {
    showLoader();
    try {
      const res = await axios.get(`${backendUrl}/expense/summary`);
      if (res.data.success) {
        setSummary(res.data.summary);
      } else {
        toast.error(res.data.message || 'Failed to fetch summary');
      }
    } catch (err) {
      toast.error('Error fetching summary');
      console.error(err);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', minHeight: '80vh' }}>
          <Typography variant="h6" color="textSecondary">
            Loading summary...
          </Typography>
        </Box>
      </Layout>
    );
  }


  const pieData = Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }));
  const barData = pieData;

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Expense Summary
        </Typography>
        <Typography variant="h4" color="primary">
          ₹ {summary.total.toLocaleString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expenses by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36}/>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expenses by Category (Bar)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AdminDashboard;
