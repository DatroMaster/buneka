const CONTACT_PHONE_INTL = "905464526152";

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

export function callLink() {
  return `tel:+${CONTACT_PHONE_INTL}`;
}
