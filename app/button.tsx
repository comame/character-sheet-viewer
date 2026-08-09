import { type ReactNode } from "react";

type buttonKind = "Default" | "Primary" | "Danger" | "Action";

export function Button({
  kind,
  onClick,
  children,
  small = false,
}: {
  kind: buttonKind;
  onClick: () => void;
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <button
      className={`Button ${kind.toLowerCase()} ${small ? "small typography-weak" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
