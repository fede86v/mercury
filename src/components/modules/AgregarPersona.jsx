import React, { useEffect } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Backdrop,
    DialogTitle
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
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
    const { error, alert, onSave, success, result, mutation } = usePerson();

    const handleSave = () => {
        onSave(persona, props.tipoPersona);
    };

    useEffect(() => {
        if (success) {
            if (props.setPersona) props.setPersona({...persona, id: result.id});
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Persona</DialogTitle>
            <DialogContent>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={mutation.isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Alerts alert={alert} error={error} />
                <Persona persona={persona} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" endIcon={< SaveIcon />} onClick={handleSave} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

AgregarPersona.propTypes = {
    open: PropTypes.bool.isRequired,
    tipoPersona: PropTypes.string.isRequired,
    setPersona: PropTypes.func,
    handleClose: PropTypes.func.isRequired
};

export default AgregarPersona