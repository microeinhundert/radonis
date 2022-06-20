# Creating A Form Input Component

Radonis ships with a React hook called `useFormField` that abstracts away some of the logic required for form fields.
This hook makes it easy to handle the display of field errors, touched and dirty states as well as id generation for the label and aria attributes.
Because of the server-centric nature of Radonis, more advanced React form libraries like [Formik](https://formik.org/) or [React Hook Form](https://react-hook-form.com/) should not be necessary.

The following snippet is an example implementation of a simple input component.
As a bonus, this component also displays a password show/hide button, but only when hydrated. This is made possible by the `useHydrated` hook.

```tsx
import { useFormField, useHydrated, useI18n } from '@microeinhundert/radonis'
import React, { useState } from 'react'

// Icons are included from @heroicons/react
import { ExclamationCircleIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

// Helper for className composition
function clsx(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

type HTMLProps<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag]

interface InputProps extends HTMLProps<'input'> {
  type?: 'text' | 'email' | 'password' | 'number'
  name: string
  label: string
  description?: string
}

const initiallyHiddenTypes = ['password']

function Input({ name, type: initialType = 'text', className, ...restProps }: InputProps) {
  const i18n = useI18n()
  const field = useFormField(name, restProps)
  const hydrated = useHydrated()

  const areContentsInitiallyHidden = initiallyHiddenTypes.includes(initialType)
  const [type, setType] = useState(initialType)

  // These translation messages live in `resources/lang/en/shared.json`
  const messages = {
    hideContents: i18n.formatMessage('shared.input.hideContents'),
    showContents: i18n.formatMessage('shared.input.showContents'),
  }

  return (
    <div>
      <label {...field.getLabelProps()} className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          defaultValue={field.value}
          {...field.getInputProps(type)}
          className={clsx(
            'block w-full rounded-md pr-10 transition focus:outline-none sm:text-sm',
            field.error ? 'border-red-300' : 'border-gray-300',
            field.error ? 'focus:border-red-500' : 'focus:border-gray-500',
            field.error ? 'focus:ring-red-500' : 'focus:ring-emerald-500',
            field.error && 'text-red-900 placeholder-red-300',
            className
          )}
        />
        {hydrated && field.value && areContentsInitiallyHidden ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button type="button" onClick={() => setType((type) => (type === initialType ? 'text' : initialType))}>
              {type !== initialType ? (
                <EyeOffIcon aria-hidden="true" className="h-5 w-5" />
              ) : (
                <EyeIcon aria-hidden="true" className="h-5 w-5" />
              )}
              <span className="sr-only">{messages[type !== initialType ? 'hideContents' : 'showContents']}</span>
            </button>
          </div>
        ) : (
          field.error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-red-500" />
            </div>
          )
        )}
      </div>
      {field.description && (
        <span {...field.getDescriptionProps()} className="mt-4 text-sm text-gray-500">
          {field.description}
        </span>
      )}
      {field.error && (
        <span {...field.getErrorProps()} className="mt-4 text-sm text-red-600">
          {field.error}
        </span>
      )}
    </div>
  )
}

export default Input
```

The language file at `resources/lang/en/shared.json` looks like this:

```json
{
  "input": {
    "showContents": "Show contents",
    "hideContents": "Hide contents"
  }
}
```

## License

[MIT](https://github.com/microeinhundert/radonis/tree/main/packages/radonis/LICENSE)
