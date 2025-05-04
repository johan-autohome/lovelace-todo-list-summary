import TodoListSummaryCard from './card';
import { TodoListSummaryCardScriptEditor } from './editor';

declare global {
  interface Window {
    customCards: Array<object>;
  }
}

if (!customElements.get('todo-list-summary-card')) {
  console.log('Defining todo-list-summary-card...');
  customElements.define('todo-list-summary-card', TodoListSummaryCard);
}

if (!customElements.get('todo-list-summary-card-editor')) {
  console.log('Defining todo-list-summary-card editor...');
  customElements.define('todo-list-summary-card-editor', TodoListSummaryCardScriptEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'todo-list-summary-card',
  name: 'Todo List summary card',
  preview: true,
  description: 'Summarize a todo-list',
});
