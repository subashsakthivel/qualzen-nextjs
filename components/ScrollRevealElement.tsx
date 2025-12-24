"use client";
import { useEffect, useRef, useState } from "react";

interface RevealImageProps {
  children: React.ReactNode;
  delay?: number; // seconds
  from?: string;
  to?: string;
  threshold?: number;
}

const ScrollReveal: React.FC<RevealImageProps> = ({
  children,
  delay = 0,
  from,
  to,
  threshold = 0.25,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`
        overflow-hidden m-0
        duration-700 motion-safe:transition-all motion-safe:duration-700  
        ${show ? from : to}
      `}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
