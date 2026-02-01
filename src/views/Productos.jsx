import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import AgregarProducto from '../components/modules/AgregarProducto'
import {
    Grid, Box, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Card, TextField, InputAdornment
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { ProductService, ProductTypeService, BrandService } from '../utils';
import { useProduct } from '../utils'
import { UserContext } from '../context/UserProvider';
import AgregarStock from '../components/modules/AgregarStock';
import {ExportToExcel} from './../utils/exportToExcel';

const Productos = () => {
    const [productoAeliminar, setProductoAeliminar] = useState(null);
    const [openProducto, setOpenProducto] = useState(false);
    const [openStock, setOpenStock] = useState(false);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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
        return sortedData;
    };

    const query = useQuery(['products'], getProductList);
    const queryProdTypes = useQuery(['productTypes'], getProductTypeList);
    const queryMarcas = useQuery(['marcas'], getMarcas);

    // Filtrar productos basado en el término de búsqueda
    const productosFiltrados = (query.data ?? []).filter((producto) => {
        if (!searchTerm.trim()) return true;
        
        const termino = searchTerm.toLowerCase();
        const descripcion = (producto.descripcion || '').toLowerCase();
        const codigo = (producto.codigo || '').toLowerCase();
        const precio = String(producto.precioVenta || '');
        
        return descripcion.includes(termino) || 
               codigo.includes(termino) || 
               precio.includes(termino);
    });

    // Calcular stock total (de todos los productos, no solo los filtrados)
    const stock = (query.data ?? []).reduce((total, item) => total + Number(item.cantidad), 0);

    const prevSuccessRef = useRef(success);
    
    useEffect(() => {
        // Solo refetch cuando success cambia de false a true
        if (success && !prevSuccessRef.current) {
            query.refetch();
        }
        prevSuccessRef.current = success;
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {openProducto ? <AgregarProducto open={openProducto} tipoProductos={queryProdTypes.data ?? []} marcas={queryMarcas.data ?? []} productos={query.data ?? []} handleClose={handleCloseProducto} /> : null}
            {openStock ? <AgregarStock open={openStock} productos={query.data ?? []} handleClose={handleCloseStock} /> : null}
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Button color="primary" variant="contained" onClick={() => { handleNewProduct(); }}>Crear</Button>
                        <Button color="secondary" variant="contained" onClick={() => { handleNewStock(); }}>Agregar Stock</Button>
                        <ExportToExcel apiData={query.data ?? []} fileName={"productos"} label={"Exportar Productos"} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem' } }}>Productos</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por descripción, código o precio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Current Stock</Typography>
                        <Typography variant="h6" textAlign="end" >{stock}</Typography>
                    </Card>
                </Grid>

                <Grid item sm={12}>
                    <TableContainer component={Paper} sx={{ overflowX: 'auto', minHeight: { xs: 260 }, maxHeight: { xs: 'none', sm: 640 } }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Descripcion</TableCell>
                                    <TableCell align="left">Codigo</TableCell>
                                    <TableCell align="left">Cantidad</TableCell>
                                    <TableCell align="left">Precio</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productosFiltrados.map((producto) => (
                                    <TableRow
                                        key={producto.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{producto.descripcion}</TableCell>
                                        <TableCell align="left">{producto.codigo}</TableCell>
                                        <TableCell align="left">{producto.cantidad}</TableCell>
                                        <TableCell align="left">{"$" + producto.precioVenta}</TableCell>
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
