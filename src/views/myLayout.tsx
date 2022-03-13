import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { LayoutSettings } from "../components/LayoutSettings";

const Styles = () => {
  return (
    <style>
      {`
    .title {
      color: var(--aha-green-800);
      font-size: 20px;
      text-align: center;
      margin: 20px;
    }
    `}
    </style>
  );
};

aha.on("myLayout", ({ fields, onUnmounted }, { identifier, settings }) => {
  return (
    <RecoilRoot>
      <Styles />
      <Suspense fallback={<aha-spinner />}>
        <LayoutSettings />
      </Suspense>
    </RecoilRoot>
  );
});
