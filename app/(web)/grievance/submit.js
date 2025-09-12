"use server";
export const handleSubmit = async (state, e) => {
  const file = e.get("document");
  let formData = new FormData();
  formData.append("name", e.get("name"));
  formData.append("email", e.get("email"));
  formData.append("message", e.get("message"));
  formData.append("phone", e.get("phone"));
  formData.append("location", e.get("location"));
  formData.append("file", file);

  try {
    const response = await fetch(`${process.env.BACKLINK}/public/grievance`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error(error);
  }
};
