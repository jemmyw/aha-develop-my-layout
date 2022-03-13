import React from "react";
import { IDENTIFIER } from "../extension";
import { keyBy, mapValues, flow } from "lodash";

aha.on(
  "myLayoutField",
  ({ record, fields, onUnmounted }, { identifier, settings }) => {
    return <></>;
  }
);

const getFields = async () => {
  const fields = await aha.user.getExtensionFields(IDENTIFIER);
  return fields as Aha.ExtensionField[];
};

const mapFields = (fields: Aha.ExtensionField[]) => {
  return (fields = flow([
    (fields) => keyBy(fields, "name"),
    (fields) => mapValues(fields, "value"),
  ])(fields)) as Record<string, any>;
};

const getDrawer = () => document.querySelector(".drawer");

const customizeDrawer = () => {};

interface ExtensionDetails {
  identifier: string;
}

const createExtensionField = async (
  details: ExtensionDetails,
  table: Element
) => {
  const reactiveNode = getDrawer().querySelector("[data-reactive-record]");
  const reactiveRecord = reactiveNode.getAttribute("data-reactive-record");
  const record = new aha.models[reactiveRecord.split("-")[0]]({
    id: reactiveRecord.split("-")[1],
  });
  const fields = mapFields(
    await record.getExtensionFields(
      details.identifier.split(".").slice(0, 1).join(".")
    )
  );

  const contributions = await aha.models.ExtensionContribution.select(
    "id",
    "name",
    "identifier"
  )
    .merge({ extension: ["id", "identifier"] })
    .where({ identifier: details.identifier })
    .all();
  const contribution = contributions[0];

  const combNode = document.createElement("div");
  combNode.classList.add("attribute__row", "attribute__row--editable");
  combNode.setAttribute("data-attributes-row-visible", "true");
  const titleNode = combNode.appendChild(document.createElement("div"));
  titleNode.classList.add("attribute__title");
  titleNode.innerHTML = `
            <div class="attribute__title-background"></div>
            <span class="attribute__name">
              <span class="attribute__name--inner">${contribution.name}</span>
            </span>
          `;
  const valueNode = combNode.appendChild(document.createElement("div"));
  valueNode
    .appendChild(document.createElement("div"))
    .classList.add("attribute__value-background");
  const containerNode = valueNode.appendChild(document.createElement("div"));
  containerNode.classList.add("attribute__value-container");
  const inputNode = containerNode.appendChild(document.createElement("div"));
  inputNode.classList.add("attribute__value-input");

  const extensionNode = document.createElement("extension-component");
  extensionNode.setAttribute(
    "data-extension-identifier",
    contribution.extension.identifier
  );
  extensionNode.setAttribute("data-extension-name", contribution.name);
  extensionNode.setAttribute("data-extension-id", contribution.extension.id);
  extensionNode.setAttribute("data-export-name", contribution.identifier);
  extensionNode.setAttribute("data-extension-fields", JSON.stringify(fields));
  extensionNode.setAttribute("data-record-id", reactiveRecord.split("-")[1]);
  extensionNode.setAttribute("data-record-type", reactiveRecord.split("-")[0]);
  extensionNode.setAttribute(
    "data-record-reference-num",
    document.querySelector(".drawer .record-reference-pill__identifier")
      ?.textContent
  );
  inputNode.appendChild(extensionNode);
  table.prepend(combNode);
};

const drawerChange = (mutations: MutationRecord[]) => {
  const removeAttributes = fields.removeAttributes || [];
  const raiseAttributes = fields.raiseAttributes || [];
  const addExtensions = fields.addExtensions || [];

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.classList.contains("tab__container")) {
          const table = node.querySelector(".attribute__table");
          if (!table) return;

          node.querySelectorAll(".attribute__row").forEach((row) => {
            const title = row.querySelector(
              ".attribute__name--inner"
            )?.textContent;

            if (removeAttributes.includes(title)) {
              row.remove();
            } else if (raiseAttributes.includes(title)) {
              table.prepend(row);
            }
          });

          addExtensions.forEach((identifier) => {
            createExtensionField({ identifier }, table);
          });
        }
      }
    });
  });

  const drawer = getDrawer();
  if (drawer.classList.contains("in")) {
    customizeDrawer();
  } else {
    console.log("drawer closed");
  }
};

let drawerMutation = new MutationObserver(drawerChange);
let fields = {} as {
  removeAttributes: string[];
  raiseAttributes: string[];
  addExtensions: string[];
};

const initialize = async () => {
  if (window.drawerMutation) {
    window.drawerMutation.disconnect();
  }
  window.drawerMutation = drawerMutation;
  drawerMutation.disconnect();

  fields = mapFields(await getFields());

  const drawer = getDrawer();
  if (drawer) {
    // drawerMutation.observe(drawer, { attributeFilter: ["class"] });
    drawerMutation.observe(drawer, {
      childList: true,
      subtree: true,
    });
  }
};

aha.on({ event: "aha.extensions.ready" }, () => {
  initialize();
});
aha.on({ event: "aha.extensions.reloaded" }, () => {
  initialize();
});
