import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid
} from '@mui/material';

const PlayerForm = ({ formData, onChange, onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            type="number"
            label="Age"
            value={formData.age}
            onChange={(e) => onChange({ ...formData, age: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => onChange({ ...formData, role: e.target.value })}
            >
              <MenuItem value="Player">Player</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            type="number"
            label="Rating"
            value={formData.rating}
            onChange={(e) => onChange({ ...formData, rating: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ height: '56px' }}
          >
            Add Player
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerForm;