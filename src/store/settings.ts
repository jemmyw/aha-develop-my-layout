import { atom, AtomEffect, selector } from "recoil";
import { IDENTIFIER } from "../extension";

const fieldEffect =
  <T>(name: string, defaultValue: T): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    setSelf(
      aha.user
        .getExtensionField(IDENTIFIER, name)
        .then((value) => (value || defaultValue) as T)
    );

    onSet(async (value) => {
      await aha.user.setExtensionField(IDENTIFIER, name, value);
    });
  };

const stringArrayState = (name) =>
  atom<string[]>({
    key: `${name}State`,
    default: [],
    effects: [fieldEffect(name, [])],
  });

export const removeAttributesState = stringArrayState("removeAttributes");
export const raiseAttributesState = stringArrayState("raiseAttributes");
export const addExtensionsState = stringArrayState("addExtensions");
export const lowerAttributesState = stringArrayState("lowerAttributes");
