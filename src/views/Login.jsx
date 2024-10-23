import { useState } from 'react'
import {
    Alert,
    Box,
    TextField,
    Typography,
    IconButton,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Link,
    Button,
    AlertTitle,
    Divider
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserProvider';

const Login = () => {
    const { loginUserByMail, error: authError, user, signInWithGoogle } = useContext(UserContext);
    const [values, setValues] = useState({
        password: '',
        email: '',
        showPassword: false,
        rememberMe: false
    });
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    const processLogin = e => {
        e.preventDefault();

        if (!values.email.trim()) {
            setAlert('Email es requerido')
            return
        }
        if (!values.password.trim()) {
            setAlert('Password es requerido!')
            return
        }
        setAlert(null)
        loginUserByMail(values.email.trim(), values.password.trim())
    };

    const handleRegister = () => {
        setError(null);
        navigate("/Register");
    };

    useEffect(() => {
        setError(authError);
    }, [authError]);

    useEffect(() => {
        if (user) {
            if (user.activado) {
                navigate("/");
            }
            else {
                navigate("/Register");
            }
        }
    }, [user]);

    return (
        <form onSubmit={processLogin}>
            <Box display="flex"
                flexDirection={"column"}
                alignItems={"stretch"}
                maxWidth={600}
                justifyContent={"center"}
                margin={"auto"}
                marginTop={20}
                padding={3} sx={{ boxShadow: 3 }}
                borderRadius={3} borderColor="InactiveBorder" >
                {/* Title */}
                <Typography variant="h4" padding={3} textAlign="center" >Login</Typography>

                {/* Alerts */}
                {
                    alert ? (
                        <Alert severity="warning">
                            <AlertTitle>
                                Atención!
                            </AlertTitle>
                            {alert}
                        </Alert>
                    )
                        : null
                }
                {/* Errors */}
                {
                    error ? (
                        <Alert severity="error">
                            <AlertTitle>
                                Error!
                            </AlertTitle>
                            {error}
                        </Alert>
                    )
                        : null
                }

                {/* Email */}
                <TextField variant='outlined' label='Email' placeholder='Email' margin='normal' type='email'
                    onChange={handleChange('email')} value={values.email} required
                />

                {/* Password */}
                <FormControl variant="outlined" margin='normal' required >
                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
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

                <Box display="flex" flexDirection={"row"}
                    sx={{
                        typography: 'body1',
                        '& > :not(style) + :not(style)': {
                            ml: 2,
                        }
                    }}
                >
                    <Link href="#" underline="none" sx={{ alignSelf: 'center', flexShrink: 0 }} onClick={handleRegister}
                        color="secondary">
                        Sin cuenta? Registrate aqui.
                    </Link>
                </Box>

                <Button height={20}
                    type="submit"
                    variant="contained"
                    sx={{ width: '100%', mt: 2 }}
                    size="large" >Login</Button>

                <Divider sx={{ my: 3 }} > o </Divider>

                <Button height={20}
                    startIcon={<GoogleIcon />}
                    onClick={signInWithGoogle}
                    color="secondary"
                    variant="contained"
                    sx={{ width: '100%' }}
                    size="large">Google</Button>

            </Box>
        </form>
    )
}

export default Login