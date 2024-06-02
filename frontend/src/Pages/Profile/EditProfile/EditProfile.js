import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import './EditProfile.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 8,
};

function EditChild({ dob, setDob }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div className='birthdate-section' onClick={handleOpen}>
        <text>Edit</text>
      </div>

      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <Box sx={{ ...style, width: 300, height: 300, position: 'relative' }}>
          <div className='text'>
            <h2>Edit date of birth?</h2>
            <p>This can only be changed a few times.</p>
            <input
              type="date"
              onChange={e => setDob(e.target.value)}
              value={dob}
            />
            <Button className='e-button' onClick={handleClose}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function EditProfile({ user, loggedInUser , onProfileSave }) {
  const [name, setName] = React.useState(loggedInUser?.name || '');
  const [bio, setBio] = React.useState(loggedInUser?.bio || '');
  const [location, setLocation] = React.useState(loggedInUser?.location || '');
  const [website, setWebsite] = React.useState(loggedInUser?.website || '');
  const [dob, setDob] = React.useState(loggedInUser?.dob || '');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    const editedInfo = {
      name,
      bio,
      location,
      website,
      dob,
    };

    fetch(`http://localhost:5000/userUpdates/${user?.email}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedInfo),
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setOpen(false);

        loggedInUser.name = name;
        loggedInUser.bio = bio;
        loggedInUser.location = location;
        loggedInUser.website = website;
        loggedInUser.dob = dob;

        onProfileSave(editedInfo);
      });
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="Edit-profile-btn">Edit profile</button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

      <div className='overlay' onClick={() => setOpen(false)}>

        <Box sx={style} className="modal" onClick={(e) => e.stopPropagation()}>
          <div className='header'>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
            <h2 className='header-title'>Edit Profile</h2>
            <button className='save-btn' onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </button>
          </div>
          
          <form className='fill-content'>
            <TextField
              className='text-field'
              fullWidth
              label="Name"
              variant='filled'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              className='text-field'
              fullWidth
              label="Bio"
              variant='filled'
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
            <TextField
              className='text-field'
              fullWidth
              label="Location"
              variant='filled'
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
            <TextField
              className='text-field'
              fullWidth
              label="Website"
              variant='filled'
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
            />
          </form>

          <div className='birthdate-section'>
            <p>Birth Date</p>
            <EditChild dob={dob} setDob={setDob} />
          </div>

          <div className='last-section'>
            <h2>{dob ? dob : 'Add your date of birth'}</h2>
          </div>
        </Box>
        </div>
      </Modal>
    </div>
  );
}
