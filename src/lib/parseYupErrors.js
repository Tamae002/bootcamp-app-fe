import React from "react";
import { ValidationError } from "yup";

/**
 *
 * @param {ValidationError} err
 * @param {React.ActionDispatch<React.AnyActionArg>} dispatcher - Dispatcher of an ObjectReducer to store the errors
 */
export default function parseYupErrors(err, dispatcher) {
  if (err.inner?.length > 0) {
    const fieldErrors = {};
    err.inner.forEach((e) => {
      fieldErrors[e.path] = e.message;
    });
    dispatcher({
      type: "concat",
      data: fieldErrors,
    });
  }
}
