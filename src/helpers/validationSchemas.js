import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    username: yup
        .string()
        .required("username is a required field"),

    email: yup
        .string()
        .required("email is a required field"),

    password: yup
        .string()
        .required("password is a required field"),

    confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
        .required()
})

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("username is a required field."),

    password: yup
        .string()
        .required("password is a required field.")
})