import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { Tooltip } from '../../tooltip';
import styles from './NameList.module.scss';

/**
 * The `NameList` component takes an array of strings
 * and displays the first item with a "+ N more" message
 * if there are more than 1 items in the list.
 *
 * Additionally, it will show a tooltip with the full list of items if
 * there are more than 1. You can customize how the items
 * in the tooltip are rendered by using the `renderTooltipItem`
 * prop.
 *
 * You can also add a title above the items in the tooltip by
 * passing the `title` prop.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string | string[]} [props.names]
 * @param {string} [props.title]
 * @param {string} [props."data-testid"]
 * @param {object} [props.layerOptions]
 * @param {(item: string, index: number, items: array) => any} [props.renderTooltipItem]
 */
export function NameList({
  className,
  names,
  renderTooltipItem = i => i,
  title,
  // @ts-ignore: valid syntax
  "data-testid": testId,
  ...tooltipOptions
}) {
  const wrapWithToolTip = (c, items) => items && items.length > 1
    ? <Tooltip
        className={styles.tooltip}
        content={
          <>
            {title && <span className={styles.tooltipTitle}>{title}</span>}
            {items.map((item, i) =>
              <span key={i} className={styles.tooltipItem}>
                {renderTooltipItem(item, i, items)}
              </span>
            )}
          </>
        }
        {...tooltipOptions}
      >
        {c}
      </Tooltip>
    : c;

  return (
    <span className={combineClasses(styles.NameList, className)} data-testid={testId}>
      {names?.length && wrapWithToolTip(
        <span>
          <span className={styles.firstName}>{names[0]}</span>
          {names.length > 1 &&
            <span className={styles.andMore}> + {names.length - 1} more</span>
          }
        </span>,
        names
      )}
    </span>
  );
}

NameList.propTypes = {
  /**
   * The array of names (or other strings) to be truncated
   * with "+ N more"
   */
  names: PropTypes.arrayOf(PropTypes.string),
  /**
   * A function to render the individual items in the tooltip.
   * If not passed, then the items will be shown as simple strings.
   */
  renderTooltipItem: PropTypes.func,
  /**
   * Title to show in the Tooltip above the list of names.
   */
  title: PropTypes.string,
  /**
   * Any other props will be passed to the Tooltip component.
   */
  '...other props': PropTypes.any,
};
