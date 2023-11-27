import React, { useEffect, useContext, useState } from 'react'
import { Grid, Typography, TextField, Button, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types'
import { ClientService } from '../../utils/databaseService'
import { UserContext } from '../../context/UserProvider'
import { useForm } from '../../utils'
import Alerts from '../common/Alerts'
import AgregarPersona from '../modules/AgregarPersona'

const Cliente = ({ persona, setPersona }) => {

    const { formState: cliente, onInputChange, setFormState } = useForm(persona);
    const { nombre, apellido, numeroDocumento } = cliente;
    const { user } = useContext(UserContext);
    const [clientes, setClientes] = useState([]);
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false);

    const getClientList = async () => {
        const data = await ClientService.getQuery("empresaId", "==", user.empresaId);
        setClientes(data)
        return data;
    };
    const query = useQuery(['client'], getClientList);

    const handleNewClient = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setAlert(null);
        setOpen(false);
    };

    useEffect(() => {
        if (numeroDocumento) {
            const client = clientes.find(c => c.numeroDocumento === numeroDocumento);
            if (client) {
                setFormState(client);
                setPersona(client);
            }
        }
    }, [numeroDocumento]);

    useEffect(() => {
        query.refetch();
        setFormState(persona)
    }, []);

    return (
        <>
            {open ? <AgregarPersona open={open} handleClose={handleClose} tipoPersona="cliente" setPersona={setPersona} /> : null}
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} >
                <Grid item xs={12} sm={12} md={6} sx={{ p: 1 }}>
                    <Box display="flex" justifyContent="flex-start">
                        <Typography variant='h5' padding={0}  >Cliente</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} sx={{ p: 1 }}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button color="primary" variant="contained" onClick={() => { handleNewClient(); }}>Crear</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ p: 1 }}>
                    <Alerts alert={alert} error={error} />
                </Grid>
                {/* Documento */}
                <Grid item xs={12} sm={6} md={6}>
                    <TextField id="txt-dni" label="Numero de Documento"
                        variant="standard" sx={{ width: '100%' }}
                        value={numeroDocumento} name="numeroDocumento"
                        onChange={onInputChange}
                    />
                </Grid>

                {/* Nombre Completo*/}
                <Grid item xs={12} sm={12} md={6}>
                    {nombre && apellido ? <Typography padding={0} sx={{ mt: 3, mb: 1 }}  >{nombre}, {apellido}</Typography> : null}
                </Grid>
            </Grid>
        </>

    )
}

Cliente.propTypes = {
    persona: PropTypes.object.isRequired,
    setPersona: PropTypes.func.isRequired
}


export default Cliente