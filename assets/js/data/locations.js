/**
 * Good Luck Nut Bolt Corporation (GLNBC)
 * Single Source of Truth: Verified Locations & Branches
 */

const GLNBC_LOCATIONS = [
  {
    id: "main-branch",
    name: "Good Luck Nut Bolt Corporation",
    branchName: "Main Branch",
    type: "branch",
    isMain: true,
    public: true,
    addressLine1: "67 Kumbharwada, Durgadevi St, Chor Bazaar",
    area: "Kamathipura, Mumbai",
    state: "Maharashtra",
    pincode: "400004",
    fullAddress: "67 Kumbharwada, Durgadevi St, Chor Bazaar, Kamathipura, Mumbai, Maharashtra – 400004",
    landmark: "Chor Bazaar / Kamathipura Area",
    phone: ["9821441071", "8828068873"],
    email: "goodlucknutbol@gmail.com",
    mapQuery: "67+Kumbharwada+Durgadevi+St+Chor+Bazaar+Kamathipura+Mumbai+400004",
    highlight: "Primary sales branch and comprehensive fasteners & hardware counter."
  },
  {
    id: "branch-traders",
    name: "Good Luck Traders",
    branchName: "Branch 2 — Nagdevi",
    type: "branch",
    isMain: false,
    public: true,
    addressLine1: "Karani Niwas, Shop No. 3, before 34, Nagdevi St, Ground Floor",
    area: "Masjid Bunder, Mumbai",
    state: "Maharashtra",
    pincode: "400003",
    fullAddress: "Karani Niwas, Shop No. 3, before 34, Nagdevi St, Ground Floor, Masjid Bunder, Mumbai – 400003",
    landmark: "Nagdevi Street hardware market",
    phone: ["9821441071", "8828068873"],
    email: "goodlucknutbol@gmail.com",
    mapQuery: "Karani+Niwas+Shop+No+3+Nagdevi+St+Masjid+Bunder+Mumbai+400003",
    highlight: "Specialized in trade supplies, clamps, U-bolts, and contractor requirements."
  },
  {
    id: "branch-hardware",
    name: "Good Luck Hardware",
    branchName: "Branch 3 — Bibijan Street",
    type: "branch",
    isMain: false,
    public: true,
    addressLine1: "15/17 Bibijan Street, Shop No. 3, Nagdevi",
    area: "Masjid Bunder, Mumbai",
    state: "Maharashtra",
    pincode: "400003",
    fullAddress: "15/17 Bibijan Street, Shop No. 3, Nagdevi, Mumbai – 400003",
    landmark: "Bibijan Street / Nagdevi core market",
    phone: ["9821441071", "8828068873"],
    email: "goodlucknutbol@gmail.com",
    mapQuery: "15+Bibijan+Street+Shop+No+3+Nagdevi+Mumbai+400003",
    highlight: "Counter service for structural fasteners, nuts, bolts, and threaded products."
  },
  // Future-ready storage facilities (addresses omitted as per specification until verified)
  {
    id: "godown-1",
    name: "GLNBC Storage Facility 1",
    branchName: "Central Godown",
    type: "godown",
    isMain: false,
    public: false,
    addressLine1: "",
    area: "Mumbai",
    state: "Maharashtra",
    pincode: "",
    fullAddress: "",
    phone: [],
    email: "",
    highlight: "Bulk inventory & stock staging facility."
  },
  {
    id: "godown-2",
    name: "GLNBC Storage Facility 2",
    branchName: "Secondary Godown",
    type: "godown",
    isMain: false,
    public: false,
    addressLine1: "",
    area: "Mumbai",
    state: "Maharashtra",
    pincode: "",
    phone: [],
    email: "",
    highlight: "Heavy structural fasteners & raw stock facility."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GLNBC_LOCATIONS };
}
