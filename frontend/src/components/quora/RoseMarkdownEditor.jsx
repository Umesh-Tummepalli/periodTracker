import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect
} from "react";
import { Editor } from "@toast-ui/react-editor";

/**
 * RoseMarkdownEditor
 *
 * Props:
 *  - initialMarkdown?: string
 *
 * Exposed methods:
 *  - getMarkdown()
 *  - setMarkdown(markdown)
 */
const RoseMarkdownEditor = forwardRef(({ initialMarkdown = "" }, ref) => {
  const editorRef = useRef(null);

  // expose methods to parent
  useImperativeHandle(ref, () => ({
    getMarkdown() {
      return editorRef.current?.getInstance().getMarkdown();
    },
    setMarkdown(markdown) {
      editorRef.current?.getInstance().setMarkdown(markdown || "");
    }
  }));

  // load initial content (edit mode)
  useEffect(() => {
    if (initialMarkdown) {
      editorRef.current?.getInstance().setMarkdown(initialMarkdown);
    }
  }, [initialMarkdown]);

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 shadow-lg shadow-rose-200/40">
      <div className="rounded-xl overflow-hidden">
        <Editor
          ref={editorRef}
          height="320px"
          initialEditType="wysiwyg"
          previewStyle="vertical"
          hideModeSwitch
          usageStatistics={false}
        />
      </div>
    </div>
  );
});

export default RoseMarkdownEditor;
