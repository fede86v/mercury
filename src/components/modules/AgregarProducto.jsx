import React, { useEffect } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Backdrop
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types'
import { useForm, useProduct } from '../../utils';
import Alerts from '../common/Alerts';
import Producto from '../common/Producto';
import CircularProgress from '@mui/material/CircularProgress';

const DEFAULT_PRODUCT = {
    descripcion: "",
    tipo: ""
};

const AgregarProducto = (props) => {
    const { formState: producto, onInputChange, onInputDateChange, } = useForm(DEFAULT_PRODUCT)
    const { error, alert, onSave, success, mutation, onSetAlert } = useProduct();

    const handleSave = () => {
        // Validar que el código no exista (solo para productos nuevos, sin id)
        if (!producto.id && producto.codigo) {
            const codigoExiste = props.productos.some(
                p => p.codigo && p.codigo.toLowerCase() === producto.codigo.toLowerCase() && !p.fechaInactivo
            );
            
            if (codigoExiste) {
                onSetAlert('Ya existe un producto con este código de barras');
                return;
            }
        }
        
        // Si es edición, validar que el código no exista en otro producto
        if (producto.id && producto.codigo) {
            const codigoExisteEnOtro = props.productos.some(
                p => p.id !== producto.id && p.codigo && p.codigo.toLowerCase() === producto.codigo.toLowerCase() && !p.fechaInactivo
            );
            
            if (codigoExisteEnOtro) {
                onSetAlert('Ya existe otro producto con este código de barras');
                return;
            }
        }
        
        onSave(producto);
    };

    const { handleClose } = props;
    
    useEffect(() => {
        if (success) {
            handleClose();
        }
    }, [success, handleClose]);

    return (
        <Dialog open={props.open} fullWidth maxWidth="sm" PaperProps={{ sx: { m: { xs: 1 }, maxHeight: { xs: 'calc(100% - 16px)', sm: '90vh' } } }}>
            <DialogTitle>Producto</DialogTitle>
            <DialogContent sx={{ overflowY: 'auto', px: { xs: 2, sm: 3 } }}>
                <DialogContentText>
                </DialogContentText>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={mutation.isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Alerts alert={alert} error={error} />
                <Producto producto={producto} tipoProductos={props.tipoProductos} marcas={props.marcas} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" endIcon={< SaveIcon />}  onClick={handleSave} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarProducto.propTypes = {
    tipoProductos: PropTypes.array.isRequired,
    marcas: PropTypes.array.isRequired,
    productos: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarProducto