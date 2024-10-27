import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AddStuffForm from './AddStuffForm';
import UpdateStuffForm from './UpdateStuffForm';
import MonacoEditor from '@monaco-editor/react';

const DocumentAccordian = ({ _id, dbId, collId, updatedCollData, dbName, collectionName }) => {
    const [docData, setDocData] = useState(null);
    const [openValue, setOpenValue] = useState(false);
    const [openValue2, setOpenValue2] = useState(false);
    const [editorHeights, setEditorHeights] = useState([]);

    const fetchDocData = async () => {
        const response = await axios.post('http://localhost:3001/api/readDoc', { _id, dbId, collId });
        setDocData(response.data);
        console.log(`Data received from readDoc method: ${response.data}`);
    };

    useEffect(() => {
        fetchDocData();
    }, [openValue, openValue2, updatedCollData]);

    const handleClick = async (field) => {
        const response = await axios.post('http://localhost:3001/api/deleteDoc', { _id, dbId, collId, field });
        console.log(response.data);
        fetchDocData();
    };

    const handleEditorMount = (editor, index) => {
        const height = editor.getContentHeight();
        setEditorHeights(prevHeights => {
            const newHeights = [...prevHeights];
            newHeights[index] = height;
            return newHeights;
        });
    };

    return (
        <>
            <div className='flex justify-between w-full items-center p-4 '>
                <h1 className='text-xl'>Documents :</h1>
                <div className='btnBox flex gap-6'>
                    <button onClick={() => setOpenValue(true)} className='border rounded-md px-4 py-2 font-semibold'>Add Documents</button>
                    <button onClick={() => setOpenValue2(true)} className='border rounded-md px-4 py-2 font-semibold'>Update Documents</button>
                </div>
            </div>

            {docData && docData.map((ele, index) => (
                <div key={index} className='flex justify-between items-start my-4  rounded-md'>
                    <MonacoEditor
                        language="json"
                        theme="vs-dark"
                        value={JSON.stringify(ele, null, 2)}
                        options={{ readOnly: true  , minimap: { enabled: false }}}
                        onMount={(editor) => handleEditorMount(editor, index)}
                        height={editorHeights[index] ? `${editorHeights[index]}px` : 'auto'}
                    />
                    <DeleteIcon onClick={() => handleClick(ele)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                </div>
            ))}

            {openValue && (
                <AddStuffForm
                    _id={_id}
                    openValue={openValue}
                    setOpenValue={setOpenValue}
                    dbName={dbName}
                    collName={collectionName}
                />
            )}
            {openValue2 && (
                <UpdateStuffForm
                    _id={_id}
                    dbId={dbId}
                    collId={collId}
                    docData={docData}
                    openValue2={openValue2}
                    setOpenValue2={setOpenValue2}
                />
            )}
        </>
    );
};

export default DocumentAccordian;
