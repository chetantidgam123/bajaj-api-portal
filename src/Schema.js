import * as yup from "yup";

export const signupFormSchema = yup.object().shape({
  fullName: yup.string().trim().min(3, "Full name must be at least 3 characters").required("mandatory field*"),
  emailId: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("mandatory field*"),
  mobileNo: yup
    .string()
    .matches(/^[7-9]\d{9}$/, "Phone number must be exactly 10 digits and correct")
    .required("mandatory field*"),
  userPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/, "Invalid password pattern must contain atleaset one uppercase letter,special character & number")
    .required("mandatory field*"),
  terms: yup.boolean().oneOf([true], "You must agree to the terms and conditions"),
});
export const loginFormSchema = yup.object().shape({
  emailId: yup
    .string()
    .email("Invalid email format")
    .required("mandatory field*"),
  userPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("mandatory field*"),
});

export const profileFormSchema = yup.object().shape({
  fullname: yup.string().min(3, "minimum length should be 3 characters").required("Mandatory field*"),
  mobileno: yup.string().matches(/^\d{10}$/, "Phone number must be exactly 10 digits").required("Mandatory field*"),
  mobileno2: yup.string().matches(/^\d{10}$/, "Alt. phone number must be exactly 10 digits"),
  emailid: yup.string().email("Invalid email").required("Mandatory field*"),
  company_name: yup.string().min(3, "minimum length should be 3 characters").required("Mandatory field*"),
  company_email: yup.string().email("Invalid office email").required("Mandatory field*"),
  company_mobile: yup.string().matches(/^\d{10}$/, "Office phone number must be exactly 10 digits").required("Mandatory field*"),
  company_office_mobile: yup.string().matches(/^\d{10}$/, "Alt. office phone number must be exactly 10 digits").required("Mandatory field*"),
  company_address: yup.string().min(3, "minimum length should be 3 characters").max(50, "maximum length should be 50 characters").required("Mandatory field*"),
  clientId: yup.string(),
  clientSecret: yup.string(),
  profile_img: yup.string(),
});

export const resetPassSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("mandatory field*"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("mandatory field*"),
});
export const forgotPassSchema = yup.object().shape({
  emailId: yup
    .string()
    .email("Invalid email format")
    .required("mandatory field*"),
});
export const createUserSchema = yup.object().shape({
  fullName: yup.string().required("mandatory field*"),
  emailId: yup
    .string()
    .email("Invalid email format")
    .required("mandatory field*"),
  mobileNo: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("mandatory field*"),
  userPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("mandatory field*"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("userPassword"), null], "Passwords must match")
    .required("mandatory field*d"),
});
export const createApiSchema = yup.object().shape({
  apiName: yup.string().required("mandatory field*"),
  categoryId: yup.string().required("mandatory field*"),
  subCategoryId: yup.string(),
  isActive: yup.boolean(),
  apiDescription: yup.string(),
  apiMethod: yup.string().required("mandatory field*"),
  apiDomain: yup.string().required("mandatory field*"),
  apiBasePath: yup.string(),
  apiVersion: yup.string(),
  apiEndpoint: yup.string().required("mandatory field*"),
  apiHeaders: yup.object(),
  apiQueryParams: yup.object(),
  apiUriParams: yup.object(),
  apiRequestBodyExample: yup.object(),
  apiRequestSchema: yup.object(),
  apiRequestBodyType: yup.string(),
});
export const categoryFormSchema = yup.object().shape({
  categoryName: yup.string().required("category name is required"),
  description: yup.string(),
  isenabled: yup.boolean(),
  categoryid: yup.number(),
});
export const subCategoryFormSchema = yup.object().shape({
  subcategoryname: yup.string().required("sub category is required"),
  categoryid: yup.number().required("category is required"),
  description: yup.string(),
  isenabled: yup.boolean(),
  sub_categoryid: yup.number(),
});

export const termscondFormSchema = yup.object().shape({
  text: yup.string().required("Content is required"),
});

export const faqSchema = yup.object().shape({
  fullname: yup.string().trim().required("Full name is required"),
  companyname: yup.string().trim().required("Company name is required"),
  emailid: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  mobileno: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  category_name: yup.string().trim().required("Category is required"),
  que: yup.string().trim().required("Please enter your question"),
  ans: yup.string().trim(), // optional
});
