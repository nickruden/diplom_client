export const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/ddphbpaps/image/upload`;
    const preset = "unsigned_preset";
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
  
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    return {
      imageUrl: data.url
    };
  };
  