import React from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PlayerList = ({ players, clubs = [], onDelete }) => {
  console.log('Players:', players); // Debug
  console.log('Clubs:', clubs); // Debug

  const getClubName = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'No Club';
  };

  return (
    <Paper elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Club</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>
                <Link 
                  to={`/players/${player.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {player.name}
                </Link>
              </TableCell>
              <TableCell>{player.age}</TableCell>
              <TableCell>{player.role}</TableCell>
              <TableCell>{player.rating}</TableCell>
              <TableCell>
                {player.clubId ? (
                  <Link 
                    to={`/clubs/${player.clubId}`} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {getClubName(player.clubId)}
                  </Link>
                ) : (
                  'No Club'
                )}
              </TableCell>
              <TableCell align="right">
                <Link 
                  to={`/players/${player.id}`}
                  style={{ textDecoration: 'none', marginRight: '8px' }}
                >
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    variant="outlined"
                  >
                    View
                  </Button>
                </Link>
                <IconButton 
                  onClick={() => onDelete(player.id)} 
                  size="small"
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
  );
};

export default PlayerList;