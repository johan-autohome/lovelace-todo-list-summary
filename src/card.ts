/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HomeAssistant, LovelaceCard } from 'custom-card-helpers';
import { HassEntity, HassServiceTarget } from 'home-assistant-js-websocket';
import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './card.styles';
import { Config, emptyConfig, exampleConfig, sort as sortItems, TodoItem as TodoItem } from './types';
import { relativeTime } from 'custom-card-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@customElement('todo-list-summary-card')
class TodoListSummaryCard extends LitElement {
  @property() private _hass?: HomeAssistant;
  @property() private _config: Config = emptyConfig;
  @property() private _state?: HassEntity;

  @state() private _entity: string = 'entity';
  @state() private _name: string = 'name';
  @state() private _header: string | undefined;
  @state() private _items: TodoItem[] = [];

  private _fetched = false;
  private _last_changed = '';
  private _version = '0.1.3';

  private get _doIHaveEverything(): boolean {
    return !!this._hass && !!this._config && !!this._entity;
  }

  // Called on startup
  async connectedCallback() {
    super.connectedCallback();
    await this.fetchItems();
  }
  // Called often when states change
  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._setup();

    if (!this._fetched && this._state) {
      this.fetchItems();
    }
  }

  // Called rarely when the use updated the config
  public setConfig(config: Config) {
    if (!config?.entity) {
      throw new Error('You need to define an entity');
    }
    if (config.entity.split('.')[0] !== 'todo') {
      throw new Error('You need to define a todo entity');
    }
    this._config = config;
    this._entity = config.entity;
    this._setup();
    this._fetched = false;
  }

  // Fetch the items for this list
  async fetchItems() {
    if (!this._doIHaveEverything) {
      this._items = [];
      return;
    }
    const items = await this._hass!.connection.sendMessagePromise<any>({
      type: 'call_service',
      domain: 'todo',
      service: 'get_items',
      target: {
        entity_id: this._entity,
      },
      return_response: true,
    });

    const todoItems: TodoItem[] = items.response[this._entity]?.items ?? [];
    this._items = this._config!.sort ? sortItems(todoItems, this._config!.sort, this._config!.asc) : todoItems;

    this._fetched = true;
    if (this._state) {
      this._last_changed = this._state.last_changed;
    }
  }

  // Toggle the status of an item
  async toggleItem(item: TodoItem) {
    if (!this._doIHaveEverything) {
      return;
    }
    const newStatus = item.status === 'completed' ? 'needs_action' : 'completed';
    const target: HassServiceTarget = { entity_id: this._entity };
    const data = {
      item: item.uid,
      status: newStatus,
    };
    await this._hass!.callService('todo', 'update_item', data, target);
    this.fetchItems();
  }

  protected render(): TemplateResult | void {
    if (!this._doIHaveEverything) return html`Setup uncomplete`;
    this._state = this._entity ? this._hass!.states[this._entity] : undefined;
    try {
      if (this._config!.debug) {
        return this.debugHtml();
      }
      return this.listHtml();
    } catch (e: any) {
      if (e.stack) console.error(e.stack);
      else console.error(e);
      const errorCard = document.createElement('hui-error-card') as LovelaceCard;
      errorCard.setConfig({
        type: 'error',
        error: e.toString(),
        origConfig: this._config,
      });
      return html` ${errorCard} `;
    }
  }

  private listHtml() {
    return html`
      <ha-card header="${this._header}">
        ${this._items.map((item) => {
          const due_date = item.due_date ?? item.due_datetime;
          const due_relative = due_date ? relativeTime(new Date(due_date), this._hass!.locale) : '';
          const status = item.status !== 'completed' && due_date && new Date(due_date) > new Date() ? '' : item.status;
          return html`
            <div class="item" @click="${() => this.toggleItem(item)}">
              <div class="summary ${status}">
                ${this._config!.icon
                  ? html` <ha-icon icon="${this._config!.icon}" class="largeIcon ${status}"></ha-icon>`
                  : ''}${item.summary}
              </div>
              ${item.description ? html`<div class="details ${status}">${item.description}</div>` : ''}
              ${due_date
                ? html`
                    <div class="due-date ${status} ">
                      <ha-icon viewBox="0 0 16 16" icon="mdi:clock-outline" class="icon"></ha-icon>${due_relative}
                    </div>
                  `
                : ''}
            </div>
          `;
        })}
      </ha-card>
    `;
  }

  private debugHtml() {
    const c = JSON.stringify(this._config, null, 2);
    const s = JSON.stringify(this._state, null, 2);
    const i = JSON.stringify(this._items, null, 2);
    return html` <ha-card header="${'Debug'} ${this._name}">
        Name: ${this._name ?? ''}<br />
        Entity: ${this._entity ?? ''}<br />
        State: ${this._state?.state}<br /><br />
        Config: ${c ?? ''}<br /><br />
        State: ${s ?? ''}<br /><br />
        Items: ${i ?? ''}<br /><br />
      </ha-card>
      ${this._version}`;
  }

  // Editor
  static getStubConfig() {
    return exampleConfig;
  }

  // Editor
  static getConfigElement() {
    return document.createElement('todo-list-summary-card-editor');
  }

  // Complete setup if we have a state
  private _setup() {
    if (!this._doIHaveEverything) {
      return;
    }

    this._state = this._entity ? this._hass!.states[this._entity] : undefined;
    if (this._state && this._state.last_changed !== this._last_changed) {
      const friendlyName = this._state.attributes.friendly_name;
      const header = this._config!.header;
      this._name = friendlyName ?? this._entity;
      this._header = header;
      this._fetched = false;
    }
  }

  static get styles(): CSSResult {
    return styles;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns in masonry view
  getCardSize() {
    return 16;
  }
  // The rules for sizing your card in the grid in sections view
  getGridOptions() {
    return {
      rows: 16,
      columns: 12,
      min_columns: 3,
      max_columns: 12,
      min_rows: 3,
      max_rows: 24,
    };
  }
}

export default TodoListSummaryCard;
