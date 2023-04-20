import * as yup from 'yup';
import { format, add } from 'date-fns';

const todaysDate = format(new Date(), 'yyyy-MM-dd');
const sixtyDaysOut = format(add(new Date(), { days: 60 }), 'yyyy-MM-dd');


// USER SCHEMAS
export const registrationSchema = yup.object().shape({
    username: yup
        .string()
        .required("required field")
        .min(4, "must be at least 4 characters")
        .max(20, 'must be 20 characters or less')
        .matches(/^[a-zA-Z0-9*@_.\-!$]+$/, 'can only contain alphanumeric, *, _, -, ., $, !, and @')
        .matches(/^(?!.*([*@_.\-!$])\1)[a-zA-Z0-9*@_.\-!$]+$/, 'Special characters cannot be repeated back to back'),

    email: yup
        .string()
        .email('invalid email format')
        .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            'invalid email format'
        )
        .required('valid email is required'),
    
    password: yup
        .string()
        .required("required field")
        .min(8, 'Password must be at least 8 characters long')
        .max(50, 'Password cannot be more than 50 characters long')
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-=,./?;:'"[\]{}|\\]).{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    
    confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
        .required('required field')
})

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("required field.")
        .min(4, "must be at least 4 characters")
        .max(20, 'must be 20 characters or less')
        .matches(/^[a-zA-Z0-9*@_.\-!$]+$/, 'can only contain alphanumeric, *, _, -, ., $, !, and @')
        .matches(/^(?!.*([*@_.\-!$])\1)[a-zA-Z0-9*@_.\-!$]+$/, 'Special characters cannot be repeated back to back'),
    
    password: yup
        .string()
        .required("required field"),
        // .min(8, 'Password must be at least 8 characters long')
        // .max(50, 'Password cannot be more than 50 characters long')
        // .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-=,./?;:'"[\]{}|\\]).{8,}$/,
        //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        // ),
})

export const editUserSchema = yup.object().shape({
    email: yup
        .string()
        .matches(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, { message: 'invalid email', excludeEmptyString: true })
        .nullable(),
    
    password: yup
        .string(),
    
    confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
})


// ROLE SCHEMAS
export const roleRequestSchema = yup.object().shape({
    business_id: yup
        .string()
        .uuid()
        .typeError('please select a business')
        .required('business id is required for request'),
})


// EVENT SCHEMAS
export const createEventSchema = yup.object().shape(
    {
        eventname: yup
            .string()
            .required('required')
            .min(2, 'Eventname must be at least 2 characters long')
            .max(50, 'Eventname cannot be more than 50 characters long')
            .matches(/^[a-zA-Z0-9\s@$!().-&]*$/, 'may contain only letters, numbers, spaces, and @ $ ! . ( ) - &'),
        
        eventdate: yup
            .date()
            .min(todaysDate, 'date should not be in the past')
            .max(sixtyDaysOut, 'right now we only allow events 60 days out')
            .required('required'),
            
        eventstart: yup
            .string()
            .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/, { message: 'incorrect time formatting', excludeEmptyString: true })
            .required('required'),
            
        eventend: yup
            .string()
            .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/, { message: 'incorrect time formatting', excludeEmptyString: true })
            .required('required'),
            
        eventmedia: yup
            .mixed()
            .test('fileFormat', 'Unsupported file format', (value) => {
                return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
            })
            .required('required'),
            
        venue_id: yup
            .string()
            .when('venue_id', {
                is: (value) => value?.length,
                then: (rule) => rule.uuid()
            })
            .required('required'),
            
        details: yup
            .string()
            .required('required'),
            
        brand_id: yup
            .string()
            .when('brand_id', {
                is: (value) => value?.length,
                then: (rule) => rule.uuid()
            })
            .required('required')
        },
        [
        // add Cyclic deps here for require itself
        ['venue_id', 'venue_id'],
        ['brand_id', 'brand_id' ]
    ]
    )
    
export const updateEventSchema = yup.object().shape({
        eventname: yup
        .string()
        .required('event name is required'),
        
        eventdate: yup
        .date()
        .min(todaysDate, 'date should not be in the past')
        .max(sixtyDaysOut, 'right now we only allow events 60 days out')
        .required(),
        
        eventstart: yup
        .string()
        .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/, { message: 'invalid format', excludeEmptyString: true })
        .required(),
        
        eventend: yup
        .string()
        .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/, { message: 'invalid format', excludeEmptyString: true })
        .required(),
        
        venue_id: yup
        .string()
        .when('venue_id', {
            is: (value) => value?.length,
            then: (rule) => rule.uuid()
        })
        .required(),
        
    details: yup
    .string()
    .required(),
    
    brand_id: yup
    .string()
    .when('brand_id', {
        is: (value) => value?.length,
        then: (rule) => rule.uuid()
    })
    .required(),
}, [ ['venue_id', 'venue_id'], ['brand_id', 'brand_id'] ])


// BUSINESS SCHEMAS
export const createBusinessSchema = yup.object().shape({
    business_name: yup
    .string()
    .required('business name is required'),
    
    business_email: yup
    .string()
    .email()
    .required('valid business email is required'),

    business_description: yup
    .string()
    .required('business description is required'),
    
    // need something to check for the file
    business_avatar: yup
    .mixed()
    .required('business image is required'),
    
    business_type: yup
    .string()
    .oneOf(['brand', 'venue', 'both'], 'invalid brand type')
        .required('business type is required'),
        
        // .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, { message: 'invalid instagram account', excludeEmptyString: true })
        business_instagram: yup.string().notRequired().nullable(),
        
        // .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, { message: 'invalid phone number', excludeEmptyString: true })
        business_phone: yup.string().notRequired().nullable(),
        
    business_website: yup.string().url().notRequired().nullable(),
    
    business_twitter: yup.string().notRequired().nullable(),

    // .matches(/((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}/, { message: 'invalid facebook link'})
    business_facebook: yup.string().notRequired().nullable(),
    
    business_location: yup.boolean().when('business_type', {
        is: 'brand',
        then: yup.boolean().oneOf([true, false], 'required'),
        otherwise: yup.boolean().oneOf([true], 'required')
    }),
    
    city: yup
    .string()
    .when('business_type', {
        is: 'brand',
        then: yup.string().notRequired(),
        otherwise: yup.string().required('required for dispensary')
    }),
    
    state: yup
        .string()
        .when('business_type', {
            is: 'brand',
            then: yup.string().notRequired(),
            otherwise: yup.string().required('required for dispensary')
        }),
        
        street_address: yup
        .string()
        .when('business_type', {
            is: 'brand',
            then: yup.string().notRequired(),
            otherwise: yup.string().required('required for dispensary')
        }),
        
        zip: yup
        .string()
        .matches(/^\d{5}$/, { message: 'invalid zip code', excludeEmptyString: true })
        .when('business_type', {
            is: 'brand',
            then: yup.string().notRequired(),
            otherwise: yup.string().required('required for dispensary')
        }),
})