import React, { useEffect } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import PropTypes from 'prop-types'
import { useForm, useTransaction } from '../../utils';
import Alerts from '../common/Alerts';
import Venta from '../common/Venta';

const DEFAULT_VENTA = {
    total: null,
    subtotal: null,
    descuento: 0,
    vendedor: ""
};

const AgregarVenta = (props) => {
    const { formState: venta, onInputChange, onInputDateChange, } = useForm(DEFAULT_VENTA)
    const { error, alert, onSave, success } = useTransaction();

    const handleSave = () => {
        onSave(venta);
    };

    useEffect(() => {
        if (success) {
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} fullWidth maxWidth="sm" >
            <DialogTitle>Venta</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
            </DialogContent>
            <Venta venta={venta} productos={props.productos} vendedores={props.vendedores} />
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={handleSave} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarVenta.propTypes = {
    productos: PropTypes.array.isRequired,
    vendedor: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarVenta