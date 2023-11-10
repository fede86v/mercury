import React from 'react'
import { Alert, AlertTitle } from '@mui/material'
import PropTypes from 'prop-types'

const Alerts = ({ alert, error }) => {
    return (
        <>
            {/* Alerts */
                alert ? (
                    <Alert sx={{ my: 2 }} severity="warning" >
                        <AlertTitle>
                            Atención!
                        </AlertTitle>
                        {alert}
                    </Alert >
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
        </>
    )
}


Alerts.propTypes = {
    alert: PropTypes.string,
    error: PropTypes.string
}


export default Alerts