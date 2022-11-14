import { Form, hydratable, useI18n, useUrlBuilder } from "@microeinhundert/radonis";

import Button from "../Button";
import CsrfField from "../CsrfField";
import Input from "../Input";
import Link from "../Link";

/*
 * Sign Up Form
 */
function SignUpForm() {
  const { formatMessage } = useI18n();
  const { make } = useUrlBuilder();

  const messages = {
    firstName: {
      label: formatMessage("auth.signUp.form.firstName.label"),
    },
    lastName: {
      label: formatMessage("auth.signUp.form.lastName.label"),
    },
    email: {
      label: formatMessage("auth.signUp.form.email.label"),
    },
    password: {
      label: formatMessage("auth.signUp.form.password.label"),
    },
    passwordConfirmation: {
      label: formatMessage("auth.signUp.form.passwordConfirmation.label"),
    },
    actions: {
      submit: formatMessage("auth.signUp.form.actions.submit"),
    },
    signInLinkLabel: formatMessage("auth.signUp.form.signInLinkLabel"),
  };

  return (
    <Form action="AuthController.signUp" method="post" noValidate>
      <div className="flex flex-col gap-5">
        <CsrfField />
        <Input
          autoComplete="given-name"
          label={messages.firstName.label}
          name="firstName"
          placeholder="John"
          type="text"
          required
        />
        <Input
          autoComplete="family-name"
          label={messages.lastName.label}
          name="lastName"
          placeholder="Doe"
          type="text"
          required
        />
        <Input
          autoComplete="email"
          label={messages.email.label}
          name="email"
          placeholder="john.doe@example.com"
          type="email"
          required
        />
        <Input
          autoComplete="new-password"
          label={messages.password.label}
          name="password"
          type="password"
          required
        />
        <Input
          autoComplete="new-password"
          label={messages.passwordConfirmation.label}
          name="passwordConfirmation"
          type="password"
          required
        />
        <Button className="mt-4" type="submit">
          {messages.actions.submit}
        </Button>
        <div className="text-center text-sm">
          <Link href={make("AuthController.signIn")}>{messages.signInLinkLabel}</Link>
        </div>
      </div>
    </Form>
  );
}

export default hydratable("SignUpForm", SignUpForm);
