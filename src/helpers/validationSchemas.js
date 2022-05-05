import * as yup from 'yup';
import { format, add } from 'date-fns';

const todaysDate = format(new Date(), 'yyyy-MM-dd');
const sixtyDaysOut = format(add(new Date(), { days: 60 }), 'yyyy-MM-dd');


export const requestBusinessCreator = yup.object().shape({
    business_id: yup
        .string()
        .uuid()
        .typeError('please select a business')
        .required('business id is required for request'),
})

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
        .moreThan(0, 'please select a brand')
        .required('branding is required')
})

export const addContactSchema = yup.object().shape({
    
    // remove checkbox values from exported object
    addinstagram: yup
        .boolean()
        .strip(),
    
    // remove checkbox values from exported object
    addfacebook: yup
        .boolean()
        .strip(),

    instagram: yup
        .string()
        .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'invalid instagram account / if blank uncheck box'),
    
    facebook: yup
        .string()
        .matches(/((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}/, 'must provide full facebook url / if blank uncheck box')

})

export const addInstagramSchema = yup.object().shape({
    instagram: yup
        .string()
        .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'invalid instagram account')
        .required('instagram is required')
})

export const addBusinessSchema = yup.object().shape({
    business_description: yup
        .string()
        .required('business description is required'),

    email: yup
        .string()
        .email()
        .required('valid business email is required'),

    business_name: yup
        .string()
        .required('business name is required'),

    business_type: yup
        .string()
        .oneOf([ 'brand', 'venue', 'both' ], 'invalid brand type')
        .required('business type is required'),

    instagram: yup
        .string()
        .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'invalid instagram account')
        .required('instagram is required'),

    phone: yup
        .string()
        .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, { message: 'invalid phone number', excludeEmptyString: true }),

    website: yup
        .string()
        .url()
        .notRequired(),

    city: yup
        .string()
        .when('business_type', {
            is: 'brand',
            then: yup.string().strip(),
            otherwise: yup.string().notRequired()
        }),
    
    state: yup
        .string()
        .when('business_type', {
            is: 'brand',
            then: yup.string().strip(),
            otherwise: yup.string().notRequired()
        }),
        
    street_address: yup
        .string()
        .when('business_type', {
            is: 'brand',
            then: yup.string().strip(),
            otherwise: yup.string().notRequired()
        }),
        
    zip: yup
        .string()
        .matches(/^\d{5}$/, { message: 'invalid zip code', excludeEmptyString: true })
        .when('business_type', {
            is: 'brand',
            then: yup.string().strip(),
            otherwise: yup.string().notRequired()
        }),
    })