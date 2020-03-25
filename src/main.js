import { LitElement, html } from "card-tools/src/lit-element";
import { createCard, createElement, createEntityRow } from "card-tools/src/lovelace-element";

class HuiElement extends LitElement {

  setConfig(config) {
    const conf = JSON.parse(JSON.stringify(config));
    const type = conf.card_type !== undefined
      ? "card"
      : conf.element_type !== undefined
        ? "element"
        : conf.row_type !== undefined
          ? "row"
          : "unknown";
    switch (type) {
      case "card":
        conf.type = conf.card_type;
        delete conf.card_type;
        this.element = createCard(conf);
        break;
      case "element":
        conf.type = conf.element_type;
        delete conf.element_type;
        this.element = createElement(conf);
        break;
      case "row":
        conf.type = conf.row_type;
        delete conf.row_type;
        this.element = createEntityRow(conf);
        break;
      default:
        this.element = createCard({
          type: "error",
          error: "Must specify card_type, element_type or row_type.",
          origConfig: conf
        });
    }
  }

  set hass(hass) {
    this.element.hass = hass;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`${this.element}`;
  }

}

if(!customElements.get("hui-element")) {
  customElements.define("hui-element", HuiElement);
  const pjson = require('../package.json');
  console.info(`%cHUI-ELEMENT ${pjson.version} IS INSTALLED`,
  "color: green; font-weight: bold",
  "");
}
