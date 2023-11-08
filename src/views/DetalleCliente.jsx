import React, { useState, useContext, useEffect } from 'react'
import { Typography, Box, Paper, Grid, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, TextField, Button, InputAdornment } from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useParams, NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import Persona from '../components/common/persona';
import { MemberService, PeopleService, UserService, PriceService, PaymentService } from '../utils/databaseService';
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from '../utils/useForm';
import { UserContext } from '../context/UserProvider';
import AgregarPago from '../components/modules/AgregarPago'

const DEFAULT_CLIENT = {
    email: "",
    codigoArea: "",
    telefono: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: Date.now(),
    genero: "Femenino",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    codigoAcceso: "",
    tipoTelefono: "Principal",
    descuento: {
        monto: 0,
        desde: Date.now(),
        hasta: null
    }
}

const DEFAULT_PAYMENT = {
    cuota: 0,
    monto: 0,
    descuento: 0,
    medioPago: "Efectivo",
    idSocio: null
};

const DetalleSocio = () => {
    const { currentUser } = useContext(UserContext);

    const { id } = useParams();

    /* Constants */
    const [preciosVigentes, setPreciosVigentes] = useState([]);
    const [openPayment, setOpenPayment] = useState(false);
    const [newPayment, setNewPayment] = useState(DEFAULT_PAYMENT);
    const { formState: socio, onInputChange, onInputDateChange, setFormState: setSocio, } = useForm(DEFAULT_CLIENT)
    const { user } = useContext(UserContext);

    const getSocio = async () => {
        const member = await MemberService.getOne(id);
        const pagos = await PaymentService.getQuery("idSocio", "==", id);
        const person = await PeopleService.getOne(id);
        const asistencia = await UserService.getSubcollection(person.email, "asistencia");
        let data = { ...person, ...member, asistencia: asistencia, pagos: pagos };
        console.log(data);

        if (!data.tipoTelefono) {
            data = { ...data, tipoTelefono: "Principal" }
        }
        setSocio(data);
        return data;
    };

    const getPriceList = async () => {
        const data = await PriceService.getQuery("desde", "<=", Date.now());
        const filtered = data.filter(d => !d.hasta || d.hasta < Date.now());
        setPreciosVigentes(filtered);
        console.log(preciosVigentes);
        return filtered;
    };

    const query = useQuery(['client', id], getSocio);
    const getPrices = useQuery(['prices'], getPriceList);

    useEffect(() => {
        query.refetch();
    }, []);

    const getPrecio = (actividades, frecuencia) => {
        let precioTotal = 0;
        actividades.forEach(actividad => {
            const precios = preciosVigentes.filter(p => p.frecuencia === frecuencia && p.actividad === actividad);

            if (precios.length > 0) {
                precioTotal += (Number)(precios[0].precio);
            }
        });
        return precioTotal;
    }

    /* Save Process */
    const saveClient = async (data) => {
        console.log(data);
        return MemberService.update(id, data, user);
    };
    const savePerson = async (data) => {
        return PeopleService.update(id, data, user);
    };

    const saveClientMutation = useMutation(
        (trainer) => saveClient(trainer),
        {
            /*
            onError: (error) => setError(error.message),
            onSuccess: () => {
                setAlert("Los cambios se guardaron correctamente.")
                //do something
            }
            */
        });
    const savePersonMutation = useMutation(
        (person) => savePerson(person),
        {
            /*
            onError: (error) => setError(error.message),
            onSuccess: () => {
                const client = socio;
                delete client.pagos;
                delete client.asistencia;
                saveClientMutation.mutate(client);
            }
            */
        });

    const handleSave = () => {
        //Validations
        const person = socio;
        delete person.actividades;
        delete person.pagos;
        delete person.asistencia;
        savePersonMutation.mutate(person);
    };

    const handleAddPago = () => {
        const cuota = getPrecio(socio.actividades, socio.frecuencia);
        let newPago = { ...DEFAULT_PAYMENT };
        newPago.cuota = cuota;
        newPago.monto = cuota;
        newPago.idSocio = id;
        setNewPayment(newPago);
        setOpenPayment(true);
    };

    const handleClosePayment = () => {
        setOpenPayment(false);
        query.refetch();
    };

    const handleChange = (prop) => (event) => {
        setSocio({ ...socio, [prop]: event.target.value });
    };

    const updatePerson = async (person) => {
        return PeopleService.update(person.id, person, currentUser);
    };

    const updateUser = async (user) => {
        return UserService.update(user.email, user.codigoAcceso, currentUser);
    };

    const onSave = () => {
        console.log("save");
    };

    /* Componentes */

    function AsistanceList({ items }) {
        return (
            <>
                {items ?
                    (<Grid item sm={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" >Fecha</TableCell>
                                        <TableCell align="left" >Entrada</TableCell>
                                        <TableCell align="left" >Salida</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map(({ id, entrada, salida }) => (
                                        <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell align="left">{id}</TableCell>
                                            <TableCell align="left">{entrada ?? ''}</TableCell>
                                            <TableCell align="left">{salida ?? ''}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    )
                    : ('No hay registros disponibles')
                }
            </>
        )
    };

    function PagosList({ items }) {
        return (
            <>
                <Grid item xs={12} justifyContent="end">
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            disabled={query.isFetching}
                            sx={{ ml: 1, mb: 3 }}
                            variant="contained"
                            startIcon={< AddCircleIcon />}
                            onClick={handleAddPago}
                        >
                            Pago
                        </Button>
                    </Box>
                </Grid>
                {items ?
                    (<Grid item sm={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" >Fecha</TableCell>
                                        <TableCell align="left" >Monto</TableCell>
                                        <TableCell align="left" >Medio de Pago</TableCell>
                                        <TableCell align="left" >Usuario</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map(({ id, monto, fechaCreacion, medioPago, usuarioActualizacion }) => (
                                        <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell align="left">{dayjs(fechaCreacion).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell align="left">{"$ " + monto}</TableCell>
                                            <TableCell align="left">{medioPago}</TableCell>
                                            <TableCell align="left">{usuarioActualizacion}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    )
                    : ('No hay registros disponibles')
                }
            </>
        )
    };

    // function Descuentos({ descuento }) {
    //     return (
    //         <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
    //             {/* Precio */}
    //             <Grid item xs={6} sm={4}>
    //                 <TextField id="txt-descuento" label="Descuento" variant="standard"
    //                     value={descuento.monto} name="descuento" required type="number"
    //                     onChange={onInputChange}
    //                     InputProps={{
    //                         endAdornment: <InputAdornment position="end">%</InputAdornment>
    //                     }}
    //                     sx={{ width: '100%' }} />
    //             </Grid>

    //         </Grid>
    //     )
    // };

    function CodigoAcceso({ user }) {
        return (
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                {/* Precio */}
                <Grid item xs={6} sm={4}>

                    {/* Editar el componente para que aparezca el ojo que oculta o muestra el codigo */}

                    <TextField id="txt-codigoAcceso" label="Codigo Acceso" variant="standard"
                        value={user.codigoAcceso} name="codigoAcceso" required type="number"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

            </Grid>
        )
    };

    return (<>
        {
            query.isFetching === true ? (<Typography variant="h4" padding={3} textAlign="center" >Loading...</Typography>)
                : (
                    <>
                        {<AgregarPago open={openPayment} currentPayment={newPayment} parentId={id} payments={socio.pagos} handleClose={handleClosePayment} />}

                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                            <Grid item xs={12} sm={2}>
                                <Button
                                    disabled={query.isFetching}
                                    component={NavLink}
                                    to={"/Socios/"}
                                    sx={{ mr: 1 }}
                                    startIcon={< ArrowLeftIcon />}
                                >
                                    Atras
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={8} >
                                <Typography variant="h4" textAlign="center" >{socio.apellido}, {socio.nombre}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} justifyContent="end">
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        disabled={query.isFetching}
                                        sx={{ ml: 1 }}
                                        variant="contained"
                                        startIcon={< SaveIcon />}
                                        onClick={handleSave}
                                    >
                                        Guardar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Paper sx={{ my: 2, padding: '10px' }} >
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                                <Grid item xs={12} >
                                    <Persona persona={socio} handleChange={onInputChange} handleDateChange={onInputDateChange} />
                                </Grid>
                                <Grid item xs={6} >
                                    <Typography variant="h5" textAlign="left" >Descuento</Typography>
                                </Grid>
                                <Grid item xs={6} >
                                    <Typography variant="h5" textAlign="left" >Codigo de Acceso</Typography>
                                </Grid>
                                <Grid item xs={6} >
                                    {/* <Descuentos descuento={socio.descuento} /> */}
                                </Grid>
                                <Grid item xs={6} >
                                    <CodigoAcceso user={socio} />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" padding={3} textAlign="center" >Pagos</Typography>
                                <Paper sx={{ my: 2, padding: '10px' }} >
                                    <PagosList items={socio.pagos} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" padding={3} textAlign="center" >Asistencia</Typography>
                                <Paper sx={{ my: 2, padding: '10px' }} >
                                    <AsistanceList items={socio.asistencia} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
    </>

    )
}

export default DetalleSocio