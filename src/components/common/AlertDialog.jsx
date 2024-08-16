import React from 'react'
import { Dialog, DialogContent, DialogTitle, Button, DialogActions } from '@mui/material'
import PropTypes from 'prop-types'

const AlertDialog = (props) => {
    return (
        <Dialog open={props.open} >
            <DialogTitle>{props.alert ? "Atención!" : "Error"}</DialogTitle>
            <DialogContent>
                {props.alert ? props.alert : props.error}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}


AlertDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    alert: PropTypes.string,
    error: PropTypes.string,
    handleClose: PropTypes.func.isRequired
}


export default AlertDialog