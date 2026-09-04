// lib/downloadCertificate.actions.js
"use server";

export async function generateCertificateAction(formData) {
  const application_no = formData.get("application_no");
  const mobile = formData.get("mobile");

  if (!process.env.BACKLINK) {
    console.error("=== MISSING ENV VAR: BACKLINK is not set ===");
    return { success: false, message: "Server configuration error. Please contact support." };
  }

  try {
    const url = `${process.env.BACKLINK}/public/generate_certificate`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      body: JSON.stringify({ application_no, mobile }),
    });

    console.log("=== STATUS:", res.status, "===");

    const rawText = await res.text(); // always read as text first — works for both JSON and HTML error bodies

    let json;
    try {
      json = JSON.parse(rawText);
    } catch {
      console.log("=== NON-JSON RESPONSE:", rawText.slice(0, 300), "===");
      return {
        success: false,
        message: `Server returned an unexpected response (status ${res.status}). Check backend route/logs.`,
      };
    }

    if (!res.ok) {
      console.log("=== ERROR BODY:", json, "===");
      return { success: false, message: json?.message || `Request failed with status ${res.status}.` };
    }

    // Backend returns: { data: { certificate_url, certificate_no } }
    const certificateUrl = json?.data?.certificate_url;

    if (!certificateUrl) {
      console.log("=== MISSING certificate_url IN RESPONSE:", json, "===");
      return { success: false, message: "Certificate URL missing in server response." };
    }

    return {
      success: true,
      url: certificateUrl, // <-- this is the real CDN URL, e.g. https://cdn.amptechnology.in/.../certificate-XXXX.pdf
      certificateNo: json?.data?.certificate_no,
    };
  } catch (error) {
    console.log("=== CATCH:", error?.message, "===");
    return { success: false, message: error?.message || "Something went wrong." };
  }
}