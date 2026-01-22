import React, { useRef } from 'react';
import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useUpload } from '../hooks/useUpload';

export const UploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUpload();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Upload all selected files
      Array.from(files).forEach((file) => {
        startUpload(file);
      });

      // Reset input so the same file can be selected again
      event.target.value = '';
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handleClick}
        sx={{ minWidth: 'auto' }}
      >
        Upload
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv"
      />
    </>
  );
};