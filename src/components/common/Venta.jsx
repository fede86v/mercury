import React, { useState } from 'react'
import { Grid, Box, Card, Typography, Divider, Paper, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types'
import Cliente from '../common/Cliente'
import Vendedor from '../common/Vendedor'
import ItemVenta from './ItemVenta';


const DEFAULT_ITEM_VENTA = {
    codigo: "",
    descripcion: "",
    precio: 0,
    cantidad: 1,
    importe: 0
};

const Venta = ({ venta, setVenta, productos }) => {
    const { total, subtotal, descuento, cliente, vendedor, detalleVenta } = venta;
    const [itemVenta, setItemVenta] = useState(DEFAULT_ITEM_VENTA);

    const setCliente = (data) => {
        setVenta({
            ...venta,
            "cliente": data
        });
    };

    const setVendedor = (data) => {
        setVenta({
            ...venta,
            "vendedor": data
        });
    };

    const setDetalleVenta = (data) => {
        venta.detalleVenta.push(data);
        console.log(venta);
    };

    const handleDelete = (item) => {
    };

    return (
        <Box sx={{ p: 2 }} >
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} sx={{ my: 2 }} spacing={2} >
                {/* Cliente */}
                <Grid item xs={12} sm={12} md={6}>
                    <Paper>
                        <Cliente persona={cliente} setPersona={setCliente} />
                    </Paper>
                </Grid>

                {/* Vendedor */}
                <Grid item xs={12} sm={12} md={6}>
                    <Paper>
                        <Vendedor persona={vendedor} setPersona={setVendedor} />
                    </Paper>
                </Grid>

                {/* Detalle Compra */}
                <Grid item xs={12} sm={12} md={12}>
                    <Paper>
                        <ItemVenta itemVenta={itemVenta} productos={productos} setDetalleVenta={setDetalleVenta} />
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Descripcion</TableCell>
                                        <TableCell align="left">Cant.</TableCell>
                                        <TableCell align="left">Precio Unit.</TableCell>
                                        <TableCell align="left">Importe</TableCell>
                                        <TableCell align="right">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detalleVenta.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{item.descripcion}</TableCell>
                                            <TableCell align="left">{item.cantidad}</TableCell>
                                            <TableCell align="left">{item.precio}</TableCell>
                                            <TableCell align="left">{item.importe}</TableCell>
                                            <TableCell align="right">
                                                <>
                                                    <IconButton aria-label="delete" onClick={() => handleDelete(item)} >
                                                        <DeleteIcon color="error" />
                                                    </ IconButton>
                                                </>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Divider />
                </Grid>
                { /* Resumen */}
                {/* Subtotal */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Subtotal</Typography>
                        <Typography variant="h6" textAlign="end" >$ {subtotal}</Typography>
                    </Card>

                </Grid>
                {/* Descuento */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Descuento</Typography>
                        <Typography variant="h6" textAlign="end" >$ {descuento}</Typography>
                    </Card>
                </Grid>
                {/* Total */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Total</Typography>
                        <Typography variant="h6" textAlign="end" >$ {total}</Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

Venta.propTypes = {
    venta: PropTypes.object.isRequired,
    setVenta: PropTypes.func.isRequired,
}


export default Venta