const MAX_CHARS = 350000;

function compressDataUrl(dataUrl, maxWidth = 900, quality = 0.74) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

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
    reader.onload = async () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      if (!raw) {
        resolve({ ok: false, error: "The image could not be read." });
        return;
      }
      let data = raw;
      try {
        data = await compressDataUrl(raw);
        if (data.length > MAX_CHARS) data = await compressDataUrl(raw, 640, 0.62);
      } catch {
        data = raw;
      }
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
