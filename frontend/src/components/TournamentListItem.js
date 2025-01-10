import React from 'react';
import { Card, CardContent, Typography, ButtonGroup, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TournamentListItem = ({ tournament, onDelete, onEdit, isDeleting }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {tournament.name}
          </Typography>
          <ButtonGroup variant="contained" size="small">
            <Button
              component={Link}
              to={`/tournaments/${tournament._id}`}
              startIcon={<VisibilityIcon />}
              color="primary"
            >
              View
            </Button>
            <Button
              onClick={() => onEdit(tournament)}
              startIcon={<EditIcon />}
              color="secondary"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(tournament._id)}
              startIcon={<DeleteIcon />}
              color="error"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TournamentListItem;