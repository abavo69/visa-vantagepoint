import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { isImageAttachment } from './supportAttachments';

describe('support image classification', () => {
  test('client photos display as images', () => {
    assert.equal(isImageAttachment({ file_name: 'passport.jpg', file_type: 'image/jpeg' }), true);
    assert.equal(isImageAttachment({ file_name: 'photo.PNG', file_type: 'application/octet-stream' }), true);
  });
  test('documents remain files', () => {
    assert.equal(isImageAttachment({ file_name: 'application.pdf', file_type: 'application/pdf' }), false);
    assert.equal(isImageAttachment({ file_name: 'photo.jpg', file_type: 'application/pdf' }), false);
    assert.equal(isImageAttachment({ file_name: 'drawing.svg', file_type: 'image/svg+xml' }), false);
  });
});