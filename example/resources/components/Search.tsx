import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { hydratable, useI18n } from "@microeinhundert/radonis";
import { useId } from "react";

import { clsx } from "../utils/string";

/*
 * Search
 */
function Search() {
  const { formatMessage } = useI18n();
  const id = useId();

  const messages = {
    label: formatMessage("shared.search.label"),
    placeholder: formatMessage("shared.search.placeholder"),
  };

  return (
    <form action="#" className="flex w-full md:ml-0" method="GET">
      <label className="sr-only" htmlFor={id}>
        {messages.label}
      </label>
      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
        </div>
        <input
          className={clsx(
            "h-full w-full border-transparent bg-transparent py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-500",
            "focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0"
          )}
          id={id}
          name="search-field"
          placeholder={messages.placeholder}
          type="search"
        />
      </div>
    </form>
  );
}

export default hydratable("Search", Search);
