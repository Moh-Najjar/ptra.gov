import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import type { SvgIconComponent } from '@mui/icons-material';

export interface SocialLink {
  id: 'youtube' | 'whatsapp' | 'x' | 'facebook';
  label: string;
  href: string;
  Icon: SvgIconComponent;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UC4x80a6SbSG7IzCC-IRT0FA',
    Icon: YouTubeIcon,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send/?phone=962780349516&text&type=phone_number&app_absent=0',
    Icon: WhatsAppIcon,
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/JC_Department',
    Icon: XIcon,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://web.facebook.com/JordanCustomsOfficial#',
    Icon: FacebookIcon,
  },
];
