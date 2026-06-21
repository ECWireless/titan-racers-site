"use client";

import { useEffect, useRef } from "react";

type AutoConfirmSubscriptionProps = {
  token: string;
};

export function AutoConfirmSubscription({ token }: AutoConfirmSubscriptionProps) {
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (hasConfirmedRef.current) {
      return;
    }

    hasConfirmedRef.current = true;

    async function confirm() {
      try {
        const response = await fetch("/api/subscribe/confirm", {
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        window.location.replace(
          `/subscribe/confirm?result=${response.ok ? "success" : "error"}`,
        );
      } catch {
        window.location.replace("/subscribe/confirm?result=error");
      }
    }

    void confirm();
  }, [token]);

  return null;
}
