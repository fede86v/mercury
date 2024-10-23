import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    TextField, Button, Card } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useFirebaseQuery } from './../utils/useFirebaseQuery';
import { TransactionService, PaymentService, TransactionDetailService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { ExportToExcel } from './../utils/exportToExcel';
import { useLoading } from '../utils/LoadingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Reportes = () => {

    const [ventas, setVentas] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [detalleVentasFiltradas, setDetalleVentasFiltradas] = useState([]);
    const [detalleVentas, setDetalleVentas] = useState([]);
    const [total, setTotal] = useState(0);
    const [debito, setDebito] = useState(0);
    const [transferencia, setTransferencia] = useState(0);
    const [credito, setCredito] = useState(0);
    const [efectivo, setEfectivo] = useState(0);
    const [desde, setDesde] = useState(new Date());
    const [hasta, setHasta] = useState(new Date());
    const { user } = useContext(UserContext);
    const { setIsLoading } = useLoading();
    

    const getTransactionList = async () => {
        setIsLoading(true);
        let d = new Date(desde);
        let h = new Date(hasta);

        d = dayjs(d.setHours(0, 0, 0)).valueOf()
        h = dayjs(h.setHours(23, 59, 59)).valueOf()

        const query = [
            { field: "empresaId", condition: "==", value: user.empresaId },
            { field: "fechaVenta", condition: ">=", value: d }
        ]

        const data = await TransactionService.getQueryMultiple(query);
        const filterData = data.filter(i => !i.fechaAnulacion && i.fechaVenta <= h);

        const sortedData = filterData.sort((a, b) => {
            if (dayjs(a.FechaVenta) > dayjs(b.FechaVenta)) {
                return -1;
            }
            if (dayjs(a.FechaVenta) < dayjs(b.FechaVenta)) {
                return 1;
            }
            return 0;
        });
        setVentas(sortedData)
        return sortedData;
    };

    const queryVentas = useFirebaseQuery(['ventas'], getTransactionList);

    const getPayments = async () => {
        setIsLoading(true);
        let d = new Date(desde);
        let h = new Date(hasta);

        d = dayjs(d.setHours(0, 0, 0)).valueOf()
        h = dayjs(h.setHours(23, 59, 59)).valueOf()

        const query = [
            { field: "empresaId", condition: "==", value: user.empresaId },
            { field: "fechaPago", condition: ">=", value: d }
        ]

        const data = await PaymentService.getQueryMultiple(query);
        const filteredData = data.filter(i => i.fechaPago < h)

        let eff = 0;
        let deb = 0;
        let tra = 0;
        let cred = 0;
        let tot = 0;

        filteredData.forEach(item => {
            tot = tot + Number(item.monto);

            if (item.metodoPago === "Efectivo") {
                eff = eff + Number(item.monto);
            }
            if (item.metodoPago === "Debito") {
                deb = deb + Number(item.monto);
            }
            if (item.metodoPago === "Transferencia") {
                tra = tra + Number(item.monto);
            }
            if (item.metodoPago === "Credito") {
                cred = cred + Number(item.monto);
            }
        });

        setPagos(filteredData);
        setEfectivo(eff);
        setDebito(deb);
        setTransferencia(tra);
        setCredito(cred);
        setTotal(tot);
        return filteredData;
    };

    const queryPayments = useFirebaseQuery(['pagos'], getPayments)

    const getTotalsByName = (data) => {
        const totals = data.reduce((acc, curr) => {
          if (!acc[curr.descripcion]) {
            acc[curr.descripcion] = 0;
          }
          acc[curr.descripcion] += Number(curr.cantidad);
          return acc;
        }, {});
      
        // Convert to array format
        return Object.entries(totals).map(([descripcion, cantidad]) => ({
            descripcion,
            cantidad
        }));
      };

    const getDetalleVenta = async () => {
        let d = new Date(desde);
        let h = new Date(hasta);

        d = dayjs(d.setHours(0, 0, 0)).valueOf()
        h = dayjs(h.setHours(23, 59, 59)).valueOf()

        setDesde(d);
        setHasta(h);

        const query = [
            { field: "empresaId", condition: "==", value: user.empresaId },
            { field: "fechaCreacion", condition: ">=", value: d }
        ]

        const data = await TransactionDetailService.getQueryMultiple(query);
        const filteredData = data.filter(i => i.fechaCreacion < h)

        const data_graph = getTotalsByName(filteredData);
        
        setDetalleVentas(data_graph)
        setDetalleVentasFiltradas(filteredData);
    };

    useEffect(() => {
        queryPayments.refetch();
        queryVentas.refetch();
        getDetalleVenta();
    }, []);

    useEffect(() => {
        if (desde > hasta)
            setHasta(desde);
    }, [desde]);

    useEffect(() => {
        if (desde > hasta)
            setDesde(hasta);
    }, [hasta]);


    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2}>

                <Grid item sm={12}>
                    <Typography variant="h4" padding={3} textAlign="center" >Reportes</Typography>
                </Grid>

                <Grid item sm={12}>
                    <Card sx={{ p: 1 }} >
                        <Grid container columnSpacing={{ xs: 1, sm: 1, md: 1 }} sx={{ my: 2 }} >
                            <Grid item xs={3} sm={2}>
                                <DatePicker
                                    id="date-desde"
                                    label="Desde"
                                    inputFormat="DD/MM/YYYY"
                                    value={desde} name="date-desde"
                                    onChange={(v) => setDesde(v)}
                                    renderInput={(props) => <TextField variant="standard" {...props} />}
                                />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <DatePicker
                                    id="date-hasta"
                                    label="Hasta"
                                    inputFormat="DD/MM/YYYY"
                                    value={hasta} name="date-hasta"
                                    onChange={(v) => setHasta(v)}
                                    renderInput={(props) => <TextField variant="standard" {...props} />}
                                />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <Button color="primary" variant="contained" onClick={() => {
                                    queryVentas.refetch();
                                    queryPayments.refetch();
                                    getDetalleVenta();
                                }}  >Buscar</Button>
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <ExportToExcel apiData={ventas} fileName={"Ventas"} label={"Exp. Ventas"} />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <ExportToExcel apiData={pagos} fileName={"Pagos"} label={"Exp. Pagos"} />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <ExportToExcel apiData={detalleVentasFiltradas} fileName={"Detalle ventas"} label={"Exp. Detalle"} />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item sm={12}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={1} >
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ p: 1 }} >
                                <Typography textAlign="end" >Total</Typography>
                                <Typography variant="h6" textAlign="end" >$ {total}</Typography>
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
                                <Typography textAlign="end" >Transferencia</Typography>
                                <Typography variant="h6" textAlign="end" >$ {transferencia}</Typography>
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
                                <Typography textAlign="end" >Credito</Typography>
                                <Typography variant="h6" textAlign="end" >$ {credito}</Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
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
                                        <TableCell align="left">{dayjs(item.fechaVenta).format('DD-M-YYYY')}</TableCell>
                                        <TableCell align="left">{"$" + item.subtotal}</TableCell>
                                        <TableCell align="left">{"$" + item.descuento}</TableCell>
                                        <TableCell align="left">{"$" + item.total}</TableCell>
                                        <TableCell align="left">{item.vendedor}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Ventas/" + item.id} >
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

                <Grid item sm={12}>
                    <Card className="w-full">
                        <Typography variant="h5" padding={2} textAlign="center" >Productos vendidos</Typography>
                            <Card className="h-96 w-full">
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart data={detalleVentas} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                                        <XAxis dataKey="descripcion" angle={-25} textAnchor="end" height={50} interval={0}/>
                                        <YAxis label={{ value: 'Unidades vendidas', angle: -90, position: 'insideLeft', offset: 10 }}/>
                                        <Tooltip formatter={(value) => [`${value} unidades`, 'Unidades Vendidas']}
                                        />
                                        <Bar dataKey="cantidad"  radius={[4, 4, 0, 0]}>
                                        {detalleVentas.map((entry, index) => (
                                            <Cell cursor="pointer" fill={'#FF4841'} key={`cell-${index}`} />
                                        ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                    </Card>
                </Grid>
            </Grid >
        </>

    )
}

export default Reportes
