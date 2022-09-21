import type { ReactNode } from 'react';

import { clsx } from '../utils/string';

/*
 * Grid
 */
export enum GridType {
  OneColumn = 'oneColumn',
  TwoColumns = 'twoColumns',
  ThreeColumns = 'threeColumns',
  FourColumns = 'fourColumns',
}

interface GridProps {
  children: ReactNode;
  type?: GridType;
}

function Grid({ children, type = GridType.ThreeColumns }: GridProps) {
  return (
    <div
      className={clsx(
        'grid gap-8',
        {
          [GridType.OneColumn]: 'grid-cols-1',
          [GridType.TwoColumns]: 'grid-cols-1 sm:grid-cols-2',
          [GridType.ThreeColumns]: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
          [GridType.FourColumns]: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        }[type]
      )}
    >
      {children}
    </div>
  );
}

export default Grid;
