import pjson from "../package.json";

class HuiElement extends HTMLElement {
  element;
  _hass;

  async setConfig(config) {
    const conf = JSON.parse(JSON.stringify(config));
    const helpers = await (window as any).loadCardHelpers();

    let type;
    if (conf.card_type !== undefined) type = "card";
    if (conf.element_type !== undefined) type = type ? "multiple" : "element";
    if (conf.row_type !== undefined) type = type ? "multiple" : "row";

    switch (type) {
      case "card":
        conf.type = conf.card_type;
        delete conf.card_type;
        this.element = await helpers.createCardElement(conf);
        break;

      case "element":
        conf.type = conf.element_type;
        delete conf.element_type;
        this.element = await helpers.createHuiElement(conf);
        break;

      case "row":
        conf.type = conf.row_type;
        if (conf.type === "default") conf.type = undefined;
        delete conf.row_type;
        this.element = await helpers.createRowElement(conf);
        break;

      case "multiple":
        this.element = await helpers.createCardElement({
          type: "error",
          error: "Must specify only one of card_type, element_type or row_type",
          origConfig: conf,
        });
        break;

      default:
        this.element = await helpers.createCardElement({
          type: "error",
          error: "Must specify card_type, element_type or row_type.",
          origConfig: conf,
        });
    }

    while (this.firstChild) this.removeChild(this.firstChild);
    this.appendChild(this.element);
    this.element.hass = this._hass;
  }

  set hass(hass) {
    this._hass = hass;
    if (this.element) this.element.hass = hass;
  }

  get shadowRoot() {
    return this.element?.shadowRoot;
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
