import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import AgregarProducto from '../components/modules/AgregarProducto'
import {
    Grid, Box, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Card
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ProductService, ProductTypeService, BrandService } from '../utils';
import { useProduct } from '../utils'
import { UserContext } from '../context/UserProvider';
import AgregarStock from '../components/modules/AgregarStock';
import {ExportToExcel} from './../utils/exportToExcel';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [productoAeliminar, setProductoAeliminar] = useState(null);
    const [tipoProductos, setTipoProductos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [openProducto, setOpenProducto] = useState(false);
    const [openStock, setOpenStock] = useState(false);
    const [stock, setStock] = useState(0);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const { user } = useContext(UserContext);
    const { onSave, success } = useProduct();

    const getProductList = async () => {
        const data = await ProductService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => !i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
            if (a.descripcion < b.descripcion) {
                return -1;
            }
            if (a.descripcion > b.descripcion) {
                return 1;
            }
            return 0;
        });
        let cantStock = 0;
        sortedData.forEach(item => {
            cantStock = cantStock + Number(item.cantidad);
        });
        setStock(cantStock);
        setProductos(sortedData)
        return sortedData;
    };
    const getProductTypeList = async () => {
        const data = await ProductTypeService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setTipoProductos(sortedData);
        return sortedData;
    };
    const getMarcas = async () => {
        const data = await BrandService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setMarcas(sortedData);
        return sortedData;
    };

    const query = useQuery(['products'], getProductList);
    const queryProdTypes = useQuery(['productTypes'], getProductTypeList);
    const queryMarcas = useQuery(['marcas'], getMarcas);

    useEffect(() => {
        query.refetch();
        queryProdTypes.refetch();
        queryMarcas.refetch();
    }, []);

    useEffect(() => {
        query.refetch();
    }, [success]);

    const handleNewProduct = () => {
        setOpenProducto(true);
    };

    const handleCloseProducto = () => {
        setOpenProducto(false);
        query.refetch();
    };

    const handleDeleteProduct = async (productoAeliminar) => {
        setProductoAeliminar(productoAeliminar);
        setDialogRemoveConfirmOpen(true);
    };
    const handleNewStock = () => {
        setOpenStock(true);
    };
    const handleClose = async (aceptar) => {
        if (aceptar) {
            const producto = { ...productoAeliminar, fechaInactivo: Date.now() };
            onSave(producto);
        }
        setDialogRemoveConfirmOpen(false);
        query.refetch();
        setProductoAeliminar(null);
    };
    const handleCloseStock = () => {
        setOpenStock(false);
        query.refetch();
    };

    return (
        <>
            {openProducto ? <AgregarProducto open={openProducto} tipoProductos={tipoProductos} marcas={marcas} handleClose={handleCloseProducto} /> : null}
            {openStock ? <AgregarStock open={openStock} productos={productos} handleClose={handleCloseStock} /> : null}
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Button color="primary" variant="contained" onClick={() => { handleNewProduct(); }}>Crear</Button>
                        <Button color="secondary" variant="contained" onClick={() => { handleNewStock(); }}>Agregar Stock</Button>
                        <ExportToExcel apiData={productos} fileName={"productos"} label={"Exportar Productos"} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem' } }}>Productos</Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Current Stock</Typography>
                        <Typography variant="h6" textAlign="end" >{stock}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Descripcion</TableCell>
                                    <TableCell align="left">Marca</TableCell>
                                    <TableCell align="left">Cantidad</TableCell>
                                    <TableCell align="left">Precio</TableCell>
                                    <TableCell align="left">Fecha Actualizacion</TableCell>
                                    <TableCell align="right">Codigo</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map((producto) => (
                                    <TableRow
                                        key={producto.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{producto.descripcion}</TableCell>
                                        <TableCell align="left">{producto.marca}</TableCell>
                                        <TableCell align="left">{producto.cantidad}</TableCell>
                                        <TableCell align="left">{"$" + producto.precioVenta}</TableCell>
                                        <TableCell align="left">{dayjs(producto.fechaActualizacion).format('DD-M-YYYY')}</TableCell>
                                        <TableCell align="left">{producto.codigo}</TableCell>

                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Productos/" + producto.id} >
                                                    <ModeEditIcon color="secondary" />
                                                </ IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteProduct(producto)} >
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
