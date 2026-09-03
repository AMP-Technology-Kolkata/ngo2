// lib/downloadCertificate.actions.js
"use server";

export async function generateCertificateAction(formData) {
  const application_no = formData.get("application_no");
  const mobile = formData.get("mobile");

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

    if (!res.ok) {
      const rawText = await res.text(); // 👈 json() না করে আগে raw text দেখো
      console.log("=== RAW ERROR BODY:", rawText, "===");

      let message = `Request failed with status ${res.status}.`;
      try {
        const errJson = JSON.parse(rawText);
        message = errJson?.message || message;
      } catch {
        message = `Non-JSON error response: ${rawText.slice(0, 200)}`;
      }
      return { success: false, message };
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { success: true, base64, filename: `${application_no}.pdf` };
  } catch (error) {
    console.log("=== CATCH:", error?.message, "===");
    return { success: false, message: error?.message || "Something went wrong." };
  }
}