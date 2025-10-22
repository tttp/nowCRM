import { mergeAttributes, Node } from "@tiptap/core";

export interface StyledLinkOptions {
	HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		buttonLink: {
			/**
			 * Set a button link
			 */
			setButtonLink: (options: {
				href: string;
				text: string;
				style: string;
			}) => ReturnType;
			/**
			 * Update a button link
			 */
			updateButtonLink: (options: {
				href: string;
				text: string;
				style: string;
			}) => ReturnType;
			/**
			 * Unset a button link
			 */
			unsetButtonLink: () => ReturnType;
		};
	}
}

export const StyledLink = Node.create<StyledLinkOptions>({
	name: "buttonLink",
	priority: 1000,
	addOptions() {
		return {
			HTMLAttributes: {},
		};
	},
	group: "inline",
	inline: true,
	selectable: true, // Make it selectable
	atom: true, // Keep it as atomic

	addAttributes() {
		return {
			href: {
				default: null,
			},
			text: {
				default: null,
			},
			style: {
				default: "primary",
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'span[data-type="button-link"]',
				getAttrs: (dom: HTMLElement) => ({
					href: dom.getAttribute("data-href"),
					text: dom.getAttribute("data-text"),
					style: dom.getAttribute("data-style") || "primary",
				}),
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		const { href, text, style } = HTMLAttributes;

		const buttonStyles = {
			primary: { backgroundColor: "#3b82f6", color: "#ffffff" },
			secondary: { backgroundColor: "#6b7280", color: "#ffffff" },
			success: { backgroundColor: "#10b981", color: "#ffffff" },
			danger: { backgroundColor: "#ef4444", color: "#ffffff" },
			warning: { backgroundColor: "#f59e0b", color: "#ffffff" },
			dark: { backgroundColor: "#1f2937", color: "#ffffff" },
			light: { backgroundColor: "#f3f4f6", color: "#1f2937" },
		};

		const selectedStyle =
			buttonStyles[style as keyof typeof buttonStyles] || buttonStyles.primary;

		return [
			"span",
			mergeAttributes(this.options.HTMLAttributes, {
				"data-type": "button-link",
				"data-href": href,
				"data-text": text,
				"data-style": style,
			}),
			[
				"a",
				{
					href,
					target: "_blank",
					rel: "noopener noreferrer",
					style: `display: inline-block; padding: 12px 24px; background-color: ${selectedStyle.backgroundColor}; color: ${selectedStyle.color}; text-decoration: none; border-radius: 6px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: none; cursor: pointer; text-align: center; line-height: 1.4; margin: 4px 2px;`,
				},
				text || "Button",
			],
		];
	},

	addCommands() {
		return {
			setButtonLink:
				(options) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options,
					});
				},

			updateButtonLink:
				(options) =>
				({ commands }) => {
					return commands.updateAttributes(this.name, options);
				},

			unsetButtonLink:
				() =>
				({ commands }) => {
					return commands.deleteSelection();
				},
		};
	},

	addNodeView() {
		return ({ node, HTMLAttributes, getPos, editor }) => {
			const { href, text, style } = node.attrs;

			const buttonStyles = {
				primary: { backgroundColor: "#3b82f6", color: "#ffffff" },
				secondary: { backgroundColor: "#6b7280", color: "#ffffff" },
				success: { backgroundColor: "#10b981", color: "#ffffff" },
				danger: { backgroundColor: "#ef4444", color: "#ffffff" },
				warning: { backgroundColor: "#f59e0b", color: "#ffffff" },
				dark: { backgroundColor: "#1f2937", color: "#ffffff" },
				light: { backgroundColor: "#f3f4f6", color: "#1f2937" },
			};

			const selectedStyle =
				buttonStyles[style as keyof typeof buttonStyles] ||
				buttonStyles.primary;

			const dom = document.createElement("span");
			dom.setAttribute("data-type", "button-link");
			dom.setAttribute("data-href", href || "");
			dom.setAttribute("data-text", text || "");
			dom.setAttribute("data-style", style || "primary");

			const button = document.createElement("a");
			button.href = href || "#";
			button.target = "_blank";
			button.rel = "noopener noreferrer";
			button.textContent = text || "Button";
			button.style.cssText = `display: inline-block; padding: 12px 24px; background-color: ${selectedStyle.backgroundColor}; color: ${selectedStyle.color}; text-decoration: none; border-radius: 6px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: none; cursor: pointer; text-align: center; line-height: 1.4; margin: 4px 2px; transition: opacity 0.2s;`;

			// Add hover effect
			button.addEventListener("mouseenter", () => {
				button.style.opacity = "0.8";
			});
			button.addEventListener("mouseleave", () => {
				button.style.opacity = "1";
			});

			// Handle click to edit
			button.addEventListener("click", (e) => {
				e.preventDefault();

				// Select this node
				if (typeof getPos === "function") {
					const pos = getPos();
					editor.commands.setNodeSelection(pos);

					// Dispatch custom event to open edit dialog
					const editEvent = new CustomEvent("editButtonLink", {
						detail: {
							node,
							pos,
							href,
							text,
							style,
						},
					});
					window.dispatchEvent(editEvent);
				}
			});

			dom.appendChild(button);

			return {
				dom,
				update: (updatedNode) => {
					if (updatedNode.type !== this.type) {
						return false;
					}

					// Update the button when attributes change
					const {
						href: newHref,
						text: newText,
						style: newStyle,
					} = updatedNode.attrs;
					const newSelectedStyle =
						buttonStyles[newStyle as keyof typeof buttonStyles] ||
						buttonStyles.primary;

					button.href = newHref || "#";
					button.textContent = newText || "Button";
					button.style.backgroundColor = newSelectedStyle.backgroundColor;
					button.style.color = newSelectedStyle.color;

					// Update data attributes
					dom.setAttribute("data-href", newHref || "");
					dom.setAttribute("data-text", newText || "");
					dom.setAttribute("data-style", newStyle || "primary");

					return true;
				},
			};
		};
	},
});
