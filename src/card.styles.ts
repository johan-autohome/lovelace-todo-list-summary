import { css } from 'lit';

export const styles = css`
  ha-card {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .has-header {
    padding-top: 0;
  }

  .header {
    padding-left: 30px;
    padding-right: 16px;
    padding-inline-start: 30px;
    padding-inline-end: 16px;
    margin-top: 8px;
    justify-content: space-between;
    direction: var(--direction);
  }

  .header h2 {
    color: var(--primary-text-color);
    font-size: inherit;
    font-weight: 500;
  }
  .item {
    display: flex;
    flex-direction: column;
    padding: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  .item:hover {
    background-color: var(--secondary-background-color);
  }
  .summary {
    font-size: 1.1em;
    padding-left: 8px;
  }
  .summary.completed {
    text-decoration: line-through;
    color: var(--secondary-text-color);
  }
  .details {
    font-size: 0.9em;
    color: var(--primary-text-color);
    padding-left: 8px;
  }
  .details.completed {
    color: var(--secondary-text-color);
  }
  .due-date {
    font-size: 0.9em;
    color: var(--secondary-text-color);
    padding-left: 8px;
  }
  .due-date.needs_action {
    color: var(--accent-color);
  }
  .icon {
    --mdc-icon-size: 14px;
    margin-right: 6px;
    color: var(--secondary-text-color);
  }
  .largeIcon {
    --mdc-icon-size: 24px;
    margin-right: 6px;
    color: var(--secondary-text-color);
  }
  .largeIcon.needs_action {
    color: var(--primary-text-color);
  }
`;
