import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback
} from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { UploadCloud, X, Video } from "lucide-react";

const DescriptionWithMedia = forwardRef(({ initialMarkdown = "" }, ref) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // We store objects: { file: File, id: string, preview: string, type: 'image' | 'video' }
  const [mediaItems, setMediaItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      mediaItems.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []); // Run on unmount

  // 🔹 Helper: Process new files
  const processFiles = (fileList) => {
    const newItems = Array.from(fileList).map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setMediaItems((prev) => [...prev, ...newItems]);
  };

  // 🔹 Drag & Drop Handlers
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // 🔹 Manual Select
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // reset input so same file can be selected again if deleted
    e.target.value = null;
  };

  // 🔹 Remove Media
  const removeMedia = (idToRemove) => {
    setMediaItems((prev) => {
      const target = prev.find((item) => item.id === idToRemove);
      if (target) URL.revokeObjectURL(target.preview); // Cleanup
      return prev.filter((item) => item.id !== idToRemove);
    });
  };

  useImperativeHandle(ref, () => ({
    fetchData() {
      // Separate images and videos for the return object
      const images = mediaItems.filter(m => m.type === 'image').map(m => m.file);
      const videos = mediaItems.filter(m => m.type === 'video').map(m => m.file);

      return {
        markdown: editorRef.current?.getInstance().getMarkdown() || "",
        images,
        videos
      };
    },
    setData({ markdown }) {
      editorRef.current?.getInstance().setMarkdown(markdown || "");
    }
  }));

  // Preload initial markdown
  useEffect(() => {
    if (initialMarkdown) {
      editorRef.current?.getInstance().setMarkdown(initialMarkdown);
    }
  }, [initialMarkdown]);

  return (
    <div className="space-y-6 rounded-3xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/50 to-rose-100/30 p-6 shadow-xl shadow-rose-200/40 transition-all duration-300">

      {/* 1. Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? "border-rose-500 bg-rose-100/50"
            : "border-rose-200 bg-white/60 hover:border-rose-400 hover:bg-rose-50"
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
        <div className="flex flex-col items-center pointer-events-none">
          <UploadCloud className="w-8 h-8 text-rose-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            <span className="text-rose-600">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Images (JPG, PNG) or Videos (MP4)
          </p>
        </div>
      </div>

      {/* 2. Media Preview Grid */}
      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm aspect-square"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/90 text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-rose-600"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Preview Content */}
              <div className="flex h-full w-full items-center justify-center p-2">
                {item.type === "video" ? (
                  <div className="relative h-full w-full">
                    <video
                      src={item.preview}
                      className="h-full w-full rounded-lg object-contain bg-black/5"
                      controls
                    />
                    <div className="absolute top-2 left-2 p-1 bg-white/80 rounded-md pointer-events-none">
                      <Video className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.preview}
                    alt="preview"
                    className="h-full w-full rounded-lg object-contain"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Editor */}
      <div className="overflow-hidden rounded-2xl border border-rose-200 shadow-sm text-lg">
        <Editor
          ref={editorRef}
          width="100%"
          height="auto"
          initialEditType="wysiwyg"
          previewStyle="vertical"
          hideModeSwitch
          usageStatistics={false}
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol'],
            ['link'],
          ]}
        />
      </div>
    </div>
  );
});

export default DescriptionWithMedia;