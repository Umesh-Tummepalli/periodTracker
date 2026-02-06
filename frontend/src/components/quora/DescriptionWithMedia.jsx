import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";

import { Editor } from "@tinymce/tinymce-react";
import TurndownService from "turndown";
import { marked } from "marked";
import { UploadCloud, X } from "lucide-react";

const DescriptionWithMedia = forwardRef(({ initialMarkdown = "" }, ref) => {
  const fileInputRef = useRef(null);

  // Initialize Turndown for HTML → Markdown
  const turndownService = useRef(
    new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    })
  );

  // HTML content for TinyMCE (convert initial markdown to HTML)
  const [htmlContent, setHtmlContent] = useState(() => {
    return initialMarkdown ? marked.parse(initialMarkdown) : "";
  });

  // Media
  const [mediaItems, setMediaItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Keep track of media items for cleanup
  const mediaItemsRef = useRef(mediaItems);

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  // File handling
  const processFiles = (fileList) => {
    const newItems = Array.from(fileList).map((file) => ({
      file,
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setMediaItems((prev) => [...prev, ...newItems]);
  };

  // Drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Manual select
  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
    e.target.value = null;
  };

  // Remove media
  const removeMedia = (id) => {
    setMediaItems((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((m) => m.id !== id);
    });
  };

  // Expose API
  useImperativeHandle(ref, () => ({
    fetchData() {
      // Convert HTML to Markdown using Turndown
      const markdown = turndownService.current.turndown(htmlContent);

      return {
        markdown,
        images: mediaItems.filter((m) => m.type === "image").map((m) => m.file),
        videos: mediaItems.filter((m) => m.type === "video").map((m) => m.file),
      };
    },
    setData({ markdown }) {
      // Convert markdown to HTML using marked
      const html = markdown ? marked.parse(markdown) : "";
      setHtmlContent(html);
    },
    reset() {
      setHtmlContent("");
      setMediaItems([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  }));

  return (
    <div className="space-y-6 rounded-3xl border border-rose-100 bg-white p-6 shadow-xl">
      {/* Upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition
          ${isDragging
            ? "border-rose-500 bg-rose-100/50"
            : "border-rose-200 hover:border-rose-400"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <UploadCloud className="w-8 h-8 text-rose-400 mb-2" />
        <p className="text-sm">
          <span className="text-rose-600">Click to upload</span> or drag & drop
        </p>
        <p className="text-xs text-gray-500">Images or Videos</p>
      </div>

      {/* Media preview */}
      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-square rounded-xl border bg-white"
            >
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute top-1 right-1 z-10 h-6 w-6 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 mx-auto" />
              </button>

              {item.type === "video" ? (
                <video
                  src={item.preview}
                  controls
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <img
                  src={item.preview}
                  alt="Preview"
                  className="h-full w-full object-contain rounded-xl"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* TinyMCE Editor */}
      <div className="">
        <Editor

          value={htmlContent}
          onEditorChange={setHtmlContent}
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline strikethrough | " +
              "bullist numlist | blockquote | link | removeformat | code",
            branding: false,
            statusbar: false,
            content_style: "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 14px; }",
          }}
        />
      </div>
    </div>
  );
});

DescriptionWithMedia.displayName = "DescriptionWithMedia";

export default DescriptionWithMedia;