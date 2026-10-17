import { describe, expect, test } from 'bun:test';
import { isImageAttachment } from './supportAttachments';

describe('support image classification', () => {
  test('client photos display as images', () => {
    expect(isImageAttachment({ file_name: 'passport.jpg', file_type: 'image/jpeg' })).toBe(true);
    expect(isImageAttachment({ file_name: 'photo.PNG', file_type: 'application/octet-stream' })).toBe(true);
  });
  test('documents remain files', () => {
    expect(isImageAttachment({ file_name: 'application.pdf', file_type: 'application/pdf' })).toBe(false);
    expect(isImageAttachment({ file_name: 'photo.jpg', file_type: 'application/pdf' })).toBe(false);
    expect(isImageAttachment({ file_name: 'drawing.svg', file_type: 'image/svg+xml' })).toBe(false);
  });
});