import React, { useEffect } from 'react'
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Alert,
    AlertTitle,
    Select,
    IconButton,
    InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { FrequencyTypes, ActivityTypes } from '../../utils/enums'
import PropTypes from 'prop-types'
import { useForm, usePrice } from '../../utils';
import dayjs from 'dayjs';


const AgregarProducto = (props) => {
    const { formState: price, onInputChange, onInputDateChange, } = useForm(props.currentPrice)
    const { id, desde, hasta, actividad, frecuencia, precio } = price;
    const { error, alert, onSave, onSetAlert, success } = usePrice(props.activePrices);

    const handleDateChange = (target) => {
        const { name, value } = target;
        if (name === 'desde' && dayjs(value).isValid) {
            onInputDateChange({ target });
            const next = dayjs(value).add(1, 'M');
            const targetNext = {
                name: "hasta",
                value: next,
            };
            onInputDateChange(targetNext);
            return;
        }

        onInputDateChange(target);
    }

    useEffect(() => {
        if (success) {
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Precio</DialogTitle>
            <DialogContent>
                <DialogContentText>

                </DialogContentText>
                {/* Alerts */
                    alert ? (
                        <Alert action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    onSetAlert(null);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                            sx={{ mb: 2, my: 2 }} severity="warning">
                            <AlertTitle>Atención</AlertTitle>
                            {alert}
                        </Alert>
                    )
                        : null
                }
                {/* Errors */
                    error ? (
                        <Alert sx={{ my: 2 }} severity="error">
                            <AlertTitle>
                                Error!
                            </AlertTitle>
                            {error}
                        </Alert>
                    )
                        : null
                }
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                    {/* Desde */}
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            id="date-desde"
                            label="Desde"
                            value={desde} name="desde"
                            onChange={(newValue) => {
                                const target = { name: "desde", value: newValue };
                                handleDateChange({ target })
                            }
                            }
                            renderInput={(props) => <TextField variant="standard" {...props} />}
                        />
                    </Grid>
                    {/* Hasta */}
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            id="date-hasta"
                            label="Hasta"
                            value={hasta} name="hasta"
                            onChange={(newValue) => {
                                const target = { name: "hasta", value: newValue };
                                handleDateChange({ target })
                            }
                            }
                            renderInput={(props) => <TextField variant="standard" {...props} />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Actividad */}
                        <FormControl variant="standard" fullWidth >
                            <InputLabel id="actividad-select-item-label">Actividad</InputLabel>
                            <Select
                                labelId="actividad-select-item-label"
                                id="actividad-select-item"
                                value={actividad} name="actividad"
                                onChange={onInputChange} >
                                {ActivityTypes.sort().map((dt) => (
                                    <MenuItem key={dt.key} value={dt.key}>{dt.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Frecuencia */}
                        <FormControl variant="standard" fullWidth >
                            <InputLabel id="frecuencia-select-item-label">Frecuencia</InputLabel>
                            <Select
                                labelId="frecuencia-select-item-label"
                                id="frecuencia-select-item"
                                value={frecuencia} name="frecuencia"
                                onChange={onInputChange} >
                                {FrequencyTypes.sort().map((dt) => (
                                    <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Precio */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-precio" label="Precio" variant="standard"
                            value={precio} name="precio" required
                            onChange={onInputChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            sx={{ width: '100%' }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={() => onSave(id ? { id, desde, hasta, actividad, frecuencia, precio } : { desde, hasta, actividad, frecuencia, precio })}>{!id ? ("Crear") : ("Guardar")}</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarProducto.propTypes = {
    activePrices: PropTypes.array.isRequired,
    currentPrice: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarProducto