import { PaperInputElement } from "@polymer/paper-input/paper-input";
import {
  customElement,
  html,
  LitElement,
  property,
  internalProperty,
  PropertyValues,
  TemplateResult,
} from "lit-element";
import { UNAVAILABLE_STATES } from "../../../data/entity";
import { setValue } from "../../../data/input_text";
import { HomeAssistant } from "../../../types";
import { hasConfigOrEntityChanged } from "../common/has-changed";
import "../components/hui-generic-entity-row";
import { createEntityNotFoundWarning } from "../components/hui-warning";
import { EntityConfig, LovelaceRow } from "./types";

@customElement("hui-input-text-entity-row")
class HuiInputTextEntityRow extends LitElement implements LovelaceRow {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @internalProperty() private _config?: EntityConfig;

  public setConfig(config: EntityConfig): void {
    if (!config) {
      throw new Error("Configuration error");
    }
    this._config = config;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-warning>
          ${createEntityNotFoundWarning(this.hass, this._config.entity)}
        </hui-warning>
      `;
    }

    return html`
      <hui-generic-entity-row .hass=${this.hass} .config=${this._config}>
        <paper-input
          no-label-float
          .disabled=${UNAVAILABLE_STATES.includes(stateObj.state)}
          .value="${stateObj.state}"
          .minlength="${stateObj.attributes.min}"
          .maxlength="${stateObj.attributes.max}"
          .autoValidate="${stateObj.attributes.pattern}"
          .pattern="${stateObj.attributes.pattern}"
          .type="${stateObj.attributes.mode}"
          @change="${this._selectedValueChanged}"
          placeholder="(empty value)"
        ></paper-input>
      </hui-generic-entity-row>
    `;
  }

  private get _inputEl(): PaperInputElement {
    return this.shadowRoot!.querySelector("paper-input") as PaperInputElement;
  }

  private _selectedValueChanged(ev): void {
    const element = this._inputEl;
    const stateObj = this.hass!.states[this._config!.entity];

    if (element.value !== stateObj.state) {
      setValue(this.hass!, stateObj.entity_id, element.value!);
    }

    ev.target.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-input-text-entity-row": HuiInputTextEntityRow;
  }
}