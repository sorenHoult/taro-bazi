import { memo, useContext, cloneElement } from "react";
import { FormContext } from "./FormContext";

function FormItem({ name, children }) {
  const { formValues, handleChange } = useContext<any>(FormContext);
  const value = formValues[name] || "";

  return cloneElement(children, {
    id: name,
    name,
    value,
    onChange: (value) => {
      handleChange({ [name]: value });
    },
  });
}

export default memo(FormItem);
