import React, { useRef } from "react";

const PLACEHOLDER_IMAGE =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export interface ImageUploaderProps {
  imageSrc: string;
  onImageChange: (src: string) => void;
  dimensions: { width: number; height: number };
  onDimensionsChange: (dims: { width: number; height: number }) => void;
  selected?: boolean;
}

function ImageUploader({
  imageSrc = PLACEHOLDER_IMAGE,
  onImageChange,
  dimensions = { width: 150, height: 150 },
  onDimensionsChange,
  selected = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resizing = useRef(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    selected && fileInputRef.current?.click();
  };

  // Resizing handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizing.current) return;
    onDimensionsChange({
      width: Math.max(
        50,
        e.clientX - (imageRef.current?.getBoundingClientRect().left || 0)
      ),
      height: Math.max(
        50,
        e.clientY - (imageRef.current?.getBoundingClientRect().top || 0)
      ),
    });
  };

  const handleMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="text-center">
      <div
        className="inline-block relative"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Uploaded"
          draggable={false}
          onClick={handleImageClick}
          className="w-full h-full object-cover cursor-pointer border border-gray-300 rounded select-none"
        />

        {/* Resize handle */}
        {selected && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute w-4 h-4 -right-2 -bottom-2 bg-white border-2 border-gray-500 rounded-full cursor-nwse-resize z-10"
          />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}

export default ImageUploader;
