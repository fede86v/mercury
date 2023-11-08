import React, { useContext, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    AlertTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Persona from '../common/persona';
import { TrainerService, PeopleService, UserService } from '../../utils/databaseService';
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../../context/UserProvider';
import { useForm } from '../../utils/useForm';

const DEFAULT_TRAINER = {
    email: "",
    codigoArea: "",
    telefono: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: Date.now(),
    genero: "Femenino",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    codigoAcceso: "",
    tipoTelefono: "Principal",
}

const AgregarEntrenador = (props) => {

    const { user } = useContext(UserContext);
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [personaExistente, setPersonaExistente] = useState(null);
    const [entrenadorExistente, setEntrenadorExistente] = useState(null);

    const { formState: entrenador, onInputChange, onInputDateChange, onResetForm, } = useForm(DEFAULT_TRAINER)

    const getByEmail = async (email, entity) => {
        setError(null);
        setAlert(null);

        const where = {
            field: "email",
            condition: "==",
            value: email,
        }

        const data = (entity === "entrenador")
            ? await TrainerService.getQuery(where.field, where.condition, where.value)
            : await PeopleService.getQuery(where.field, where.condition, where.value);

        if (data) {
            if (entity === "entrenador") {
                setError("Este entrenador ya se encuentra registrado en el sistema.");
                setEntrenadorExistente(data[0])
            }
            else {
                setPersonaExistente(data[0]);
                setAlert("Esta persona ya se encuentra registrada en el sistema. Desea asignar el rol de Entrenador?");
            }
        }

        return data;
    };

    const saveTrainer = async (trainer) => {
        console.log(trainer);
        return TrainerService.create(trainer, user, trainer.id);
    };

    const savePerson = async (person) => {
        return PeopleService.create(person, user, person.id);
    };

    const saveUser = async (newUser) => {
        return UserService.create(newUser, user, newUser.email);
    };

    const updateUser = async (email) => {
        return UserService.update(email, {
            esEntrenador: true,
        }, user);
    };

    // create mutation srearchTrainer
    const searchMutation = useMutation(
        (item) => getByEmail(item.email, item.entity),
        {
            onError: (error) => setError(error.message),
        });
    // create mutation addTrainer
    const saveMutation = useMutation(
        (trainer) => saveTrainer(trainer),
        {
            onError: (error) => setError(error.message),
            onSuccess: () => {
                handleClose();
            }
        });
    // create mutation addPerson
    const savePersonMutation = useMutation(
        (person) => savePerson(person),
        {
            onError: (error) => setError(error.message),
            onSuccess: (data) => {
                const newTrainer = { ...entrenador };
                newTrainer.id = data.id;
                delete newTrainer.numeroDocumento;
                delete newTrainer.tipoDocumento;
                delete newTrainer.codigoArea;
                delete newTrainer.telefono;
                saveMutation.mutate(newTrainer);
            }
        });
    // create mutation addUser
    const saveUserMutation = useMutation(
        (user) => saveUser(user),
        {
            onError: (error) => setError(error.message),
            onSuccess: () => {
                delete entrenador.codigoAcceso;
                savePersonMutation.mutate(entrenador);
            }
        });
    const updateUserMutation = useMutation(
        ({ email }) => updateUser(email),
        {
            onError: (error) => setError(error.message),
            onSuccess: () => {
                const newTrainer = { ...personaExistente };
                delete newTrainer.numeroDocumento;
                delete newTrainer.tipoDocumento;
                delete newTrainer.codigoArea;
                delete newTrainer.telefono;
                delete newTrainer.fechaNacimiento;

                saveMutation.mutate(newTrainer);
            },
        }
    );

    const handleChange = (event) => {
        if (!event) return;
        if (event.target.name === "email" && event.target.value.length > 6) {
            const email = event.target.value;
            searchMutation.mutate({ email: email, entity: "entrenador" });
            searchMutation.mutate({ email: email, entity: "persona" });
        }
        onInputChange(event);
    };

    const handleClose = () => {
        setAlert(null);
        setError(null);
        onResetForm();
        setPersonaExistente(null);
        setEntrenadorExistente(null);

        props.handleClose();
    };

    const asociarPersona = async () => {
        setAlert(null);
        const trainer = {
            id: personaExistente.id,
            email: personaExistente.email,
            nombre: personaExistente.nombre,
            apellido: personaExistente.apellido,
            genero: personaExistente.genero,
        };
        updateUserMutation.mutate(trainer);

        //await fb_asociarEntrenador(personaExistente);
    };

    const handleCrearEntrenador = () => {
        setAlert(null);
        let alert = null;
        if (entrenador.email.trim().length === 0) {
            alert = alert + `- Debe ingresar un email valido. < /br>`;
        }
        if (entrenador.nombre.trim() === "") {
            alert = alert + `- Debe ingresar un Nombre. < /br>`;
        }
        if (entrenador.apellido.trim() === "") {
            alert = alert + `- Debe ingresar un Apellido. < /br>`;
        }
        if (entrenador.tipoDocumento.trim() === "") {
            alert = alert + `- Debe ingresar un Tipo de Documento. < /br>`;
        }
        if (entrenador.numeroDocumento.trim() === "") {
            alert = alert + `- Debe ingresar un Documento. < /br>`;
        }
        if (entrenador.fechaNacimiento === Date.now()) {
            alert = alert + `- Debe ingresar una Fecha de Nacimiento anterior a Hoy. < /br>`;
        }
        if (alert !== null) {
            setAlert(alert);
            return;
        }
        if (personaExistente) {
            updateUserMutation.mutate(entrenador);
        }
        else {
            const user = {
                email: entrenador.email,
                esEntrenador: true,
                codigoAcceso: entrenador.numeroDocumento.slice(-4),
                fotoURL: null,
                fechaInactivo: null,
                activado: false
            };
            saveUserMutation.mutate(user);
        }
    };

    return (
        <Dialog open={props.open} >
            <DialogTitle>Nuevo Entrenador</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Ingrese los siguientes datos para crear un nuevo entrenador.
                </DialogContentText>
                {/* Errors */
                    error ? (
                        <Alert sx={{ my: 2 }} severity="error">
                            <AlertTitle>
                                Error!
                            </AlertTitle>
                            {error}
                        </Alert>
                    )
                        : null
                }
                {/* Alerts */
                    !error && alert ? (
                        <Alert action={
                            personaExistente === null ?
                                (<IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setAlert(null);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>)
                                :
                                <Button color="inherit" size="small" onClick={() => asociarPersona()} >
                                    ASOCIAR
                                </Button>
                        }
                            sx={{ mb: 2, my: 2 }} severity="warning">
                            <AlertTitle>Atención</AlertTitle>
                            {alert}
                        </Alert>
                    )
                        : null
                }
                <Persona persona={entrenador} handleChange={handleChange} handleDateChange={onInputDateChange} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>Cancelar</Button>
                {entrenadorExistente
                    ? (null)
                    : (<Button color="primary" variant="contained" onClick={handleCrearEntrenador}>Crear</Button>)
                }
            </DialogActions>
        </Dialog>
    )
}

export default AgregarEntrenador