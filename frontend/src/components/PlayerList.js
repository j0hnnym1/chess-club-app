import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PlayerList = ({ players, onDelete }) => {
  return (
    <Paper elevation={2}>
      <List>
        {players.map((player) => (
          <ListItem key={player.id} divider>
            <ListItemText
              primary={player.name}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Age: {player.age} • Role: {player.role} • Rating: {player.rating}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(player.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PlayerList;