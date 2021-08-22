export class UploadedFile {

    fileName: string | undefined;
    progress: number | undefined;
    
}

export class UploadedFileDto {
    fileName: string = "";
    fileSize: number = 1;
    uploadedAt: Date = new Date();
    fileType: string = "";
}