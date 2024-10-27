import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MonacoEditor from '@monaco-editor/react'; // Import MonacoEditor

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius : '10px',
    p: 4,
};

const AddStuffForm = ({ openValue, setOpenValue, _id, dbName, collName, documents }) => {
    const handleClose = () => {
        setOpenValue(false); // Close the modal and inform parent
    };

    const [newDbName, setNewDbName] = useState('');
    const [newCollName, setNewCollName] = useState('');
    const [newDocs, setNewDocs] = useState('');

    useEffect(() => {
        setNewDbName(dbName || '');
        setNewCollName(collName || '');
        setNewDocs(documents ? JSON.stringify(documents, null, 2) : ''); // Format initial documents as JSON string
    }, [dbName, collName, documents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/createDatabase', { _id, dbName: newDbName });
            const dbId = response.data;

            const response2 = await axios.post('http://localhost:3001/api/createCollection', { _id, dbId, collectionName: newCollName });
            const collId = response2.data;

            // Send newDocs as a JSON string
            await axios.post('http://localhost:3001/api/createDoc', { _id, dbId, collId, documentData: newDocs });

            handleClose(); // Close the modal after submission
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div>
            <Modal
                open={openValue}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmit} className='w-full p-2 space-y-4'>
                        <input
                            className='border-2 w-full rounded-md p-3'
                            placeholder='Database name'
                            type='text'
                            name='newDbName'
                            value={newDbName}
                            onChange={(e) => setNewDbName(e.target.value)}
                        />
                        <input
                            className='border-2 w-full rounded-md p-3'
                            placeholder='Collection name'
                            type='text'
                            name='newCollName'
                            value={newCollName}
                            onChange={(e) => setNewCollName(e.target.value)}
                        />
                        <div className='documentBox rounded-lg overflow-hidden'>
                            <MonacoEditor
                                height="300px"
                                language="json"
                                theme="vs-dark"
                                value={newDocs}
                                onChange={(value) => setNewDocs(value)} // Update the state with the editor value
                                options={{
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                        <button className='px-8 py-2 rounded-lg text-white bg-sblack hover:bg-dblack mx-auto block' type='submit'>Submit!</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddStuffForm;
