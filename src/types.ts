export interface TodoItem {
  uid: string;
  summary: string;
  status: 'needs_action' | 'completed' | undefined;
  description?: string;
  due_date?: string; // 2024-04-10
  due_datetime?: string; // 2024-04-10 23:00:00
}

/**
 * Sorts a list of todo items based on name or due date, with optional ascending/descending order.
 * Completed items are always sorted after non-completed items.
 *
 * @param items - Array of todo items to sort.
 * @param sort - Criteria to sort by: either 'name' or 'due'.
 * @param ascending - Whether to sort in ascending order (default is true).
 * @returns A new sorted array of TodoItem objects.
 */
export function sort(items: TodoItem[], sort: 'name' | 'due', ascending: boolean = true): TodoItem[] {
  const asc = ascending ? 1 : -1;
  return items.sort((a, b) => {
    if ((a.status ?? 'needs_action') !== (b.status ?? 'needs_action')) {
      return a.status === 'completed' ? 1 : -1;
    }
    switch (sort) {
      case 'name':
        if (a.summary === b.summary) return 0;
        return a.summary > b.summary ? asc : -asc;
      case 'due':
        const a_due = a.due_date ?? a.due_datetime;
        const b_due = b.due_date ?? b.due_datetime;
        if (a_due === b_due) return 0;
        if (a_due === undefined) return -asc;
        if (b_due === undefined) return asc;
        return new Date(a_due) < new Date(b_due) ? -asc : asc;
      default:
        return 0;
    }
  });
}

export interface Config {
  type: 'custom:todo-list-summary-card';
  entity: string; // 'todo.shopping_list',
  header?: string;
  icon?: string; //  'mdi:check-circle-outline',
  sort?: 'due' | 'name';
  asc?: boolean;
  grid_options?: {
    columns: number;
    rows: number;
  };
  debug?: boolean;
}

export const emptyConfig: Config = {
  type: 'custom:todo-list-summary-card',
  entity: 'todo.shopping_list',
  debug: false,
};

export const exampleConfig: Config = {
  type: 'custom:todo-list-summary-card',
  entity: 'todo.shopping_list',
  header: 'To-do List',
  icon: 'mdi:check-circle-outline',
  sort: 'due',
  asc: true,
  grid_options: {
    columns: 12,
    rows: 16,
  },
};
