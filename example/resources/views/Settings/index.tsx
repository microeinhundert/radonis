import { useI18n } from "@microeinhundert/radonis";
import Header from "Components/Header";
import { BaseLayout } from "Layouts/Base";

function Index() {
  const { formatMessage } = useI18n();

  const messages = {
    title: formatMessage("settings.index.title"),
  };

  return (
    <BaseLayout>
      <Header title={messages.title} />
      <p>This is an empty view.</p>
    </BaseLayout>
  );
}

export { Index };
