/**
 * Good Luck Nut Bolt Corporation (GLNBC)
 * Single Source of Truth: Industrial Product Categories
 */

const GLNBC_CATEGORIES = [
  {
    id: "u-bolts-clamps",
    slug: "u-bolts-clamps",
    name: "U-Bolts & Clamps",
    tagline: "Flagship Specialist Products",
    description: "Standard and custom U-bolts, pipe support clamps, and heavy mounting hardware.",
    icon: "circle-dot",
    featured: true
  },
  {
    id: "clamps-brackets",
    slug: "clamps-brackets",
    name: "Clamps & Brackets",
    tagline: "Industrial Piping & Structural Clamping",
    description: "Hi-Tech, Rubber, PP, Pipe, Saddle, Beam, Wire, and U-Clamps for industrial installations.",
    icon: "git-commit",
    featured: true
  },
  {
    id: "fasteners",
    slug: "fasteners",
    name: "Fasteners & Bolts",
    tagline: "High-Strength Bolts, Screws & Studs",
    description: "Hex bolts, Allen cap bolts, CSK bolts, Eye bolts, Foundation bolts, and Threaded studs.",
    icon: "shield",
    featured: true
  },
  {
    id: "nuts",
    slug: "nuts",
    name: "Industrial Nuts",
    tagline: "High-Grade & Specialty Nuts",
    description: "2H Heavy Hex Nuts, Long Nuts, Cage Nuts, Lock Nuts, and Strut Channel Spring Nuts.",
    icon: "hexagon",
    featured: true
  },
  {
    id: "anchors",
    slug: "anchors",
    name: "Anchors & Fixings",
    tagline: "Masonry & Concrete Anchoring",
    description: "Pin-Type anchors, Rawl bolt fasteners, and heavy-duty concrete anchor systems.",
    icon: "anchor",
    featured: true
  },
  {
    id: "washers",
    slug: "washers",
    name: "Washers & Gaskets",
    tagline: "Sealing & Load Distribution",
    description: "Bitumen (Dambar) washers, PVC rubber washers, Rip-Lock washers, and Umbrella washers.",
    icon: "disc",
    featured: true
  },
  {
    id: "screws",
    slug: "screws",
    name: "Industrial Screws",
    tagline: "Self-Drilling & Machine Screws",
    description: "Self-drilling screws, Button head screws, and Countersunk (CSK) machine screws.",
    icon: "crosshair",
    featured: true
  },
  {
    id: "hooks-brackets",
    slug: "hooks-brackets",
    name: "Hooks & Brackets",
    tagline: "Mounting & Support Brackets",
    description: "J-Hooks, L-Hooks, Screw Hooks, Heavy Wall Brackets, and Z-Brackets.",
    icon: "corner-up-right",
    featured: true
  },
  {
    id: "cable-management",
    slug: "cable-management",
    name: "Cable Management",
    tagline: "Trays & Electrical Support",
    description: "Perforated cable trays and routing hardware for commercial & industrial power lines.",
    icon: "layers",
    featured: false
  },
  {
    id: "brackets-misc",
    slug: "brackets-misc",
    name: "Brackets & Miscellaneous",
    tagline: "Channel Brackets & Protective Hardware",
    description: "C-Channel Brackets (C Patti) and protective PVC caps for structural ends.",
    icon: "box",
    featured: false
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GLNBC_CATEGORIES };
}
