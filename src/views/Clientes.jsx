import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import AgregarPersona from '../components/modules/AgregarPersona'
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton, Button
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ClientService } from '../utils';
import { UserContext } from '../context/UserProvider';

const Clientes = () => {
    const [vendedores, setClientes] = useState([]);
    const [open, setOpen] = useState(false);
    const { user } = useContext(UserContext);

    const getClientList = async () => {
        const data = await ClientService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setClientes(sortedData)
        return sortedData;
    };

    const query = useQuery(['clientes'], getClientList);

    useEffect(() => {
        query.refetch();
    }, []);

    const handleNewProduct = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        query.refetch();
    };

    return (
        <>
            {open ? <AgregarPersona open={open} handleClose={handleClose} tipoPersona="cliente" /> : null}
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
                <Grid item sm={2}>
                    <Button color="primary" variant="contained" onClick={() => { handleNewProduct(); }}>Crear</Button>
                </Grid>
                <Grid item sm={10}>
                    <Typography variant="h4" padding={3} textAlign="center" >Clientes</Typography>
                </Grid>
                <Grid item sm={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Nombre</TableCell>
                                    <TableCell align="left">Apellido</TableCell>
                                    <TableCell align="left">Genero</TableCell>
                                    <TableCell align="left">Fecha Actualizacion</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendedores.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{item.nombre}</TableCell>
                                        <TableCell align="left">{item.apellido}</TableCell>
                                        <TableCell align="left">{item.genero}</TableCell>
                                        <TableCell align="left">{dayjs(item.fechaActualizacion).format('DD-M-YYYY')}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Clientes/" + item.id} >
                                                    <ModeEditIcon color="secondary" />
                                                </ IconButton>
                                            </>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>

    )
}

export default Clientes
