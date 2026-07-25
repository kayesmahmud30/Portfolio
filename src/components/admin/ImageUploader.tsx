"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { FiUploadCloud, FiCheckCircle, FiLoader, FiTrash2 } from "react-icons/fi";

interface ImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onClear?: () => void;
  allowClear?: boolean;
  label?: string;
}

export default function ImageUploader({
  currentUrl,
  onUpload,
  onClear,
  allowClear = false,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [error, setError] = useState<string>("");

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreview(data.url);
      onUpload(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    setPreview("");
    setError("");
    onClear?.();
    onUpload("");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
          {label}
        </span>
        {allowClear && preview ? (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400"
          >
            <FiTrash2 className="text-[10px]" />
            Remove Image
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {preview ? (
          <div className="relative h-24 w-36 overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            <Image
              src={preview}
              alt="Preview"
              fill
              unoptimized={preview.startsWith("data:")}
              className="object-cover"
            />
          </div>
        ) : null}

        <label className="group relative flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-black/20 bg-white/40 px-5 py-4 text-sm font-medium text-zinc-800 transition hover:border-indigo-500 hover:bg-white/60 dark:border-white/20 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:border-indigo-400 dark:hover:bg-zinc-900/60">
          {uploading ? (
            <>
              <FiLoader className="animate-spin text-indigo-500 text-[18px]" />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <FiUploadCloud className="text-[18px] text-zinc-500 group-hover:text-indigo-500" />
              <span>{preview ? "Replace Image" : "Choose & Upload Image"}</span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      {preview ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <FiCheckCircle /> Image attached / uploaded successfully
        </div>
      ) : (
        <div className="text-xs text-zinc-400 dark:text-zinc-500">
          No image set — section will render without a banner.
        </div>
      )}

      {error ? (
        <div className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </div>
      ) : null}
    </div>
  );
}
