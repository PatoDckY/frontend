import React, { ReactNode } from "react";
import HeaderClient from "../components/HeaderClient";
import FooterClient from "../components/FooterClient";

type Props = { children: ReactNode };

export default function ClientLayout({ children }: Props) {
  return (
    <div className="client-container">
      <HeaderClient />
      <main>{children}</main>
      <FooterClient />
    </div>
  );
}
