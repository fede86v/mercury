import { TextField, Typography } from '@mui/material'
import React from 'react'

const EditableTextBox = ({ editMode = true, label, id, required, onChange, value, placeholder }) => {
    return (editMode === true) ?
        (
            <TextField
                id={{ id }}
                label={{ label }}
                required={{ required }}
                onChange={{ onChange }}
                value={{ value }}
                placeholder={{ placeholder }}
            />
        )
        : (
            <Typography >{{ value }}</Typography>
        )
}

export default EditableTextBox