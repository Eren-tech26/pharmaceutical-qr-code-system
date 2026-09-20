import QRCode from 'qrcode';
import { DosageFormCategory } from '../types/pharmacy';
import { DOSAGE_FORM_LIST } from '../data/dosageFormsData';

// Build the FIXED URL that opens a specific dosage form's Student Guide tab.
// Scanning this QR (e.g. ?form=TABLETS) redirects the browser to that form's guide.
export function buildFormUrl(form: DosageFormCategory): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://pharma-guide.app/';
  return `${base}?form=${encodeURIComponent(form)}`;
}

export async function generateQrDataUrl(data: string, colorDark = '#166534'): Promise<string> {
  return await QRCode.toDataURL(data, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 600,
    color: {
      dark: colorDark,
      light: '#ffffff'
    }
  });
}

// Read the dosage form from the current URL (?form=TABLETS) when a QR opens the page.
export function getFormFromUrl(): DosageFormCategory | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('form');
  if (!raw) return null;
  const decoded = decodeURIComponent(raw).toUpperCase().trim();
  const direct = DOSAGE_FORM_LIST.find((f) => f === decoded);
  if (direct) return direct;
  const partial = DOSAGE_FORM_LIST.find((f) => decoded.includes(f) || f.includes(decoded));
  return partial || null;
}
