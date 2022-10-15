import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Form, useHydrated, useI18n } from '@microeinhundert/radonis';
import { useServerQuery } from '@microeinhundert/radonis-query';
import { useQueryClient } from "@tanstack/react-query";
import type Garden from 'App/Models/Garden';
import type GardensController  from 'App/Controllers/Http/GardensController';
import { useState } from 'react';

import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import Button, { ButtonColor } from '../Button';
import Card from '../Card';
import Fallback from '../Fallback';
import Grid from '../Grid';
import IconCircle, { IconCircleColor } from '../IconCircle';
import NoDataIllustration from '../Illustrations/NoDataIllustration';
import Modal from '../Modal';

/*
 * Gardens List Item
 */
interface GardensListItemProps {
  canEdit: boolean;
  garden: Garden;
}

function GardensListItem({ canEdit, garden }: GardensListItemProps) {
  const { formatMessage } = useI18n();
  const hydrated = useHydrated();
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const queryClient = useQueryClient()

  const messages = {
    actions: {
      edit: formatMessage('gardens.list.actions.edit'),
      delete: formatMessage('gardens.list.actions.delete'),
    },
    modals: {
      delete: {
        title: formatMessage('gardens.list.modals.delete.title', { name: garden.name }),
        description: formatMessage('gardens.list.modals.delete.description'),
        actions: {
          cancel: formatMessage('gardens.list.modals.delete.actions.cancel'),
          confirm: formatMessage('gardens.list.modals.delete.actions.confirm'),
        },
      },
    },
  };

  return (
    <Form
      action="GardensController.destroy"
      noReload
      hooks={{
        onMutate: async () => {
          await queryClient.cancelQueries(['GardensController.index'])
          setDeleteConfirmationModalOpen(false);
        },
        onSettled: () => {
          queryClient.invalidateQueries(['GardensController.index'])
        }
      }}
      id={`delete-garden-${garden.id}`}
      method="delete"
      params={{ id: garden.id }}
    >
      <Card>
        <Card.Head
          actions={
            canEdit && (
              <>
                <Button.Link
                  color={ButtonColor.Emerald}
                  icon={PencilIcon}
                  params={{ id: garden.id }}
                  title={messages.actions.edit}
                  to="GardensController.edit"
                  round
                  small
                />
                <Button
                  color={ButtonColor.WhiteDanger}
                  icon={TrashIcon}
                  title={messages.actions.delete}
                  type={hydrated ? 'button' : 'submit'}
                  round
                  small
                  onClick={() => {
                    setDeleteConfirmationModalOpen(true);
                  }}
                />
              </>
            )
          }
        >
          {garden.name}
        </Card.Head>
        <Card.Body>
          <p>{garden.city}</p>
          <p>{garden.zip}</p>
        </Card.Body>
      </Card>
      <Modal
        actions={
          <>
            <Button
              color={ButtonColor.White}
              round
              onClick={() => setDeleteConfirmationModalOpen(false)}
            >
              {messages.modals.delete.actions.cancel}
            </Button>
            <Button color={ButtonColor.Red} form={`delete-garden-${garden.id}`} type="submit" round>
              {messages.modals.delete.actions.confirm}
            </Button>
          </>
        }
        open={deleteConfirmationModalOpen}
        onClose={() => setDeleteConfirmationModalOpen(false)}
      >
        <Modal.Aside>
          <IconCircle color={IconCircleColor.Red} icon={ExclamationCircleIcon} />
        </Modal.Aside>
        <Modal.Body>
          <Modal.Title>{messages.modals.delete.title}</Modal.Title>
          <Modal.Description>{messages.modals.delete.description}</Modal.Description>
        </Modal.Body>
      </Modal>
    </Form>
  );
}

/*
 * Gardens List
 */
function GardensList() {
  const { formatMessage } = useI18n();
  const user = useAuthenticatedUser();
  const { data } = useServerQuery<GardensController['index']>('GardensController.index');

  const messages = {
    noData: {
      headline: formatMessage('gardens.list.noData.headline'),
      text: formatMessage('gardens.list.noData.text'),
    },
  };

  return (
    <>
      {data?.gardens.length ? (
        <>
          <Grid>
            {data.gardens.map((garden) => (
              <GardensListItem
                key={garden.id}
                canEdit={user?.id === garden.userId}
                garden={garden}
              />
            ))}
          </Grid>
        </>
      ) : (
        <Fallback {...messages.noData} icon={NoDataIllustration} />
      )}
    </>
  );
}

export default GardensList;
