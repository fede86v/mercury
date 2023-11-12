import React, { useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { Grid, Box, Typography, Button, Paper } from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SaveIcon from '@mui/icons-material/Save';
import { ProductService } from '../utils/databaseService';
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
    telefono: ""
};

const DetalleCliente = () => {

    const { id } = useParams();
    const { onSave } = usePerson();
    const { formState: cliente, onInputChange, onInputDateChange, setFormState: setCliente } = useForm(DEFAULT_PERSON)

    const getCliente = async () => {
        const data = await ProductService.getOne(id);
        setCliente(data);
        return data;
    };

    const query = useQuery(['clientes'], getCliente, id);

    useEffect(() => {
        query.refetch();

        return () => {
            setCliente(DEFAULT_PERSON);
        }
    }, []);

    return (
        <>
            {
                query.isLoading ? (<Typography variant="h4" padding={3} textAlign="center" >Loading...</Typography>)
                    : (
                        <>
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