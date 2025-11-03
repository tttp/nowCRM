// This file contains the prompt templates used for various tasks in the application.
// These templates are used to guide the AI model in generating responses based on user input.
// The prompts are designed to be clear and specific, ensuring that the AI understands the task at hand.
export const BASE_PROMPT = (
	reference_result: string,
	additional_prompt?: string,
) =>
	additional_prompt
		? `You are an expert text writer specializing in enhancing and refining user-provided text.

The user has provided their main text in brackets: [${reference_result}]
They also have specific requirements for improvement, given in brackets: [${additional_prompt}]

Your task is to generate an improved version of the main text while incorporating the requested changes as closely as possible. However, ensure that the core meaning and structure of the original text remain largely intact. Focus on refinement, clarity, and natural flow without making drastic modifications.

Your response should only contain the revised text without any additional commentary.`
		: `Do the following task on text in brackets: [${reference_result}]`;

export const REMOVE_HTML_PROMPT =
	"Remove all HTML tags and content. Provide ONLY plain text, preserving spacing and line breaks.";

export const SUMMARIZATION_PROMPT = (
	reference_result: string,
	max_content_length: number,
) =>
	`IMPORTANT: You MUST summarize the text so that the final output is STRICTLY under ${max_content_length} characters, including spaces and punctuation. DO NOT EXCEED THIS LIMIT.

You must preserve the most essential ideas. The output MUST end with the marker <<END>>.

Here’s how it should look:
Input: [Our new product helps busy people save time every day by automating daily chores using smart scheduling.]
Output (62 chars): Save time daily with our smart chore automation product. <<END>>

Now process the following input:
[${reference_result}]

Only return the summarized text ending with <<END>>. No commentary, markdown, or formatting.`;

export const REWRITE_PROMPT = (max_content_length: number) =>
	`The current content is too long.

You must rewrite or summarize it so the final result is strictly under ${max_content_length} characters. This includes all punctuation and spaces.

The revised version must maintain the message’s meaning and natural tone. The result should be clean, easy to read, and not feel abruptly cut.

End your result with the marker: <<END>>`;

export const QUICK_TEXT_CREATE_PROMPT = (
	title: string,
	style?: string,
	language?: string,
	additional_context?: string,
	target_length?: string,
) =>
	`You are a versatile text generation AI. Your task is to create a piece of text based on the following specifications:

1. Title: "${title}"
2. Writing Style: ${style || "Default"}
3. Language: ${language || "English"}${
		additional_context
			? `\n4. Additional Context/Keywords: ${additional_context}`
			: ""
	}${target_length ? `\n5. Desired Length: ${target_length}` : ""}

Please generate the text that effectively incorporates these elements. The output should only include the generated text itself, without any introductory phrases or explanations. Focus on producing high-quality content that aligns with the given title and adheres to the specified style and language.`;

/**
 * Generates a prompt for an AI model to analyze input data and return a structured JSON object.
 *
 * @param input_data - A string containing the data fields to be analyzed (e.g., "Full Name: John Doe, Email: john.doe@example.com").
 * @param structure_scheme - A string representing the desired JSON output structure (e.g., '{"firstName": "string", "lastName": "string"}').
 * @param language - An optional language code (e.g., "de", "fr") for the output.
 * @returns A complete prompt string to be sent to the AI.
 */
export const ENRICH_PROMPT = (
	input_data: string,
	structure_scheme: string,
	language?: string,
) =>
	`Instructions:
- Only provide enrichment for the requested fields.
- Use professional context and industry knowledge.
- If a field already has a value, suggest improvements or corrections if needed.
- For social media URLs, ensure they are valid and properly formatted.

Analyze the provided data fields: ${input_data}

Return a single, minified JSON object that strictly adheres to this structure: ${structure_scheme}.
${language ? `All values must be in ${language}.` : ""}
Do not include any explanations, markdown, or text other than the required JSON object.`;

export const HTML_FORMAT_PROMPT = `
DO NOT include a subject line, title, or heading in the email (such as <h1> or bold titles). The subject will be provided separately. Start directly with the greeting or message body.

Format the output as a responsive HTML email, using inline styles for maximum compatibility across email clients. Ensure proper structure with tags, and maintain a clean, readable layout.
Use tags that require rendering by non-default editors (like <button>) only if the user explicitly asks for them.
Do not wrap the output in markdown-style code blocks such as \`\`\`html or \`\`\`. Return only the raw HTML content, without any additional formatting or annotations.
	`;
