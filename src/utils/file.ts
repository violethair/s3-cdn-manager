export const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const truncateFilename = (filename: string, maxLength: number = 30) => {
    if (filename.length <= maxLength) return filename;

    const extension = filename.split(".").pop() || "";
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf("."));

    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 3) + "...";
    return `${truncatedName}.${extension}`;
};
