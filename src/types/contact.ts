/** Supported link types for a contact detail value. */
export type ContactLinkType = 'email' | 'phone' | 'none';

/** A single labeled contact detail row within a section. */
export interface ContactDetailItem {
  id: string;
  labelKey?: string;
  valueKey: string;
  linkType: ContactLinkType;
}

/** A grouped block of contact information on the Contact page. */
export interface ContactSection {
  id: string;
  titleKey: string;
  items: ContactDetailItem[];
}
