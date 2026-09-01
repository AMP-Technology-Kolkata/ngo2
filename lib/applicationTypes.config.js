// lib/applicationTypes.config.js

// slug (URL segment) => { applicationType (backend field value), heading (page title) }
export const APPLICATION_CONFIGS = {
  "character-certificate": {
    applicationType: "character",
    heading: "Apply for Character Certificate",
  },
  "residential-certificate": {
    applicationType: "residential",
    heading: "Apply for Residential Certificate",
  },
  "income-certificate": {
    applicationType: "income",
    heading: "Apply for Income Certificate",
  },
  "unemployment-certificate": {
    applicationType: "unemployment",
    heading: "Apply for Unemployment Certificate",
  },
  "caste-certificate": {
    applicationType: "caste",
    heading: "Apply for Caste Certificate",
  },
  "unmarried-certificate": {
    applicationType: "unmarried",
    heading: "Apply for Unmarried Certificate",
  },
  "bpl-certificate": {
    applicationType: "bpl",
    heading: "Apply for BPL Certificate",
  },
  "jsy-certificate": {
    applicationType: "jsy",
    heading: "Apply for JSY Certificate",
  },
};

export function getApplicationConfig(slug) {
  return APPLICATION_CONFIGS[slug] || null;
}