import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import DatabaseAccordian from './DatabaseAccordian';
import AddStuffForm from './AddStuffForm';
import EditIcon from '@mui/icons-material/Edit';

const styles = {
  accordianStyle: {
    backgroundColor: '#212529',
    color: 'white',
    borderRadius: '10px'
  },
  userNameChangeStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  },
};

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id, userName } = location.state;
  const [openValueOfDb, setOpenValueOfDb] = useState(false);
  const [newUserName, setNewUserName] = useState(userName);
  const [userNameChangeModal, setUserNameChangeModal] = useState(false);

  // Function to open and close modal
  const handleOpen = () => setUserNameChangeModal(true);
  const handleClose = () => setUserNameChangeModal(false);

  // Function to handle username change
  const handleUserNameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/changeUserName', { _id, newUserName });
      console.log(response.data);
      setNewUserName(response.data.userName); // Update the displayed username
      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  // Function to handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      await axios.post('http://localhost:3001/api/deleteUser', { _id });
      navigate('/'); // Redirect to the home page after deletion
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className='bg-dblack min-h-screen p-16'>
      {/* TITLE BOX STARTS */}
      <div className='titleBox p-6 py-10 mb-6 rounded-xl flex justify-between items-center text-white bg-sblack'>
        <div className='flex space-x-6 items-center'>
          <h1 className='text-4xl font-bold'>Welcome {newUserName}</h1>
          <EditIcon onClick={handleOpen} className='h-10'>Change Username</EditIcon>
        </div>
        <div className='btnBox flex gap-6'>
          <button onClick={handleDeleteProfile} className='border rounded-md px-4 py-2 font-semibold'>Delete Profile</button>
        </div>
      </div>
      {/* TITLE BOX ENDS */}

      {/* MAIN BOX STARTS */}
      <div className='bg-dblack'>
        <Accordion style={styles.accordianStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}>
            <div className='flex justify-between w-full items-center p-4'>
              <h1 className='text-xl'>Databases :</h1>
              <button onClick={() => setOpenValueOfDb(true)} className='border rounded-md px-4 py-2 font-semibold'>Add Database</button>
            </div>
          </AccordionSummary>

          <AccordionDetails sx={styles.accordianStyle}>
            <DatabaseAccordian _id={_id} openValueOfDb={openValueOfDb} />
          </AccordionDetails>
        </Accordion>

        {openValueOfDb && <AddStuffForm _id={_id} openValue={openValueOfDb} setOpenValue={setOpenValueOfDb} />}
      </div>
      {/* MAIN BOX ENDS */}

      {/* USERNAME CHANGE MODAL */}
      <Modal open={userNameChangeModal} onClose={handleClose}>
        <Box sx={styles.userNameChangeStyle}>
          <form onSubmit={handleUserNameChange}>
            <input
              type='text'
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className='border rounded w-full p-2'
            />
            <button type='submit' className='px-4 py-2 mt-4 bg-red-400 text-white rounded'>Submit</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
