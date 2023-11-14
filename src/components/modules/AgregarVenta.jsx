import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types'
import { useForm, useTransaction } from '../../utils';
import Alerts from '../common/Alerts';
import Venta from '../common/Venta';
import Pagos from '../common/Pagos';

const DEFAULT_VENTA = {
    total: null,
    subtotal: null,
    descuento: 0,
    vendedor: ""
};

const STEPS = ["venta", "pago"];

const AgregarVenta = (props) => {
    const [activeStep, setActiveStep] = useState(0);
    const { formState: venta, onInputChange, onInputDateChange, } = useForm(DEFAULT_VENTA)
    const { error, alert, onSave, success } = useTransaction();


    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleNext = () => {
        if (activeStep === STEPS.length - 1) {
            onSave(venta);
        }
        setActiveStep(activeStep + 1);
    };

    useEffect(() => {
        if (success) {
            props.handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Venta</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
            </DialogContent>
            {/* Steps */}
            <Box sx={{ width: '100%', p: 1 }}>
                <Stepper activeStep={activeStep}>
                    {STEPS.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Alerts alert={alert} error={error} />
                {/* Venta */
                    activeStep === 0 ? (
                        <Box sx={{ my: 2 }} >
                            <Venta venta={venta} productos={props.productos} vendedores={props.vendedores} />
                        </Box>
                    ) : null}
                {
                    /* Pago */
                    activeStep === 1 ? (
                        <Box sx={{ my: 2 }} >
                            <Pagos />
                        </Box>
                    ) : null}
            </Box>
            <DialogActions>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    startIcon={< ArrowLeftIcon />}
                >
                    Atras
                </Button>
                <Button color="primary" onClick={() => props.handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={handleNext}
                    endIcon={activeStep === STEPS.length - 1 ? < SendIcon /> : < ArrowRightIcon />} >{activeStep === STEPS.length - 1 ? 'Guardar' : 'Siguiente'}</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarVenta.propTypes = {
    productos: PropTypes.array.isRequired,
    vendedor: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarVenta