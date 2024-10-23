import React, { useEffect, useContext, useState } from 'react'
import { Grid, FormControl, Typography, Select, InputLabel, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'
import { UserContext } from '../../context/UserProvider'
import Alerts from './Alerts'

const Vendedor = ({ persona, setPersona, vendedores }) => {

    const { id } = persona;
    const { user } = useContext(UserContext);
    const [alert, setAlert] = useState(null)
    

    useEffect(() => {
        if (vendedores.length > 0) {
            if (id === "0") {
                const persona_caja = vendedores.find(v => v.email === "");
                const persona_user = vendedores.find(v => v.email === user.email);
                console.log(persona_user)
                console.log(persona_caja)
                if (persona_user || persona_caja) {
                setPersona(persona_user ?? persona_caja);
                }
            }
            else {
                const persona = vendedores.find(v => v.id === id);
                if (persona) {
                    setPersona(persona);
                }
            }
        }
    }, [id]);

    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} >
                <Grid item xs={12} sm={12} md={12} sx={{ p: 1 }}>
                    <Typography variant='h5' padding={0} sx={{ mb: 2 }}  >Vendedor</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} >
                    <Alerts alert={alert} />
                </Grid>
                {/* Vendedor */}
                <Grid item xs={12} sm={6} md={12}>
                    <FormControl variant="standard" fullWidth >
                        <InputLabel id="vendedores-label">Vendedor</InputLabel>
                        <Select
                            labelId="vendedores-label"
                            id="vendedores"
                            value={id} name="id"
                            onChange={(e) => { setPersona({ ...persona, id: e.target.value }) }}
                        >
                            {vendedores.map((dt) => (
                                <MenuItem key={dt.id} value={dt.id}>{dt.nombre} {dt.apellido}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>

    )
}

Vendedor.propTypes = {
    persona: PropTypes.object.isRequired,
    vendedores: PropTypes.array.isRequired,
    setPersona: PropTypes.func.isRequired
}


export default Vendedor