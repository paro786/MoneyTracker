import React from 'react'
import { Button } from 'react-bootstrap';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const AddButton = ({ handler }) => {
    return (
        <Button style={{ zIndex: 5, position: "fixed", width: "60px", height: "60px", right: "5%", bottom: "15vh", borderRadius: "50%", border: '0', backgroundColor: "black", color: '#04bef8' }} onClick={handler}><AddRoundedIcon fontSize='large' /> </Button>
    )
}

export default AddButton;