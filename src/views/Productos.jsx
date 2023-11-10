 import React, { useState, useContext } from 'react';
import { NavLink } from "react-router-dom";
import AgregarProducto from '../components/modules/AgregarProducto'
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ProductService, ProductTypeService } from '../utils';
import { UserContext } from '../context/UserProvider';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [tipoProductos, setTipoProductos] = useState([]);
    const [openProducto, setOpenProducto] = useState(false);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const { user } = useContext(UserContext);


    const getProductList = async () => {
        const data = await ProductService.getQueryry("empresa", "==", user.empresaId);;
        return data;
    };
    const getProductTypeList = async () => {
        const data = await ProductTypeService.getQueryry("empresa", "==", user.empresaId);
        setTipoProductos(data);
        return data;
    };

    const query = useQuery(['products'], getProductList);
    const queryProdTypes = useQuery(['productTypes'], getProductTypeList);

    const handleNewProduct = () => {
        setOpenProducto(true);
    };
    const handleCloseProducto = () => {
        setOpenProducto(!openProducto);
    };
    const handleDeleteProduct = async (uid, activo) => {
        setDialogRemoveConfirmOpen(true);
    };
    const handleClose = async (aceptar) => {
        setDialogRemoveConfirmOpen(false);
        query.refetch();
    };

    return (
        <>
            <AgregarProducto open={openProducto} tipoProductos={tipoProductos} handleClose={handleCloseProducto} />
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                <Grid item sm={2}>
                    <Button color="primary" variant="contained" onClick={() => { handleNewProduct(); }}>Crear</Button>
                </Grid>
                <Grid item sm={10}>
                    <Typography variant="h4" padding={3} textAlign="center" >Productos</Typography>
                </Grid>
                <Grid item sm={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Descripcion</TableCell>
                                    <TableCell align="left">Tipo</TableCell>
                                    <TableCell align="left">Cantidad</TableCell>
                                    <TableCell align="left">Precio</TableCell>
                                    <TableCell align="left">Fecha Actualizacion</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map(({ uid, descripcion, tipo, cantidad, precio, fechaActualizacion }) => (
                                    <TableRow
                                        key={uid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{descripcion}</TableCell>
                                        <TableCell align="left">{tipo}</TableCell>
                                        <TableCell align="left">{cantidad}</TableCell>
                                        <TableCell align="left">{"$" + precio}</TableCell>
                                        <TableCell align="left">{dayjs(fechaActualizacion).format('DD-M-YYYY')}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Productos/" + uid} >
                                                    <ModeEditIcon color="secondary" />
                                                </ IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteProduct(uid, true)} >
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