import { Upload, X } from "lucide-react";

import "./product-images-card.css";

interface ProductImagesCardProps {
  images: string[];
  onRemove: (index: number) => void;
}

export function ProductImagesCard({
  images,
  onRemove,
}: ProductImagesCardProps) {
  return (
    <div className="product-form-card">
      <div className="product-form-card-header">
        <h2 className="product-form-card-title">Product Images</h2>
        <p className="product-form-card-description">
          Drag to reorder. First image is the primary display image.
        </p>
      </div>
      <div className="product-form-card-body">
        <div className="product-form-image-upload">
          <Upload />
          <span className="product-form-image-upload-text">
            Drop images here or click to upload
          </span>
          <span className="product-form-image-upload-hint">
            PNG, JPG, or WebP. Max 5MB per file.
          </span>
        </div>
        {images.length > 0 && (
          <div className="product-form-image-grid">
            {images.map((img, i) => (
              <div key={i} className="product-form-image-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Product ${i + 1}`} />
                <button
                  type="button"
                  className="product-form-image-thumb-remove"
                  onClick={() => onRemove(i)}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
