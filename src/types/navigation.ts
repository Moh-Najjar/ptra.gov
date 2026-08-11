export interface NavChildItem {
  labelKey: string;
  path: string;
}

export interface NavItem {
  labelKey: string;
  path: string;
  children?: NavChildItem[];
}

export interface FooterLink {
  labelKey: string;
  path?: string;
  href?: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  titleKey: string;
  links: FooterLink[];
}

export interface PartnerLogo {
  id: string;
  labelKey: string;
  group: 'execution' | 'partnership' | 'funding';
  src: string;
}

export interface UtilityLink {
  labelKey: string;
  path: string;
}
