export const WRITING_INSTRUCTION_EXAMPLES = [
	`Be Specific About Your Needs: Instead of "write something about dogs," try "write a 500-word informative article about dog training techniques for new puppy owners, focusing on positive reinforcement methods."`,

	`Define the Format and Structure: Specify exactly what you want: "Write a formal business email," "Create a casual blog post with subheadings," or "Draft a persuasive essay with introduction, three main points, and conclusion."`,

	`Provide Context and Background: Give the AI relevant information: "I'm a small business owner writing to potential clients" or "This is for a college application essay about overcoming challenges."`,

	`Set the Tone and Style: Be explicit about voice: "Write in a conversational, friendly tone," "Use professional business language," or "Make it humorous and engaging for teenagers."`,

	`Include Your Audience: Specify who will read this: "for busy executives," "for parents of young children," or "for people new to investing."`,

	`Give Examples When Possible: If you have a particular style in mind, share a sample or reference: "Similar to how Malcolm Gladwell explains complex topics" or "In the style of a product description on Apple's website."`,

	`Specify Constraints: Include word count, key points to cover, things to avoid, or required elements: "Must include statistics," "Avoid technical jargon," or "Include a clear call-to-action."`,

	`Use Step-by-Step Instructions: For complex requests: "First, create an outline. Then write the introduction focusing on the problem. Next, provide three solutions with examples."`,
];

export interface WritingPersona {
	id: string;
	name: string;
	description: string;
	category: "professional" | "creative" | "industry" | "communication";
}

export const WRITING_PERSONAS: WritingPersona[] = [
	// Professional Personas
	{
		id: "marketing-copywriter",
		name: "Marketing Copywriter",
		description: "Specializing in conversion-focused content",
		category: "professional",
	},
	{
		id: "technical-writer",
		name: "Technical Writer",
		description: "Who explains complex topics simply",
		category: "professional",
	},
	{
		id: "executive-comms",
		name: "Executive Communication Specialist",
		description: "For C-suite messaging",
		category: "professional",
	},
	{
		id: "grant-writer",
		name: "Grant Writer",
		description: "With expertise in nonprofit funding",
		category: "professional",
	},
	{
		id: "legal-writer",
		name: "Legal Writer",
		description: "Who creates clear contracts and policies",
		category: "professional",
	},
	{
		id: "academic-researcher",
		name: "Academic Researcher",
		description: "Writing for peer-reviewed journals",
		category: "professional",
	},

	// Creative Personas
	{
		id: "novelist",
		name: "Novelist",
		description: "Known for character-driven storytelling",
		category: "creative",
	},
	{
		id: "screenwriter",
		name: "Screenwriter",
		description: "Specializing in dialogue and pacing",
		category: "creative",
	},
	{
		id: "travel-blogger",
		name: "Travel Blogger",
		description: "With vivid, immersive descriptions",
		category: "creative",
	},
	{
		id: "food-writer",
		name: "Food Writer",
		description: "Who makes readers taste through words",
		category: "creative",
	},
	{
		id: "poetry-editor",
		name: "Poetry Editor",
		description: "With expertise in contemporary verse",
		category: "creative",
	},
	{
		id: "childrens-author",
		name: "Children's Book Author",
		description: "Using age-appropriate language",
		category: "creative",
	},

	// Industry Expert Personas
	{
		id: "financial-advisor",
		name: "Financial Advisor",
		description: "Explaining investment strategies",
		category: "industry",
	},
	{
		id: "healthcare-pro",
		name: "Healthcare Professional",
		description: "Discussing medical topics",
		category: "industry",
	},
	{
		id: "tech-consultant",
		name: "Technology Consultant",
		description: "Breaking down digital trends",
		category: "industry",
	},
	{
		id: "fitness-trainer",
		name: "Fitness Trainer",
		description: "Motivating through written content",
		category: "industry",
	},
	{
		id: "real-estate-agent",
		name: "Real Estate Agent",
		description: "Describing properties compellingly",
		category: "industry",
	},
	{
		id: "environmental-scientist",
		name: "Environmental Scientist",
		description: "Communicating climate issues",
		category: "industry",
	},

	// Communication Style Personas
	{
		id: "motivational-speaker",
		name: "Motivational Speaker",
		description: "Inspiring action through words",
		category: "communication",
	},
	{
		id: "journalist",
		name: "Journalist",
		description: "Delivering facts with engaging storytelling",
		category: "communication",
	},
	{
		id: "teacher",
		name: "Teacher",
		description: "Explaining concepts with patience and clarity",
		category: "communication",
	},
	{
		id: "comedian",
		name: "Stand-up Comedian",
		description: "Adding humor to any topic",
		category: "communication",
	},
	{
		id: "therapist",
		name: "Therapist",
		description: "Offering supportive, empathetic guidance",
		category: "communication",
	},
	{
		id: "debate-coach",
		name: "Debate Coach",
		description: "Presenting persuasive arguments",
		category: "communication",
	},
	{
		id: "campaigner",
		name: "Campaigner",
		description: "Advocating for causes with passionate, persuasive messaging",
		category: "communication",
	},
];

export function getRandomInstruction(): string {
	const randomIndex = Math.floor(
		Math.random() * WRITING_INSTRUCTION_EXAMPLES.length,
	);
	return WRITING_INSTRUCTION_EXAMPLES[randomIndex];
}

export function getRandomPersona(): WritingPersona {
	const randomIndex = Math.floor(Math.random() * WRITING_PERSONAS.length);
	return WRITING_PERSONAS[randomIndex];
}
