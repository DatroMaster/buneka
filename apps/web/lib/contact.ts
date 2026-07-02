export const CONTACT_PHONE_DISPLAY = "+90 546 452 61 52";
export const CONTACT_PHONE_INTL = "905464526152";

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}
