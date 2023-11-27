import React, { useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { Grid, Box, Typography, Button, Paper, Backdrop } from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import { ClientService } from '../utils/databaseService';
import Persona from '../components/common/Persona';
import { usePerson, useForm } from '../utils'
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";

const DEFAULT_PERSON = {
    email: '',
    nombre: "",
    apellido: "",
    fechaNacimiento: Date.now(),
    genero: "Femenino",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    tipoTelefono: "Principal",
    telefono: "",
    ciudad: "Salta",
    localidad: "Salta",
    direccion: "",
    zip: "4400"

};

const DetalleCliente = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { onSave, success, mutation } = usePerson();
    const { formState: cliente, onInputChange, onInputDateChange, setFormState: setCliente } = useForm(DEFAULT_PERSON)

    const getCliente = async () => {
        const data = await ClientService.getOne(id);
        setCliente(data);
        return data;
    };

    const query = useQuery(['clientes'], getCliente, id);

    useEffect(() => {
        query.refetch();
    }, []);

    useEffect(() => {
        if (success) {
            setCliente(DEFAULT_PERSON);
            navigate("/Clientes");
        }
    }, [success]);

    return (
        <>
            {
                query.isLoading ? (<Typography variant="h4" padding={3} textAlign="center" >Loading...</Typography>)
                    : (
                        <>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={mutation.isLoading}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>

                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 1 }} spacing={1} >
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        component={NavLink}
                                        to={"/Clientes/"}
                                        sx={{ mr: 1 }}
                                        startIcon={< ArrowLeftIcon />}
                                    >
                                        Atras
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={8} >
                                    <Typography variant="h4" textAlign="center" >{cliente.Nombre}, {cliente.apellido} </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2} justifyContent="end">
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button
                                            sx={{ ml: 1 }}
                                            variant="contained"
                                            startIcon={< SaveIcon />}
                                            onClick={() => onSave(cliente, "cliente")}
                                        >
                                            Guardar
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} >
                                    <Paper sx={{ p: 2 }}  >
                                        <Persona persona={cliente} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    )
            }
        </>
    )

}

export default DetalleCliente