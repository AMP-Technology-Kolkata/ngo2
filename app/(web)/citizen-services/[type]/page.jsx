import { notFound } from "next/navigation";
import {
  getApplicationConfig,
  APPLICATION_CONFIGS,
} from "../../../../lib/applicationTypes.config";
import GeneralApplicationForm from "../../components/GeneralApplicationForm";
import LandNocForm from "../../components/LandNocForm";
import BurningForm from "../../components/BurningForm";

export function generateStaticParams() {
  return Object.keys(APPLICATION_CONFIGS).map((slug) => ({ type: slug }));
}

export function generateMetadata({ params }) {
  const config = getApplicationConfig(params.type);
  return { title: config ? config.heading : "Citizen Service" };
}

function makeSubmitHandler(endpoint) {
  return async function submit(payload) {
    "use server";
    try {
      const url = `${process.env.BACKLINK}/public/${endpoint}`;
      const isFormData = payload instanceof FormData;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          "x-api-key": process.env.API_KEY,
          "office-id": process.env.OFFICE,
        },
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const rawText = await res.text();
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

      return { success: true, data: data?.data || data };
    } catch (error) {
      return { success: false, message: error?.message || "Submission failed" };
    }
  };
}

export default function DynamicCertificatePage({ params }) {
  const config = getApplicationConfig(params.type);

  if (!config) return notFound();

  const submit = makeSubmitHandler(config.endpoint);

  if (config.component === "land_noc") {
    return <LandNocForm submitLandNoc={submit} />;
  }

  if (config.component === "burning") {
    return <BurningForm submitBurning={submit} />;
  }

  return (
    <GeneralApplicationForm
      applicationType={config.applicationType}
      heading={config.heading}
      submitApplication={submit}
    />
  );
}
