import { HydrationRoot, useI18n } from "@microeinhundert/radonis";
import SignInForm from "Components/Auth/SignInForm";
import { AuthLayout } from "Layouts/Auth";

function SignIn() {
  const { formatMessage } = useI18n();

  const messages = {
    title: formatMessage("auth.signIn.title"),
  };

  return (
    <AuthLayout title={messages.title}>
      <HydrationRoot>
        <SignInForm />
      </HydrationRoot>
    </AuthLayout>
  );
}

export { SignIn };
