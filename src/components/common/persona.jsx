import React from 'react'
import { Grid, FormControl, Radio, RadioGroup, Select, FormControlLabel, TextField, Divider, InputLabel, MenuItem, FormLabel, } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DocumentTypes, PhoneTypes } from '../../utils/enums'
import PropTypes from 'prop-types'

const Persona = ({ persona, handleChange, handleDateChange }) => {
    const { email, nombre, apellido, fechaNacimiento, tipoDocumento, numeroDocumento, genero, tipoTelefono, telefono } = persona;
    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
            {/* Email */}
            <Grid item xs={12} sm={12}>

                <TextField label='Email' placeholder='Email' margin='normal' type='email' variant="standard"
                    onChange={handleChange} value={email} name="email" required sx={{ width: "100%" }} />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} sm={6}>
                <TextField id="txt-name" label="Nombre" variant="standard"
                    value={nombre} name="nombre" required
                    onChange={handleChange}
                    sx={{ width: '100%' }} />
            </Grid>

            {/* Apellido */}
            <Grid item xs={12} sm={6}>
                <TextField id="txt-lastName" label="Apellido" variant="standard"
                    value={apellido} name="apellido" required
                    onChange={handleChange}
                    sx={{ width: '100%' }} />
            </Grid>

            {/* Fecha de Nacimiento */}
            <Grid item xs={12} sm={6}>
                <DatePicker
                    id="date-dateOfBird"
                    label="Fecha de Nacimiento"
                    value={fechaNacimiento} name="fechaNacimiento"
                    onChange={(newValue) => {
                        const target = { name: "fechaNacimiento", value: newValue };
                        handleDateChange({ target })
                    }
                    }
                    renderInput={(props) => <TextField variant="standard" {...props} />}
                />
            </Grid>

            {/* Genero */}
            <Grid item xs={12} sm={6}>
                <FormControl >
                    <FormLabel id="lbl-genero" >Genero</FormLabel>
                    <RadioGroup row
                        value={genero} name="genero" onChange={handleChange} >
                        <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
                        <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                        <FormControlLabel value="Otro" control={<Radio />} label="Otro" />
                    </RadioGroup>
                </FormControl>
            </Grid>


            {/* Tipo Documento */}
            <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="standard" fullWidth >
                    <InputLabel id="tipo-dni-select-item-label">Tipo Documento</InputLabel>
                    <Select
                        labelId="tipo-dni-select-item-label"
                        id="tipo-dni-select-item"
                        value={tipoDocumento} name="tipoDocumento"
                        onChange={handleChange}
                        label="Tipo Documento" >
                        {DocumentTypes.sort().map((dt) => (
                            <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Documento */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField id="txt-dni" label="Numero de Documento"
                    variant="standard" sx={{ width: '100%' }}
                    value={numeroDocumento} name="numeroDocumento"
                    onChange={handleChange}
                />
            </Grid>

            {/* Tipo Telefono */}
            <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="standard" fullWidth >
                    <InputLabel id="tipo-tel-select-item-label">Teléfono</InputLabel>
                    <Select
                        labelId="tipo-tel-select-item-label"
                        id="tipo-tel-select-item"
                        value={tipoTelefono} name="tipoTelefono"
                        onChange={handleChange}
                        label="Teléfono" >
                        {PhoneTypes.sort().map((dt) => (
                            <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>


            {/* Documento */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField id="txt-phone" label="Teléfono"
                    variant="standard" sx={{ width: '100%' }}
                    value={telefono} name="telefono"
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    )
}

Persona.propTypes = {
    persona: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleDateChange: PropTypes.func.isRequired,
}


export default Persona