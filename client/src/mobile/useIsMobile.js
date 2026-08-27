import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

function matchesUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|BlackBerry/i.test(
    navigator.userAgent,
  );
}

export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth <= MOBILE_BREAKPOINT || matchesUserAgent()
  );
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(isMobileDevice);

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
