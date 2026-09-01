import React from "react";
import HeirshipCertificateForm from "../../components/HeirshipCertificateForm";

export default function HeirshipCertificate() {
  async function submitHeirship(formData) {
    "use server";
    try {
      // 👇 These logs appear in your TERMINAL (where `next dev` runs), NOT browser console
      console.log("=== FORM DATA RECEIVED ===");
      const debugPayload = {};
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            key,
            "=> FILE:",
            value.name,
            value.size,
            "bytes",
            value.type,
          );
        } else {
          console.log(key, "=>", value);
          debugPayload[key] = debugPayload[key]
            ? [].concat(debugPayload[key], value)
            : value;
        }
      }
      console.log("=== END FORM DATA ===");

      const url = `${process.env.BACKLINK}/public/save_heirship`;
      console.log("Calling:", url);
      console.log("Headers:", {
        "x-api-key": process.env.API_KEY ? "PRESENT" : "MISSING",
        "office-id": process.env.OFFICE,
      });

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
        console.log(
          "=== BACKEND RETURNED NON-JSON — likely HTML error page (check status) ===",
        );
        return {
          success: false,
          message: `Server returned non-JSON response (status ${res.status}). Raw: ${rawText.slice(0, 200)}`,
        };
      }

      if (!res.ok) {
        console.log(
          "=== BACKEND ERROR PAYLOAD:",
          JSON.stringify(data, null, 2),
          "===",
        );
        const backendMsg =
          data?.message ||
          (Array.isArray(data?.errors) && data.errors.length > 0
            ? data.errors.map((e) => e.message || e).join(", ")
            : null) ||
          `Request failed with status ${res.status}. Please check all fields (especially Date of Birth) and try again.`;
        return { success: false, message: backendMsg };
      }

      console.log(
        "=== SUCCESS RESPONSE DATA:",
        JSON.stringify(data, null, 2),
        "===",
      );
      if (!data?.data?.applicationId && !data?._id && !data?.data?._id) {
        console.warn(
          "⚠️ Backend said success but no record ID returned — verify DB manually!",
        );
      }

      return { success: true, data };
    } catch (error) {
      console.log("=== CATCH BLOCK HIT ===");
      console.log("Error name:", error?.name);
      console.log("Error message:", error?.message);
      console.log("Error stack:", error?.stack);
      return { success: false, message: error?.message || "Submission failed" };
    }
  }

  return <HeirshipCertificateForm submitHeirship={submitHeirship} />;
}
