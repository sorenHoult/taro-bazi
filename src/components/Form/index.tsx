import { memo, useRef, useState } from "react";
import { FormContext } from "./FormContext";

export class FormInstance {
  formValues: any = {};
  getFieldsValue(names?: string[]) {
    const { handleChange, ...rest } = this.formValues;
    const obj: any = {};
    if (names?.length) {
      names.forEach((name) => {
        obj[name] = rest[name];
      });
      return obj;
    }
    return rest;
  }

  getFieldValue(name: string) {
    return this.formValues[name];
  }

  setFieldsValue(values) {
    const { handleChange } = this.formValues;
    if (values) {
      handleChange({ ...values });
    }
  }

  setFieldValue(name, value) {
    const { handleChange } = this.formValues;
    if (name) {
      handleChange({ [name]: value });
    }
  }
}

export function createForm() {
  return new FormInstance();
}

export function useForm(form?: any) {
  const formRef = useRef<FormInstance>(form || new FormInstance());
  return formRef.current;
}

function Form({ form, initialValues, children }) {
  const formRef = useForm(form);
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (newValues) => {
    setFormValues({ ...formValues, ...newValues });
  };

  formRef.formValues = {
    handleChange,
    ...formValues,
  };
  return (
    <FormContext.Provider value={{ formValues, handleChange }}>
      {children}
    </FormContext.Provider>
  );
}

export default memo(Form);
