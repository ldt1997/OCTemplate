import { useEffect } from "react";

type StructuredDataProps = {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function StructuredData({ id, data }: StructuredDataProps) {
  const serializedData = JSON.stringify(data);

  useEffect(() => {
    const scriptId = `seo-json-ld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = serializedData;

    return () => {
      script?.remove();
    };
  }, [id, serializedData]);

  return null;
}

