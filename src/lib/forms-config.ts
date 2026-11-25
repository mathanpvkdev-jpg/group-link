/**
 * Universal Forms Configuration
 *
 * Currently set to native website direct submission (no login required, instant auto-publish).
 * Set ENABLE_GOOGLE_FORMS = true later when you want to switch back to external Google Forms.
 */

export const ENABLE_GOOGLE_FORMS = false;

export const FORMS_CONFIG = {
  // Social Media Group Directory Submission (WhatsApp / Telegram / Arattai / Instagram)
  submitGroup: {
    localPath: '/submit-group',
    shortUrl: 'https://forms.gle/oZzitWMZ8xtB9rmx5',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfSQfwEK0ui8gYez8o7WIlASQ4ZxMwfI8oCZZolcH61ePE1Rg/viewform?embedded=true',
    title: 'Social Media Group Directory Submission',
    description: 'Submit your group or channel directly to our directory without login.',
  },

  // Business Registration Form (Nammabus Local Business Directory: ₹0 Free Merchant Listing)
  registerBusiness: {
    localPath: '/local-biz/add-business',
    shortUrl: 'https://forms.gle/FVQVofUVejQ2ebiA7',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdss74aRQE4ee65YfpPs7sGYH-UKdAxSp-q-556dJnhXwIl8w/viewform?embedded=true',
    title: 'Business Registration Form',
    description: 'Register your local business, technician services, or retail store directly without login.',
  },
} as const;

export const SUBMIT_GROUP_URL = ENABLE_GOOGLE_FORMS
  ? FORMS_CONFIG.submitGroup.shortUrl
  : FORMS_CONFIG.submitGroup.localPath;
export const SUBMIT_GROUP_EMBED_URL = FORMS_CONFIG.submitGroup.embedUrl;

export const REGISTER_BUSINESS_URL = ENABLE_GOOGLE_FORMS
  ? FORMS_CONFIG.registerBusiness.shortUrl
  : FORMS_CONFIG.registerBusiness.localPath;
export const REGISTER_BUSINESS_EMBED_URL = FORMS_CONFIG.registerBusiness.embedUrl;
