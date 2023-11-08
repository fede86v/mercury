import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./views/Login";
import Config from "./views/Config";
import Home from "./views/Home";
import Register from "./views/Register";
import Clientes from "./views/Clientes";
import Ventas from "./views/Ventas";
import Vendedores from "./views/Vendedores";
import DetalleVendedor from "./views/DetalleVendedor";
import DetalleVenta from "./views/DetalleVenta";
import DetalleCliente from "./views/DetalleCliente";
import RequireAuth from "./components/RequireAuth"
import Main from "./components/Main";
import { UserContext } from './context/UserProvider';
import MySpinner from './components/MySpinner';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useFirestore } from './utils/useFirestore';

const App = () => {
  const [open, setOpen] = useState(false);
  const { loading } = useFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    setOpen(loading);
  }, [loading]);

  return user !== false ? (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="Config" element={<RequireAuth><Config /></RequireAuth>} />
          
            <Route path="Clientes">
              <Route path=":id" element={<RequireAuth><DetalleCliente /></RequireAuth>} />
              <Route index element={<RequireAuth><Clientes /></RequireAuth>} />
            </Route>
          
            <Route path="Vendedores" >
              <Route path=":id" element={<RequireAuth><DetalleVendedor /></RequireAuth>} />
              <Route index element={<RequireAuth><Vendedores /></RequireAuth>} />
            </Route>
            
            <Route path="Ventas" >
              <Route path=":id" element={<RequireAuth><DetalleVenta /></RequireAuth>} />
              <Route index element={<RequireAuth><Ventas /></RequireAuth>} />
            </Route>
          </Route>

          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

        </Routes>
      </BrowserRouter >
    </>

  ) : (<MySpinner />);
}

export default App;
