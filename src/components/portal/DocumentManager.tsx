import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  description?: string;
}

const DocumentManager = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const texts = {
    en: {
      title: 'Document Manager',
      description: 'Upload and manage your visa application documents',
      uploadNew: 'Upload New Document',
      selectFile: 'Select File',
      addDescription: 'Add Description (Optional)',
      upload: 'Upload Document',
      noDocuments: 'No documents uploaded yet',
      downloadDocument: 'Download Document',
      deleteDocument: 'Delete Document',
      viewDocument: 'View Document',
      uploadSuccess: 'Document uploaded successfully',
      deleteSuccess: 'Document deleted successfully',
      uploadError: 'Failed to upload document',
      deleteError: 'Failed to delete document',
      fileSize: 'File Size',
      uploadDate: 'Upload Date',
      maxFileSize: 'Maximum file size: 10MB',
      supportedFormats: 'Supported formats: PDF, DOC, DOCX, JPG, PNG'
    },
    es: {
      title: 'Gestor de Documentos',
      description: 'Sube y gestiona tus documentos de solicitud de visa',
      uploadNew: 'Subir Nuevo Documento',
      selectFile: 'Seleccionar Archivo',
      addDescription: 'Agregar Descripción (Opcional)',
      upload: 'Subir Documento',
      noDocuments: 'Aún no se han subido documentos',
      downloadDocument: 'Descargar Documento',
      deleteDocument: 'Eliminar Documento',
      viewDocument: 'Ver Documento',
      uploadSuccess: 'Documento subido exitosamente',
      deleteSuccess: 'Documento eliminado exitosamente',
      uploadError: 'Error al subir documento',
      deleteError: 'Error al eliminar documento',
      fileSize: 'Tamaño del Archivo',
      uploadDate: 'Fecha de Subida',
      maxFileSize: 'Tamaño máximo: 10MB',
      supportedFormats: 'Formatos soportados: PDF, DOC, DOCX, JPG, PNG'
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          description: description || null
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: t.uploadSuccess,
      });

      setSelectedFile(null);
      setDescription('');
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: t.uploadError,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: t.deleteSuccess,
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: t.deleteError,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border border-border rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-foreground">{t.uploadNew}</h3>
            
            <div className="space-y-3">
              <div>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t.maxFileSize} • {t.supportedFormats}
                </p>
              </div>
              
              <Textarea
                placeholder={t.addDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
              
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : t.upload}
              </Button>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t.noDocuments}</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{doc.file_name}</h4>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{t.fileSize}: {formatFileSize(doc.file_size)}</span>
                        <span>{t.uploadDate}: {formatDate(doc.upload_date)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {doc.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;