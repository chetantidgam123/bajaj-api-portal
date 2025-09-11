import * as yup from 'yup'

export const signupFormSchema = yup.object().shape({
    fullName: yup.string().required('mandatory field*'),
    emailId: yup.string().email('Invalid email format').required('mandatory field*'),
    mobileNo: yup.string().matches(/^\d{10}$/, 'Phone number must be exactly 10 digits').required('mandatory field*'),
    userPassword: yup.string().min(6, 'Password must be at least 6 characters long').required('mandatory field*'),
    // confirmPassword: yup.string()
    //     .oneOf([yup.ref('userPassword'), null], 'Passwords must match')
    //     .required('mandatory field*'),
    terms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions')
});
export const loginFormSchema = yup.object().shape({
    emailId: yup.string().email('Invalid email format').required('mandatory field*'),
    userPassword: yup.string().min(6, 'Password must be at least 6 characters long').required('mandatory field*'),
});
export const profileFormSchema = yup.object().shape({
    firstName: yup.string().min(5, 'Invalid firstName').required('mandatory field*'),
    lastName: yup.string().min(5, 'Invalid lastName').required('mandatory field*'),
    phoneNumber: yup.string().matches(/^\d{10}$/, 'Invalid phoneNumber').required('mandatory field*'),
    alternameNumber: yup.string().matches(/^\d{10}$/, 'Invalid alternameNumber').required('mandatory field*'),
    emailId: yup.string().email('Invalid emailId').required('mandatory field*'),
    companyName: yup.string().min(5, 'Invalid companyName').required('mandatory field*'),
    officeEmailId: yup.string().email('Invalid officeEmailId').required('mandatory field*'),
    officePhoneNumber: yup.string().matches(/^\d{10}$/, 'Invalid officePhoneNumber').required('mandatory field*'),
    companyAddress: yup.string().min(5, 'Invalid companyAddress').required('mandatory field*'),
    clientId: yup.string().min(5, 'Invalid clientId'),
    clientSecret: yup.string().min(5, 'Invalid clientSecret')
});
export const resetPassSchema = yup.object().shape({
    password: yup.string().min(6, 'Password must be at least 6 characters long').required('mandatory field*'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('mandatory field*'),
});
export const forgotPassSchema = yup.object().shape({
    emailId: yup.string().email('Invalid email format').required('mandatory field*'),
});
export const createUserSchema = yup.object().shape({
    fullName: yup.string().required('mandatory field*'),
    emailId: yup.string().email('Invalid email format').required('mandatory field*'),
    mobileNo: yup.string().matches(/^\d{10}$/, 'Phone number must be exactly 10 digits').required('mandatory field*'),
    userPassword: yup.string().min(6, 'Password must be at least 6 characters long').required('mandatory field*'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('userPassword'), null], 'Passwords must match')
        .required('mandatory field*d')
});
export const createApiSchema = yup.object().shape({
    apiName: yup.string().required('mandatory field*'),
    categoryId: yup.string().required('mandatory field*'),
    subCategoryId: yup.string(),
    isActive: yup.boolean(),
    apiDescription: yup.string(),
    apiMethod: yup.string().required('mandatory field*'),
    apiDomain: yup.string().required('mandatory field*'),
    apiBasePath: yup.string(),
    apiVersion: yup.string(),
    apiEndpoint: yup.string().required('mandatory field*'),
    apiHeaders: yup.object(),
    apiQueryParams: yup.object(),
    apiUriParams: yup.object(),
    apiRequestBodyExample: yup.object(),
    apiRequestSchema: yup.object(),
    apiRequestBodyType: yup.string(),
});
export const categoryFormSchema = yup.object().shape({
    categoryName: yup.string().required('category name is required'),
    description: yup.string(),
    isenabled: yup.boolean(),
    categoryid: yup.number(),
});
export const subCategoryFormSchema = yup.object().shape({
    subcategoryname: yup.string().required('sub category is required'),
    categoryid: yup.number().required('category is required'),
    description: yup.string(),
    isenabled: yup.boolean(),
    sub_categoryid: yup.number(),
});

export const termscondFormSchema = yup.object().shape({
    text:yup.string().required('Content is required')
})


