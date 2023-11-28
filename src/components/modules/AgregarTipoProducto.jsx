import React, { useEffect } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types'
import { useForm, useConfig } from '../../utils';
import Alerts from '../common/Alerts';

const DEFAULT_PRODUCT_TYPE = {
    nombre: ""
};

const AgregarTipoProducto = (props) => {
    const { formState: tipoProducto, onInputChange, setFormState } = useForm(props.tipoProducto ?? DEFAULT_PRODUCT_TYPE)
    const { error, alert, onSaveTipoProducto, success } = useConfig();
    
    const handleSave = () => {
        onSaveTipoProducto(tipoProducto);
        };

    const handleClose = () => {
        setFormState(DEFAULT_PRODUCT_TYPE);
            props.handleClose();
        };

    useEffect(() => {
        if (success) {
            setFormState(DEFAULT_PRODUCT_TYPE);
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Categoria de Producto</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                    {/* descripcion */}
                    <Grid item xs={12} sm={12}>
                        <TextField label='Tipo de Producto' placeholder='Tipo de Producto' margin='normal' variant="standard"
                            onChange={onInputChange} value={tipoProducto.nombre} name="nombre" required sx={{ width: "100%" }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>Cancelar</Button>
                <Button color="primary" variant="contained" endIcon={< SaveIcon />}  onClick={handleSave} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarTipoProducto.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarTipoProducto