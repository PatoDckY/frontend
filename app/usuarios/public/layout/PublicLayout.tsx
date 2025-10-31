import React, { ReactNode } from "react";
import HeaderPublico from "../components/HeaderPublico";
import FooterPublico from "../components/FooterPublico";

type Props = { children: ReactNode };

export default function PublicLayout({ children }: Props) {
  return (
    <div className="publico-container">
      <HeaderPublico />
      <main>{children}</main>
      <FooterPublico />
    </div>
  );
}
