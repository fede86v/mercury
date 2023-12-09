import React, { useState, useContext, useEffect } from 'react'
import { Grid, Box, Typography, Button, Paper, Backdrop } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../context/UserProvider';
import { CompanyService } from '../utils';
import Empresa from '../components/common/Empresa';
import { useForm } from '../utils';

const DEFAULT_COMPANY = {
    nombre: "",
    cuit: "",
}
const Perfil = () => {
    const { user } = useContext(UserContext);
    const { formState: empresa, onInputChange, setFormState: setEmpresa } = useForm(DEFAULT_COMPANY)

    const getEmpresa = async () => {
        const data = await CompanyService.getOne(user.empresaId);
        setEmpresa(data);
        return data;
    };

    const query = useQuery(["companies"], getEmpresa, user.empresaId);

    useEffect(() => {
        query.refetch();

        return () => {
            setEmpresa(DEFAULT_COMPANY);
        }
    }, []);

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={query.isLoading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 1 }} spacing={1} >
                <Grid item xs={12} sm={10} >
                    <Typography variant="h4" textAlign="center" >{empresa.nombre} </Typography>
                </Grid>
                <Grid item xs={12} sm={2} justifyContent="end">
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            sx={{ ml: 1 }}
                            variant="contained"
                            startIcon={< SaveIcon />} >
                            Guardar
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} >
                    <Paper sx={{ p: 2 }}  >
                        <Empresa empresa={empresa} onInputChange={onInputChange} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default Perfil