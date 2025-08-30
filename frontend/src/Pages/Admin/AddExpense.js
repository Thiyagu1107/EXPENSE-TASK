import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import { useLoader } from '../../Context/LoaderContext';

const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!description || !amount || !category || !date) {
      toast.error('Please fill all fields');
      return;
    }

    showLoader();
    setLoading(true);


    const data = { description, amount, category, date };

    try {
      const response = await axios.post(`${backendUrl}/expense`, data);
      if (response.data.success) {
        toast.success('Expense added successfully!');
        navigate('/dashboard/admin/expense');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

    const handleCancel = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
    };



  return (
    <Layout>
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>Add Expense</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: '20px' }}
          />

          <TextField
            label="Amount"
            variant="outlined"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ marginBottom: '20px' }}
          />

          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Shopping">Shopping</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date"
            variant="outlined"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ flex: 1, marginRight: '10px' }}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              style={{ flex: 1 }}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Container>
    </Layout>
  );
};

export default AddExpense;
