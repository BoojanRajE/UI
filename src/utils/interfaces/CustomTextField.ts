import React, { ChangeEvent } from 'react';
import { TextFieldProps } from '@mui/material';

/* This causes an error so I tried the other approach */
// interface CustomTextFieldProps extends TextFieldProps {
//     label: string;
//     value: string;
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void;
//   }

export type CustomTextFieldProps = TextFieldProps & {
    label?: string;
    value?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
