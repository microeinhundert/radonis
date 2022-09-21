import { useI18n } from '@microeinhundert/radonis';
import Header from 'Components/Header';
import { BaseLayout } from 'Layouts/Base';

function Dashboard() {
  const { formatMessage } = useI18n();

  const messages = {
    title: formatMessage('dashboard.index.title'),
  };

  return (
    <BaseLayout>
      <Header title={messages.title} />
      <p>This is an empty view.</p>
    </BaseLayout>
  );
}

export { Dashboard };
