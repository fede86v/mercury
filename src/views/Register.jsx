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
import { DocumentTypes } from '../utils/enums';
import Alerts from '../components/common/alerts'
import { useForm } from '../utils';

const DEFAULT_USER = {
    uid: "",
    company: '',
    password: '',
    repassword: '',
    email: '',
    nombre: "",
    apellido: "",
    fechaNacimiento: Date.now(),
    genero: "Femenino",
    tipoDocumento: "DNI",
    numeroDocumento: "",
};

const Register = () => {
    const steps = ["Cuenta", "Usuario"];

    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepassword, setShowRepassword] = useState(false);
    const [companies, setCompanies] = useState([]);
    const { error: authError, user, signInWithGoogle, createUserWithEmail, updateUser } = useContext(UserContext);
    const { error: firebaseError, loading, validateCodigoAcceso } = useFirestore();
    const { formState: usuario, onInputChange, onInputDateChange, setFormState: setUsuario } = useForm(DEFAULT_USER)
    const { compania, password, repassword, email, nombre, apellido, fechaNacimiento, genero, tipoDocumento, numeroDocumento } = usuario;

    useEffect(() => {
        setError(null);
    }, []);

    useEffect(() => {
        if (user) {
            if (user.activado) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
            else {
                if (usuario.uid === "") {
                    setUsuario((v) => ({
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
            if (email.trim().length === 0) {
                setAlert(`Debe ingresar un email valido`);
                return;
            }
            if (!password.trim()) {
                setAlert('Password es requerido!')
                return
            }
            if (password.length < 6) {
                setAlert('Contraseña muy debil - minimo 6 caracteres!')
                return
            }
            if (password.trim() !== repassword.trim()) {
                setAlert('Contraseñas no coinciden, por favor verifiquelas')
                return
            }
            createUserWithEmail(email, password);
        }
        if (activeStep === 1) {
            if (nombre.trim() === "") {

                setAlert(`Debe ingresar un Nombre`);
                return;
            }
            if (apellido.trim() === "") {
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
        const user = {
            uid: usuario.uid,
            email: usuario.email,
            persona: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                fechaNacimiento: usuario.fechaNacimiento.toString(),
                genero: usuario.genero,
                tipoDocumento: usuario.tipoDocumento,
                numeroDocumento: usuario.numeroDocumento,
            },
        };
        await updateUser(user);
    }, [usuario, updateUser]);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setError(null);
        setAlert(null);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowRepassword = () => {
        setShowRepassword(!showRepassword);
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
                        <Alerts alert={alert} error={error} />
                        {/* Cuenta */
                            activeStep === 0 ? (

                                <Box sx={{ my: 2 }} >
                                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                                        <Grid item xs={12} sm={12}>
                                            <Grid item xs={12} sm={12}>
                                                {/* Text */}
                                                <FormControl variant="standard" fullWidth >
                                                    <InputLabel id="company-label">Compania</InputLabel>
                                                    <Select
                                                        labelId="compania-label"
                                                        id="compania" name='compania'
                                                        value={compania}
                                                        onChange={onInputChange}>
                                                        {companies.sort().map((dt) => (
                                                            <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            {/* Text */}
                                            <Typography >Puede registrarse utilizando Usuario y Contraseña o puede elegir registrarse directamente con su cuenta de google.</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>

                                            {/* Email */}
                                            <TextField label='Email' placeholder='Email' margin='normal' type='email'
                                                onChange={onInputChange} value={email} name='email' required sx={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>

                                            {/* Password */}
                                            <FormControl margin='normal' required sx={{ width: "100%" }}>
                                                <InputLabel htmlFor="lbl-password">Contraseña</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password} name='password'
                                                    onChange={onInputChange}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDown}
                                                                edge="end" >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
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
                                                    type={showRepassword ? 'text' : 'password'}
                                                    value={repassword} name='repassword'
                                                    onChange={onInputChange}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowRepassword}
                                                                onMouseDown={handleMouseDown}
                                                                edge="end" >
                                                                {showRepassword ? <VisibilityOff /> : <Visibility />}
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
                                            value={nombre} name='nombre'
                                            onChange={onInputChange}
                                            sx={{ width: '100%' }} />
                                    </Grid>
                                    {/* Apellido */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField id="txt-lastName" label="Apellido" variant="standard"
                                            value={apellido} name='apellido'
                                            onChange={onInputChange}
                                            sx={{ width: '100%' }} />
                                    </Grid>
                                    {/* Fecha de Nacimiento */}
                                    <Grid item xs={12} sm={12}>
                                        <DesktopDatePicker
                                            label="Fecha de Nacimiento"
                                            inputFormat="DD/MM/yyyy"
                                            disableMaskedInput
                                            value={fechaNacimiento} name='fechaNacimiento'
                                            onChange={onInputDateChange}
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
                                                value={tipoDocumento} name='tipoDocumento'
                                                onChange={onInputChange}
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
                                            value={numeroDocumento} name='numeroDocumento' onChange={onInputChange}
                                        />
                                    </Grid>
                                    {/* Genero */}
                                    <Grid item xs={12} sm={12}>
                                        <FormControl>
                                            <FormLabel id="lbl-genero">Genero</FormLabel>
                                            <RadioGroup row
                                                aria-labelledby="lbl-genero"
                                                value={genero} name='genero' onChange={onInputChange} >
                                                <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
                                                <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                                                <FormControlLabel value="Otro" control={<Radio />} label="Otro" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
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