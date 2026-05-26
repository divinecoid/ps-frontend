const getFilename = (res: Response) => {
  const disposition = res.headers.get("content-disposition");
  if (!disposition) return null;

  let match = disposition.match(/filename\*=UTF-8''(.+)/);
  if (match) return decodeURIComponent(match[1]);

  match = disposition.match(/filename="(.+)"/);
  if (match) return match[1];

  match = disposition.match(/filename=(.+)/);
  if (match) return match[1];

  return null;
};

export const downloadFile = async (res: Response) => {
  const blob = await res.blob();
  const filename = getFilename(res) || "download.pdf";
  const buffer = await blob.arrayBuffer();
  const filePath = await window.electronAPI.saveFile(buffer, filename);
  return filePath;
};