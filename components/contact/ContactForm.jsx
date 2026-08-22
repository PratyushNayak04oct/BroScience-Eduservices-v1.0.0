"use client";

import FormField, { FormStatus } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { useFormState } from "@/hooks/useFormState";

function validateContactForm(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Please enter your name.";
  if (!values.email?.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Please enter a valid email address.";
  if (!values.phone?.trim()) errors.phone = "Please enter your phone number.";
  else if (!/^[0-9+\s-]{10,}$/.test(values.phone))
    errors.phone = "Please enter a valid phone number.";
  if (!values.subject?.trim()) errors.subject = "Please select a subject.";
  if (!values.message?.trim()) errors.message = "Please enter your message.";
  return errors;
}

const subjectOptions = [
  { value: "", label: "Select a topic" },
  { value: "course-enquiry", label: "Course Enquiry" },
  { value: "counselling", label: "Free Counselling" },
  { value: "admission", label: "Admission" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const courseOptions = [
  { value: "", label: "Select a course (optional)" },
  { value: "class-7-10", label: "Class 7–10 Foundation" },
  { value: "class-11-12", label: "Class 11–12 Science" },
  { value: "jee", label: "JEE Preparation" },
  { value: "neet", label: "NEET Preparation" },
  { value: "boards", label: "Board Exams" },
];

export default function ContactForm() {
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
  } = useFormState({ validate: validateContactForm });

  const makeChangeHandler = (name) => (e) => setValue(name, e.target.value);

  if (status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <FormStatus
          status="success"
          successMessage="Thank you for reaching out! Our team will contact you within 24 hours."
        />
        <Button onClick={reset} variant="secondary">
          Send Another Message
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
          placeholder="Your full name"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={makeChangeHandler("phone")}
          onFocus={() => handleFocus("phone")}
          onBlur={() => handleBlur("phone")}
          error={errors.phone}
          state={getFieldState("phone")}
          placeholder="+91 98765 43210"
          required
          disabled={isSubmitting}
        />
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
      </div>

      <FormField
        label="Course Interest"
        name="course"
        as="select"
        options={courseOptions}
        value={values.course}
        onChange={makeChangeHandler("course")}
        onFocus={() => handleFocus("course")}
        onBlur={() => handleBlur("course")}
        state={getFieldState("course")}
        disabled={isSubmitting}
      />

      <FormField
        label="Message"
        name="message"
        as="textarea"
        value={values.message}
        onChange={makeChangeHandler("message")}
        onFocus={() => handleFocus("message")}
        onBlur={() => handleBlur("message")}
        error={errors.message}
        state={getFieldState("message")}
        placeholder="Tell us how we can help you..."
        required
        disabled={isSubmitting}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
