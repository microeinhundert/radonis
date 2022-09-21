import { HydrationRoot } from '@ioc:Microeinhundert/Radonis';
import { useI18n } from '@microeinhundert/radonis';
import GardenForm from 'Components/Gardens/GardenForm';
import Header from 'Components/Header';
import { BaseLayout } from 'Layouts/Base';

function Create() {
  const { formatMessage } = useI18n();

  const messages = {
    title: formatMessage('gardens.create.title'),
  };

  return (
    <BaseLayout>
      <Header title={messages.title} />
      <HydrationRoot component="GardenForm">
        <GardenForm />
      </HydrationRoot>
    </BaseLayout>
  );
}

export { Create };
