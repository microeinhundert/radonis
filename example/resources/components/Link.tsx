import type { ReactNode } from 'react';

import { clsx } from '../utils/string';

/*
 * Link
 */
interface LinkProps extends HTMLProps<'a'> {
  children?: ReactNode;
}

function Link({ children, href, className, ...restProps }: LinkProps) {
  return (
    <a
      {...restProps}
      className={clsx('font-medium text-emerald-600 hover:text-emerald-500', className)}
      href={href}
    >
      {children}
    </a>
  );
}

export default Link;
