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

        const result = response.ok
          ? "success"
          : response.status >= 500
            ? "unavailable"
            : "error";

        window.location.replace(
          `/subscribe/confirm?result=${result}`,
        );
      } catch {
        window.location.replace("/subscribe/confirm?result=unavailable");
      }
    }

    void confirm();
  }, [token]);

  return null;
}
