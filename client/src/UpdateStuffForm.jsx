import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MonacoEditor from '@monaco-editor/react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius : '10px',
    p: 2,
};

const UpdateStuffForm = ({ openValue2, setOpenValue2, _id, dbId, collId, dbData, collData, fetchCollData, docData }) => {
    const [open, setOpen] = useState(openValue2);
    const [data, setData] = useState('');

    useEffect(() => {
        setOpen(openValue2);
    }, [openValue2]);

    const handleClose = () => {
        setOpen(false);
        setOpenValue2(false); // Notify parent to close
    };

    useEffect(() => {
        const formatData = (inputData) => {
            return JSON.stringify(inputData, null, 2); // Indent JSON for readability
        };

        if (dbData) {
            setData(formatData(dbData));
        } else if (collData) {
            setData(formatData(collData));
        } else if (docData) {
            setData(formatData(docData));
        }
    }, [dbData, collData, docData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const parsedData = JSON.parse(data); // Ensure data is valid JSON

            if (dbData) {
                await axios.post('http://localhost:3001/api/updateDb', { _id, dbId, document: parsedData });
            } else if (collData) {
                await axios.post('http://localhost:3001/api/updateColl', { _id, dbId, document: parsedData });
            } else {
                await axios.post('http://localhost:3001/api/updateDoc', { _id, dbId, collId, newDocument: parsedData });
            }

            handleClose();
            fetchCollData();
        } catch (error) {
            console.error("Failed to parse JSON data:", error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <MonacoEditor
                        height= '400px'
                        language="json"
                        theme="vs-dark"
                        value={data}
                        onChange={(value) => setData(value)}
                        options={{
                            minimap: { enabled: true },
                            automaticLayout: true,
                        }}
                    />
                    <button className='mx-auto block px-8 py-2 rounded-lg text-white bg-sblack hover:bg-dblack' type='submit'>Submit!</button>
                </form>
            </Box>
        </Modal>
    );
};

export default UpdateStuffForm;
