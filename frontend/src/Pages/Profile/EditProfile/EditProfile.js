import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import './EditProfile.css';

import { useTranslation } from 'react-i18next';

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

  const {t} = useTranslation();

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
        <text>{t("Edit")}</text>
      </div>

      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <Box sx={{ ...style, width: 300, height: 300, position: 'relative' }}>
          <div className='text'>
            <h2> {t("Edit_DOB_heading")} </h2>
            <p> {t("Edit_DOB_tagline")} </p>
            <input
              type="date"
              onChange={e => setDob(e.target.value)}
              value={dob}
            />
            <Button className='e-button' onClick={handleClose}> {t("Cancel")} </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function EditProfile({ user, loggedInUser , onProfileSave }) {

  const {t} = useTranslation(); 

  const [name, setName] = React.useState(loggedInUser?.name || '');
  const [bio, setBio] = React.useState(loggedInUser?.bio || '');
  const [location, setLocation] = React.useState(loggedInUser?.location || '');
  const [dob, setDob] = React.useState(loggedInUser?.dob || '');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    const editedInfo = {
      name,
      bio,
      location,
      dob,
    };

    fetch(`${process.env.REACT_APP_Backend_url}/userUpdates/${user?.email}`, {
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
        loggedInUser.dob = dob;

        onProfileSave(editedInfo);
      });
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="Edit-profile-btn"> {t("Edit_profile")} </button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

      <div className='overlay' onClick={() => setOpen(false)}>

        <Box sx={style} className="modal" onClick={(e) => e.stopPropagation()}>
          <div className='header'>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
            <h2 className='header-title'>{t("Edit_profile")}</h2>
            <button className='save-btn' onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : t("Save")}
            </button>
          </div>
          
          <form className='fill-content'>
            <TextField
              className='text-field'
              fullWidth
              label={t("Name")}
              variant='filled'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              className='text-field'
              fullWidth
              label={t("Bio")}
              variant='filled'
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
            <TextField
              className='text-field'
              fullWidth
              label={t("Location")}
              variant='filled'
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </form>

          <div className='birthdate-section'>
            <p>{t("DOB_msg1")}</p>
            <EditChild dob={dob} setDob={setDob} />
          </div>

          <div className='last-section'>
            <h2>{dob ? dob : t("DOB_msg2")}</h2>
          </div>
        </Box>
        </div>
      </Modal>
    </div>
  );
}
