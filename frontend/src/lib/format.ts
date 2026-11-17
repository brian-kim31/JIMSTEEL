const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export const formatPrice = (value: string | number) => gbp.format(Number(value));

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
