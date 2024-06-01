import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function FreeSolo({ inputValue, handleInputChange }) {

  const [usernameList, setUsernameList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/registeredUsers')
      .then((response) => {
        setUsernameList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={usernameList.map((option) => option.username)}
        onChange={handleInputChange}
        renderInput={(params) => <TextField {...params} label="search voices by username" />}
      />
    </Stack>
  );
}
