import {
    Box,
    Button,
    Divider,
    Typography
} from '@mui/material'
import {NavLink} from 'react-router-dom';
import React from 'react'

const PendingActivation = () => {
    return (

        <Box display="flex"
            flexDirection={"column"}
            alignItems={"stretch"}
            maxWidth={600}
            justifyContent={"center"}
            margin={"auto"}
            marginTop={20}
            padding={3} sx={{ boxShadow: 3 }}
            borderRadius={3} borderColor="InactiveBorder" >

                    <Typography>Tu cuenta no está activada, comunicate con el administrador. </Typography> 
                            
                    <Divider sx={{ my: 3 }} > o </Divider>

                    <Button height={20}
                        component={NavLink} to={'/Login'}
                        color="secondary"
                        variant="contained"
                        sx={{ width: '100%' }}
                        size="large">Volver al Login
                    </Button>        

        </Box>

    )
}

export default PendingActivation