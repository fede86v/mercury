import React, { useEffect, useContext, useState } from 'react'
import {
    Alert,
    Box,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    Button,
    AlertTitle,
    Stepper, Step, StepLabel, Select,
    MenuItem,
    Divider,
    Grid,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
    IconButton,
    Checkbox,
    ListItemText,
    FormHelperText,
} from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SendIcon from '@mui/icons-material/Send';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google'
import { useFirestore } from '../utils/useFirestore';
import BgrImage from '../images/felicidades.png';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import { DocumentTypes, ActivityTypes } from '../utils/enums';

const Register = () => {
    const steps = ["Cuenta", "Usuario", "Actividad"];

    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [values, setValues] = useState({
        uid: "",
        password: '',
        repassword: '',
        email: '',
        showPassword: false,
        nombre: "",
        apellido: "",
        fechaNacimiento: Date.now(),
        genero: "Femenino",
        tipoDocumento: "DNI",
        numeroDocumento: "",
    });

    const { error: authError, user, signInWithGoogle, createUserWithEmail, updateUser } = useContext(UserContext);
    const { error: firebaseError, loading, validateCodigoAcceso } = useFirestore();

    useEffect(() => {
        setError(null);
    }, []);

    useEffect(() => {
        if (user) {
            if (user.activado) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
            else {
                if (values.uid === "") {
                    setValues((v) => ({
                        ...v,
                        "uid": user.uid,
                        "email": user.email,
                        "nombre": user.persona.nombre,
                        "apellido": user.persona.apellido
                    }));
                    setActiveStep(1);
                }
                else {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            }
            setError(null);
            setAlert(null);
        }
    }, [user]);

    useEffect(() => {
        setError(firebaseError);
    }, [firebaseError]);

    useEffect(() => {
        if (authError === 'auth/invalid-email') {
            setError('Email no válido');
        }
        if (authError === 'auth/email-already-in-use') {
            setError('Email ya utilizado');
        }
        setError(authError);
    }, [authError]);

    const handleNext = e => {
        e.preventDefault()
        console.log(activeStep);
        if (activeStep === 0) {
            if (values.email.trim().length === 0) {
                setAlert(`Debe ingresar un email valido`);
                return;
            }
            if (!values.password.trim()) {
                setAlert('Password es requerido!')
                return
            }
            if (values.password.length < 6) {
                setAlert('Contraseña muy debil - minimo 6 caracteres!')
                return
            }
            if (values.password.trim() !== values.repassword.trim()) {
                setAlert('Contraseñas no coinciden, por favor verifiquelas')
                return
            }
            createUserWithEmail(values.email, values.password);
        }
        if (activeStep === 1) {
            if (values.nombre.trim() === "") {

                setAlert(`Debe ingresar un Nombre`);
                return;
            }
            if (values.apellido.trim() === "") {
                setAlert(`Debe ingresar un Apellido`);
                return;
            }

            actualizarUsuario();
        }
        if (activeStep === 2) {
            actualizarUsuario();
        }
    };

    const actualizarUsuario = React.useCallback(async () => {
        let user = {
            uid: values.uid,
            email: values.email,
            persona: {
                nombre: values.nombre,
                apellido: values.apellido,
                fechaNacimiento: values.fechaNacimiento.toString(),
                genero: values.genero,
                tipoDocumento: values.tipoDocumento,
                numeroDocumento: values.numeroDocumento,
            },
        };
        user = await updateUser(user);
    }, [values, updateUser]);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setError(null);
        setAlert(null);
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleDateChange = (newValue) => {
        //setValues({ ...values, "fechaNacimiento": moment(newValue, "DD/MM/YYYY"), });
    };

    const handleActividadesChange = (event) => {
        const {
            target: { value },
        } = event;
        const newActividad = typeof value === 'string' ? value.split(',') : value;

        setValues({ ...values, "actividades": newActividad, });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleClickShowRepassword = () => {
        setValues({
            ...values,
            showRepassword: !values.showRepassword,
        });
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <form onSubmit={handleNext} >
                <Box display="flex"
                    flexDirection={"column"}
                    alignItems={"stretch"}
                    maxWidth={600}
                    justifyContent={"center"}
                    margin={"auto"}
                    marginTop={20}
                    padding={3} sx={{ boxShadow: 3 }}
                    borderRadius={3} borderColor="InactiveBorder"
                >
                    {/* Title */}
                    <Typography variant="h4" padding={3} textAlign="center" >Registrese</Typography>

                    {/* Steps */}
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {/* Alerts */
                            alert ? (
                                <Alert sx={{ my: 2 }} severity="warning">
                                    <AlertTitle>
                                        Atención!
                                    </AlertTitle>
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
                        {/* Cuenta */
                            activeStep === 0 ? (

                                <Box sx={{ my: 2 }} >
                                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                                        <Grid item xs={12} sm={12}>

                                            {/* Text */}
                                            <Typography >Puede registrarse utilizando Usuario y Contraseña o puede elegir registrarse directamente con su cuenta de google.</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>

                                            {/* Email */}
                                            <TextField label='Email' placeholder='Email' margin='normal' type='email'
                                                onChange={handleChange('email')} value={values.email} required sx={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>

                                            {/* Password */}
                                            <FormControl margin='normal' required sx={{ width: "100%" }}>
                                                <InputLabel htmlFor="lbl-password">Contraseña</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type={values.showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    onChange={handleChange('password')}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDown}
                                                                edge="end" >
                                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {/* Re-Password */}
                                            <FormControl margin='normal' required sx={{ width: "100%" }} >
                                                <InputLabel htmlFor="lbl-repassword">Repetir Contraseña</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-repassword"
                                                    type={values.showRepassword ? 'text' : 'password'}
                                                    value={values.repassword}
                                                    onChange={handleChange('repassword')}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowRepassword}
                                                                onMouseDown={handleMouseDown}
                                                                edge="end" >
                                                                {values.showRepassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Re-Password"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Divider > o </Divider>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Button height={20}
                                                startIcon={<GoogleIcon />}
                                                onClick={signInWithGoogle}
                                                color="secondary"
                                                variant="contained"
                                                sx={{ width: '100%' }}
                                                size="large">Google</Button>

                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : null}
                        {
                            /* Usuario */
                            activeStep === 1 ? (
                                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                                    {/* Nombre */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField id="txt-name" label="Nombre" variant="standard"
                                            value={values.nombre}
                                            onChange={handleChange("nombre")}
                                            sx={{ width: '100%' }} />
                                    </Grid>
                                    {/* Apellido */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField id="txt-lastName" label="Apellido" variant="standard"
                                            value={values.apellido}
                                            onChange={handleChange("apellido")}
                                            sx={{ width: '100%' }} />
                                    </Grid>
                                    {/* Fecha de Nacimiento */}
                                    <Grid item xs={12} sm={12}>
                                        <DesktopDatePicker
                                            label="Fecha de Nacimiento"
                                            inputFormat="DD/MM/yyyy"
                                            disableMaskedInput
                                            value={values.fechaNacimiento}
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
                                                value={values.tipoDocumento}
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
                                            value={values.numeroDocumento}
                                            onChange={handleChange("numeroDocumento")}
                                        />
                                    </Grid>
                                    {/* Genero */}
                                    <Grid item xs={12} sm={12}>
                                        <FormControl>
                                            <FormLabel id="lbl-genero">Genero</FormLabel>
                                            <RadioGroup row
                                                aria-labelledby="lbl-genero"
                                                value={values.genero} onChange={handleChange("genero")} >
                                                <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
                                                <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                                                <FormControlLabel value="Otro" control={<Radio />} label="Otro" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            ) : null}
                        {
                            /* Actividad */
                            activeStep === 2 ? (
                                <Box sx={{ my: 2 }} >
                                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                                        <Grid item xs={12} sm={6}>
                                            {/* Actividades */}
                                            <FormControl required sx={{ width: 300 }}>
                                                <InputLabel id="actividades-select-item-label">Actividades</InputLabel>
                                                <Select
                                                    labelId="actividades-select-item-label"
                                                    id="actividades-multiple-checkbox"
                                                    multiple
                                                    value={values.actividades}
                                                    onChange={handleActividadesChange}
                                                    input={<OutlinedInput label="Actividades" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                >
                                                    {ActivityTypes.sort().map((dt) => (
                                                        <MenuItem key={dt.key} value={dt.key}>
                                                            <Checkbox checked={values.actividades.indexOf(dt.key) > -1} />
                                                            <ListItemText primary={dt.value} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>Elija al menos una opción</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        {/* Nombre */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField id="txt-name" label="Codigo de Acceso" variant="standard"
                                                value={values.codigoAcceso} required
                                                onChange={handleChange("codigoAcceso")}
                                                sx={{ width: '100%' }} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : null}

                        { /* Buttons */
                            activeStep === steps.length ? (
                                <>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }} >
                                        <Box sx={{ flex: '1 1 auto' }} >
                                            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                                                Ya estas Registrado!!!
                                            </Typography>

                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                Bienvenido.
                                            </Typography>
                                        </Box>

                                        <img src={BgrImage} width='200px' height='auto' alt='' style={{ transform: 'scaleX(-1)' }} />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }} >
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button component={NavLink} to={'/'} >Inicio</Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Button
                                            disabled={activeStep <= 1}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                            startIcon={< ArrowLeftIcon />}
                                        >
                                            Atras
                                        </Button>
                                        <Box sx={{ flex: '1 1 auto' }} />

                                        <Button type="submit" onClick={handleNext} endIcon={activeStep === steps.length - 1 ? < SendIcon /> : < ArrowRightIcon />} >
                                            {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                                        </Button>
                                    </Box>
                                </>
                            )}
                    </Box>
                </Box>
            </form>
        </>
    )
}

export default Register