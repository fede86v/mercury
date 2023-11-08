import React from 'react'
import { IMaskInput } from 'react-imask';
import {
    FormControl,
    InputLabel,
    Input,
} from '@mui/material';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask={{ mask }}
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { value } })}
            overwrite
        />
    );
});

TextMaskCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
    mask: PropTypes.func.isRequired,
};

export default function MyMaskedInput({ label, id, onChange, value, mask, variant = "standard" }) {

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <FormControl variant={{ variant }}>
            <InputLabel htmlFor="formatted-text-mask-input">{{ label }}</InputLabel>
            <Input
                value={{ value }}
                onChange={{ onChange }}
                id={{ id }}
                mask={{ mask }}
                inputComponent={TextMaskCustom}
            />
        </FormControl>
    );
}