import React, { useState } from 'react'
import {
    Grid, Box, Card, Typography, Divider, Paper, TableContainer, Table,
    TableCell, TableHead, TableRow, TableBody, IconButton, Dialog,
    DialogTitle, DialogContent, Button, DialogContentText, DialogActions
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types'
import Cliente from '../common/Cliente'
import Vendedor from '../common/Vendedor'
import ItemVenta from './ItemVenta';
import Alerts from './Alerts';

const Venta = ({ venta, setVenta, productos }) => {
    const { total, subtotal, descuento, cliente, vendedor, detalleVenta } = venta;
    const [alert, setAlert] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);

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

    const calcularMontos = (detalle) => {
        let precio = 0;
        let descuento = 0;
        let total = 0;
        for (let i of detalle) {
            precio += Number(i.cantidad) * Number(i.precio);
            descuento += Number(i.descuento);
            total += Number(i.importe);
        }

        setVenta({
            ...venta,
            "detalleVenta": detalle,
            "subtotal": precio,
            "descuento": descuento,
            "total": total
        });
    };

    const setDetalleVenta = (data) => {
        detalleVenta.push(data);
        calcularMontos(detalleVenta);
    };

    const handleDelete = (item) => {
        if (item) {
            setItemToDelete(item);
            setDialogRemoveConfirmOpen(true);
        }
    };

    /* Dialog Remove */
    const handleClose = (aceptar) => {
        if (aceptar) {
            const array = detalleVenta.filter(i => i !== itemToDelete);
            calcularMontos(array);
        }
        setDialogRemoveConfirmOpen(false);
    };

    return (
        <Box sx={{ p: 2 }} >
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} spacing={2} >
                {/* Cliente */}
                <Grid item xs={12} sm={12} md={6}>
                    <Paper sx={{ p: 2 }}  >
                        <Cliente persona={cliente} setPersona={setCliente} />
                    </Paper>
                </Grid>

                {/* Vendedor */}
                <Grid item xs={12} sm={12} md={6}>
                    <Paper sx={{ p: 2 }}  >
                        <Vendedor persona={vendedor} setPersona={setVendedor} />
                    </Paper>
                </Grid>

                {/* Detalle Compra */}
                <Grid item xs={12} sm={12} md={12}>
                    <Paper sx={{ p: 2 }}  >
                        <Alerts alert={alert} />
                        <ItemVenta productos={productos} setDetalleVenta={setDetalleVenta} setAlert={setAlert} />
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Descripcion</TableCell>
                                        <TableCell align="left">Cant.</TableCell>
                                        <TableCell align="left">Precio Unit.</TableCell>
                                        <TableCell align="left">Descuento</TableCell>
                                        <TableCell align="left">Importe</TableCell>
                                        <TableCell align="right">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detalleVenta.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{item.descripcion}</TableCell>
                                            <TableCell align="left">{item.cantidad}</TableCell>
                                            <TableCell align="left">$ {item.precio}</TableCell>
                                            <TableCell align="left">{item.descuento !== 0 ? '$' + item.descuento : ''}</TableCell>
                                            <TableCell align="left">$ {item.importe}</TableCell>
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
                { /* ---------- Resumen ----------  */}
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
                        Esta seguro de eliminar este producto?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="secondary" >Cancelar</Button>
                    <Button onClick={() => handleClose(true)} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

Venta.propTypes = {
    venta: PropTypes.object.isRequired,
    setVenta: PropTypes.func.isRequired,
}


export default Venta