import { PlusIcon } from "@heroicons/react/24/solid";
import { HydrationRoot, useI18n } from "@microeinhundert/radonis";
import type Garden from "App/Models/Garden";
import Button, { ButtonColor } from "Components/Button";
import GardensList from "Components/Gardens/GardensList";
import Header from "Components/Header";
import { BaseLayout } from "Layouts/Base";

interface IndexProps {
  gardens: Garden[];
}

function Index({ gardens }: IndexProps) {
  const { formatMessage } = useI18n();

  const messages = {
    title: formatMessage("gardens.index.title"),
    actions: {
      create: formatMessage("gardens.index.actions.create"),
    },
  };

  return (
    <BaseLayout>
      <Header
        actions={
          <>
            <Button.Link color={ButtonColor.Emerald} icon={PlusIcon} to="GardensController.create">
              {messages.actions.create}
            </Button.Link>
          </>
        }
        title={messages.title}
      />
      <HydrationRoot>
        <GardensList gardens={gardens} />
      </HydrationRoot>
    </BaseLayout>
  );
}

export { Index };
export { Create } from "./Create";
export { Edit } from "./Edit";
export { Show } from "./Show";
