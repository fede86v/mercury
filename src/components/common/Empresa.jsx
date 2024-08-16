import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@mui/material'

const Empresa = ({ empresa, onInputChange }) => {
    const { nombre, cuit, token, sign } = empresa;
    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
            {/* Email */}
            <Grid item xs={12} sm={12}>
                <TextField id="txt-empresa-nombre" label='Nombre' placeholder='Nombre' margin='normal' variant="standard"
                    onChange={onInputChange} value={nombre} name="nombre" sx={{ width: "100%" }} />
            </Grid>

            {/* CUIT */}
            <Grid item xs={12} sm={6}>
                <TextField id="txt-cuit" label="CUIT" variant="standard"
                    value={cuit} name="cuit" required
                    onChange={onInputChange}
                    sx={{ width: '100%' }} />
            </Grid>
            
            {/* TOKEN */}
            <Grid item xs={12} sm={6}>

                <TextField id="txt-token" label="Token AFIP" variant="standard"
                    value={token} name="token" required
                    onChange={onInputChange}
                    sx={{ width: '100%' }} />
            </Grid>

            {/* Sign */}
            <Grid item xs={12} sm={6}>

                <TextField id="txt-sign" label="Sign AFIP" variant="standard"
                    value={sign} name="sign" required
                    onChange={onInputChange}
                    sx={{ width: '100%' }} />
            </Grid>

        </Grid>
    );
}

Empresa.propTypes = {
    empresa: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired
}


export default Empresa