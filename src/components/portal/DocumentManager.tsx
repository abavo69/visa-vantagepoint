import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Download, Upload } from 'lucide-react';
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
  const [note, setNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const texts = {
    en: {
      title: 'Your Documents',
      description: 'View and download your visa application documents',
      noDocuments: 'No documents available yet',
      downloadDocument: 'Download Document',
      viewDocument: 'View Document',
      fileSize: 'File Size',
      uploadDate: 'Upload Date',
      documentsProvided: 'Documents provided by your visa consultant'
    },
    es: {
      title: 'Tus Documentos',
      description: 'Ver y descargar tus documentos de solicitud de visa',
      noDocuments: 'Aún no hay documentos disponibles',
      downloadDocument: 'Descargar Documento',
      viewDocument: 'Ver Documento',
      fileSize: 'Tamaño del Archivo',
      uploadDate: 'Fecha de Subida',
      documentsProvided: 'Documentos proporcionados por tu consultor de visa'
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

  const handleUpload = async (files: FileList | null) => {
    if (!user || !files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        toast({ title: 'Error', description: `${file.name}: max 20MB`, variant: 'destructive' });
        continue;
      }
      try {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('client-documents').upload(path, file);
        if (upErr) throw upErr;
        const { error: dbErr } = await supabase.from('client_documents').insert({
          user_id: user.id,
          file_name: file.name,
          file_path: path,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
          description: `[Sent by client]${note.trim() ? ' ' + note.trim() : ''}`,
        });
        if (dbErr) throw dbErr;
        ok++;
      } catch (err) {
        console.error('Upload error:', err);
        toast({ title: 'Error', description: `${file.name} failed to upload`, variant: 'destructive' });
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (ok > 0) {
      setNote('');
      toast({ title: language === 'es' ? 'Archivos enviados' : 'Files sent', description: language === 'es' ? 'Tu consultor ya puede verlos.' : 'Your consultant can now see them.' });
      fetchDocuments();
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
          {/* Upload to admin */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              {language === 'es' ? 'Enviar archivos a tu consultor' : 'Send files to your consultant'}
            </p>
            <Input
              placeholder={language === 'es' ? 'Nota (opcional)' : 'Note (optional)'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              className="h-11"
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button className="w-full h-11" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading
                ? (language === 'es' ? 'Subiendo...' : 'Uploading...')
                : (language === 'es' ? 'Subir imágenes o documentos' : 'Upload images or documents')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {language === 'es' ? 'Máx. 20MB por archivo' : 'Max 20MB per file'}
            </p>
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
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Download className="h-4 w-4" />
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