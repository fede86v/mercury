import React, { useState, useEffect, useContext } from 'react'
import { Stepper, Box, Step, StepLabel, Button } from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SendIcon from '@mui/icons-material/Send';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { useForm, useTransaction } from '../utils';
import Alerts from '../components/common/Alerts';
import Venta from '../components/common/Venta';
import Pagos from '../components/common/Pagos';

const DEFAULT_VENTA = {
    total: null,
    subtotal: null,
    descuento: 0,
    vendedor: { nombre: "caja", id: "0" },
    cliente: { nombre: "consumidor Final", id: "0" },
    detalleVenta: [],
};

const STEPS = ["venta", "pago"];

const DetalleVenta = () => {
    const [productos, setProductos] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const { formState: venta, onInputChange, onInputDateChange, setFormState } = useForm(DEFAULT_VENTA)
    const { error, alert, onSave, success } = useTransaction();
    const { user } = useContext(UserContext);

    const getProductList = async () => {
        const data = await ProductService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setProductos(sortedData)
        return sortedData;
    };

    const handleCancel = () => {
        setFormState(DEFAULT_VENTA);
        setActiveStep(0);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleNext = () => {
        if (activeStep === STEPS.length - 1) {
            onSave(venta);
        }
        setActiveStep(activeStep + 1);
    };

    const queryProductos = useQuery(['products'], getProductList);

    useEffect(() => {
        queryProductos.refetch();
    }, []);

    useEffect(() => {
        if (success) {

        }
    }, [success]);

    return (
        <>
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
                            <Venta venta={venta} setVenta={setFormState} productos={productos} />
                        </Box>
                    ) : null}
                {
                    /* Pago */
                    activeStep === 1 ? (
                        <Box sx={{ my: 2 }} >
                            <Pagos />
                        </Box>
                    ) : null}
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    startIcon={< ArrowLeftIcon />}
                >
                    Atras
                </Button>
                <Button color="primary" onClick={() => handleCancel()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={handleNext}
                    endIcon={activeStep === STEPS.length - 1 ? < SendIcon /> : < ArrowRightIcon />} >{activeStep === STEPS.length - 1 ? 'Guardar' : 'Siguiente'}</Button>
            </Box>

        </>
    );
}

export default DetalleVenta