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
        .required("required field"),

    password: yup
        .string()
        .required("required field"),

    confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
        .required('required field')
})

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("username is a required field."),

    password: yup
        .string()
        .required("password is a required field.")
})

export const createEventSchema = yup.object().shape(
    {
        eventname: yup
            .string()
            .required('event name is required'),
        
        eventdate: yup
            .date()
            .min(todaysDate, 'date should not be in the past')
            .max(sixtyDaysOut, 'right now we only allow events 60 days out')
            .required('event date is required'),

        eventstart: yup
            .string()
            .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/, { message: 'incorrect time formatting', excludeEmptyString: true })
            .required('start time is required'),
            
        eventend: yup
            .string()
            .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/, { message: 'incorrect time formatting', excludeEmptyString: true })
            .required('end time is required'),
        
        eventmedia: yup
            .mixed()
            .required('event image must be provided'),

        venue_id: yup
            .string()
            .when('venue_id', {
                is: (value) => value?.length,
                then: (rule) => rule.uuid()
            })
            .required('event location is required'),
            
        details: yup
            .string()
            .required('event details are required'),
            
        brand_id: yup
            .string()
            .when('brand_id', {
                is: (value) => value?.length,
                then: (rule) => rule.uuid()
            })
            .required('branding is required')
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
        .matches(/([01]?[0-9]|2[0-3])[0-5][0-9]/, { message: 'incorrect time formatting', excludeEmptyString: true })
        .required(),

    eventend: yup
        .string()
        .matches(/([01]?[0-9]|2[0-3])[0-5][0-9]/, { message: 'incorrect time formatting', excludeEmptyString: true })
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