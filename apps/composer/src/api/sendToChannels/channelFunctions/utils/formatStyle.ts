export const inlineLinkAndUnderlineStyles = (html: string): string => {
	// 1) Merge <span style> into direct <a> tags
	html = html.replace(
		/<span style="([^"]+)">([^<]*)<\/span>\s*<a([^>]*?)style="([^"]*?)"([^>]*)>([\s\S]*?)<\/a>/gi,
		(_match, spanStyle, textBefore, aBefore, aStyle, aAfter, linkContent) => {
			const mergedStyle = `${spanStyle};${aStyle}`.replace(/;;+/g, ";");
			return `<span style="${spanStyle}">${textBefore}</span><a${aBefore}style="${mergedStyle}"${aAfter}>${linkContent}</a>`;
		},
	);

	// 2) Merge <span style> into direct <u> tags
	html = html.replace(
		/<span style="([^"]+)">([^<]*)<\/span>\s*<u([^>]*?)style="([^"]*?)"([^>]*)>([\s\S]*?)<\/u>/gi,
		(_match, spanStyle, textBefore, uBefore, uStyle, uAfter, uContent) => {
			const mergedStyle = `${spanStyle};${uStyle}`.replace(/;;+/g, ";");
			return `<span style="${spanStyle}">${textBefore}</span><u${uBefore}style="${mergedStyle}"${uAfter}>${uContent}</u>`;
		},
	);

	// 3) Merge parent <a style> into nested <u> inside links
	html = html.replace(
		/<a([^>]*?)style="([^"]*?)"([^>]*)>\s*<u([^>]*?)style="([^"]*?)"([^>]*)>([\s\S]*?)<\/u>\s*<\/a>/gi,
		(_match, aBefore, aStyle, aAfter, uBefore, uStyle, uAfter, uContent) => {
			const mergedStyle = `${aStyle};${uStyle}`.replace(/;;+/g, ";");
			return `<a${aBefore}style="${aStyle}"${aAfter}><u${uBefore}style="${mergedStyle}"${uAfter}>${uContent}</u></a>`;
		},
	);

	return html;
};
