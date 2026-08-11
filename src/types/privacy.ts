/** Unique identifier for a privacy policy section. */
export type PrivacySectionId =
  | 'commitment'
  | 'ipAddresses'
  | 'cookies'
  | 'informationProtection'
  | 'informationSecurity'
  | 'thirdPartyWebsites'
  | 'policyUpdates';

/** Metadata for a titled privacy policy section. */
export interface PrivacySection {
  id: PrivacySectionId;
  titleKey: string;
  bodyKey: string;
}
