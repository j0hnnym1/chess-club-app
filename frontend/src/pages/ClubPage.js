import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Box,
  Stack
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const ClubsPage = ({ token }) => {
  const [clubs, setClubs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      console.log('Fetching clubs...'); // Debug
      const response = await axios.get('http://localhost:3000/api/clubs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Clubs response:', response.data); // Debug
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error); // Debug
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (club = null) => {
    console.log('Opening dialog with club:', club); // Debug
    setSelectedClub(club);
    setFormData(club || { name: '', location: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClub(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Submitting club data:', formData); // Debug
      if (selectedClub) {
        await axios.put(`http://localhost:3000/api/clubs/${selectedClub.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:3000/api/clubs', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      await fetchClubs();
      handleClose();
    } catch (error) {
      console.error('Error submitting club:', error); // Debug
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      console.log('Deleting club:', id); // Debug
      await axios.delete(`http://localhost:3000/api/clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchClubs();
    } catch (error) {
      console.error('Error deleting club:', error); // Debug
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && clubs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Clubs
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Club
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell>
                  <Link to={`/clubs/${club.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {club.name}
                  </Link>
                </TableCell>
                <TableCell>{club.location}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(club)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(club.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedClub ? 'Edit Club' : 'Add Club'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={formData.location}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClubsPage;