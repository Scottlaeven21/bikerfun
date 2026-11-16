const VIN17 = /\b[A-HJ-NPR-Z0-9]{17}\b/g;
const FRAME = /\b[A-Z0-9]{8,17}\b/g;
const LABEL = /(?:VIN|CHASSIS|FRAME|IDENTIFICATIE|VOERTUIGIDENTIFICATIE|WMI)/i;

function scoreCandidate(value: string) {
  const mixed = /[A-Z]/.test(value) && /\d/.test(value);
  let score = value.length;
  if (value.length === 17) score += 20;
  if (mixed) score += 8;
  if (/^[A-HJ-NPR-Z0-9]+$/.test(value)) score += 4;
  return score;
}

export function extractVinFromOcrText(text: string): string | null {
  const cleaned = text
    .toUpperCase()
    .replace(/[IOQ]/g, (char) => (char === 'I' ? '1' : '0'))
    .replace(/[^A-Z0-9\n ]/g, ' ');

  const seventeen = cleaned.match(VIN17) || [];
  if (seventeen.length) {
    return [...seventeen].sort((a, b) => scoreCandidate(b) - scoreCandidate(a))[0];
  }

  const labeledLine = cleaned
    .split('\n')
    .find((line) => LABEL.test(line));
  const labeledMatch = labeledLine?.match(FRAME);
  if (labeledMatch?.length) {
    return [...labeledMatch].sort((a, b) => scoreCandidate(b) - scoreCandidate(a))[0];
  }

  const frames = (cleaned.match(FRAME) || []).filter((value) => /[A-Z]/.test(value) && /\d/.test(value));
  if (!frames.length) return null;
  return [...frames].sort((a, b) => scoreCandidate(b) - scoreCandidate(a))[0];
}
