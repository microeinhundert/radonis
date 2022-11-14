import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { hydratable, useI18n } from "@microeinhundert/radonis";
import type { ReactNode } from "react";
import { Fragment } from "react";

import { clsx } from "../utils/string";

/*
 * Modal Aside
 */
interface ModalAsideProps {
  children: ReactNode;
}

function ModalAside({ children }: ModalAsideProps) {
  return <div className="mb-5 sm:flex-shrink-0">{children}</div>;
}

/*
 * Modal Body
 */
interface ModalBodyProps {
  children: ReactNode;
}

function ModalBody({ children }: ModalBodyProps) {
  return <div className="sm:flex-grow">{children}</div>;
}

/*
 * Modal Title
 */
interface ModalTitleProps {
  children: ReactNode;
}

function ModalTitle({ children }: ModalTitleProps) {
  return (
    <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
      {children}
    </Dialog.Title>
  );
}

/*
 * Modal Description
 */
interface ModalDescriptionProps {
  children: ReactNode;
}

function ModalDescription({ children }: ModalDescriptionProps) {
  return (
    <Dialog.Description className="mt-2 text-center text-sm text-gray-500 sm:text-left">
      {children}
    </Dialog.Description>
  );
}

/*
 * Modal Overlay
 */
function ModalOverlay() {
  const transition = {
    enter: "ease-out duration-200",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
  };

  return (
    <Transition.Child as={Fragment} {...transition}>
      <div className="fixed inset-0 bg-gray-600/75 transition-opacity" />
    </Transition.Child>
  );
}

/*
 * Modal Content
 */
interface ModalContentProps {
  children: ReactNode;
  actions?: ReactNode;
  wide?: boolean;
  onClose: () => void;
}

function ModalContent({ children, actions, wide, onClose }: ModalContentProps) {
  const { formatMessage } = useI18n();

  const messages = {
    close: formatMessage("shared.modal.close"),
  };

  const transition = {
    enter: "ease-out duration-200",
    enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-90",
    enterTo: "opacity-100 translate-y-0 sm:scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
    leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-90",
  };

  return (
    <Transition.Child as={Fragment} {...transition}>
      <Dialog.Panel
        className={clsx(
          "relative z-10 w-full overflow-hidden rounded-lg bg-white p-6 shadow-xl transition",
          wide ? "sm:max-w-5xl" : "sm:max-w-xl"
        )}
      >
        <div className="text-center sm:flex sm:gap-5 sm:text-left">{children}</div>
        {actions ? (
          <div className="mt-8 flex justify-center gap-3 sm:justify-end">{actions}</div>
        ) : (
          <div className="absolute top-6 right-6">
            <button
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              title={messages.close}
              type="button"
              onClick={onClose}
            >
              <span className="sr-only">{messages.close}</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        )}
      </Dialog.Panel>
    </Transition.Child>
  );
}

/*
 * Modal
 */
interface ModalProps extends ModalContentProps {
  open: boolean;
}

function Modal({ open, onClose, ...restProps }: ModalProps) {
  return (
    <Transition.Root as={Fragment} show={open}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-y-auto"
        open={open}
        static
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4 text-center">
          <ModalOverlay />
          <ModalContent {...restProps} onClose={onClose} />
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Modal.Aside = ModalAside;
Modal.Body = ModalBody;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;

export default hydratable("Modal", Modal);
