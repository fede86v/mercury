import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Backdrop, Card
} from '@mui/material';
import dayjs from 'dayjs';

import CircularProgress from '@mui/material/CircularProgress';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import { TransactionService, useTransaction, ProductService, EmployeeService, PaymentService } from '../utils';
import { UserContext } from '../context/UserProvider';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [itemAeliminar, setItemAeliminar] = useState(null);
    const [totalHoy, setTotalHoy] = useState(0);
    const [totalSemana, setTotalSemana] = useState(0);
    const [totalMes, setTotalMes] = useState(0);
    const [total, setTotal] = useState(0);
    const [debito, setDebito] = useState(0);
    const [credito, setCredito] = useState(0);
    const [efectivo, setEfectivo] = useState(0);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const { user } = useContext(UserContext);
    const { onSave, mutation } = useTransaction();

    const getTransactionList = async () => {
        const data = await TransactionService.getQuery("empresaId", "==", user.empresaId);
        const filterData = data.filter(i => !i.fechaAnulacion);

        const sortedData = filterData.sort((a, b) => {
            if (dayjs(a.fechaCreacion) > dayjs(b.fechaCreacion)) {
                return -1;
            }
            if (dayjs(a.fechaCreacion) < dayjs(b.fechaCreacion)) {
                return 1;
            }
            return 0;
        });
        let hoy = 0;
        let semana = 0;
        let mes = 0;
        let todo = 0;
        sortedData.forEach(item => {
            if (dayjs(item.fechaCreacion) > dayjs().startOf("day")) {
                hoy = hoy + Number(item.total);
            }
            if (dayjs(item.fechaCreacion) > dayjs().startOf("week")) {
                semana = semana + Number(item.total);
            }
            if (dayjs(item.fechaCreacion) > dayjs().startOf("month")) {
                mes = mes + Number(item.total);
            }
            todo = todo + Number(item.total);
        });

        setTotalHoy(hoy);
        setTotalSemana(semana);
        setTotalMes(mes);
        setTotal(todo);

        setVentas(sortedData)
        return sortedData;
    };

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
        setProductos(sortedData)
        return sortedData;
    };

    const getPaymentsForToday = async () => {
        var start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        const query = [{ field: "empresaId", condition: "==", value: user.empresaId }, { field: "fechaCreacion", condition: ">", value: start.getTime() }]
        const data = await PaymentService.getQueryMultiple(query);
        let eff = 0;
        let deb = 0;
        let cred = 0;

        data.forEach(item => {
            if (item.metodoPago === "Efectivo") {
                eff = eff + Number(item.monto);
            }
            if (item.metodoPago === "Debito" || item.metodoPago === "Transferencia") {
                deb = deb + Number(item.monto);
            }
            if (item.metodoPago === "Credito") {
                cred = cred + Number(item.monto);
            }
        });
        setCredito(cred);
        setDebito(deb);
        setEfectivo(eff);
    };

    const getEmployeeList = async () => {
        const data = await EmployeeService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
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

    const query = useQuery(['ventas'], getTransactionList);
    const queryProductos = useQuery(['productos'], getProductList);
    const queryVendedores = useQuery(['vendedores'], getEmployeeList);

    useEffect(() => {
        query.refetch();
        queryProductos.refetch();
        queryVendedores.refetch();
        getPaymentsForToday();
    }, []);

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
                <Grid item sm={2}>
                    <Button
                        component={NavLink}
                        to={"/DetalleVenta/"} color="primary" variant="contained" >Crear</Button>
                </Grid>
                <Grid item sm={10}>
                    <Typography variant="h4" padding={3} textAlign="center" >Ventas</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Ventas Hoy</Typography>
                        <Typography variant="h6" textAlign="end" >$ {totalHoy}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Efectivo</Typography>
                        <Typography variant="h6" textAlign="end" >$ {efectivo}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Debito / Transferencia</Typography>
                        <Typography variant="h6" textAlign="end" >$ {debito}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Credito</Typography>
                        <Typography variant="h6" textAlign="end" >$ {credito}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Ventas Semana</Typography>
                        <Typography variant="h6" textAlign="end" >$ {totalSemana}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Ventas Mes</Typography>
                        <Typography variant="h6" textAlign="end" >$ {totalMes}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 1 }} >
                        <Typography textAlign="end" >Ventas Totales</Typography>
                        <Typography variant="h6" textAlign="end" >$ {total}</Typography>
                    </Card>
                </Grid>

                <Grid item sm={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Fecha</TableCell>
                                    <TableCell align="left">Subtotal</TableCell>
                                    <TableCell align="left">Descuento</TableCell>
                                    <TableCell align="left">Total</TableCell>
                                    <TableCell align="left">Vendedor</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ventas.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{dayjs(item.fechaCreacion).format('DD-M-YYYY')}</TableCell>
                                        <TableCell align="left">{"$" + item.subtotal}</TableCell>
                                        <TableCell align="left">{"$" + item.descuento}</TableCell>
                                        <TableCell align="left">{"$" + item.total}</TableCell>
                                        <TableCell align="left">{item.vendedor}</TableCell>
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
            </Grid>
        </>

    )
}

export default Ventas
