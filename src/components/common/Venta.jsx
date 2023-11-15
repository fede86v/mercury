import React from 'react'
import { Grid, Box, Card, Typography, Divider, Paper } from '@mui/material'
import PropTypes from 'prop-types'
import Cliente from '../common/Cliente'
import Vendedor from '../common/Vendedor'

const Venta = ({ venta, setVenta }) => {
    const { total, subtotal, descuento, cliente, vendedor, productos } = venta;

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
                <Grid item xs={12} sm={12}>
                    <Paper>

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