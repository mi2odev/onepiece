import { toPng } from 'html-to-image';

const RENDER_OPTS = { pixelRatio: 2, cacheBust: true, backgroundColor: '#061433' } as const;

async function nodeToBlob(node: HTMLElement): Promise<{ dataUrl: string; blob: Blob }> {
  const dataUrl = await toPng(node, RENDER_OPTS);
  const blob = await (await fetch(dataUrl)).blob();
  return { dataUrl, blob };
}

/** Download a DOM node as a PNG. */
export async function downloadNodeAsPng(node: HTMLElement, filename: string): Promise<void> {
  const { dataUrl } = await nodeToBlob(node);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

interface ShareMeta {
  title: string;
  text: string;
  filename: string;
}

/**
 * Try the native Web Share sheet with the rendered poster image; fall back to a
 * direct download. Returns 'shared' | 'downloaded'.
 */
export async function sharePoster(
  node: HTMLElement,
  meta: ShareMeta,
): Promise<'shared' | 'downloaded'> {
  const { dataUrl, blob } = await nodeToBlob(node);
  const file = new File([blob], meta.filename, { type: 'image/png' });

  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: meta.title, text: meta.text });
      return 'shared';
    } catch {
      /* user cancelled or unsupported → fall back to download */
    }
  }

  const link = document.createElement('a');
  link.download = meta.filename;
  link.href = dataUrl;
  link.click();
  return 'downloaded';
}
