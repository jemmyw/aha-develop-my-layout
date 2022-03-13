import { debounce } from "lodash";
import React from "react";
import { useRecoilState } from "recoil";
import {
  addExtensionsState,
  raiseAttributesState,
  removeAttributesState,
} from "../store/settings";

export const LayoutSettings = () => {
  const [removeAttributes, setRemoveAttributes] = useRecoilState(
    removeAttributesState
  );
  const [raiseAttributes, setRaiseAttributes] =
    useRecoilState(raiseAttributesState);
  const [addExtensions, setAddExtensions] = useRecoilState(addExtensionsState);

  const setHandler = (setter) => {
    const deSetter = debounce(setter, 1000);
    return (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const list = event.target.value
        .split("\n")
        .map((v) => v.replace("\n", ""))
        .filter((v) => v.length > 0);
      deSetter(list);
    };
  };

  const removeAttributesList = removeAttributes.join("\n");
  const raiseAttributesList = raiseAttributes.join("\n");
  const addExtensionsList = addExtensions.join("\n");

  return (
    <div>
      <div>
        <div>Fields to remove</div>
        <textarea
          value={removeAttributesList}
          onChange={setHandler(setRemoveAttributes)}
        ></textarea>
      </div>
      <div>
        <div>Fields to raise</div>
        <textarea
          value={raiseAttributesList}
          onChange={setHandler(setRaiseAttributes)}
        />
      </div>
      <div>
        <div>Extensions to add</div>
        <textarea
          value={addExtensionsList}
          onChange={setHandler(setAddExtensions)}
        />
      </div>
    </div>
  );
};
