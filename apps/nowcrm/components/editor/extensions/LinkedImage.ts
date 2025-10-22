import { type CommandProps, Node, type RawCommands } from "@tiptap/core";

export const LinkedImage = Node.create({
	name: "linkedImage",
	group: "block",
	atom: true,
	inline: false,

	addAttributes() {
		return {
			src: { default: null },
			href: { default: null },
			alt: { default: "" },
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
						src: img.getAttribute("src"),
						href: anchor.getAttribute("href"),
						alt: img.getAttribute("alt") || "",
					};
				},
			},
			{
				tag: "img[src]", // for images without links
				getAttrs: (node: HTMLElement) => {
					const img = node as HTMLImageElement;
					return {
						src: img.getAttribute("src"),
						href: null,
						alt: img.getAttribute("alt") || "",
					};
				},
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		if (HTMLAttributes.href) {
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
						src: HTMLAttributes.src,
						alt: HTMLAttributes.alt,
						style: "max-width: 100%; border-radius: 6px;",
					},
				],
			];
		}

		// If no link, render plain <img>
		return [
			"img",
			{
				src: HTMLAttributes.src,
				alt: HTMLAttributes.alt,
				style: "max-width: 100%; border-radius: 6px;",
			},
		];
	},
	addCommands(): Partial<RawCommands> {
		return {
			insertLinkedImage:
				(src: string, href: string, alt = "") =>
				({ chain }: CommandProps) => {
					return chain()
						.insertContent({
							type: this.name,
							attrs: { src, href, alt },
						})
						.run();
				},
		} as unknown as Partial<RawCommands>;
	},
});
