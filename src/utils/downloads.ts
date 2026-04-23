function save(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
}

export function saveArrayBuffer(buffer: BlobPart, filename: string) {
    save(new Blob([buffer], {type: 'application/octet-stream'}), filename);
}

export function saveString(text: string, filename: string) {
    save(new Blob([text], {type: 'text/plain;charset=utf-8'}), filename);
}