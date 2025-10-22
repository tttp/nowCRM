"use client";
import "reactjs-tiptap-editor/style.css";
import "react-image-crop/dist/ReactCrop.css";

import RichTextEditor, { BaseKit, type Editor } from "reactjs-tiptap-editor";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { Bold } from "reactjs-tiptap-editor/bold";
import {
	BubbleMenuExcalidraw,
	BubbleMenuKatex,
} from "reactjs-tiptap-editor/bubble-extra";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { Clear } from "reactjs-tiptap-editor/clear";
import { Code } from "reactjs-tiptap-editor/code";
import { Color } from "reactjs-tiptap-editor/color";
import { Emoji } from "reactjs-tiptap-editor/emoji";
import { Excalidraw } from "reactjs-tiptap-editor/excalidraw";
import { ExportPdf } from "reactjs-tiptap-editor/exportpdf";
import { ExportWord } from "reactjs-tiptap-editor/exportword";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { FormatPainter } from "reactjs-tiptap-editor/formatpainter";
import { Heading } from "reactjs-tiptap-editor/heading";
import { Highlight } from "reactjs-tiptap-editor/highlight";
import { History } from "reactjs-tiptap-editor/history";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Iframe } from "reactjs-tiptap-editor/iframe";
import { Image } from "reactjs-tiptap-editor/image";
import { ImportWord } from "reactjs-tiptap-editor/importword";
import { Indent } from "reactjs-tiptap-editor/indent";
import { Italic } from "reactjs-tiptap-editor/italic";
import { Katex } from "reactjs-tiptap-editor/katex";
import { LineHeight } from "reactjs-tiptap-editor/lineheight";
import { Link } from "reactjs-tiptap-editor/link";
import { MoreMark } from "reactjs-tiptap-editor/moremark";
import { ColumnActionButton } from "reactjs-tiptap-editor/multicolumn";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { SearchAndReplace } from "reactjs-tiptap-editor/searchandreplace";
import { SlashCommand } from "reactjs-tiptap-editor/slashcommand";
import { Strike } from "reactjs-tiptap-editor/strike";
import { Table } from "reactjs-tiptap-editor/table";
import { TableOfContents } from "reactjs-tiptap-editor/tableofcontent";
import { TaskList } from "reactjs-tiptap-editor/tasklist";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextDirection } from "reactjs-tiptap-editor/textdirection";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { Video } from "reactjs-tiptap-editor/video";
import MyEditor from "@/components/editor/Editor";
import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import React from "react";
import { Button } from "@/components/ui/button";
import { uploadAsset } from "@/lib/services/new_type/assets/downloadAsset";

const extensions = [
	BaseKit.configure({
		placeholder: {
			showOnlyCurrent: true,
		},
		characterCount: {
			limit: 50_000,
		},
	}),
	History,
	SearchAndReplace,
	TableOfContents.extend({ name: "Table of contents" }),
	FormatPainter.configure({ spacer: true }),
	Clear,
	FontFamily,
	Heading.configure({ spacer: true }),
	FontSize,
	Bold,
	Italic,
	TextUnderline,
	Strike,
	MoreMark,
	Emoji,
	Color.configure({ spacer: true }),
	Highlight,
	BulletList,
	OrderedList,
	TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
	Indent,
	LineHeight,
	TaskList.configure({
		spacer: true,
		taskItem: {
			nested: true,
		},
	}),
	Link,
	Image.configure({
		upload: async (files: File) => {
			const formData = new FormData();
			formData.append("files", files);
			const asset = await uploadAsset(formData);
			console.log(asset);
			if (!asset.data || !asset.success) return "";
			return asset.data[0].url;
		},
	}),
	Video.configure({
		upload: async (files: File) => {
			const formData = new FormData();
			formData.append("files", files);
			const asset = await uploadAsset(formData);
			if (!asset.data || !asset.success) return "";
			return asset.data[0].url;
		},
	}),
	Blockquote,
	SlashCommand,
	HorizontalRule,
	Code.configure({
		toolbar: false,
	}),
	ColumnActionButton,
	Table,
	Iframe,
	ExportPdf.configure({ spacer: true }),
	ImportWord.configure({
		upload: (files: File[]) => {
			const f = files.map((file) => ({
				src: URL.createObjectURL(file),
				alt: file.name,
			}));
			return Promise.resolve(f);
		},
	}),
	ExportWord,
	TextDirection,
	Katex,
	Excalidraw,
];

const DEFAULT = "hello bro";

export default function ExamplePage() {
	const [content, setContent] = React.useState(DEFAULT);

	const onChangeContent = (value: any) => {
		console.log("Content being set to:", value); // Debugging the content update
		setContent(value);
	};

	const editorRef = React.useRef<{ editor: Editor | null } | null>(null);

	React.useEffect(() => {
		if (editorRef.current) {
			// Safely call `commands.setContent` after typing the ref
			editorRef.current.editor?.commands.setContent(content); // Tiptap's method to set content
		}
	}, [content]); // Re-run the effect when content changes

	return (
		<div className="container">
			<div className="flex items-center justify-center p-5">
				<RichTextEditor
					output="html"
					ref={editorRef} // Attach editor reference
					content={content}
					onChangeContent={onChangeContent}
					useEditorOptions={{
						immediatelyRender: false,
					}}
					extensions={extensions}
					bubbleMenu={{
						render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
							return (
								<>
									{bubbleDefaultDom}

									{extensionsNames.includes("katex") ? (
										<BubbleMenuKatex
											disabled={disabled}
											editor={editor}
											key="katex"
										/>
									) : null}
									{extensionsNames.includes("excalidraw") ? (
										<BubbleMenuExcalidraw
											disabled={disabled}
											editor={editor}
											key="excalidraw"
										/>
									) : null}
								</>
							);
						},
					}}
				/>
			</div>

			<Button
				onClick={() => {
					const newContent = "new content change";
					console.log("Content before change:", content); // Debugging the current state
					onChangeContent(newContent); // Triggering the change
					console.log("Content after change:", newContent); // Verifying the new content
				}}
			>
				Try to change content
			</Button>

			<div className="flex items-center justify-center p-5">
				<MyEditor />
			</div>
		</div>
	);
}
