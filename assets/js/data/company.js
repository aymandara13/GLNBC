/**
 * Good Luck Nut Bolt Corporation (GLNBC)
 * Single Source of Truth: Verified Company Information
 */

const GLNBC_COMPANY = {
  name: "Good Luck Nut Bolt Corporation",
  shortName: "GLNBC",
  established: 1975,
  experienceYears: "50+",
  tagline: "50+ Years of Trust. The Foundation Your Industry Builds On.",
  subtitle: "Suppliers of industrial fasteners, U-Bolts, clamps, nuts, bolts, studs, and custom hardware in Mumbai since 1975.",
  
  contacts: {
    sales: "9821441071",
    salesEnquiry: "8828068873",
    salesFormatted: "+91 98214 41071",
    enquiryFormatted: "+91 88280 68873",
    email: "goodlucknutbol@gmail.com",
    whatsappPrimary: "919821441071",
    whatsappSecondary: "918828068873"
  },
  
  notices: {
    sizeStandard: "Standard & Custom — Available on Request",
    priceDefault: "Price Available on Request",
    priceMarket: "Pricing Subject to Current Market Rates",
    bulkDiscount: "Buying in bulk or paying cash? Let us know — applicable discounts can be discussed.",
    godownTrustNote: "Supported by additional stock and warehouse storage facilities across Mumbai."
  },

  trustPoints: [
    { title: "Established 1975", desc: "Over 50 years of uninterrupted trade & supply in Mumbai." },
    { title: "Standard & Custom", desc: "Custom dimensions, threading, materials, and finishes to order." },
    { title: "3 Mumbai Branches", desc: "Customer-facing trade branches in Kumbharwada and Nagdevi." },
    { title: "Direct Human Sales", desc: "Fast quotes directly from experienced industrial fastener specialists." }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GLNBC_COMPANY };
}
