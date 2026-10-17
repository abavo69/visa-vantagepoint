// Files a client sends from the support inbox are stored in client_documents and
// announced in the chat by a "📎 sent a file: <name>" message. This module links a
// chat message back to the stored file so the admin can download it from the inbox.

export interface SupportChatMessage {
  message: string;
  created_at: string;
}

export interface StoredFile {
  id: string;
  user_id?: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
}

const ATTACHMENT_PREFIX = '📎';

export function isImageAttachment(file: Pick<StoredFile, 'file_type' | 'file_name'>): boolean {
  const type = file.file_type.toLowerCase().split(';')[0].trim();
  if (['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/bmp'].includes(type)) return true;
  return (!type || type === 'application/octet-stream') && /\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(file.file_name);
}

export function fileNameFromMessage(message: string): string | null {
  if (!message.startsWith(ATTACHMENT_PREFIX)) return null;
  const idx = message.lastIndexOf(': ');
  if (idx < 0) return null;
  const fileName = message.slice(idx + 2).trim();
  return fileName.length > 0 ? fileName : null;
}

export function attachedFileForMessage<T extends StoredFile>(
  msg: SupportChatMessage,
  files: T[]
): T | null {
  const fileName = fileNameFromMessage(msg.message);
  if (!fileName) return null;

  const candidates = files.filter(f => f.file_name === fileName);
  if (candidates.length === 0) return null;

  // The same file name may be sent more than once: pick the upload closest in time
  // to the chat message.
  const msgTime = new Date(msg.created_at).getTime();
  return candidates.reduce((best, f) => (
    Math.abs(new Date(f.upload_date).getTime() - msgTime) <
    Math.abs(new Date(best.upload_date).getTime() - msgTime) ? f : best
  ));
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
