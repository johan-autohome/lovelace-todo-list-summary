import { css } from 'lit';

export const styles = css`
  .table {
    display: table;
  }
  .row {
    display: table-row;
  }
  .cell {
    display: table-cell;
    padding: 0.5em;
  }
  .markdown pre {
    background-color: var(--card-background-color);
    padding: 8px;
    border-radius: 4px;
    overflow: auto;
  }
`;
