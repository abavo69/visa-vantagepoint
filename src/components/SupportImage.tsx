import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import type { StoredFile } from '@/lib/supportAttachments';

// Use authenticated downloads: support images stay in the private document bucket.
export default function SupportImage({ file, language = 'en' }: { file: StoredFile; language?: 'en' | 'es' }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let objectUrl: string | undefined;
    setUrl(null);
    setFailed(false);
    const load = async () => {
      try {
        const { data, error } = await supabase.storage.from('client-documents').download(file.file_path);
        if (error || !data) throw error || new Error('Image unavailable');
        if (!active) return;
        objectUrl = URL.createObjectURL(data);
        setUrl(objectUrl);
      } catch {
        if (active) setFailed(true);
      }
    };
    void load();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.file_path, attempt]);

  if (failed) return (
    <div className="mt-2 space-y-2 text-sm">
      <p>{language === 'es' ? 'No se pudo cargar la imagen.' : 'Unable to load image.'}</p>
      <Button variant="outline" className="min-h-11" onClick={() => setAttempt(value => value + 1)}>
        {language === 'es' ? 'Reintentar' : 'Retry'}
      </Button>
    </div>
  );

  return (
    <div className="mt-2 flex min-h-24 w-full items-center justify-center overflow-hidden rounded-md bg-background text-foreground">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={file.file_name} className="block max-w-full">
          <img src={url} alt={file.file_name} className="block max-h-80 w-auto max-w-full object-contain" onError={() => setFailed(true)} />
        </a>
      ) : <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label={language === 'es' ? 'Cargando imagen' : 'Loading image'} />}
    </div>
  );
}