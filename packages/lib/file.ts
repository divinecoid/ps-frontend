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
  let filename = getFilename(res) || "download.pdf";
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}