const MAX_CHARS = 350000;

export function readLocalImage(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ ok: false, error: "No file selected." });
      return;
    }
    if (!file.type.startsWith("image/")) {
      resolve({ ok: false, error: "Please choose an image file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : "";
      if (data.length > MAX_CHARS) {
        resolve({ ok: true, data: null, name: file.name, truncated: true });
        return;
      }
      resolve({ ok: true, data, name: file.name, truncated: false });
    };
    reader.onerror = () => resolve({ ok: false, error: "The image could not be read." });
    reader.readAsDataURL(file);
  });
}
