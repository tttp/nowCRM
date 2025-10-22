import { type CommandProps, Node, type RawCommands } from "@tiptap/core";

export const LinkedVideo = Node.create({
	name: "linkedVideo",
	group: "block",
	atom: true,
	inline: false,

	addAttributes() {
		return {
			thumbnail: { default: null },
			href: { default: null },
			alt: { default: "Video thumbnail" },
		};
	},

	parseHTML() {
		return [
			{
				tag: "a[href] > img[src]",
				getAttrs: (node: HTMLElement) => {
					const img = node as HTMLImageElement;
					const anchor = img.closest("a");
					if (!img || !anchor) return false;

					return {
						thumbnail: img.getAttribute("src"),
						href: anchor.getAttribute("href"),
						alt: img.getAttribute("alt") || "Video thumbnail",
					};
				},
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"a",
			{
				href: HTMLAttributes.href,
				target: "_blank",
				rel: "noopener noreferrer",
			},
			[
				"img",
				{
					src: HTMLAttributes.thumbnail,
					alt: HTMLAttributes.alt,
					style: "max-width: 100%; border-radius: 6px; position: relative;",
				},
			],
		];
	},

	addCommands(): Partial<RawCommands> {
		return {
			insertLinkedVideo:
				(thumbnail: string, href: string, alt = "") =>
				({ chain }: CommandProps) => {
					const origin =
						typeof window !== "undefined" ? window.location.origin : "";
					const finalThumbnail =
						thumbnail === null ? `${origin}/fallback-thumbnail.png` : thumbnail;
					return chain()
						.insertContent({
							type: this.name,
							attrs: {
								thumbnail: finalThumbnail,
								href,
								alt,
							},
						})
						.run();
				},
		} as unknown as Partial<RawCommands>;
	},
});
