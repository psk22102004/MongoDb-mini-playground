import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
// import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DocumentAccordian from './DocumentAccordian';
import AddStuffForm from './AddStuffForm';
import UpdateStuffForm from './UpdateStuffForm';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';




/* 
[
    {
        "collectionName": "Newest-Parth-Collection",
        "documents": [],
        "_id": "670a4ef953d9357994014a1f"
    }
]
*/

const styles = {
    accordianStyle: {
        margin: '10px 0px',
        backgroundColor: '#3e454c',
        color: 'white',
        border: '1px solid white',
        borderRadius: '10px'
    },
    colllNameChangeStyle: {
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
}

const CollectionAccordian = ({ _id, dbId, dbName }) => {
    const [collData, setCollData] = useState(null);
    const [openValue, setOpenValue] = useState(false);
    const [openValue2, setOpenValue2] = useState(false);

    const [newCollName, setNewCollName] = useState('');
    const [colChangeModal, setColChangeModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState('');

    const handleOpen = (collection) => {
        setColChangeModal(true);
        setSelectedCollection(collection);
    }
    const handleClose = () => setColChangeModal(false);


    const fetchCollData = async () => {
        const response = await axios.post('http://localhost:3001/api/readCollections', { _id, dbId });
        setCollData(response.data);
    }

    useEffect(
        () => {

            fetchCollData();
        }, [openValue, openValue2]
    )

    const handleColleNameChange = async (collId, newCollName) => {
        const response = await axios.post('http://localhost:3001/api/changeCollName', { _id, dbId, collId, newCollName });
        console.log(response.data);
        handleClose();
        fetchCollData();
    }

    const handleDelete = async (collection) => {
        const response = await axios.post('http://localhost:3001/api/deleteColl', { _id, dbId, collId: collection._id });
        console.log(response.data);
        fetchCollData();
    }

    return (
        <>
            <div className='flex justify-between w-full items-center p-4'>
                <h1 className='text-xl'>Collections :</h1>
                <div className='btnBox flex gap-6'>
                    <button onClick={() => { setOpenValue(true) }} className='border rounded-md px-4 py-2 font-semibold'>Add Collection</button>
                    <button onClick={() => { setOpenValue2(true) }} className='border rounded-md px-4 py-2 font-semibold'>Update All Collection</button>
                </div>
            </div>
            {
                collData && collData.map(
                    (ele, index) => {
                        return (
                            <>
                                <Accordion key={index} style={styles.accordianStyle}>

                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}>
                                        <div className='flex justify-between w-full items-center p-4 '>
                                            <div className='flex space-x-6 items-center'>
                                                <h1 className='text-xl'>{ele.collectionName} </h1>
                                                <EditIcon onClick={() => { handleOpen(ele) }} className=''>Update Collection Name</EditIcon>
                                            </div>
                                            <div className='btnBox flex gap-6'>
                                                <button onClick={() => { handleDelete(ele) }} className='border rounded-md px-4 py-2 font-semibold'>Delete Collection</button>
                                            </div>
                                        </div>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <DocumentAccordian _id={_id} dbId={dbId} dbName={dbName} collId={ele._id} updatedCollData={collData} collectionName={ele.collectionName} />

                                    </AccordionDetails>

                                </Accordion>
                                {openValue && <AddStuffForm _id={_id} openValue={openValue} setOpenValue={setOpenValue} dbName={dbName} />}
                                {openValue2 && <UpdateStuffForm _id={_id} dbId={dbId} collData={collData} fetchCollData={fetchCollData} openValue2={openValue2} setOpenValue2={setOpenValue2} />}

                            </>
                        )
                    }
                )
            }
            <Modal open={colChangeModal} onClose={handleClose}>
                <Box sx={styles.colllNameChangeStyle}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleColleNameChange(selectedCollection._id, newCollName)
                    }}>
                        <input type='text' onChange={(e) => { setNewCollName(e.target.value) }} />
                        <button type='submit' className='px-4 py-2 bg-red-400'>Submit</button>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default CollectionAccordian