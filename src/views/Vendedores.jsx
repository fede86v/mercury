import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import AgregarPersona from '../components/modules/AgregarPersona'
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { EmployeeService } from '../utils';
import { useProduct } from '../utils'
import { UserContext } from '../context/UserProvider';

const Vendedores = () => {
    const [vendedores, setVendedores] = useState([]);
    const [open, setOpen] = useState(false);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const { user } = useContext(UserContext);
    const { onSave } = useProduct();

    const getEmployeeList = async () => {
        const data = await EmployeeService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setVendedores(sortedData)
        return sortedData;
    };

    const query = useQuery(['employees'], getEmployeeList);

    useEffect(() => {
        query.refetch();
    }, []);

    const handleNewProduct = () => {
        setOpen(true);
    };
    const handleCloseVendedor = () => {
        setOpen(false);
        query.refetch();
    };
    const handleDeleteProduct = async (productoAeliminar) => {
        const producto = { ...productoAeliminar, fechaInactivo: Date.now() };
        onSave(producto);
        setDialogRemoveConfirmOpen(true);
    };
    const handleClose = async (aceptar) => {
        setDialogRemoveConfirmOpen(false);
        query.refetch();
    };

    return (
        <>
            {open ? <AgregarPersona open={open} handleClose={handleCloseVendedor} /> : null}
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
                <Grid item sm={2}>
                    <Button color="primary" variant="contained" onClick={() => { handleNewProduct(); }}>Crear</Button>
                </Grid>
                <Grid item sm={10}>
                    <Typography variant="h4" padding={3} textAlign="center" >Vendedores</Typography>
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
                                                <IconButton aria-label="edit" component={NavLink} to={"/Vendedores/" + item.id} >
                                                    <ModeEditIcon color="secondary" />
                                                </ IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteProduct(item)} >
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

export default Vendedores
