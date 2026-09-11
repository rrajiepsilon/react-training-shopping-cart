import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const registrationSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  age: yup
    .number()
    .typeError("Enter a valid age")
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be a whole number")
    .max(120, "Enter a valid age"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number"),
  addressLine1: yup.string().trim().required("Address line 1 is required"),
  addressLine2: yup.string().trim().notRequired(),
  city: yup.string().trim().required("City is required"),
  state: yup.string().trim().required("State is required"),
  zipCode: yup
    .string()
    .trim()
    .required("Zip code is required")
    .matches(/^\d{4,6}$/, "Enter a valid zip code"),
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, dots and underscores only"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

/**
 * Runs a Yup schema against form values and returns a flat
 * { fieldName: message } error map — convenient for controlled forms
 * that keep errors in component state rather than using react-hook-form.
 */
export async function validateWithYup(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    const errors = {};
    if (err.inner && err.inner.length > 0) {
      err.inner.forEach((validationError) => {
        if (!errors[validationError.path]) {
          errors[validationError.path] = validationError.message;
        }
      });
    } else if (err.path) {
      errors[err.path] = err.message;
    }
    return errors;
  }
}
