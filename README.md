hui-element
=================

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

The Lovelace interface for Home Assistant has three types of objects, those are:

**Cards**  
Examples include `entities`, `glance`, `vertical-stack`, `gauge`, `media-player`.

**Entity rows**  
The individual rows in an entities card. Examples include `section`, `call-service`, `conditional`, `cast`, but also `sensor-entity`, `toggle-entity`, `climate-entity` and several more that a normal user never have to bother with.

**Elements**  
The elements used in a picture-elements card. Examples include `state-badge`, `state-label`, `image`.

When you select a `type:` for something, what is loaded will depend on where.
E.g. specifying `type: conditional` in a lovelace view or a stack card will load a conditional card, but specifying `type: conditional` in an entities card will load a conditional entity row.

Sometimes you may want to use things in other places, though. That's where `hui-element` comes in.

## Usage

For installation, updating and debugging instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

Let's say you want to use the `section` entity row in place of a card.

Normally, a section row configuration may look like:
```yaml
type: section
label: Important things
```

To make it work as a card, change it to:
```yaml
type: custom:hui-element
row_type: section
label: Important things
```

I.e., change `type:` to `row_type:` and add `type: custom:hui-element`.

`hui-element` will then load the correct row and place it wherever you want it.

Similarly, to put a glance card inside an entities card:
```yaml
type: entities
entities:
  - light.bed_light
  - type: custom:hui-element
    card_type: glance
    entities:
      - light.kitchen_lights
      - light.ceiling_lights
```

![Skärmavbild 2020-03-25 kl  10 55 26](https://user-images.githubusercontent.com/1299821/77524156-2b0af480-6e87-11ea-8718-b89a57d38dc9.png)


> Note: In some cases, the internal types may need to be used.
> I.e. to add a media player row as a card, you'd need to specify `row_type: media-player-entity`.

> Note2: It may also work to set `row_type: default` and hui-element will figure out the correct row type by itself.

The correct types to use can be found in the frontend source code for [cards](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/create-element/create-card-element.ts), [entity-rows](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/create-element/create-row-element.ts) and [elements](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/create-element/create-hui-element.ts).

## FAQ

**Does this replace the `custom:hui-` trick?**  
Yes. That's where the name is from.
The `custom:hui-` trick was always a dirty hack that worked by accident rather than design, and since 0.107 it works intermittently at best.


---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

<!--
```
resources:
  url: /local/hui-element.js
  type: module
```
-->
