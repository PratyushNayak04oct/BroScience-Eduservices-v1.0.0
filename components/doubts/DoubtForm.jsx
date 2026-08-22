"use client";

import FormField, { FormStatus } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { useFormState } from "@/hooks/useFormState";

function validateDoubtForm(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Please enter your name.";
  if (!values.email?.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Please enter a valid email address.";
  if (!values.subject?.trim()) errors.subject = "Please select a subject.";
  if (!values.question?.trim()) errors.question = "Please describe your doubt.";
  else if (values.question.trim().length < 20)
    errors.question = "Please provide at least 20 characters.";
  return errors;
}

const subjectOptions = [
  { value: "", label: "Select a subject" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
  { value: "Other", label: "Other" },
];

export default function DoubtForm() {
  const {
    values,
    errors,
    status,
    setValue,
    handleFocus,
    handleBlur,
    handleSubmit,
    getFieldState,
    isSubmitting,
    reset,
  } = useFormState({ validate: validateDoubtForm });

  const makeChangeHandler = (name) => (e) => setValue(name, e.target.value);

  if (status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <FormStatus status="success" successMessage="Your doubt has been submitted! A faculty member will respond within 24 hours." />
        <Button onClick={reset} variant="secondary">
          Submit Another Doubt
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormStatus status={status} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Full Name"
          name="name"
          value={values.name}
          onChange={makeChangeHandler("name")}
          onFocus={() => handleFocus("name")}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          state={getFieldState("name")}
          placeholder="Your name"
          required
          disabled={isSubmitting}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={makeChangeHandler("email")}
          onFocus={() => handleFocus("email")}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          state={getFieldState("email")}
          placeholder="you@example.com"
          required
          disabled={isSubmitting}
        />
      </div>

      <FormField
        label="Subject"
        name="subject"
        as="select"
        options={subjectOptions}
        value={values.subject}
        onChange={makeChangeHandler("subject")}
        onFocus={() => handleFocus("subject")}
        onBlur={() => handleBlur("subject")}
        error={errors.subject}
        state={getFieldState("subject")}
        required
        disabled={isSubmitting}
      />

      <FormField
        label="Your Doubt"
        name="question"
        as="textarea"
        value={values.question}
        onChange={makeChangeHandler("question")}
        onFocus={() => handleFocus("question")}
        onBlur={() => handleBlur("question")}
        error={errors.question}
        state={getFieldState("question")}
        placeholder="Describe your doubt in detail. Include the topic, what you've tried, and where you're stuck."
        required
        disabled={isSubmitting}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Doubt"}
      </Button>
    </form>
  );
}
