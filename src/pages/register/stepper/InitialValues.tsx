import { ValidationSchema } from './Context';

export const initialValues: ValidationSchema = {
  firstName: {
    value: '',
    error: '',
    required: true,
    validate: 'text_',
    minLength: 2,
    maxLength: 20,
    helperText: '',
  },
  middleName: {
    value: '',
    error: '',
    validate: 'text_',
    minLength: 2,
    maxLength: 20,
    helperText: '',
  },
  lastName: {
    value: '',
    error: '',
    required: true,
    validate: 'text_',
    minLength: 2,
    maxLength: 20,
  },
  otherName: {
    value: '',
    error: '',
    validate: 'text_',
    minLength: 2,
    maxLength: 20,
  },
  email: {
    value: '',
    error: '',
    validate: 'email',
    required: true,
  },
  organizationEmail: {
    value: '',
    error: '',
    validate: 'email',
    required: true,
  },
  organization: {
    value: '',
    error: '',
    required: true,
    validate: 'text',
  },
  organizationLabel: {
    value: '',
    error: '',
    required: true,
    validate: 'text',
  },
  existingFlag: {
    value: false,
    error: '',
    required: false,
    validate: 'checkbox',
  },
  discipline: {
    value: [],
    error: '',
  },
};
