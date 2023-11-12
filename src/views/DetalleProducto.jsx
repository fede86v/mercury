import React, { useState, useContext, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { Grid, Box, Typography, Button, Paper } from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SaveIcon from '@mui/icons-material/Save';
import { ProductService, ProductTypeService, BrandService } from '../utils/databaseService';
import Producto from '../components/common/Producto';
import { useProduct, useForm } from '../utils'
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../context/UserProvider';

const DEFAULT_PRODUCT = {
    descripcion: "",
    tipo: "",
    cantidad: null,
    precioVenta: null, precioCompra: null, marca: "", codigo: "", imagen: ""
}

const DetalleProducto = () => {

    const { id } = useParams();
    const [categorias, setCategories] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const { onSave } = useProduct();
    const { formState: producto, onInputChange, onInputDateChange, setFormState: setProducto } = useForm(DEFAULT_PRODUCT)
    const { user } = useContext(UserContext);

    const getProducto = async () => {
        const data = await ProductService.getOne(id);
        setProducto(data);
        return data;
    };
    const getCategories = async () => {
        const data = await ProductTypeService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setCategories(sortedData);
        return sortedData;
    };
    const getMarcas = async () => {
        const data = await BrandService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setMarcas(sortedData);
        return sortedData;
    };

    const query = useQuery(['producto'], getProducto, id);
    const queryProdTypes = useQuery(['productTypes'], getCategories);
    const queryMarcas = useQuery(['marcas'], getMarcas);

    useEffect(() => {
        query.refetch();
        queryProdTypes.refetch();
        queryMarcas.refetch();

        return () => {
            console.log("destructor");
            setProducto(DEFAULT_PRODUCT);
        }
    }, []);

    return (
        <>
            {
                query.isLoading || queryProdTypes.isLoading || queryMarcas.isLoading ? (<Typography variant="h4" padding={3} textAlign="center" >Loading...</Typography>)
                    : (
                        <>
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 1 }} spacing={1} >
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        component={NavLink}
                                        to={"/Productos/"}
                                        sx={{ mr: 1 }}
                                        startIcon={< ArrowLeftIcon />}
                                    >
                                        Atras
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={8} >
                                    <Typography variant="h4" textAlign="center" >{producto.descripcion} </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2} justifyContent="end">
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button
                                            sx={{ ml: 1 }}
                                            variant="contained"
                                            startIcon={< SaveIcon />}
                                            onClick={() => onSave(producto)}
                                        >
                                            Guardar
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} >
                                    <Paper sx={{ p: 2 }}  >
                                        <Producto producto={producto} tipoProductos={categorias} marcas={marcas} onInputChange={onInputChange} onInputDateChange={onInputDateChange} />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    )
            }
        </>
    )

}

export default DetalleProducto