const STYLE_ID_PREFIX = "uppy-hide-dragover-hint-";
const styleIdForUploader = (uploaderId: string): string => `${STYLE_ID_PREFIX}${uploaderId}`;
const buildStyleContent = (uploaderId: string): string => {
  const selector = `#${CSS.escape(uploaderId)} .uppy-Dashboard-dropFilesHereHint`;
  return `
    ${selector} {
      background-image: none !important;
      padding: 0 !important;
    }
  `;
};

export const acquireHideDragOverHintStyle = (uploaderId: string): void => {
  const styleId = styleIdForUploader(uploaderId);
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = buildStyleContent(uploaderId);
};

export const releaseHideDragOverHintStyle = (uploaderId: string): void => {
  const styleEl = document.getElementById(styleIdForUploader(uploaderId));
  if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl);
};
