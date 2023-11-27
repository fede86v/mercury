import React, { useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Button, Paper, Backdrop } from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import { EmployeeService } from '../utils/databaseService';
import Persona from '../components/common/Persona';
import { usePerson, useForm } from '../utils'
import { useQuery } from '@tanstack/react-query';

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

const DetalleVendedor = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { onSave, success, mutation } = usePerson();
    const { formState: vendedor, onInputChange, onInputDateChange, setFormState: setVendedor } = useForm(DEFAULT_PERSON)

    const getVendedor = async () => {
        const data = await EmployeeService.getOne(id);
        setVendedor(data);
        return data;
    };

    const query = useQuery(['vendedores'], getVendedor, id);

    useEffect(() => {
        query.refetch();
    }, []);

    useEffect(() => {
        if (success) {
            setVendedor(DEFAULT_PERSON);
            navigate("/Vendedores");
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
                                open={mutation && mutation.isLoading}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 1 }} spacing={1} >
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        component={NavLink}
                                        to={"/Vendedores/"}
                                        sx={{ mr: 1 }}
                                        startIcon={< ArrowLeftIcon />}
                                    >
                                        Atras
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={8} >
                                    <Typography variant="h4" textAlign="center" >{vendedor.Nombre}, {vendedor.apellido} </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2} justifyContent="end">
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button
                                            sx={{ ml: 1 }}
                                            variant="contained"
                                            startIcon={< SaveIcon />}
                                            onClick={() => onSave(vendedor, "vendedor")}
                                        >
                                            Guardar
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} >
                                    <Paper sx={{ p: 2 }}  >
                                        <Persona persona={vendedor} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    )
            }
        </>
    )

}

export default DetalleVendedor