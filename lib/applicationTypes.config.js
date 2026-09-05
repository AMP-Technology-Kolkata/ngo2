// lib/applicationTypes.config.js

export const APPLICATION_CONFIGS = {
  "character-certificate": {
    applicationType: "character",
    heading: "Apply for Character Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "residential-certificate": {
    applicationType: "residential",
    heading: "Apply for Residential Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "income-certificate": {
    applicationType: "income",
    heading: "Apply for Income Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "unemployment-certificate": {
    applicationType: "unemployment",
    heading: "Apply for Unemployment Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "caste-certificate": {
    applicationType: "caste",
    heading: "Apply for Caste Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "unmarried-certificate": {
    applicationType: "unmarried",
    heading: "Apply for Unmarried Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "bpl-certificate": {
    applicationType: "bpl",
    heading: "Apply for BPL Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "jsy-certificate": {
    applicationType: "jsy",
    heading: "Apply for JSY Certificate",
    component: "general",
    endpoint: "save_application",
  },
  "ews-certificate": {
    applicationType: "ews",
    heading: "Apply for EWS Certificate",
    component: "general",
    endpoint: "save_application",
  },

  // ---------------- New certificate types (separate forms) ----------------
  "land-noc": {
    applicationType: "land_noc",
    heading: "Apply for Land NOC",
    component: "land_noc",
    endpoint: "save_land_noc",
  },
  "burning-certificate": {
    applicationType: "burning",
    heading: "Apply for Burning / Burial Certificate",
    component: "burning",
    endpoint: "save_burning",
  },
};

export function getApplicationConfig(slug) {
  return APPLICATION_CONFIGS[slug] || null;
}