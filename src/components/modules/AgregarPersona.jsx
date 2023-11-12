import React, { useEffect } from 'react'
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    InputLabel,
    MenuItem,
    Alert,
    AlertTitle,
    Select,
    Divider,
    IconButton,
    Checkbox,
    ListItemText,
    FormHelperText,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types'
import { useForm, usePerson } from '../../utils';
import Alerts from '../common/Alerts';
import Persona from '../common/Persona';

const DEFAULT_PERSONA = {
    email: "",
    tipoTelefono: "Principal",
    telefono: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: Date.now(),
    genero: "Femenino",
    tipoDocumento: "DNI",
    numeroDocumento: "",
}

const AgregarPersona = (props) => {
    const { formState: persona, onInputChange, onInputDateChange, } = useForm(DEFAULT_PERSONA)
    const { error, alert, onSave, success } = usePerson(props.activePrices);

    const handleSave = () => {
        onSave(persona, props.tipoPersona);
    };

    useEffect(() => {
        if (success) {
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Persona</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
                <Persona persona={persona} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={handleSave} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

AgregarPersona.propTypes = {
    open: PropTypes.bool.isRequired,
    tipoPersona: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarPersona