/**
 * Good Luck Nut Bolt Corporation (GLNBC)
 * Single Source of Truth: Industrial Product Categories
 * Grounded in Owner Guidelines:
 * - "Cable Management" includes Z-Channel, C-Channel, C-Patti, Z-Patti, and Cable Trays
 * - "Fasteners" includes all Bolts, Studs, Anchors, Foundation Bolts, Screws, and Fixings
 * - Rawl Bolt and Rawl Anchor are unified as the same product
 */

const GLNBC_CATEGORIES = [
  {
    id: "u-bolts-clamps",
    slug: "u-bolts-clamps",
    name: "U-Bolts & Clamps",
    tagline: "Flagship Specialist Products",
    description: "Standard round/square bend U-bolts, single & double pipe clamps, double-wire hose clamps, rubber acoustic clamps, and PP hydraulic clamps.",
    icon: "circle-dot",
    featured: true
  },
  {
    id: "fasteners",
    slug: "fasteners",
    name: "Fasteners & Fixings",
    tagline: "High-Strength Bolts, Studs, Anchors & Screws",
    description: "High-tensile hex bolts, B7 studs, wedge & pin-type anchors, rawl bolts/anchors, bullet fasteners, foundation bolts, T-bolts, CSK bolts, Allen cap bolts, and cement nails.",
    icon: "shield",
    featured: true
  },
  {
    id: "nuts",
    slug: "nuts",
    name: "Industrial Nuts",
    tagline: "Heavy Hex, Nylock, Wing & Specialty Nuts",
    description: "2H Heavy Hex Nuts, Standard Hex Nuts, Wing/Butterfly Nuts, Eye Nuts, Long Coupling Nuts, Cage Nuts, and Strut Channel Spring Nuts.",
    icon: "hexagon",
    featured: true
  },
  {
    id: "washers",
    slug: "washers",
    name: "Washers & Gaskets",
    tagline: "Sealing, Load Distribution & Locking",
    description: "Bitumen (Dambar) waterproofing washers, Plain/Flat washers, Spring washers, Rip-Lock washers, and Galvanized Umbrella washers.",
    icon: "disc",
    featured: true
  },
  {
    id: "hooks-brackets",
    slug: "hooks-brackets",
    name: "Hooks & Mounting",
    tagline: "Piping & Structural Hanging Hardware",
    description: "Threaded Pipe Hooks, J-Hooks, L-Hooks, Screw Hooks, and Heavy-Duty Structural Wall Brackets.",
    icon: "corner-up-right",
    featured: true
  },
  {
    id: "cable-management",
    slug: "cable-management",
    name: "Cable Management & Channels",
    tagline: "Trays, C-Channels & Z-Patti Supports",
    description: "Perforated cable trays, Channel trays, C-Channel brackets (C Patti), Z-Brackets (Z Patti), and strut channel framing accessories.",
    icon: "layers",
    featured: true
  },
  {
    id: "screws",
    slug: "screws",
    name: "Industrial Screws",
    tagline: "Self-Drilling & Precision Machine Screws",
    description: "Self-drilling screws (SDS), Button head socket screws, and Countersunk (CSK) machine screws.",
    icon: "crosshair",
    featured: false
  },
  {
    id: "branded-hardware",
    slug: "branded-hardware",
    name: "Branded Fasteners & Couplers",
    tagline: "Trading Lines & Structural Couplers",
    description: "Branded anchors (Hilti, Fischer, TVS, Unbrako) and heavy-duty scaffolding forged & sheet couplers.",
    icon: "box",
    featured: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GLNBC_CATEGORIES };
}
