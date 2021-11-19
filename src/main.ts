import pjson from "../package.json";

class HuiElement extends HTMLElement {
  element;
  _hass;
  _shadowRoot;
  updateComplete;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    let resolver;
    this.updateComplete = new Promise((resolve) => (resolver = resolve));
    this.updateComplete.resolver = resolver;
  }

  async setConfig(config) {
    const conf = JSON.parse(JSON.stringify(config));
    const helpers = await (window as any).loadCardHelpers();

    let type;
    if (conf.card_type !== undefined) type = "card";
    if (conf.element_type !== undefined) type = type ? "multiple" : "element";
    if (conf.row_type !== undefined) type = type ? "multiple" : "row";

    if (this.element) this._shadowRoot.removeChild(this.element);
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
        this.applyStyle(this.element, "element", conf);
        break;

      case "row":
        conf.type = conf.row_type;
        if (conf.type === "default") conf.type = undefined;
        delete conf.row_type;
        this.element = await helpers.createRowElement(conf);
        this.applyStyle(this.element, "row", conf);
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

    this._shadowRoot.appendChild(this.element);
    this.element.hass = this._hass;
    if (this.element.updateComplete) await this.element.updateComplete;
    this.updateComplete.resolver();
  }

  async applyStyle(el, type, config) {
    if (config.card_mod === undefined) return;
    await customElements.whenDefined("card-mod");
    (customElements.get("card-mod") as any).applyToElement(
      el,
      type,
      config.card_mod ? config.card_mod.style : config.style,
      { config }
    );
  }

  set hass(hass) {
    this._hass = hass;
    if (this.element) this.element.hass = hass;
  }

  get modElement() {
    return this.element;
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
