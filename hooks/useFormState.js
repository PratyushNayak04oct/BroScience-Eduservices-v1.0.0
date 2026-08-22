"use client";

import { useCallback, useState } from "react";

export function useFormState({ validate, onSubmit }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState("idle");

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleFocus = useCallback((name) => {
    setFocusedField(name);
  }, []);

  const handleBlur = useCallback(
    (name) => {
      setFocusedField(null);
      if (validate) {
        const fieldErrors = validate(values);
        if (fieldErrors[name]) {
          setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
        }
      }
    },
    [validate, values]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (validate) {
        const fieldErrors = validate(values);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          return;
        }
      }

      setStatus("submitting");
      setErrors({});

      try {
        if (onSubmit) await onSubmit(values);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStatus("success");
      } catch {
        setStatus("failure");
      }
    },
    [onSubmit, validate, values]
  );

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
    setFocusedField(null);
    setStatus("idle");
  }, []);

  const getFieldState = useCallback(
    (name) => {
      if (errors[name]) return "error";
      if (focusedField === name) return "focused";
      return "default";
    },
    [errors, focusedField]
  );

  return {
    values,
    errors,
    status,
    setValue,
    handleFocus,
    handleBlur,
    handleSubmit,
    reset,
    getFieldState,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    isFailure: status === "failure",
  };
}
