export const normalizeDomain = (domain: string): string =>
  domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

export const findMatchingScan = <T extends { domain: string }>(
  domain: string,
  scans: readonly T[]
): T | undefined => {
  const normalizedDomain = normalizeDomain(domain);
  return scans.find(scan => normalizeDomain(scan.domain) === normalizedDomain);
};
