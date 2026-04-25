/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { getUser, User } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [setUser]);

  return user;
}
