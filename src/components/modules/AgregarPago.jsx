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
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types'
import { useForm, usePayment } from '../../utils';
import { PaymentMethods } from '../../utils/enums'


const AgregarPago = (props) => {
    const { formState: payment, onInputChange, setFormState } = useForm(props.currentPayment)
    const { monto, cuota, descuento, medioPago } = payment;
    const { error, alert, onSave, onSetAlert, success } = usePayment();

    useEffect(() => {
        if (success) {
            props.handleClose();
        }
    }, [success]);

    useEffect(() => {
        setFormState({
            ...payment,
            "monto": cuota - (cuota * descuento / 100),
        });
    }, [descuento]);

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
                    {/* Cuota */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-cuota" label="Cuota" variant="standard"
                            value={cuota} name="cuota" disabled={true}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            sx={{ width: '100%' }} />
                    </Grid>

                    {/* Descuento */}
                    <Grid item xs={6} sm={3}>
                        <TextField id="txt-descuento" label="Descuento" variant="standard"
                            value={descuento} name="descuento"
                            onChange={onInputChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            sx={{ width: '100%' }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField id="txt-montoDescuento" label="Descuento" variant="standard"
                            value={cuota * descuento / 100} name="montoDescuento" disabled={true}
                            InputProps={{
                                startAdornment: <InputAdornment position="end">$</InputAdornment>
                            }}
                            sx={{ width: '100%' }} />
                    </Grid>
                    {/* Monto */}
                    <Grid item xs={12} sm={6}>
                        <TextField id="txt-monto" label="Monto" variant="standard"
                            value={monto} name="monto" required
                            onChange={onInputChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            sx={{ width: '100%' }} />
                    </Grid>

                    {/* Medio de Pago */}
                    {/* Tipo Documento */}
                    <Grid item xs={12} sm={6} >
                        <FormControl variant="standard" fullWidth >
                            <InputLabel id="medio-pago-label">Medio de Pago</InputLabel>
                            <Select
                                labelId="medio-pago-label"
                                id="medio-pago"
                                value={medioPago} name="medioPago"
                                onChange={onInputChange}
                                label="Tipo Documento" >
                                {PaymentMethods.sort().map((dt) => (
                                    <MenuItem key={dt.key} value={dt.value}>{dt.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={() => {
                    onSave(payment);
                }}>Guardar</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarPago.propTypes = {
    parentId: PropTypes.string.isRequired,
    currentPayment: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarPago