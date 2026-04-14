import { oneDark } from "@codemirror/theme-one-dark";
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    codeMirrorPlugin,
    CodeToggle,
    CreateLink,
    headingsPlugin,
    HighlightToggle,
    imagePlugin,
    InsertCodeBlock,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
} from "@mdxeditor/editor";
import React, { memo, useMemo } from "react";
/** @import { MDXEditorMethods } from "@mdxeditor/editor"; */

const MarkdownEditor = React.forwardRef(
/**
 * Memoized MDXEditor wrapper to prevent unnecessary re-renders
 *
 * @param {object} props
 * @param {string} props.markdown - Initial markdown content
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - CSS class for the editor
 * @param {string} props.contentEditableClassName - CSS class for content area
 * @param {boolean} props.isDark - Whether to use dark theme
 * @param {React.Ref<MDXEditorMethods>} ref - Ref forwarded to MDXEditor
 */
  function (
  {
    markdown = "",
    placeholder = "Deskripsi",
    className = "",
    contentEditableClassName = "",
    isDark = false,
    ...props
  },
  ref
) {
  // Memoize plugins to prevent recreation on every render
  const plugins = useMemo(() => [
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    imagePlugin(),
    markdownShortcutPlugin(),
    tablePlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
    codeMirrorPlugin({
      codeMirrorExtensions: isDark ? [oneDark] : [],
      codeBlockLanguages: {
        txt: "Plain Text",
        html: "HTML",
        css: "CSS",
        js: "JavaScript",
        tsx: "TypeScript",
      },
    }),
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <UndoRedo />
          <BoldItalicUnderlineToggles />
          <CodeToggle />
          <HighlightToggle />
          <ListsToggle />
          <BlockTypeSelect />
          <CreateLink />
          <InsertImage />
          <InsertTable />
          <InsertThematicBreak />
          <InsertCodeBlock />
        </>
      ),
      toolbarClassName: "z-0! bg-surface!"
    }),
  ], [isDark]); // Only recreate plugins when theme changes

  return (
    <MDXEditor
      ref={ref}
      markdown={markdown}
      placeholder={placeholder}
      className={className}
      contentEditableClassName={contentEditableClassName}
      plugins={plugins}
      {...props}
    />
  );
});

export default memo(MarkdownEditor);
