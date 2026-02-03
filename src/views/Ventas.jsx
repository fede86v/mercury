import React, { useState, useContext } from 'react';
import { NavLink } from "react-router-dom";
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Backdrop, Card } from '@mui/material';
import dayjs from 'dayjs';

import CircularProgress from '@mui/material/CircularProgress';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import { TransactionService, useTransaction, PaymentService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { useFirebaseQuery } from './../utils/useFirebaseQuery';
import { useLoading } from '../utils/LoadingContext';

const Ventas = () => {
    const [itemAeliminar, setItemAeliminar] = useState(null);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const { user } = useContext(UserContext);
    const { onSave, mutation } = useTransaction();
    const { setIsLoading } = useLoading();

    const getTransactionList = async () => {
        let desde = new Date();
        desde = dayjs(desde.setHours(0,0,0)).valueOf();

        const query = [
            { field: "empresaId", condition: "==", value: user.empresaId },
            { field: "fechaVenta", condition: ">=", value: desde }
        ]
        
        const data = await TransactionService.getQueryMultiple(query);
        
        const filterData = data.filter(i => !i.fechaAnulacion);

        const sortedData = filterData.sort((a, b) => {
            if (dayjs(a.fechaVenta) > dayjs(b.fechaVenta)) {
                return -1;
            }
            if (dayjs(a.fechaVenta) < dayjs(b.fechaVenta)) {
                return 1;
            }
            return 0;
        });
        return sortedData;
    };

    const getPaymentsForToday = async () => {
        let desde = new Date();
        desde = new Date(desde.setHours(0, 0, 0, 0))
        const query = [
            { field: "empresaId", condition: "==", value: user.empresaId }
        ]

        const data = await PaymentService.getQueryMultiple(query);
        const filterData = data.filter(i => !i.fechaAnulacion && (i.fechaPago >= desde));
        return filterData;
    };

    const query = useFirebaseQuery(['ventas'], getTransactionList);
    const queryPayments = useFirebaseQuery(['paymentsToday'], getPaymentsForToday);

    // Calcular totales de ventas
    const totalHoy = (query.data ?? []).reduce((total, item) => total + Number(item.total), 0);
    
    // Calcular totales de pagos
    const pagosHoy = queryPayments.data ?? [];
    const efectivo = pagosHoy.filter(p => p.metodoPago === "Efectivo").reduce((sum, p) => sum + Number(p.monto), 0);
    const debito = pagosHoy.filter(p => p.metodoPago === "Debito").reduce((sum, p) => sum + Number(p.monto), 0);
    const transferencia = pagosHoy.filter(p => p.metodoPago === "Transferencia").reduce((sum, p) => sum + Number(p.monto), 0);
    const credito = pagosHoy.filter(p => p.metodoPago === "Credito").reduce((sum, p) => sum + Number(p.monto), 0);

    const handleDelete = async (itemAeliminar) => {
        setItemAeliminar(itemAeliminar);
        setDialogRemoveConfirmOpen(true);
    };
    const handleClose = async (aceptar) => {
        if (aceptar) {
            const venta = { ...itemAeliminar, fechaAnulacion: Date.now() };
            onSave(venta);
        }
        setDialogRemoveConfirmOpen(false);
        setItemAeliminar(null);
        query.refetch();
        queryPayments.refetch();
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={mutation.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
                <Grid item xs={12} sm={2}>
                    <Button
                        component={NavLink}
                        to={"/DetalleVenta/"} color="primary" variant="contained" fullWidth sx={{ mb: { xs: 1, sm: 0 } }}>Crear</Button>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <Typography variant="h4" sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 3 }, textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem' } }}>Ventas</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ p: 1 }} >
                                <Typography textAlign="end" >Ventas Hoy</Typography>
                                <Typography variant="h6" textAlign="end" >$ {totalHoy}</Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <Card sx={{ p: 1 }} >
                                <Typography textAlign="end" >Efectivo</Typography>
                                <Typography variant="h6" textAlign="end" >$ {efectivo}</Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <Card sx={{ p: 1 }} >
                                <Typography textAlign="end" >Debito</Typography>
                                <Typography variant="h6" textAlign="end" >$ {debito}</Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <Card sx={{ p: 1 }} >
                                <Typography textAlign="end" >Transferencia</Typography>
                                <Typography variant="h6" textAlign="end" >$ {transferencia}</Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <Card sx={{ p: 1 }} >
                                <Typography textAlign="end" >Credito</Typography>
                                <Typography variant="h6" textAlign="end" >$ {credito}</Typography>
                            </Card>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item sm={12}>
                    <TableContainer component={Paper} sx={{ overflowX: 'auto', minHeight: { xs: 260 } }}>
                        <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="simple table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Total</TableCell>
                                    <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Subtotal</TableCell>
                                    <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Descuento</TableCell>
                                    <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Vendedor</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(query.data ?? []).map((item) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{"$" + item.total}</TableCell>
                                        <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{"$" + item.subtotal}</TableCell>
                                        <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{"$" + item.descuento}</TableCell>
                                        <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{item.vendedor}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Ventas/" + item.id} >
                                                    <ModeEditIcon color="secondary" />
                                                </ IconButton>
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
                            Esta seguro de eliminar esta transaccion?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose(false)} color="secondary" >Cancelar</Button>
                        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid >
        </>

    )
}

export default Ventas
