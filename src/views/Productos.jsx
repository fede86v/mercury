import React, { useEffect, useState } from 'react'
import { useFirestore } from '../utils/useFirestore';
import { NavLink } from "react-router-dom";
import AgregarCliente from '../components/modules/AgregarCliente'
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

const Productos = () => {
    const [socios, setSocios] = useState([]);
    const [openSocio, setOpenSocio] = useState(false);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);


    const { getSocios: fb_getSocios } = useFirestore();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await fb_getSocios();
        if (res !== null)
            setSocios(res);
    };

    const handleNewSocio = () => {
        setOpenSocio(true);
    };
    const handleCloseSocio = () => {
        setOpenSocio(!openSocio);
        getData();
    };

    const handleDeleteSocio = async (uid, activo) => {
        /* const currentSocio = activo
            ? entrenadores.find(e => e.uid === uid)
            : entrenadoresInactivos.find(e => e.uid === uid);
        setCurrentSocio(currentSocio);*/
        setDialogRemoveConfirmOpen(true);
    };

    const handleClose = async (aceptar) => {
        //Agregar codigo para seleccionar el current Socio y eliminarlo
        setDialogRemoveConfirmOpen(false);
    };

    return (
        <>
            <AgregarCliente open={openSocio} handleClose={handleCloseSocio} />
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >

                <Grid item sm={12}>
                    <Button color="primary" variant="contained" onClick={() => { handleNewSocio(); }}>Crear</Button>
                </Grid>

                <Grid item sm={12}>
                    <Typography variant="h4" padding={3} textAlign="center" >Clientes</Typography>
                </Grid>
                <Grid item sm={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Apellido</TableCell>
                                    <TableCell align="left">Nombre</TableCell>
                                    <TableCell align="left">Vencimiento</TableCell>
                                    <TableCell align="left">Clases Restantes</TableCell>
                                    <TableCell align="left">Actividad</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {socios.map(({ uid, apellido, nombre, fechaVencimiento, clasesRestantes, actividades }) => (
                                    <TableRow
                                        key={uid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{apellido}</TableCell>
                                        <TableCell align="left">{nombre}</TableCell>
                                        {/* <TableCell align="left">{moment(fechaVencimiento).format('DD-M-YYYY')}</TableCell> */}
                                        <TableCell align="left">{clasesRestantes}</TableCell>
                                        <TableCell align="left">{actividades.map(a => a + " ")}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Socios/" + uid} >
                                                    <ModeEditIcon color="primary" />
                                                </ IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteSocio(uid, true)} >
                                                    <DeleteIcon color="error" />
                                                </ IconButton>
                                            </>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Dialog
                    open={dialogRemoveConfirmOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Esta seguro?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Esta seguro de eliminar a esta persona? los datos no seran eliminados pero no seran visibles directamente.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose(false)} color="secondary" >Cancelar</Button>
                        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>

    )
}

export default Productos