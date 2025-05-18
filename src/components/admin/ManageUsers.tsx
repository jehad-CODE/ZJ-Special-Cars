import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
  RadioGroup,
  Radio,
  FormControlLabel,
  Paper,
  styled
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Add as AddIcon,
  Sort as SortIcon,
  Close as CloseIcon
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

interface NewUser {
  username: string;
  email: string;
  password: string;
  phone: string;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface ApiResponse {
  message?: string;
  [key: string]: any;
}

type SortOption = 'username_asc' | 'username_desc' | 'email_asc' | 'email_desc' | 'newest' | 'oldest';

// Styled components for better table design
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 15,
  padding: '16px',
}));

// Modified StyledTableRow without hover effect and background color
const StyledTableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
});

// Number cell styling
const NumberCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  width: '50px',
  color: theme.palette.primary.main,
}));

// Custom pagination styling
const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    margin: theme.spacing(0, 0.5),
    [theme.breakpoints.down('sm')]: {
      minWidth: '30px',
      height: '30px',
      fontSize: '0.75rem',
    },
  },
}));

const ManageUsers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [viewType, setViewType] = useState<'staff' | 'user' | 'admin'>('staff');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUser>({ username: '', email: '', password: '', phone: '' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [sortDialogOpen, setSortDialogOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({ open: false, message: '', severity: 'success' });
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10; // Each page shows 10 users
  
  // Sorting
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Get token from localStorage for authentication
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    fetchUsers();
  }, [sortBy]);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      let sortedUsers = [...response.data];
      
      // Apply sorting
      switch (sortBy) {
        case 'username_asc':
          sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
          break;
        case 'username_desc':
          sortedUsers.sort((a, b) => b.username.localeCompare(a.username));
          break;
        case 'email_asc':
          sortedUsers.sort((a, b) => a.email.localeCompare(b.email));
          break;
        case 'email_desc':
          sortedUsers.sort((a, b) => b.email.localeCompare(a.email));
          break;
        case 'newest':
          sortedUsers.sort((a, b) => b._id.localeCompare(a._id));
          break;
        case 'oldest':
          sortedUsers.sort((a, b) => a._id.localeCompare(b._id));
          break;
      }
      
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      showAlert(
        axiosError.response?.data?.message || 'Failed to load users', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message: string, severity: AlertColor = 'success'): void => {
    setAlert({ open: true, message, severity });
  };

  const handleViewChange = (type: 'staff' | 'user' | 'admin'): void => {
    setViewType(type);
    setPage(1); // Reset to first page when changing view
  };

  const resetNewUserForm = (): void => {
    setNewUser({ username: '', email: '', password: '', phone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<string>): void => {
    if (editUser) {
      setEditUser({ 
        ...editUser, 
        role: e.target.value as 'user' | 'staff' | 'admin' 
      });
    }
  };

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const handleOpenAddDialog = (): void => {
    resetNewUserForm();
    setAddDialogOpen(true);
  };

  const handleAdd = async (): Promise<void> => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      showAlert('Please fill in username, email, and password', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post<ApiResponse>(
        `${API_URL}/users`, 
        {
          ...newUser,
          role: viewType // Set role based on current view
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Close dialog and reset form
      setAddDialogOpen(false);
      resetNewUserForm();
      
      showAlert(response.data.message || 'User added successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error adding user:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      showAlert(
        axiosError.response?.data?.message || 'Failed to add user', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (user: User): void => {
    setEditUser({
      ...user,
      password: ''
    } as User & { password?: string });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editUser || !editUser.username || !editUser.email) {
      showAlert('Username and email are required', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const userData = { ...editUser };
      const userId = editUser._id;
      
      const response = await axios.put<ApiResponse>(
        `${API_URL}/users/${userId}`, 
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setEditDialogOpen(false);
      showAlert(response.data.message || 'User updated successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      showAlert(
        axiosError.response?.data?.message || 'Failed to update user', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        
        const response = await axios.delete<ApiResponse>(`${API_URL}/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        showAlert(response.data.message || 'User deleted successfully');
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error('Error deleting user:', error);
        const axiosError = error as AxiosError<ApiResponse>;
        showAlert(
          axiosError.response?.data?.message || 'Failed to delete user', 
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter users by role
  const filteredUsers = users.filter(user => user.role === viewType);

  // Paginate the filtered list (10 users per page)
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  // Calculate total pages, ensure at least 1 page even if no users
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

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

  return (
    <Box>

      {/* Filters and Actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        {/* Type filter buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['staff', 'user', 'admin'].map((type) => (
            <Button 
              key={type} 
              variant={viewType === type ? 'contained' : 'outlined'} 
              onClick={() => handleViewChange(type as 'staff' | 'user' | 'admin')} 
              sx={{ mb: 1 }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1) + (type === 'admin' ? 's' : 's')}
            </Button>
          ))}
        </Stack>
        
        {/* Sort button */}
        <Button 
          variant="outlined" 
          startIcon={<SortIcon />} 
          onClick={() => setSortDialogOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Sort By: {getSortLabel()}
        </Button>
      </Box>

      {/* Add Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Add {viewType === 'staff' ? 'Staff' : viewType === 'admin' ? 'Admin' : 'User'}
        </Button>
      </Box>

      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper elevation={1} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell width="60px">#</StyledTableCell>
                    <StyledTableCell>Username</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    {!isMobile && <StyledTableCell>Phone</StyledTableCell>}
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <StyledTableRow key={user._id}>
                        <NumberCell>{startIndex + index + 1}</NumberCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        {!isMobile && <TableCell>{user.phone || '-'}</TableCell>}
                        <TableCell>
                          <Box sx={{ 
                            bgcolor: user.role === 'admin' ? 'error.main' : 
                                    user.role === 'staff' ? 'warning.main' : 'success.main',
                            color: 'white',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {user.role.toUpperCase()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" startIcon={<EditIcon />}
                            onClick={() => openEditDialog(user)}
                            sx={{ mr: 1 }}>
                            Edit
                          </Button>
                          <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(user._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <TableCell colSpan={isMobile ? 5 : 6} align="center">
                        No {viewType === 'staff' ? 'staff members' : viewType === 'admin' ? 'admins' : 'users'} found
                      </TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          {/* Pagination - always display regardless of content */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <StyledPagination 
              count={totalPages} 
              page={page}
              onChange={handleChangePage}
              color="primary"
              size={isMobile ? "small" : "large"}
              hideNextButton
              hidePrevButton
              siblingCount={isMobile ? 0 : 1}
            />
          </Box>
        </>
      )}

      {/* Add User Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}
      >
        <DialogTitle>
          Add New {viewType === 'staff' ? 'Staff Member' : viewType === 'admin' ? 'Admin' : 'User'}
          <IconButton 
            onClick={() => setAddDialogOpen(false)} 
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: '#aaa' } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: '#aaa' } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: '#aaa' } }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={newUser.phone}
              onChange={handleInputChange}
              fullWidth
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: '#aaa' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button 
            onClick={handleAdd} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}
      >
        <DialogTitle>
          Edit User
          <IconButton 
            onClick={() => setEditDialogOpen(false)} 
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
          {editUser && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Username"
                name="username"
                value={editUser.username}
                onChange={handleEditInputChange}
                fullWidth
                required
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={editUser.email}
                onChange={handleEditInputChange}
                fullWidth
                required
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={editUser.phone || ''}
                onChange={handleEditInputChange}
                fullWidth
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              <FormControl fullWidth required>
                <InputLabel sx={{ color: '#aaa' }}>Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={editUser.role}
                  label="Role"
                  onChange={handleRoleChange}
                  inputProps={{ style: { color: 'white' } }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sort Dialog */}
      <Dialog 
        open={sortDialogOpen} 
        onClose={() => setSortDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}
      >
        <DialogTitle>Sort Users</DialogTitle>
        <DialogContent>
          <RadioGroup 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <FormControlLabel value="newest" control={<Radio />} label="Newest First" />
            <FormControlLabel value="oldest" control={<Radio />} label="Oldest First" />
            <FormControlLabel value="username_asc" control={<Radio />} label="Username (A-Z)" />
            <FormControlLabel value="username_desc" control={<Radio />} label="Username (Z-A)" />
            <FormControlLabel value="email_asc" control={<Radio />} label="Email (A-Z)" />
            <FormControlLabel value="email_desc" control={<Radio />} label="Email (Z-A)" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setSortDialogOpen(false)} 
            variant="contained"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;