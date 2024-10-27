import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CollectionAccordian from './CollectionAccordian';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';


const styles = {
    accordianStyle: {
        margin: '10px 0px',
        backgroundColor: '#373d42',
        color: 'white',
        border: '1px solid white',
        borderRadius: '10px'
    },
    dbNameChangeStyle: {
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

const DatabaseAccordian = ({ _id, openValueOfDb }) => {
    const [dbData, setDbData] = useState(null);
    const [dbNameChangeModal, setDbNameChangeModal] = useState(false);
    const [selectedDb, setSelectedDb] = useState('');
    const [newDbName, setNewDbName] = useState('');

    const fetchData = async () => {
        const response = await axios.get(`https://mongodb-mini-playground.onrender.com/api/readDatabases/${_id}`);
        setDbData(response.data);
    };

    useEffect(() => {
        fetchData();
    }, [openValueOfDb]);

    const handleOpenDbChangeModal = (db) => {
        setDbNameChangeModal(true);
        setSelectedDb(db);
    };

    const handleCloseDbChangeModal = () => setDbNameChangeModal(false);

    const handleDbNameChange = async (dbId, newDbName) => {
        const response = await axios.post('https://mongodb-mini-playground.onrender.com/api/changeDbName', { _id, dbId, newDbName });
        console.log(response.data);
        handleCloseDbChangeModal();
        fetchData();
    };

    const handleDeleteDb = async (db) => {
        const response = await axios.post('https://mongodb-mini-playground.onrender.com/api/deleteDb', { _id, dbId: db._id });
        console.log(response.data);
        fetchData();
    };

    return (
        <>
            {dbData && dbData.map((ele, index) => (
                <Accordion key={index} style={styles.accordianStyle}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}>
                        <div className='flex justify-between w-full items-center p-4'>
                            <div className='flex space-x-6 items-center'>
                                <h1 className='text-xl'>{ele.dbName}</h1>
                                <EditIcon onClick={() => handleOpenDbChangeModal(ele)} className=''>Update Database Name</EditIcon>
                            </div>
                            <div className='btnBox flex gap-6'>
                                <button onClick={() => handleDeleteDb(ele)} className='border rounded-md px-4 py-2 font-semibold'>Delete Database</button>
                            </div>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails>
                        <CollectionAccordian _id={_id} dbId={ele._id} dbName={ele.dbName} />
                    </AccordionDetails>
                </Accordion>
            ))}

            <Modal open={dbNameChangeModal} onClose={handleCloseDbChangeModal}>
                <Box sx={styles.dbNameChangeStyle}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleDbNameChange(selectedDb._id, newDbName);
                    }}>
                        <input type='text' onChange={(e) => setNewDbName(e.target.value)} />
                        <button type='submit' className='px-4 py-2 bg-red-400'>Submit</button>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default DatabaseAccordian;
