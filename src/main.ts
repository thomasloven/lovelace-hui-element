import { LitElement, html } from "card-tools/src/lit-element";
import {
  createCard,
  createElement,
  createEntityRow,
} from "card-tools/src/lovelace-element";
import pjson from "../package.json";

class HuiElement extends LitElement {
  element;

  setConfig(config) {
    const conf = JSON.parse(JSON.stringify(config));
    let type;
    if (conf.card_type !== undefined) type = "card";
    if (conf.element_type !== undefined) {
      if (type !== undefined) {
        this.element = createCard({
          type: "error",
          error:
            "Must specify only one of card_type, element_type or row_type.",
          origConfig: conf,
        });
        return;
      }
      type = "element";
    }
    if (conf.row_type !== undefined) {
      if (type !== undefined) {
        this.element = createCard({
          type: "error",
          error:
            "Must specify only one of card_type, element_type or row_type.",
          origConfig: conf,
        });
        return;
      }
      type = "row";
    }
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
        if (conf.type === "default") conf.type = undefined;
        delete conf.row_type;
        this.element = createEntityRow(conf);
        break;
      default:
        this.element = createCard({
          type: "error",
          error: "Must specify card_type, element_type or row_type.",
          origConfig: conf,
        });
    }
  }

  set hass(hass) {
    this.element.hass = hass;
  }

  createRenderRoot() {
    return this;
  }

  get shadowRoot() {
    return this.element.shadowRoot;
  }

  // get modElement() {
  //   return this.element;
  // }

  render() {
    return html`${this.element}`;
  }
}

if (!customElements.get("hui-element")) {
  customElements.define("hui-element", HuiElement as any);
  console.info(
    `%cHUI-ELEMENT ${pjson.version} IS INSTALLED`,
    "color: green; font-weight: bold",
    ""
  );
}
