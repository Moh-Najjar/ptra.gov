import type { PrivacySection } from '../types/privacy';

/** Privacy policy sections displayed on the Privacy page. */
export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'commitment',
    titleKey: 'privacy.sections.commitment.title',
    bodyKey: 'privacy.sections.commitment.body',
  },
  {
    id: 'ipAddresses',
    titleKey: 'privacy.sections.ipAddresses.title',
    bodyKey: 'privacy.sections.ipAddresses.body',
  },
  {
    id: 'cookies',
    titleKey: 'privacy.sections.cookies.title',
    bodyKey: 'privacy.sections.cookies.body',
  },
  {
    id: 'informationProtection',
    titleKey: 'privacy.sections.informationProtection.title',
    bodyKey: 'privacy.sections.informationProtection.body',
  },
  {
    id: 'informationSecurity',
    titleKey: 'privacy.sections.informationSecurity.title',
    bodyKey: 'privacy.sections.informationSecurity.body',
  },
  {
    id: 'thirdPartyWebsites',
    titleKey: 'privacy.sections.thirdPartyWebsites.title',
    bodyKey: 'privacy.sections.thirdPartyWebsites.body',
  },
  {
    id: 'policyUpdates',
    titleKey: 'privacy.sections.policyUpdates.title',
    bodyKey: 'privacy.sections.policyUpdates.body',
  },
];
