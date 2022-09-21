import { HydrationRoot } from '@ioc:Microeinhundert/Radonis';
import { useI18n } from '@microeinhundert/radonis';
import SignUpForm from 'Components/Auth/SignUpForm';
import { AuthLayout } from 'Layouts/Auth';

function SignUp() {
  const { formatMessage } = useI18n();

  const messages = {
    title: formatMessage('auth.signUp.title'),
  };

  return (
    <AuthLayout title={messages.title}>
      <HydrationRoot component="SignUpForm">
        <SignUpForm />
      </HydrationRoot>
    </AuthLayout>
  );
}

export { SignUp };
