package com.dan.club.services;

import com.dan.club.models.FileUpload;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {
    FileUpload uploadFile(MultipartFile multipartFile) throws IOException;
    Resource getFileAsResource(String fileCode) throws IOException;
    void deleteFileByFileCode(String fileCode) throws IOException;
    FileUpload getFileUploadByFileCode(String fileCode);
}
