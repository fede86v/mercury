import {
    Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper, Typography, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, FormControlLabel, Switch
} from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AgregarEntrenador from '../components/modules/AgregarEntrenador';
import { UserContext } from '../context/UserProvider';
import { TrainerService } from '../utils/databaseService';
import { useQuery, useMutation } from '@tanstack/react-query'

const Vendedores = () => {

    const { user } = useContext(UserContext);
    const [trainers, setTrainers] = useState([]);
    const [inactiveTrainers, setInactiveTrainers] = useState([]);
    const [currentTrainer, setCurrentTrainer] = useState(null);
    const [includeDisabled, setIncludedisabled] = useState(false);
    const [dialogRemoveConfirmOpen, setDialogRemoveConfirmOpen] = useState(false);
    const [openTrainer, setOpenTrainer] = useState(false);

    const filterItems = (includeInactives, data) => {
        /* Pending Activation Users */
        let allTrainers = data.filter(item => item.activado);

        /* Active Users */
        let pendingActivationTrainers = data.filter(item => !item.activado);

        if (!includeInactives) {
            allTrainers = allTrainers.filter(item => item.fechaDeshabilitado == null)
            pendingActivationTrainers = pendingActivationTrainers.filter(item => item.fechaDeshabilitado == null)
        }

        setTrainers(allTrainers);
        setInactiveTrainers(pendingActivationTrainers);
    };

    const getTrainerList = async () => {
        const data = await TrainerService.getAll();
        filterItems(includeDisabled, data);
        return data;
    };

    const query = useQuery(['trainer'], getTrainerList);

    const updateTrainer = (trainer) => {
        return TrainerService.update(trainer.id, trainer, user);
    };

    const deleteTrainer = (trainer) => {
        return TrainerService.deleteSoft(trainer.id, user);
    };

    // create mutation actualizacion
    const updateMutation = useMutation(
        (trainer) => updateTrainer(trainer),
        {
            onError: (error) => console.error(error.message),
            onSuccess: () => {
                query.refetch();
            }
        });

    const deleteMutation = useMutation(
        (trainer) => deleteTrainer(trainer),
        {
            onError: (error) => console.error(error.message),
            onSuccess: () => {
                query.refetch();
            }
        });

    const handleActivarTrainer = (id) => {
        const entrenador = query.data.find(e => e.id === id);
        entrenador.activado = true;
        updateMutation.mutate(entrenador);
    };

    const handleMostrarDeshabilitados = async () => {
        filterItems(!includeDisabled, query.data);
        setIncludedisabled(!includeDisabled);
    };

    const handleDeleteTrainer = async (id) => {
        const entrenador = query.data.find(e => e.id === id);
        setCurrentTrainer(entrenador);
        setDialogRemoveConfirmOpen(true);
    };
    const handleClose = async (aceptar) => {
        if (aceptar) {
            deleteMutation.mutate(currentTrainer);
        }
        setDialogRemoveConfirmOpen(false);
    };

    //Trainer
    const handleNewTrainer = () => {
        setOpenTrainer(true);
    };
    const handleCloseTrainer = () => {
        setOpenTrainer(false);
        query.refetch();
    };


    useEffect(() => {
        if (query.data) {
            filterItems(includeDisabled, query.data);
        };
    }, []);

    return (
        <>
            <AgregarEntrenador open={openTrainer} handleClose={handleCloseTrainer} />
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >

                <Grid item sm={12}>
                    <Button color="primary" variant="contained" onClick={() => { handleNewTrainer(); }}>Crear</Button>
                </Grid>
                <Grid item sm={12}>
                    <FormControlLabel control={<Switch checked={includeDisabled} onChange={handleMostrarDeshabilitados} />} label="Mostrar Traineres Deshabilitados" />
                </Grid>
                {
                    (includeDisabled && inactiveTrainers.length === 0) ? (null)
                        : (
                            /*  Devolvemos la lista de los Traineres pendientes de Activacion */
                            <>
                                <Grid item sm={12}>
                                    <Typography variant="h4" padding={3} textAlign="center" >Traineres pendientes de activación</Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Apellido</TableCell>
                                                    <TableCell align="left">Nombre</TableCell>
                                                    <TableCell align="right">Ultima Actualizacion</TableCell>
                                                    <TableCell align="right">Acción</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {inactiveTrainers.map(({ id, apellido, nombre, fechaActualizacion }) => (
                                                    <TableRow
                                                        key={id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left">{apellido}</TableCell>
                                                        <TableCell align="left">{nombre}</TableCell>
                                                        <TableCell align="right">
                                                            <>
                                                                <IconButton aria-label="delete" onClick={() => handleActivarTrainer(id)} >
                                                                    <AssignmentTurnedInIcon color="secondary" />
                                                                </ IconButton>
                                                                <IconButton aria-label="delete" onClick={() => handleDeleteTrainer(id)} >
                                                                    <DeleteIcon color="error" />
                                                                </ IconButton>
                                                            </>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </>
                        )
                }
                <Grid item sm={12}>
                    <Typography variant="h4" padding={3} textAlign="center" >Traineres</Typography>
                </Grid>
                <Grid item sm={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Apellido</TableCell>
                                    <TableCell align="left">Nombre</TableCell>
                                    <TableCell align="right">Ultima Actualizacion</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainers.map(({ id, apellido, nombre, fechaActualizacion }) => (
                                    <TableRow
                                        key={id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{apellido}</TableCell>
                                        <TableCell align="left">{nombre}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" component={NavLink} to={"/Entrenadores/" + id} >
                                                    <ModeEditIcon color="primary" />
                                                </ IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteTrainer(id)} >
                                                    <DeleteIcon color="error" />
                                                </ IconButton>
                                            </>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Dialog
                    open={dialogRemoveConfirmOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Esta seguro?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Esta seguro de eliminar este entrnador? los datos no seran eliminados pero no seran visibles directamente.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose(false)} color="secondary" >Cancelar</Button>
                        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>

    )
}

export default Vendedores