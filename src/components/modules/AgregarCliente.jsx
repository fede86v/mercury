import React, { useEffect, useState } from 'react'
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
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { DocumentTypes, ActivityTypes, FrequencyTypes } from '../../utils/enums'
import { useFirestore } from '../../utils/useFirestore';

const MSG_ASOCIAR_PERSONA = "Esta persona ya se encuentra registrada en el sistema. Desea asignar el rol de Socio?";
const MSG_SOCIO_EXISTENTE = "Este socio ya se encuentra registrado en el sistema.";
const DEFAULT_SOCIO = {
    uid: "",
    email: "",
    tipoTelefono: "Principal",
    telefono: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: Date.now(),
    genero: "Femenino",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    fechaVencimiento: Date.now(),
    clasesRestantes: 0,
    totalClases: 0,
    actividades: ['MUSCULACION'],
    codigoAcceso: "",
    frecuencia: "3 veces por semana",
    cuota: 0,
}

const AgregarCliente = (props) => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [cerrar, setCerrar] = useState(false);
    const [habilitadoGuardar, setHabilitadoGuardar] = useState(true);
    const [personaExistente, setPersonaExistente] = useState(null);
    const [preciosVigentes, setPreciosVigentes] = useState([]);
    const [socio, setSocio] = useState(DEFAULT_SOCIO);

    const {
        getPrecios: fb_getPrecios,
        getUsuario: fb_getUsuario,
        updateUsuario: fb_updateUsuario,
        createUsuario: fb_createUsuario,
        error: firebaseError,
        createSocio: fb_createSocio,
        createPersona: fb_createPersona,
        updatePersona: fb_updatePersona,
        updateSocio: fb_updateSocio,
        validatePersona: fb_validatePersona,
        validateSocio: fb_validateSocio,
    } = useFirestore();

    const handleChange = (prop) => (event) => {
        let cuota = 0;
        let clases = 0;
        if (socio.cuota === 0) {
            if (socio.actividades.length !== 0) {
                console.log("2");
                cuota = getPrecio(socio.actividades, socio.frecuencia);
            }
            const freq = FrequencyTypes.filter(f => f.value === socio.frecuencia)[0].key;
            clases = getSemanas() * freq;
        }
        if (prop === "numeroDocumento") {
            const codAcceso = event.target.value.slice(-4);
            cuota !== 0 ?
                setSocio({ ...socio, [prop]: event.target.value, "cuota": cuota, "totalClases": clases, "clasesRestantes": clases })
                : setSocio({ ...socio, [prop]: event.target.value, "codigoAcceso": codAcceso });
            return;
        }
        if (prop === "frecuencia") {
            let precio = 0;
            if (socio.actividades) {
                precio = getPrecio(socio.actividades, event.target.value);
            }
            const freq = FrequencyTypes.filter(f => f.value === event.target.value)[0].key;
            const clases = getSemanas() * freq;
            setSocio({ ...socio, [prop]: event.target.value, "cuota": precio, "totalClases": clases, "clasesRestantes": clases });
            return;
        }
        if (prop === "email") {
            const email = event.target.value;
            fb_validateSocio(socio.email).then(
                socio => {
                    if (socio) {
                        setHabilitadoGuardar(false);
                        setAlert(MSG_SOCIO_EXISTENTE);
                        return;
                    }
                });
            fb_validatePersona(email, null, null).then(
                persona => {
                    if (persona) {
                        setPersonaExistente(persona);
                        setCerrar(false);
                        setAlert(MSG_ASOCIAR_PERSONA);
                    }
                }
            );
        }
        cuota !== 0 ?
            setSocio({ ...socio, [prop]: event.target.value, "cuota": cuota, "totalClases": clases, "clasesRestantes": clases })
            : setSocio({ ...socio, [prop]: event.target.value });
    };
    const handleDateChange = (newValue) => {
        const date = dayjs(newValue).isValid ? dayjs(newValue).valueOf() : newValue;
        setSocio({ ...socio, "fechaNacimiento": date, });
    }
    const handleActividadesChange = (event) => {
        const {
            target: { value },
        } = event;
        const newActividad = typeof value === 'string' ? value.split(',') : value;

        let precio = 0;
        if (socio.frecuencia !== "" && socio.actividades) {
            precio = getPrecio(event.target.value, socio.frecuencia);
        }
        const freq = FrequencyTypes.filter(f => f.value === socio.frecuencia)[0].key;
        const clases = getSemanas() * freq;
        setSocio({ ...socio, "actividades": newActividad, "cuota": precio, "totalClases": clases, "clasesRestantes": clases });
    };
    const handleCrearSocio = () => {
        //Validar Datos
        if (socio.email.trim().length === 0) {
            setAlert(`Debe ingresar un email valido`);
            return;
        }
        if (socio.nombre.trim() === "") {
            setAlert(`Debe ingresar un Nombre`);
            return;
        }
        if (socio.apellido.trim() === "") {
            setAlert(`Debe ingresar un Apellido`);
            return;
        }
        if (socio.tipoDocumento.trim() === "") {
            setAlert(`Debe ingresar un Tipo de Documento`);
            return;
        }
        if (socio.numeroDocumento.trim() === "") {
            setAlert(`Debe ingresar un Numero de Documento`);
            return;
        }
        if (socio.fechaNacimiento === Date.now()) {
            setAlert(`Debe ingresar una Fecha de Nacimiento anterior a Hoy.`);
            return;
        }

        crearSocio();
    }
    const crearSocio = async () => {
        console.log(socio);
        const persona = personaExistente
            ? await fb_updatePersona(socio)
            : await fb_createPersona(socio);

        let usuario = null;

        if (personaExistente) {
            usuario = await fb_getUsuario(socio.email);
        }
        if (usuario) {
            usuario.esSocio = true;
            usuario.codigoAcceso = socio.codigoAcceso;
            usuario = await fb_updateUsuario(usuario);
        }
        else {
            usuario = {
                email: socio.email,
                esSocio: true,
                codigoAcceso: socio.codigoAcceso,
                fotoURL: null,
                fechaInactivo: null,
                activado: false
            };
            usuario = await fb_createUsuario(usuario);
        }

        var date = new Date();
        date.setDate(date.getDate() + 30);

        const soc = {
            uid: persona.uid,
            email: persona.email,
            nombre: persona.nombre,
            apellido: persona.apellido,
            actividades: socio.actividades,
            frecuencia: socio.frecuencia,
            codigoArea: socio.codigoArea,
            telefono: socio.telefono,
            fechaVencimiento: date.getTime(),
            fechaNacimiento: socio.fechaNacimiento,
            genero: socio.genero,
            clasesRestantes: socio.clasesRestantes,
            totalClases: socio.totalClases
        }
        const fb_socio = socio.uid !== "" ?
            await fb_updateSocio(soc) :
            await fb_createSocio(soc);

        setPersonaExistente(null);
        setCerrar(false);
        setAlert(null);
        setSocio(DEFAULT_SOCIO);
        props.handleClose();

    }
    const asociarPersona = async () => {
        var date = new Date();
        date.setDate(date.getDate() + 30);

        const soc = {
            uid: personaExistente.uid,
            email: personaExistente.email,
            nombre: personaExistente.nombre,
            apellido: personaExistente.apellido,
            tipoDocumento: personaExistente.tipoDocumento,
            numeroDocumento: personaExistente.numeroDocumento,
            fechaNacimiento: personaExistente.fechaNacimiento,
            codigoAcceso: personaExistente.numeroDocumento.slice(-4),
            genero: personaExistente.genero,
            codigoArea: personaExistente.codigoArea ? personaExistente.codigoArea : null,
            telefono: personaExistente.telefono ? personaExistente.telefono : null,
            actividades: socio.actividades,
            frecuencia: socio.frecuencia,
            fechaVencimiento: date.getTime(),
            clasesRestantes: socio.clasesRestantes,
            totalClases: socio.totalClases
        }

        const fb_socio = await fb_createSocio(soc);
        setSocio(soc);
        setAlert(null);

        if (cerrar) {
            setPersonaExistente(null);
            setCerrar(false);
            setAlert(null);
            props.handleClose();
        }
    }
    const getPrecios = async () => {
        const result = await fb_getPrecios(true);
        if (result != null) {
            setPreciosVigentes(result);
        }
    }
    const getPrecio = (actividades, frecuencia) => {
        if (actividades && frecuencia !== "") {
            let precioTotal = 0;
            actividades.forEach(actividad => {
                const precios = preciosVigentes.filter(p => p.frecuencia === frecuencia && p.actividad === actividad);

                if (precios.length > 0) {
                    precioTotal += (Number)(precios[0].precio);
                }
            });
            return precioTotal;
        }
    }
    const getSemanas = () => {
        const now = new Date;
        const a = dayjs(now);
        const b = dayjs(now).add(1, 'M');
        const semanas = b.diff(a, 'week');
        return semanas;
    }

    useEffect(() => {
        setError(firebaseError);
    }, [firebaseError]);

    useEffect(() => {
        getPrecios();
    }, []);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Nuevo Socio</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Ingrese los siguientes datos para crear un nuevo socio.
                </DialogContentText>
                {/* Alerts */
                    alert ? (
                        <Alert action={
                            alert === MSG_ASOCIAR_PERSONA ?
                                (<Button color="inherit" size="small" onClick={() => asociarPersona()} >
                                    ASOCIAR
                                </Button>)
                                :
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

                        }
                            sx={{ mb: 2, my: 2 }} severity="warning">
                            <AlertTitle>Atención</AlertTitle>
                            {alert}
                        </Alert>
                    )
                        : null
                }
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
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >

                    <Grid item xs={12} sm={12}>

                        {/* Email */}
                        <TextField label='Email' placeholder='Email' margin='normal' type='email' variant="standard"
                            onChange={handleChange('email')} value={socio.email} required sx={{ width: "100%" }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Divider />
                    </Grid>
                    {/* Nombre */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-name" label="Nombre" variant="standard"
                            value={socio.nombre} required
                            onChange={handleChange("nombre")}
                            sx={{ width: '100%' }} />
                    </Grid>
                    {/* Apellido */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-lastName" label="Apellido" variant="standard"
                            value={socio.apellido} required
                            onChange={handleChange("apellido")}
                            sx={{ width: '100%' }} />
                    </Grid>
                    {/* Fecha de Nacimiento */}
                    <Grid item xs={12} sm={12}>
                        <DesktopDatePicker
                            label="Fecha de Nacimiento"
                            inputFormat="DD/MM/yyyy"
                            disableMaskedInput
                            value={socio.fechaNacimiento}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField variant="standard" {...params} sx={{ width: '100%' }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* Tipo DNI */}
                        <FormControl variant="standard" fullWidth >
                            <InputLabel id="tipo-dni-select-item-label">Tipo Documento</InputLabel>
                            <Select
                                labelId="tipo-dni-select-item-label"
                                id="tipo-dni-select-item"
                                value={socio.tipoDocumento}
                                onChange={handleChange("tipoDocumento")}
                                label="Tipo Documento" >
                                {DocumentTypes.sort().map((dt) => (
                                    <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* DNI */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-dni" label="Numero de Documento"
                            variant="standard" sx={{ width: '100%' }}
                            value={socio.numeroDocumento}
                            onChange={handleChange("numeroDocumento")}
                        />
                    </Grid>
                    {/* Genero */}
                    <Grid item xs={12} sm={12}>
                        <FormControl>
                            <FormLabel id="lbl-genero">Genero</FormLabel>
                            <RadioGroup row
                                aria-labelledby="lbl-genero"
                                value={socio.genero} onChange={handleChange("genero")} >
                                <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
                                <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                                <FormControlLabel value="Otro" control={<Radio />} label="Otro" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* Actividades */}
                        <FormControl required fullWidth>
                            <InputLabel id="actividades-multiple-checkbox-label">Actividad</InputLabel>
                            <Select
                                labelId='actividades-multiple-checkbox-label'
                                id="actividades-multiple-checkbox"
                                multiple variant="standard"
                                value={socio.actividades}
                                onChange={handleActividadesChange}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {ActivityTypes.sort().map((dt) => (
                                    <MenuItem key={dt.key} value={dt.key}>
                                        <Checkbox checked={socio.actividades.indexOf(dt.key) > -1} />
                                        <ListItemText primary={dt.value} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Elija al menos una opción</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* Frecuencia */}
                        <FormControl required fullWidth >
                            <InputLabel id="frecuencia-select-item-label">Frecuencia</InputLabel>
                            <Select
                                labelId="frecuencia-select-item-label"
                                label="Frecuencia"
                                id="frecuencia-select-item"
                                value={socio.frecuencia}
                                variant="standard"
                                onChange={handleChange("frecuencia")} >
                                {FrequencyTypes.sort().map((dt) => (
                                    <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography id="txt-precio" >Cuota: {socio.cuota}</Typography>
                        {/*
                        <TextField id="txt-precio" label="Cuota" variant="standard"
                            value={socio.cuota} sx={{ width: '100%' }} InputProps={{
                                readOnly: true,
                            }} />
                            */}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Divider />
                    </Grid>
                    {/* Nombre */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-name" label="Codigo de Acceso" variant="standard"
                            value={socio.codigoAcceso} required
                            onChange={handleChange("codigoAcceso")}
                            sx={{ width: '100%' }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={props.handleClose}>Cancelar</Button>
                <Button color="primary" variant="contained" disabled={!habilitadoGuardar} onClick={handleCrearSocio}>Crear</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AgregarCliente