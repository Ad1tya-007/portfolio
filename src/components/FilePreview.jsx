import { useMemo } from 'react';
import './FilePreview.css';

// Resolve image path from folder content to Vite glob key (relative to this file's folder)
function getImageGlobKey(contentPath) {
  if (!contentPath || typeof contentPath !== 'string') return null;
  const withoutSrc = contentPath.replace(/^\/src\//, '');
  return withoutSrc ? `../${withoutSrc}` : null;
}

// Preload all project images so we can resolve by path
const imageModules = import.meta.glob('../data/projects/**/*.{jpeg,jpg,png,gif,webp}', {
  eager: true,
  import: 'default',
});

function getImageUrl(contentPath) {
  const key = getImageGlobKey(contentPath);
  if (!key) return null;
  const mod = imageModules[key];
  return mod ?? null;
}

const TEXT_EXT = new Set(['.md', '.txt', '.markdown']);
const IMAGE_EXT = new Set(['.jpeg', '.jpg', '.png', '.gif', '.webp']);

function getExtension(name) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function FilePreview({ file, appearance = 'dark', onClose }) {
  const ext = useMemo(() => getExtension(file?.name ?? ''), [file?.name]);
  const isText = TEXT_EXT.has(ext);
  const isImage = IMAGE_EXT.has(ext);
  const imageUrl = useMemo(
    () => (isImage && file?.content ? getImageUrl(file.content) : null),
    [isImage, file?.content]
  );

  if (!file) return null;

  return (
    <div
      className={`file-preview-overlay file-preview-${appearance} ${isImage ? 'file-preview-is-image' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="file-preview-window"
        onClick={(e) => e.stopPropagation()}>
        <div className="file-preview-titlebar">
          <span className="file-preview-title">{file.name}</span>
          <button
            type="button"
            className="file-preview-close"
            onClick={onClose}
            aria-label="Close">
            ×
          </button>
        </div>
        <div className="file-preview-body">
          {isText && (
            <div className="file-preview-text-editor">
              <pre className="file-preview-text-content">
                {file.content ?? ''}
              </pre>
            </div>
          )}
          {isImage && (
            <div className="file-preview-image-wrap">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={file.name}
                  className="file-preview-image"
                />
              ) : (
                <div className="file-preview-image-placeholder">
                  Unable to load image
                </div>
              )}
            </div>
          )}
          {!isText && !isImage && (
            <div className="file-preview-unsupported">
              <p>Preview not available for this file type.</p>
              <p className="file-preview-filename">{file.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
export { getImageUrl, getExtension, TEXT_EXT, IMAGE_EXT };
