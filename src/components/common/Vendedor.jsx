import React, { useEffect, useContext, useState } from 'react'
import { Grid, FormControl, Typography, Select, TextField, InputLabel, MenuItem, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types'
import { EmployeeService } from '../../utils/databaseService'
import { UserContext } from '../../context/UserProvider'
import { useForm } from '../../utils'
import Alerts from './Alerts'

const Vendedor = ({ persona, setPersona }) => {

    const { formState: vendedor, onInputChange, setFormState } = useForm(persona);
    const { id, nombre, apellido } = vendedor;
    const { user } = useContext(UserContext);
    const [vendedores, setVendedores] = useState([]);
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)

    const getEmployeeList = async () => {
        const data = await EmployeeService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => !i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
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

    const query = useQuery(['vendedor'], getEmployeeList);

    useEffect(() => {
        if (id) {
            const persona = vendedores.find(v => v.id === id);
            if (persona) {
                setFormState(persona);
                setPersona(persona);
            }
        }
    }, [id]);

    useEffect(() => {
        query.refetch();
    }, []);

    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} sx={{ p: 1 }}  >
                <Grid item xs={12} sm={12} md={12} sx={{ p: 1 }}>
                    <Typography variant='h5' padding={0} sx={{ mb: 2 }}  >Vendedor</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ p: 1 }}>
                    <Alerts alert={alert} error={error} />
                </Grid>
                {/* Vendedor */}
                <Grid item xs={12} sm={6} md={12}>
                    <FormControl variant="standard" fullWidth >
                        <InputLabel id="vendedores-label">Vendedor</InputLabel>
                        <Select
                            labelId="vendedores-label"
                            id="vendedores"
                            value={id} name="id"
                            onChange={onInputChange}
                            label="Vendedor" >
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
    handleChange: PropTypes.func.isRequired,
    setPersona: PropTypes.func.isRequired
}


export default Vendedor