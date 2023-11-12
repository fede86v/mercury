import React from 'react'
import { Grid, Box, Select, TextField, InputAdornment, InputLabel, MenuItem, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const Venta = ({ venta, onInputChange, vendedores, productos }) => {
    const { total, subtotal, descuento } = venta;

    return (
        <Box sx={{ p: 2 }} >

            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                {/* Detalle Compra */}
                <Grid item xs={12} sm={12}>

                </Grid>

                {/* Subtotal */}
                <Grid item xs={12} sm={12}>
                    <Typography variant="h6" textAlign="end" >$ {subtotal}</Typography>
                </Grid>
                {/* Descuento */}
                <Grid item xs={12} sm={12}>
                    <Typography variant="h6" textAlign="end" >$ {descuento}</Typography>
                </Grid>
                {/* Total */}
                <Grid item xs={12} sm={12}>
                    <Typography variant="h6" textAlign="end" >$ {total}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

Venta.propTypes = {
    productos: PropTypes.array.isRequired,
    vendedores: PropTypes.array.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onInputDateChange: PropTypes.func.isRequired,
}


export default Venta