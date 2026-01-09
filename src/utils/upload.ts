/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

export const uploadToCloudinary = async () => {
  try {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (!result.assets?.length) return;

    const file = result.assets[0];

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.type,
      name: file.fileName || `avatar.jpg`,
    } as any);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    // console.log("Cloudinary URL:", data.secure_url);

    // Lưu URL vào user của bạn (call API server)
    // await saveAvatarToServer(userId, data.secure_url);
  } catch (err) {
    console.error(err);
    Alert.alert("Upload thất bại");
  }
};
