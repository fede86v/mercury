import React, { useEffect } from 'react'
import { Grid, Box, TextField, Button } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from '../../utils'

const ItemVenta = ({ itemVenta, setDetalleVenta, productos }) => {

    const { formState: item, onInputChange, setFormState } = useForm(itemVenta);
    const { codigo, descripcion, cantidad, precio, importe } = item;

    useEffect(() => {
        if (codigo) {
            const item = productos.find(i => i.codigo === codigo);
            if (item) {
                setFormState(
                    {
                        id: item.id,
                        codigo: item.codigo,
                        descripcion: item.descripcion,
                        precio: item.precioVenta,
                        cantidad: 1,
                        importe: item.precioVenta,
                    }
                );
            }
        }
    }, [codigo]);

    const handleNewItem = async () => {

    };

    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} sx={{ p: 1 }}  >
                {/* Codigo */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-codigo" label="Código" variant="standard"
                        value={codigo} name="codigo"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

                {/* Descripción */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField id="txt-descripcion" label="Descripción" variant="standard"
                        value={descripcion} name="descripcion"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

                {/* Cantidad */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-cantidad" label="Cantidad" variant="standard"
                        value={cantidad} name="cantidad"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

                {/* Importe */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-importe" label="Importe" variant="standard"
                        value={importe} name="importe"
                        sx={{ width: '100%' }} />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button color="secondary" variant="contained" onClick={() => { setDetalleVenta(item); }}>Agregar</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

ItemVenta.propTypes = {
    producto: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    setProducto: PropTypes.func.isRequired
}


export default ItemVenta