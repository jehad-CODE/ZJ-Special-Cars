import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Snackbar, Alert, AlertColor, Pagination, useMediaQuery, useTheme,
  RadioGroup, Radio, FormControlLabel, Paper, styled
} from '@mui/material';
import { 
  Edit as EditIcon, Sort as SortIcon, Close as CloseIcon,
  Delete as DeleteIcon, Add as AddIcon
} from '@mui/icons-material';
import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Define TypeScript interfaces
interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'staff' | 'admin';
}

interface UserUpdate extends User {
  password?: string;
}

interface NewUser {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'user';
}

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

type SortOption = 'username_asc' | 'username_desc' | 'email_asc' | 'email_desc' | 'newest' | 'oldest';

// Styled components 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  fontSize: 15,
  padding: '16px',
}));

const StyledTableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': { border: 0 },
});

const NumberCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  width: '50px',
  color: theme.palette.success.main,
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    margin: theme.spacing(0, 0.5),
    [theme.breakpoints.down('sm')]: {
      minWidth: '30px',
      height: '30px',
      fontSize: '0.75rem',
    },
  },
  // Style the pagination to use the success color
  '& .Mui-selected': {
    backgroundColor: `${theme.palette.success.main} !important`,
    color: theme.palette.common.white,
  },
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: theme.palette.success.light,
  }
}));

// Text field styling
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
  }
};

const ManageUsers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('token');

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<UserUpdate | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({ 
    username: '', email: '', password: '', phone: '', role: 'user' 
  });
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [sortDialogOpen, setSortDialogOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const itemsPerPage = 10;

  useEffect(() => { fetchUsers(); }, [sortBy]);

  // Fetch users from API
  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Filter to only include users with role = "user"
      const userAccounts = response.data.filter(user => user.role === 'user') as User[];
      
      // Apply sorting
      let sortedUsers = [...userAccounts];
      switch (sortBy) {
        case 'username_asc': sortedUsers.sort((a, b) => a.username.localeCompare(b.username)); break;
        case 'username_desc': sortedUsers.sort((a, b) => b.username.localeCompare(a.username)); break;
        case 'email_asc': sortedUsers.sort((a, b) => a.email.localeCompare(b.email)); break;
        case 'email_desc': sortedUsers.sort((a, b) => b.email.localeCompare(a.email)); break;
        case 'newest': sortedUsers.sort((a, b) => b._id.localeCompare(a._id)); break;
        case 'oldest': sortedUsers.sort((a, b) => a._id.localeCompare(b._id)); break;
      }
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      const axiosError = error as AxiosError<any>;
      showAlert(axiosError.response?.data?.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show alert
  const showAlert = (message: string, severity: AlertColor = 'success'): void => {
    setAlert({ open: true, message, severity });
  };

  // Add new user
  const handleAdd = async (): Promise<void> => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      showAlert('Username, email, and password are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/users`, newUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAddDialogOpen(false);
      showAlert(response.data.message || 'User added successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      const axiosError = error as AxiosError<any>;
      showAlert(axiosError.response?.data?.message || 'Failed to add user', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUpdate = async (): Promise<void> => {
    if (!editUser || !editUser.username || !editUser.email) {
      showAlert('Username and email are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const userData = { ...editUser };
      const userId = editUser._id;
      
      const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setEditDialogOpen(false);
      showAlert(response.data.message || 'User updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      const axiosError = error as AxiosError<any>;
      showAlert(axiosError.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_URL}/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        showAlert(response.data.message || 'User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        const axiosError = error as AxiosError<any>;
        showAlert(axiosError.response?.data?.message || 'Failed to delete user', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper functions
  const getSortLabel = (): string => {
    switch (sortBy) {
      case 'username_asc': return 'Username (A-Z)';
      case 'username_desc': return 'Username (Z-A)';
      case 'email_asc': return 'Email (A-Z)';
      case 'email_desc': return 'Email (Z-A)';
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      default: return 'Newest First';
    }
  };

  // Pagination calculations
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0px 2px 3px rgba(0,0,0,0.3)' }}>
        Manage Users
      </Typography>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => { setNewUser({ username: '', email: '', password: '', phone: '', role: 'user' }); setAddDialogOpen(true); }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Add User
        </Button>
        <Button variant="outlined" color="success" startIcon={<SortIcon />} onClick={() => setSortDialogOpen(true)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Sort By: {getSortLabel()}
        </Button>
      </Box>

      {/* Users table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', background: 'linear-gradient(145deg, #2c2c2c, #333333)', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell width="60px">#</StyledTableCell>
                    <StyledTableCell>Username</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    {!isMobile && <StyledTableCell>Phone</StyledTableCell>}
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <StyledTableRow key={user._id}>
                        <NumberCell>{startIndex + index + 1}</NumberCell>
                        <TableCell sx={{ fontWeight: 'medium', color: 'white' }}>{user.username}</TableCell>
                        <TableCell sx={{ color: '#cccccc' }}>{user.email}</TableCell>
                        {!isMobile && <TableCell sx={{ color: '#cccccc' }}>{user.phone || '-'}</TableCell>}
                        <TableCell align="right">
                          <Button size="small" variant="outlined" color="success" startIcon={<EditIcon />} onClick={() => { setEditUser({...user}); setEditDialogOpen(true); }} sx={{ mr: 1, mb: { xs: 1, md: 0 } }}>Edit</Button>
                          <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(user._id)}>Delete</Button>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <TableCell colSpan={isMobile ? 4 : 5} align="center" sx={{ color: 'white' }}>No users found</TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          {/* Pagination */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <StyledPagination 
              count={totalPages} 
              page={page} 
              onChange={(_, newPage) => setPage(newPage)} 
              color="primary"
              size={isMobile ? "small" : "large"} 
              hideNextButton={isMobile} 
              hidePrevButton={isMobile} 
              siblingCount={isMobile ? 0 : 1} 
            />
          </Box>
        </>
      )}

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}>
        <DialogTitle>
          Add New User
          <IconButton onClick={() => setAddDialogOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Username" name="username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required fullWidth InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
            <TextField label="Email" name="email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required fullWidth InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
            <TextField label="Password" name="password" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required fullWidth InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
            <TextField label="Phone" name="phone" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} fullWidth InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="success" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}>
        <DialogTitle>
          Edit User
          <IconButton onClick={() => setEditDialogOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
          {editUser && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="Username" name="username" value={editUser.username} onChange={(e) => setEditUser({...editUser, username: e.target.value})} fullWidth required InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
              <TextField label="Email" name="email" type="email" value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} fullWidth required InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
              <TextField label="Phone" name="phone" value={editUser.phone || ''} onChange={(e) => setEditUser({...editUser, phone: e.target.value})} fullWidth InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
              <TextField label="New Password (leave blank to keep current)" name="password" type="password" value={editUser.password || ''} onChange={(e) => setEditUser({...editUser, password: e.target.value})} fullWidth InputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: '#aaa' } }} sx={textFieldStyle} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="success" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sort Dialog */}
      <Dialog open={sortDialogOpen} onClose={() => setSortDialogOpen(false)} PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}>
        <DialogTitle>Sort Users</DialogTitle>
        <DialogContent>
          <RadioGroup value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
            <FormControlLabel value="newest" control={<Radio color="success" />} label="Newest First" />
            <FormControlLabel value="oldest" control={<Radio color="success" />} label="Oldest First" />
            <FormControlLabel value="username_asc" control={<Radio color="success" />} label="Username (A-Z)" />
            <FormControlLabel value="username_desc" control={<Radio color="success" />} label="Username (Z-A)" />
            <FormControlLabel value="email_asc" control={<Radio color="success" />} label="Email (A-Z)" />
            <FormControlLabel value="email_desc" control={<Radio color="success" />} label="Email (Z-A)" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSortDialogOpen(false)} variant="contained" color="success">Done</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;