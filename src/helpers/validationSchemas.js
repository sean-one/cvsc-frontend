import * as yup from 'yup';
import { format, add } from 'date-fns';

const todaysDate = format(new Date(), 'yyyy-MM-dd');
const sixtyDaysOut = format(add(new Date(), { days: 60 }), 'yyyy-MM-dd');


// console.log(sixtyDaysOut)
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
        .required('please enter password again')
})

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("username is a required field."),

    password: yup
        .string()
        .required("password is a required field.")
})

export const createEventSchema = yup.object().shape({
    eventname: yup
        .string()
        .required(),
    
    eventdate: yup
        .date()
        .min(todaysDate, 'date should not be in the past')
        .max(sixtyDaysOut, 'right now we only allow events 60 days out')
        .required('event date is required'),

    eventstart: yup
        .string()
        .matches(/([01]?[0-9]|2[0-3])[0-5][0-9]/, 'incorrect time formatting')
        .required('there must be a beginning'),
        
    eventend: yup
        .string()
        .matches(/([01]?[0-9]|2[0-3])[0-5][0-9]/, 'incorrect time formatting')
        .required('there must be a beginning'),
    
        // this should be UUID or whatever the ID ends up being
    venue_id: yup
        .number()
        .moreThan(0, 'please select a venue location')
        .required('event location is required'),
    
    details: yup
        .string()
        .required(),
    
    // this should be UUID or whatever the ID ends up being
    brand_id: yup
        .number()
        .required()
})