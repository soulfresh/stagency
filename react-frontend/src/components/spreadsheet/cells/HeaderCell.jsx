import React from 'react';
import PropTypes from 'prop-types';
import { mergeRefs } from 'react-laag';

import { combineClasses } from '@thesoulfresh/utils';
import { useTimeout } from '@thesoulfresh/react-tools';

import { Tooltip } from '../../tooltip';

import styles from './HeaderCell.module.scss';

/**
 * @typedef {object} HeaderCellProps
 * @property {*} [ref]
 * @property {string} [displayName] - DEPRECATED: use headerName
 * @property {string} [headerName]
 * @property {string} [headerTooltip]
 * @property {number} [tooltipDelay]
 * @property {boolean} [centered]
 * @property {boolean} [visible]
 * @property {string | number} [value]
 * @property {string} [valueFormatted]
 * @property {object} [column]
 * @property {object} [columnApi]
 * @property {string} [className]
 * @property {number} [rowIndex]
 * @property {object} [api]
 * @property {object} [tableApi]
 * @property {function} [ResizeObserver] - ResizeObserver polyfill
 *   (for use in testing).
 */
/**
 * @type React.FC<HeaderCellProps>
 */
export const HeaderCell = React.forwardRef(({
  displayName,
  headerName,
  centered,
  value,
  valueFormatted,
  column,
  columnApi,
  rowIndex,
  visible = true,
  headerTooltip,
  tooltipDelay = 1000,
  className,
  api,
  tableApi,
  ResizeObserver,
  ...rest
}, ref) => {
  const columnName = displayName ||
    headerName ||
    value ||
    valueFormatted ||
    columnApi.getDisplayNameForColumn(column);
  const localRef = React.useRef();

  const wait = useTimeout();
  const timeoutRef = React.useRef();

  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  // TODO The tooltip only works after it has been opened once
  // using the mouse hover.
  // TODO If we keep AgGrid around, we should also:
  // - Set the cell selection when the inner header cell is focused
  //   so we don't lose the highlight indicator.
  // - Pass Esc and Enter events to the inner header cell if focus
  //   is on the outer cell so users can control the visiblility
  //   of the tooltip with the keyboard.

  // Open the tooltip when cell focus events occur.
  React.useEffect(() => {
    if (headerTooltip) {
      // When the cell or table loses focus, hide the tooltip.
      const onBlur = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        setTooltipOpen(false);
        tableApi.removeEventListener('focusout', onBlur);
      }

      // When the cell receives focus, open the tooltip
      // and start listening for focus to leave the table.
      const onParentFocus = (e) => {
        if (!tooltipOpen) {
          if (tooltipDelay > 0) {
            timeoutRef.current = wait(() => setTooltipOpen(true), tooltipDelay);
          } else {
            setTooltipOpen(true)
          }
          // Listen for the Spreadsheet losing focus in order to hide the tooltip.
          tableApi.addEventListener('focusout', onBlur);
        }
        else {
          onBlur();
        }
      };

      // @ts-ignore
      const parentCell = localRef.current.closest('[role=columnheader]');
      parentCell?.addEventListener('focus', onParentFocus);

      return () => {
        parentCell?.removeEventListener('focus', onParentFocus);
      }
    }
  });

  const content = <span data-rendered className={styles.textWrapper}>{ columnName }</span>;

  return (
    <div data-testid="HeaderCell"
      className={combineClasses(
        styles.HeaderCell,
        className,
        centered ? styles.centered : null,
        !visible ? styles.hidden : null,
      )}
      ref={mergeRefs(ref, localRef)}
    >
      {headerTooltip &&
        <Tooltip
          data-testid="Tooltip"
          isOpen={tooltipOpen}
          onOpen={() => setTooltipOpen(true)}
          onClose={() => setTooltipOpen(false)}
          content={headerTooltip}
          layerOptions={{
            triggerOffset: 20,
            ResizeObserver,
          }}
          hoverOptions={{
            delayEnter: tooltipDelay,
          }}
        >
          { content }
        </Tooltip>
      }
      {!headerTooltip && content }
    </div>
  );
});

HeaderCell.propTypes = {
  displayName: PropTypes.string,
  visible: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueFormatted: PropTypes.string,
  headerTooltip: PropTypes.string,
};


