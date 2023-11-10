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
import { useForm, useProduct } from '../../utils';
import Alerts from '../common/Alerts';
import Producto from '../common/Producto';

const DEFAULT_PRODUCT = {
    id: null, 
    descripcion: "", 
    tipo: "", 
    cantidad: 0, 
    precioVenta: 0, 
    precioCompra: 0, 
    imagen: ""
};

const AgregarProducto = (props) => {
    const { formState: producto, onInputChange, onInputDateChange, } = useForm(DEFAULT_PRODUCT)
    const { error, alert, onSave, success } = useProduct(props.activePrices);
    
    const handleSave = () => {
        onSave(producto);
        };

    useEffect(() => {
        if (success) {
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Producto</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
                <Producto producto={producto} tipoProductos={props.tipoProductos} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={handleSave} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarProducto.propTypes = {
    tipoProductos: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarProducto