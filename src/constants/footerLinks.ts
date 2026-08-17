import { partnerLogoImages } from '../assets/images';
import { ROUTES } from '../app/routes/paths';
import type { FooterLinkGroup, PartnerLogo } from '../types/navigation';

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    titleKey: 'footer.importantLinks',
    links: [
      {
        labelKey: 'footer.tradeFacilitationPortal',
        href: 'https://tradeportal.customs.gov.jo/',
        external: true,
      },
      {
        labelKey: 'footer.eGovernment',
        href: 'https://portal.jordan.gov.jo/wps/portal?lang=ar#/',
        external: true,
      },
      { labelKey: 'footer.about', path: ROUTES.ABOUT },
      { labelKey: 'footer.faq', path: ROUTES.FAQ },
    ],
  },
  {
    titleKey: 'footer.usagePolicies',
    links: [
      { labelKey: 'footer.userEvaluation', action: 'survey' },
      { labelKey: 'footer.accessibility', path: ROUTES.ACCESSIBILITY },
      { labelKey: 'footer.privacy', path: ROUTES.PRIVACY },
    ],
  },
];

/** Partner logos grouped by execution, partnership, and funding sections. */
export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    id: 'execution-1',
    labelKey: 'footer.partners.jordanCustoms',
    group: 'execution',
    src: partnerLogoImages.execution1,
  },
  {
    id: 'execution-2',
    labelKey: 'footer.partners.itc',
    group: 'execution',
    src: partnerLogoImages.execution2,
  },
  {
    id: 'partnership-1',
    labelKey: 'footer.partners.modee',
    group: 'partnership',
    src: partnerLogoImages.partnership1,
  },
  {
    id: 'partnership-2',
    labelKey: 'footer.partners.customsDept',
    group: 'partnership',
    src: partnerLogoImages.partnership2,
  },
  {
    id: 'partnership-3',
    labelKey: 'footer.partners.collaboratingPartner',
    group: 'partnership',
    src: partnerLogoImages.partnership3,
  },
  {
    id: 'funded-1',
    labelKey: 'footer.partners.giz',
    group: 'funding',
    src: partnerLogoImages.funded1,
  },
  {
    id: 'funded-2',
    labelKey: 'footer.partners.germanCooperation',
    group: 'funding',
    src: partnerLogoImages.funded2,
  },
];

export const PARTNER_GROUP_LABEL_KEYS = {
  execution: 'footer.execution',
  partnership: 'footer.partnership',
  funding: 'footer.funding',
} as const;

export const POWERED_BY_URL = 'https://datahubanalytics.com/';
