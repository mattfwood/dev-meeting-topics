import React, { useState, ReactNode, PropsWithoutRef } from 'react';
import { Formik, FormikProps } from 'formik';
import * as z from 'zod';
import { Button } from 'minerva-ui';

type FormProps<S extends z.ZodType<any, any>> = {
  /** All your form fields */
  children: ReactNode;
  /** Text to display in the submit button */
  submitText?: string;
  schema?: S;
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>;
  initialValues?: FormikProps<z.infer<S>>['initialValues'];
  resetFormOnSubmit?: boolean;
} & Omit<PropsWithoutRef<JSX.IntrinsicElements['form']>, 'onSubmit'>;

type OnSubmitResult = {
  FORM_ERROR?: string;
  [prop: string]: any;
};

export const FORM_ERROR = 'FORM_ERROR';

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  resetFormOnSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null);
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={(values) => {
        if (!schema) return;
        try {
          schema.parse(values);
        } catch (error) {
          return error.formErrors.fieldErrors;
        }
      }}
      onSubmit={async (values, { setErrors, resetForm }) => {
        const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {};

        if (FORM_ERROR) {
          setFormError(FORM_ERROR);
        }

        const hasOtherErrors = Object.keys(otherErrors).length > 0;

        if (hasOtherErrors) {
          setErrors(otherErrors);
        }

        // if no errors, reset form
        if (!FORM_ERROR && !hasOtherErrors && resetFormOnSubmit) {
          resetForm(initialValues);
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {formError && (
            <div role="alert" style={{ color: 'red' }}>
              {formError}
            </div>
          )}

          {Boolean(submitText) && (
            <Button type="submit" disabled={isSubmitting}>
              {submitText}
            </Button>
          )}
        </form>
      )}
    </Formik>
  );
}

export default Form;
