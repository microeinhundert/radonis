import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { hydratable, useI18n } from "@microeinhundert/radonis";
import { useState } from "react";

import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { getFirstChar } from "../utils/string";
import Button, { ButtonColor } from "./Button";
import IconCircle, { IconCircleColor } from "./IconCircle";
import Modal from "./Modal";

/*
 * Sidebar User Info
 */
function SidebarUserInfo() {
  const { formatMessage } = useI18n();
  const user = useAuthenticatedUser();

  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  const messages = {
    signOut: formatMessage("shared.sidebar.signOut"),
    signIn: formatMessage("shared.sidebar.signIn"),
    signUp: formatMessage("shared.sidebar.signUp"),
    modals: {
      signOut: {
        title: formatMessage("shared.sidebar.modals.signOut.title"),
        description: formatMessage("shared.sidebar.modals.signOut.description"),
        actions: {
          cancel: formatMessage("shared.sidebar.modals.signOut.actions.cancel"),
          confirm: formatMessage("shared.sidebar.modals.signOut.actions.confirm"),
        },
      },
    },
  };

  return (
    <div className="flex flex-shrink-0 items-center gap-3 border-t border-gray-200 p-4">
      {user ? (
        <>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-500">
            <span className="text-uppercase text-xs font-medium leading-none text-white">
              {getFirstChar(user.firstName) + getFirstChar(user.lastName)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              {user.firstName} {user.lastName}
            </p>
            <p className="w-32 truncate text-xs font-medium text-gray-500">{user.email}</p>
          </div>
          <div className="flex-shrink-0">
            <Button
              color={ButtonColor.WhiteDanger}
              icon={ArrowLeftOnRectangleIcon}
              title={messages.signOut}
              onClick={() => setSignOutModalOpen(true)}
            />
          </div>
          <Modal
            actions={
              <>
                <Button color={ButtonColor.White} round onClick={() => setSignOutModalOpen(false)}>
                  {messages.modals.signOut.actions.cancel}
                </Button>
                <Button.Link color={ButtonColor.Red} to="AuthController.signOut" round>
                  {messages.modals.signOut.actions.confirm}
                </Button.Link>
              </>
            }
            open={signOutModalOpen}
            onClose={() => setSignOutModalOpen(false)}
          >
            <Modal.Aside>
              <IconCircle color={IconCircleColor.Red} icon={ArrowLeftOnRectangleIcon} />
            </Modal.Aside>
            <Modal.Body>
              <Modal.Title>{messages.modals.signOut.title}</Modal.Title>
              <Modal.Description>{messages.modals.signOut.description}</Modal.Description>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <>
          <Button.Link className="flex-1" color={ButtonColor.White} to="AuthController.signInShow">
            {messages.signIn}
          </Button.Link>
          <Button.Link
            className="flex-1"
            color={ButtonColor.Emerald}
            to="AuthController.signUpShow"
          >
            {messages.signUp}
          </Button.Link>
        </>
      )}
    </div>
  );
}

export default hydratable("SidebarUserInfo", SidebarUserInfo);
