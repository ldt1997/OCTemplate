import { useEffect } from "react";
import {
  getCanonicalUrl,
  getOgImageUrl,
  siteMetadata,
  type SeoMetadata,
} from "@/data/siteMetadata";
import { StructuredData } from "@/components/seo/StructuredData";

type SeoMetaProps = {
  metadata: SeoMetadata;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  structuredDataId?: string;
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
}

export function SeoMeta({
  metadata,
  structuredData,
  structuredDataId,
}: SeoMetaProps) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(metadata);
    const imageUrl = getOgImageUrl(metadata);

    document.title = metadata.title;
    setCanonical(canonicalUrl);

    setMeta("name", "description", metadata.description);
    setMeta("name", "keywords", metadata.keywords?.join(", ") ?? "");
    setMeta("name", "theme-color", siteMetadata.themeColor);

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", siteMetadata.name);
    setMeta("property", "og:locale", siteMetadata.locale);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setMeta("name", "twitter:image", imageUrl);
  }, [metadata]);

  if (!structuredData) {
    return null;
  }

  return (
    <StructuredData
      id={structuredDataId ?? (metadata.path.replace(/\W+/g, "-") || "home")}
      data={structuredData}
    />
  );
}
