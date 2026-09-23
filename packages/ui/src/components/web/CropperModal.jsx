import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';
import { XMarkIcon as CloseIcon } from '../../icons';

export default function CropperModal({
  imageSrc,
  aspect = 1,
  circular = false,
  onCancel,
  onCropDone,
  title = 'Crop Image',
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      // Detect mimeType from the src (defaults to jpeg)
      const mimeType = imageSrc.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, mimeType);
      const previewUrl = URL.createObjectURL(blob);
      onCropDone({ blob, previewUrl });
    } catch (e) {
      console.error('Crop failed:', e);
      alert('Failed to crop image');
    }
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text">{title}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-background rounded-full">
            <CloseIcon className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={!circular}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="p-4 border-t border-border">
          <label className="text-xs text-text-secondary block mb-2">Zoom</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-border">
          <button
            onClick={onCancel}
            disabled={processing}
            className="flex-1 bg-surface border border-border text-text py-2 rounded-lg hover:bg-background"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={processing}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Apply Crop'}
          </button>
        </div>
      </div>
    </div>
  );
}