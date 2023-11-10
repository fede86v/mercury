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
import { useForm } from '../utils';
import { UserContext } from '../context/UserProvider';

const DetalleVenta = () => {

}

export default DetalleVenta