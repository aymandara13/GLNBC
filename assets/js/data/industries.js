/**
 * Good Luck Nut Bolt Corporation (GLNBC)
 * Single Source of Truth: Applications & Industries Served
 */

const GLNBC_INDUSTRIES = [
  {
    id: "construction-infra",
    name: "Construction & Infrastructure",
    tagline: "Heavy Structural Bolting & Foundation Anchors",
    description: "High-integrity foundation bolts, anchor fasteners, and structural Grade 8.8/10.9 hex bolts for commercial high-rises, bridges, pre-engineered buildings (PEBs), and infrastructure projects.",
    keyProducts: ["Foundation Bolts", "Anchor Fasteners", "Hex Bolts", "Rawl Bolt Fasteners", "Wall Brackets"],
    icon: "building"
  },
  {
    id: "piping-plumbing",
    name: "Plumbing, Piping & Chemical Process",
    tagline: "Rigid Pipe Clamps, U-Bolts & Flange Hardware",
    description: "Specialized U-bolts, two-bolt pipe clamps, EPDM rubber-lined acoustic clamps, and ASTM A193 B7 / A194 2H stud bolting for high-pressure process pipelines, steam headers, and fire sprinkler systems.",
    keyProducts: ["U-Bolts", "Pipe Clamps", "Rubber Pipe Clamps", "Hi-Tech Clamps", "Studs & Threaded Products", "2H Heavy Hex Nuts"],
    icon: "git-commit"
  },
  {
    id: "fabrication-engineering",
    name: "Heavy Fabrication & Engineering",
    tagline: "Custom Dimensions, Threading & High-Tensile Fasteners",
    description: "Precision-machined fasteners, custom length studs, Allen cap screws, and heavy hex nuts supplied to customer fabrication drawings and exact metallurgical specifications.",
    keyProducts: ["Allen Cap Bolts", "Studs & Threaded Products", "Long Nuts", "Countersunk Bolts", "Eye Bolts"],
    icon: "wrench"
  },
  {
    id: "electrical-cable",
    name: "Electrical, Solar & Cable Management",
    tagline: "Strut Channels, Cable Trays & Framing Brackets",
    description: "Perforated cable trays, C-channel brackets (C Patti), spring channel nuts, and offset Z-brackets engineered for electrical distribution grids, solar module roof mounting, and control rooms.",
    keyProducts: ["Perforated Cable Trays", "C-Channel Brackets / C Patti", "Strut Channel Spring Nuts", "Z-Brackets", "Cage Nuts"],
    icon: "zap"
  },
  {
    id: "hvac-mechanical",
    name: "HVAC & Mechanical Installations",
    tagline: "Vibration Damping, Duct Hangers & Clamps",
    description: "Acoustic rubber pipe clamps, threaded rod suspensions, beam clamps, and self-drilling screws for commercial ventilation ducting, chilled water loops, and air handling equipment.",
    keyProducts: ["Rubber Pipe Clamps", "Beam Clamps", "Self-Drilling Screws", "Studs & Threaded Products", "Mounting Clips / Clamps"],
    icon: "wind"
  },
  {
    id: "manufacturing-machinery",
    name: "Industrial Manufacturing & Machinery",
    tagline: "Precision Socket Screws & Vibration-Resistant Nuts",
    description: "Grade 10.9 and 12.9 socket head fasteners, button head screws, prevailing torque lock nuts, and custom machined components for heavy machinery, pumps, valves, and machine tools.",
    keyProducts: ["Allen Cap Bolts", "Button Head Screws", "Lock Nuts", "2H Heavy Hex Nuts", "Rip-Lock Washers"],
    icon: "cpu"
  },
  {
    id: "automotive-transport",
    name: "Automotive & Transportation",
    tagline: "Chassis U-Bolts, High-Tensile Fasteners & Clips",
    description: "Heavy chassis U-bolts, leaf spring clamping bolts, hose clips, and specialized vibration-proof fasteners for commercial vehicles, trailers, material handling, and railway maintenance.",
    keyProducts: ["U-Bolts", "Hose Clips", "High Tensile Hex Bolts", "Lock Nuts", "Wire Rope Clamps"],
    icon: "truck"
  },
  {
    id: "contractors-maintenance",
    name: "Contractors & Plant Maintenance",
    tagline: "Rapid Supply, Direct Counter Service & Bulk Availability",
    description: "Complete fastener packages for turnkey contractors, shutdown maintenance teams, and plant engineers with direct counter pickup across 3 Mumbai trade branches.",
    keyProducts: ["Hex Bolts", "Standard Hex Nuts", "Self-Drilling Screws", "Bitumen Washers", "Anchor Fasteners"],
    icon: "check-circle"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GLNBC_INDUSTRIES };
}
