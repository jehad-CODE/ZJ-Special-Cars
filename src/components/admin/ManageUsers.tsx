import React, { useState } from 'react';
import {
  Typography,
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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

// Mock data with roles
const mockData = [
  { id: 1, name: 'Staff Member 1', email: 'staff1@example.com', role: 'staff' },
  { id: 2, name: 'Staff Member 2', email: 'staff2@example.com', role: 'staff' },
  { id: 3, name: 'User 1', email: 'user1@example.com', role: 'user' },
  { id: 4, name: 'User 2', email: 'user2@example.com', role: 'user' },
];

const ManageUsers: React.FC = () => {
  const [viewType, setViewType] = useState<'staff' | 'user'>('staff');
  const [data, setData] = useState(mockData);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const filteredData = data.filter((item) => item.role === viewType);

  const handleViewChange = (type: 'staff' | 'user') => {
    setViewType(type);
  };

  const handleAdd = () => {
    if (newUser.name && newUser.email) {
      const newItem = {
        id: data.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: viewType,
      };
      setData([...data, newItem]);
      setNewUser({ name: '', email: '' });
    }
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage {viewType === 'staff' ? 'Staff' : 'Users'}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Here you can manage the {viewType === 'staff' ? 'staff members' : 'users'} in the system.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant={viewType === 'staff' ? 'contained' : 'outlined'}
          onClick={() => handleViewChange('staff')}
        >
          Staff
        </Button>
        <Button
          variant={viewType === 'user' ? 'contained' : 'outlined'}
          onClick={() => handleViewChange('user')}
        >
          Users
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add {viewType === 'staff' ? 'Staff' : 'User'}
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell align="right">
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageUsers;
