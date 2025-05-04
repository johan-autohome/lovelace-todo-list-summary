import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import marked from 'marked';
import { styles } from './editor.styles';
import { Config, emptyConfig } from './types';

const example = `
\`\`\`yaml
type: custom:todo-list-summary-card
entity: todo.shopping_list
icon: mdi:check-circle-outline,
header: Title // Optional str
sort: due // optional 'name' | 'due'
asc: true // optional bool, default true
grid_options:
  columns: 12
  rows: 16
\`\`\`
`;

@customElement('todo-list-summary-card-editor')
export class TodoListSummaryCardScriptEditor extends LitElement {
  @property() _config: Config = emptyConfig;

  setConfig(config: Config) {
    this._config = config;
  }

  static get styles(): CSSResult {
    return styles;
  }

  private renderMarkdown(md: string) {
    return html`<div class="markdown" .innerHTML=${marked.parse(md)}></div>`;
  }

  protected render(): TemplateResult {
    return html`
    <form class="table">
        <div class="row">
            <label class="label cell" for="entity">Entity:</label>
            <input
                @change="${this.handleChangedEvent}"
                class="value cell" id="entity" value="${this._config.entity}"></input>
        </div>
        <div class="row">
            <label class="label cell" for="entity">Header:</label>
            <input
                @change="${this.handleChangedEvent}"
                class="value cell" id="header" value="${this._config.header}"></input>
        </div>
        <div class="row">Example
        <div>${this.renderMarkdown(example)}</div>
        </div>
    </form>
    `;
  }

  handleChangedEvent(changedEvent: Event) {
    const target = changedEvent.target as HTMLInputElement;
    // this._config is readonly, copy needed
    const newConfig = Object.assign({}, this._config);
    if (target.id == 'header') {
      newConfig.header = target.value;
    } else if (target.id == 'entity') {
      newConfig.entity = target.value;
    }
    const messageEvent = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(messageEvent);
  }
}
