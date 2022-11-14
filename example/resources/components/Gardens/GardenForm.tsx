import { Form, hydratable, useI18n } from "@microeinhundert/radonis";
import type Garden from "App/Models/Garden";

import Button from "../Button";
import CsrfField from "../CsrfField";
import Input from "../Input";

/*
 * Garden Form
 */
interface GardenFormProps {
  garden?: Garden;
}

function GardenForm({ garden }: GardenFormProps) {
  const { formatMessage } = useI18n();

  const messages = {
    name: {
      label: formatMessage("gardens.form.name.label"),
    },
    zip: {
      label: formatMessage("gardens.form.zip.label"),
    },
    city: {
      label: formatMessage("gardens.form.city.label"),
    },
    actions: {
      create: formatMessage("gardens.form.actions.create"),
      update: formatMessage("gardens.form.actions.update"),
    },
  };

  return (
    <Form
      action={garden ? "GardensController.update" : "GardensController.store"}
      method={garden ? "put" : "post"}
      params={garden ? { id: garden.id } : undefined}
      noValidate
    >
      <div className="flex flex-col gap-5">
        <CsrfField />
        <Input
          defaultValue={garden?.name}
          label={messages.name.label}
          name="name"
          type="text"
          required
        />
        <Input
          defaultValue={garden?.zip}
          label={messages.zip.label}
          name="zip"
          type="text"
          required
        />
        <Input
          defaultValue={garden?.city}
          label={messages.city.label}
          name="city"
          type="text"
          required
        />
        <Button className="mt-4" type="submit">
          {messages.actions[garden ? "update" : "create"]}
        </Button>
      </div>
    </Form>
  );
}

export default hydratable("GardenForm", GardenForm);
