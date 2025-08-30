import React, { useState, useEffect } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Box, TablePagination, Typography, TextField } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../../Components/Layout/Layout';
import { useLoader } from '../../Context/LoaderContext';
import * as XLSX from 'xlsx';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [keyword, setKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchExpenses = async () => {
    showLoader();
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (filterCategory) params.category = filterCategory;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(`${backendUrl}/expense`, { params });
      if (response.data.success) {
        setExpenses(response.data.expenses);
      } else {
        toast.error(response.data.message || 'Unable to fetch expenses');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching expenses');
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/admin/expense/edit/${id}`);
  };

  const handleDelete = async () => {
    if (expenseToDelete) {
      showLoader();
      try {
        const response = await axios.delete(`${backendUrl}/expense/${expenseToDelete}`);
        if (response.data.success) {
          toast.success('Expense deleted successfully');
          setExpenses(expenses.filter(exp => exp._id !== expenseToDelete));
        } else {
          toast.error('Failed to delete expense');
        }
      } catch (error) {
        toast.error('Error deleting expense');
        console.error(error);
      } finally {
        hideLoader();
        setOpenDeleteDialog(false);
      }
    }
  };

  const handleDeleteClick = (id) => {
    setExpenseToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setExpenseToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const paginatedExpenses = expenses.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const exportToExcel = () => {
    const formattedData = expenses.map((expense) => ({
      Description: expense.description,
      Amount: expense.amount,
      Category: expense.category,
      Date: (new Date(expense.date).toISOString().split('T')[0]),
      UserId: expense.userId
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

    XLSX.writeFile(wb, 'expenses.xlsx');
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setExcelFile(file);
      handleImportExcel();
    } else {
      toast.error('Please upload a valid Excel file.');
    }
  };

  const handleImportExcel = async () => {
    if (!excelFile) {
      toast.error('Please select an Excel file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const transformedData = jsonData.map((expense) => ({
        description: expense.Description,  
        amount: expense.Amount,            
        category: expense.Category,        
        date: expense.Date,               
        userId: expense.UserId,            
      }));

      try {
        const response = await axios.post(`${backendUrl}/expense/import`, { expenses: transformedData });
        if (response.data.success) {
          toast.success('Expenses imported successfully');
          setExpenses([...expenses, ...response.data.expenses]);
        } else {
          toast.error('Failed to import expenses');
        }
      } catch (error) {
        toast.error('Error importing expenses');
        console.error(error);
      }
    };
    reader.readAsBinaryString(excelFile);
  };


  return (
    <Layout>
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
          <TextField
            label="Search Description"
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            size="small"
          />
          <TextField
            label="Category"
            variant="outlined"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            select
            SelectProps={{ native: true }}
            size="small"
          >
            <option value=""></option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
          />
          <Button variant="contained" color="primary" onClick={fetchExpenses}>
            Apply Filters
          </Button>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: '20px' }}>
          <Typography variant="h5">Manage Expenses</Typography>
          <Link to="/dashboard/admin/expense/create" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Add Expense</Button>
          </Link>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={exportToExcel} 
            style={{ marginBottom: '20px' }}
          >
            Export to Excel
          </Button>

          <Button 
            variant="contained" 
            color="success" 
            component="label" 
            style={{ marginBottom: '20px' }}
          >
            Import Excel
            <input 
              type="file" 
              hidden 
              accept=".xlsx" 
              onChange={handleExcelFileChange} 
            />
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.length > 0 ? (
                paginatedExpenses.map((expense, index) => (
                  <TableRow key={expense._id}>
                    <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit Expense">
                        <IconButton onClick={() => handleEdit(expense._id)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Expense">
                        <IconButton onClick={() => handleDeleteClick(expense._id)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center' }}>No expenses found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={expenses.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this expense? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ExpenseList;
