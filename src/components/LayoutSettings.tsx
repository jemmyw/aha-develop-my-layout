import { debounce } from "lodash";
import React from "react";
import { RecoilState, useRecoilState } from "recoil";
import {
  addExtensionsState,
  lowerAttributesState,
  raiseAttributesState,
  removeAttributesState,
} from "../store/settings";

const ArraySetting = ({
  label,
  state,
}: {
  label: string;
  state: RecoilState<string[]>;
}) => {
  const [attribute, setAttribute] = useRecoilState(state);
  const list = attribute.join("\n");

  const debouncedSetter = debounce(setAttribute, 250);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const list = event.target.value
      .split("\n")
      .map((v) => v.replace("\n", ""))
      .filter((v) => v.length > 0);
    debouncedSetter(list);
  };

  return (
    <div>
      <div>{label}</div>
      <textarea value={list} onChange={handleChange} />
    </div>
  );
};

export const LayoutSettings = () => {
  return (
    <div>
      <ArraySetting label="Fields to remove" state={removeAttributesState} />
      <ArraySetting label="Fields to raise" state={raiseAttributesState} />
      <ArraySetting label="Fields to lower" state={lowerAttributesState} />
      <ArraySetting label="Extensions to add" state={addExtensionsState} />
    </div>
  );
};
