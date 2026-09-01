import { notFound } from "next/navigation";
import { getApplicationConfig } from "../../../../lib/applicationTypes.config";
import GeneralApplicationForm from "../../components/GeneralApplicationForm";

// Pre-render known slugs at build time (optional but good for SEO/perf)
export function generateStaticParams() {
  const { APPLICATION_CONFIGS } = require("../../../../lib/applicationTypes.config");
  return Object.keys(APPLICATION_CONFIGS).map((slug) => ({ type: slug }));
}

export function generateMetadata({ params }) {
  const config = getApplicationConfig(params.type);
  return { title: config ? config.heading : "Citizen Service" };
}

export default function DynamicCertificatePage({ params }) {
  const config = getApplicationConfig(params.type);

  // Unknown slug -> 404 (also prevents clash with /heirship-certificate style routes)
  if (!config) return notFound();

  async function submitApplication(formData) {
    "use server";
    try {
      console.log(`=== [${config.applicationType}] FORM DATA RECEIVED ===`);
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, "=> FILE:", value.name, value.size, "bytes", value.type);
        } else {
          console.log(key, "=>", value);
        }
      }
      console.log("=== END FORM DATA ===");

      const url = `${process.env.BACKLINK}/public/save_application`;
      console.log("Calling:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "x-api-key": process.env.API_KEY,
          "office-id": process.env.OFFICE,
        },
        body: formData,
      });

      const rawText = await res.text();
      console.log("=== BACKEND STATUS:", res.status, "===");
      console.log("=== BACKEND RAW RESPONSE:", rawText, "===");

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        return {
          success: false,
          message: `Server returned non-JSON response (status ${res.status})`,
        };
      }

      if (!res.ok) {
        const backendMsg =
          data?.message ||
          (Array.isArray(data?.errors) && data.errors.length > 0
            ? data.errors.map((e) => e.message || e).join(", ")
            : null) ||
          `Failed with status ${res.status}`;
        return { success: false, message: backendMsg };
      }

      return { success: true, data };
    } catch (error) {
      console.log("=== CATCH BLOCK HIT ===", error?.message);
      return { success: false, message: error?.message || "Submission failed" };
    }
  }

  return (
    <GeneralApplicationForm
      applicationType={config.applicationType}
      heading={config.heading}
      submitApplication={submitApplication}
    />
  );
}