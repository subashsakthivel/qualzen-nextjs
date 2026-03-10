"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

type SessionContextType = {
  session: ReturnType<typeof authClient.useSession>["data"];
  isPending: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProviderClientComponent({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession()

  return (
    <SessionContext.Provider value={{ session, isPending }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useAppSession = () => {
  return useContext(SessionContext);
};