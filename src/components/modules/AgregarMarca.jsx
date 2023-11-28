import React, { useEffect } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types'
import { useForm, useConfig } from '../../utils';
import Alerts from '../common/Alerts';

const DEFAULT_MARCA = {
    nombre: ""
};

const AgregarMarca = (props) => {
    const { formState: marca, onInputChange, setFormState } = useForm(props.marca ?? DEFAULT_MARCA)
    const { error, alert, onSaveMarca, success } = useConfig();

    const handleSave = () => {
        onSaveMarca(marca);
    };

    const handleClose = () => {
        setFormState(DEFAULT_MARCA);
        props.handleClose();
    };

    useEffect(() => {
        if (success) {
            setFormState(DEFAULT_MARCA);
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Marca</DialogTitle>
            <DialogContent>
                {alert || error ? <Alerts alert={alert} error={error} /> : null}
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                    {/* descripcion */}
                    <Grid item xs={12} sm={12}>
                        <TextField label='Marca' placeholder='Marca' margin='normal' variant="standard"
                            onChange={onInputChange} value={marca.nombre} name="nombre" required sx={{ width: "100%" }} />
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

AgregarMarca.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarMarca