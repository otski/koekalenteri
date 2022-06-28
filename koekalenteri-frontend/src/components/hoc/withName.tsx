/* eslint-disable mobx/missing-observer */
import { ComponentType, FunctionComponent } from "react";

export const withName = <P extends object>(
  Component: ComponentType<P>,
  displayName: string
): FunctionComponent<P> =>
  (props: P) => {
    const Wrap = (props: P) => <Component {...props} />
    Wrap.displayName = displayName;
    return <Wrap {...props} />
  };
