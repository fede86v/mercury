import React, { useState, useEffect } from 'react';
import { Grid, Paper, TableContainer, TableCell, TableBody, TableHead, Table, TableRow, IconButton, Autocomplete, TextField, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types'
import { PaymentMethods } from '../../utils/enums';
import { useForm } from '../../utils';
import Alerts from '../common/Alerts';

const DEFAULT_PAYMENT_METHOD = { key: "Efectivo", value: "Efectivo" };
const DEFAULT_PAYMENT = {
    metodoPago: "Efectivo",
    monto: 0,
    comprobante: ""
};

const Pagos = ({ pagos, setPagos, montoTotal }) => {

    const { formState: pago, onInputChange, setFormState: setPago } = useForm({ ...DEFAULT_PAYMENT, monto: montoTotal });
    const { monto, metodoPago, comprobante, cuotas } = pago;
    const [metodo, setMetodo] = useState(DEFAULT_PAYMENT_METHOD);
    const [alert, setAlert] = useState(null);
    const [montoTotalPagos, setMontoTotalPagos] = useState(0);

    const agregarPago = () => {
        let pagosActualizado = pagos;
        pagosActualizado.push(pago);
        setPagos(pagosActualizado);

        let total = 0;
        for (let i of pagosActualizado) total += Number(i.monto);
        setMontoTotalPagos(total);
    };

    const handleNewItem = () => {
        let validacion = "";
        if ((metodo === "Credito" || metodo === "Debito") && monto === 0) {
            validacion = "Monto es requerido."
        }
        if ((metodo === "Credito" || metodo === "Debito") && !comprobante) {
            validacion = "Comprobante es requerido."
        }
        if (metodo === "Credito" && !cuotas) {
            validacion = "Ingrese la cantidad de cuotas en que realizará el pago."
        }

        if (validacion) {
            setAlert(validacion);
            return;
        }
        agregarPago();
    };

    const handleDelete = () => { };

    const ItemPago = (
        <>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} >

                {/* Metodo de Pago */}
                <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                        id="autocomplete-descripcion"
                        options={PaymentMethods}
                        onChange={(event, newValue) => { setMetodo(newValue); }}
                        getOptionLabel={(option) => option.value}
                        value={metodo}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Método de Pago" />}
                    />
                </Grid>

                {/* Monto */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-monto" label="Monto"
                        value={monto} name="monto"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

                {/* Comprobante */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-comprobante" label="Comprobante"
                        value={comprobante} name="comprobante"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button color="secondary" variant="contained" disabled={montoTotalPagos === montoTotal} onClick={handleNewItem}>Agregar</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    );

    return (
        <>
            {/* Detalle Compra */}
            <Grid item xs={12} sm={12} md={12}>
                <Paper sx={{ p: 2 }}  >
                    <Alerts alert={alert} />
                    <ItemPago />
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Metodo de Pago</TableCell>
                                    <TableCell align="left">Monto</TableCell>
                                    <TableCell align="left">Comprobante #</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagos.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{item.metodoPago}</TableCell>
                                        <TableCell align="left">{item.monto}</TableCell>
                                        <TableCell align="left">{item.comprobante}</TableCell>
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
        </>
    )
}

Pagos.propTypes = {
    pagos: PropTypes.array.isRequired,
    setPagos: PropTypes.func.isRequired
}

export default Pagos