import type { ContactDetailItem, ContactSection } from '../types/contact';

/** Centralized contact sections displayed on the Contact page. */
export const CONTACT_SECTIONS: ContactSection[] = [
  {
    id: 'email',
    titleKey: 'contact.sections.email.title',
    items: [
      {
        id: 'email-main',
        labelKey: 'contact.labels.email',
        valueKey: 'contact.sections.email.value',
        linkType: 'email',
      },
    ],
  },
  {
    id: 'phone',
    titleKey: 'contact.sections.phone.title',
    items: [
      {
        id: 'phone-main',
        labelKey: 'contact.labels.phone',
        valueKey: 'contact.sections.phone.phoneValue',
        linkType: 'phone',
      },
      {
        id: 'fax-main',
        labelKey: 'contact.labels.fax',
        valueKey: 'contact.sections.phone.faxValue',
        linkType: 'none',
      },
    ],
  },
  {
    id: 'complaints',
    titleKey: 'contact.sections.complaints.title',
    items: [
      {
        id: 'complaints-department',
        labelKey: 'contact.labels.complaintsPhones',
        valueKey: 'contact.sections.complaints.departmentPhone',
        linkType: 'phone',
      },
      {
        id: 'complaints-zain',
        labelKey: 'contact.labels.zain',
        valueKey: 'contact.sections.complaints.zainPhone',
        linkType: 'phone',
      },
      {
        id: 'complaints-umniah',
        labelKey: 'contact.labels.umniah',
        valueKey: 'contact.sections.complaints.umniahPhone',
        linkType: 'phone',
      },
      {
        id: 'complaints-hotline',
        labelKey: 'contact.labels.complaintsHotline',
        valueKey: 'contact.sections.complaints.hotline',
        linkType: 'phone',
      },
      {
        id: 'complaints-extensions',
        labelKey: 'contact.labels.extensions',
        valueKey: 'contact.sections.complaints.extensions',
        linkType: 'none',
      },
    ],
  },
  {
    id: 'hours',
    titleKey: 'contact.sections.hours.title',
    items: [
      {
        id: 'hours-value',
        labelKey: 'contact.labels.workingHours',
        valueKey: 'contact.sections.hours.value',
        linkType: 'none',
      },
    ],
  },
  {
    id: 'whatsapp',
    titleKey: 'contact.sections.whatsapp.title',
    items: [
      {
        id: 'whatsapp-number',
        labelKey: 'contact.labels.whatsapp',
        valueKey: 'contact.sections.whatsapp.value',
        linkType: 'phone',
      },
    ],
  },
  {
    id: 'address',
    titleKey: 'contact.sections.address.title',
    items: [
      {
        id: 'address-po-box',
        labelKey: 'contact.labels.poBox',
        valueKey: 'contact.sections.address.poBox',
        linkType: 'none',
      },
      {
        id: 'address-location',
        labelKey: 'contact.labels.address',
        valueKey: 'contact.sections.address.location',
        linkType: 'none',
      },
    ],
  },
];

/** Builds a mailto or tel href from a contact detail value. */
export const getContactHref = (linkType: ContactDetailItem['linkType'], value: string): string | undefined => {
  if (linkType === 'email') {
    return `mailto:${value}`;
  }

  if (linkType === 'phone') {
    const normalizedPhone = value.replace(/[^\d+]/g, '');
    return `tel:${normalizedPhone}`;
  }

  return undefined;
};
