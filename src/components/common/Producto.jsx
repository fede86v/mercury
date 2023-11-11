import React from 'react'
import { Grid, FormControl, Select, TextField, InputAdornment, InputLabel, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'

const Producto = ({ producto, onInputChange, tipoProductos, marcas }) => {
    const { descripcion, tipo, cantidad, precioVenta, precioCompra, marca, codigo, imagen } = producto;

    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
            {/* descripcion */}
            <Grid item xs={12} sm={12}>
                <TextField label='Descripcion' placeholder='Descripcion' margin='normal' variant="standard"
                    onChange={onInputChange} value={descripcion} name="descripcion" required sx={{ width: "100%" }} />
            </Grid>

            {/* tipo */}
            <Grid item xs={12} sm={12}>
                <FormControl variant="standard" fullWidth >
                    <InputLabel id="company-label">Tipo</InputLabel>
                    <Select
                        labelId="empresa-label"
                        id="tipo" name='tipo'
                        value={tipo}
                        onChange={onInputChange}>
                        {tipoProductos.sort().map((dt) => (
                            <MenuItem key={dt.id} value={dt.nombre}>{dt.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* marca */}
            <Grid item xs={12} sm={12}>
                <FormControl variant="standard" fullWidth >
                    <InputLabel id="marca-label">Marca</InputLabel>
                    <Select
                        labelId="marca-label"
                        id="marca" name='marca' value={marca}
                        onChange={onInputChange}>
                        {marcas.sort().map((dt) => (
                            <MenuItem key={dt.id} value={dt.nombre}>{dt.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* cantidad */}
            <Grid item xs={6} sm={6}>
                <TextField id="txt-cantidad" label="Cantidad" variant="standard"
                    value={cantidad} name="cantidad" required type="number"
                    onChange={onInputChange}
                    sx={{ width: '100%' }} />
            </Grid>

            {/* Precio Compra*/}
            <Grid item xs={6} sm={6}>
                <TextField id="txt-costo" label="Costo" variant="standard"
                    value={precioCompra} name="precioCompra" required
                    onChange={onInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                    sx={{ width: '100%' }} />
            </Grid>

            {/* Precio Venta*/}
            <Grid item xs={6} sm={6}>
                <TextField id="txt-precio" label="Precio" variant="standard"
                    value={precioVenta} name="precioVenta" required
                    onChange={onInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                    sx={{ width: '100%' }} />
            </Grid>

            {/* descripcion */}
            <Grid item xs={12} sm={12}>
                <TextField label='Codigo de Barra' placeholder='Codigo de Barras' margin='normal' variant="standard"
                    onChange={onInputChange} value={codigo} name="codigo" required sx={{ width: "100%" }} />
            </Grid>

        </Grid>
    )
}

Producto.propTypes = {
    producto: PropTypes.object.isRequired,
    tipoProductos: PropTypes.array.isRequired,
    marcas: PropTypes.array.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onInputDateChange: PropTypes.func.isRequired,
}


export default Producto