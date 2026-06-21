"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, type ReactNode } from "react";

type EventProperties = Record<string, string | number | boolean>;

export function TrackClick({
  children,
  className,
  eventName,
  href,
  properties,
}: {
  children: ReactNode;
  className?: string;
  eventName: string;
  href: string;
  properties?: EventProperties;
}) {
  return (
    <a
      className={className}
      href={href}
      onClick={() => track(eventName, properties)}
    >
      {children}
    </a>
  );
}

export function TrackSectionView({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: EventProperties;
}) {
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const marker = markerRef.current;

    if (!marker || hasTrackedRef.current) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      hasTrackedRef.current = true;
      track(eventName, properties);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasTrackedRef.current) {
          hasTrackedRef.current = true;
          track(eventName, properties);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(marker);

    return () => observer.disconnect();
  }, [eventName, properties]);

  return <span ref={markerRef} aria-hidden="true" className="sr-only" />;
}

export function TrackOnMount({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: EventProperties;
}) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;
    track(eventName, properties);
  }, [eventName, properties]);

  return null;
}
