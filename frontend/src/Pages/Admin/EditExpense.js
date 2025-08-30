import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import { useLoader } from '../../Context/LoaderContext';

const EditExpense = () => {
  const { id } = useParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchExpense = async () => {
      showLoader();
      try {
        const response = await axios.get(`${backendUrl}/expense/${id}`);
        if (response.data.success) {
          const expense = response.data.expenses[0];
          setDescription(expense.description);
          setAmount(expense.amount);
          setCategory(expense.category);
          setDate(new Date(expense.date).toISOString().split('T')[0]);
        }
      } catch (error) {
        toast.error('Error fetching expense details');
        console.error(error);
      } finally {
        hideLoader();
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!description || !amount || !category || !date) {
      toast.error('Please fill all fields');
      return;
    }

    showLoader();
    setLoading(true);

    try {
      const response = await axios.put(`${backendUrl}/expense/${id}`, { description, amount, category, date });
      if (response.data.success) {
        toast.success('Expense updated successfully');
        navigate('/dashboard/admin/expense');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error updating expense');
      console.error(error);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>Edit Expense</Typography>
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
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            select
            SelectProps={{ native: true }}
            style={{ marginBottom: '20px' }}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </TextField>
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ flex: 1, marginRight: '10px' }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Expense'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              style={{ flex: 1 }}
              onClick={() => navigate('/dashboard/admin/expense')}
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

export default EditExpense;
