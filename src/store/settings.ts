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

export const removeAttributesState = atom<string[]>({
  key: "removeAttributesState",
  default: [],
  effects: [fieldEffect("removeAttributes", [])],
});

export const raiseAttributesState = atom<string[]>({
  key: "raiseAttributesState",
  default: [],
  effects: [fieldEffect("raiseAttributes", [])],
});

export const addExtensionsState = atom<string[]>({
  key: "addExtensionsState",
  default: [],
  effects: [fieldEffect("addExtensions", [])],
});
