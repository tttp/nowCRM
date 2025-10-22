"use server";

import { auth } from "@/auth";
import {
	handleError,
	type StandardResponse,
} from "@/lib/services/common/response.service";
import { journeyStepConnectionsService } from "@/lib/services/new_type/journeyStepConnections.service";
import journeyStepsService from "@/lib/services/new_type/journeySteps.service";
import journeysService from "@/lib/services/new_type/journeys.service";
import { journeyStepRuleService } from "@/lib/services/new_type/journeysStepRule.service";
import { journeyStepRuleScoresService } from "@/lib/services/new_type/journeysStepRuleScore.service";
import { CommunicationChannel } from "@/lib/static/channel-icons";
import type { Form_Journey } from "@/lib/types/new_type/journey";
import type { Form_JourneyStep } from "@/lib/types/new_type/journeyStep";
import type { Form_JourneyStepConnection } from "@/lib/types/new_type/journeyStepConnection";
import type { Form_JourneyStepRule } from "@/lib/types/new_type/journeyStepRule";
import type { Form_JourneyStepRuleScore } from "@/lib/types/new_type/journeyStepRuleScore";

// Update journey
export async function updateJourney(
	journeyId: number,
	data: Partial<Form_Journey>,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		return await journeysService.update(journeyId, data);
	} catch (error) {
		console.error("Error updating journey:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to update journey",
		};
	}
}

export async function activateJourney(
	journeyId: number,
	active: boolean,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	const journey = await journeysService.findOne(journeyId, {
		populate: {
			journey_steps: {
				populate: {
					composition: true,
					channel: true,
					identity: true,
				},
			},
		},
	});

	// Collect invalid steps and why each one failed
	const invalidSteps: Array<{ name: string; reasons: string[] }> = [];

	if (journey.data?.journey_steps?.length) {
		for (const step of journey.data.journey_steps) {
			const reasons: string[] = [];
			if (step.type === "channel") {
				if (!step.composition) {
					reasons.push("missing composition");
				}
				if (!step.channel) {
					reasons.push("missing channel");
				}

				// Only check identity if it's email
				const channelName = step.channel?.name;
				const isEmail = Boolean(
					channelName &&
						channelName.toLowerCase() ===
							CommunicationChannel.EMAIL.toLowerCase(),
				);
				if (isEmail && !step.identity) {
					reasons.push("missing identity for email channel");
				}
			}
			if (step.type === "trigger") {
				if (!step.additional_data?.entity) {
					reasons.push("missing entity");
				}

				if (!step.additional_data?.event) {
					reasons.push("missing event");
				}
			}
			if (step.type === "scheduler-trigger") {
				if (step.timing?.type === "publish" && !step.timing?.value) {
					reasons.push("missing date for scheduler trigger");
				}
			}

			if (step.type === "wait") {
				if (!step.timing?.value) {
					switch (step.timing?.type) {
						case "delay":
							reasons.push("missing delay duration");
							break;
						case "publish":
							reasons.push("missing date and time for wait step");
							break;
						default:
							break;
					}
				}
			}

			if (reasons.length > 0) {
				invalidSteps.push({
					name: step.name,
					reasons,
				});
			}
		}
	} else {
		invalidSteps.push({
			name: "(No journey_steps found)",
			reasons: ["no journey_steps returned from DB"],
		});
	}

	// If any invalid steps, return 400 with detailed reasons
	if (invalidSteps.length > 0) {
		const detailStrings = invalidSteps.map(
			({ name, reasons }) => `${name}: ${reasons.join(", ")}`,
		);
		return {
			data: null,
			status: 400,
			success: false,
			errorMessage: `Steps with invalid data: ${detailStrings.join("; ")}`,
		};
	}

	try {
		return await journeysService.update(journeyId, { active });
	} catch (error) {
		console.error("Error updating journey:", error);
		return handleError(error);
	}
}

// Create a new step
export async function createStep(
	data: Form_JourneyStep,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		// Add publishedAt date if not provided
		if (!data.publishedAt) {
			data.publishedAt = new Date();
		}

		return await journeyStepsService.create(data);
	} catch (error) {
		console.error("Error creating step:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to create step",
		};
	}
}

// Update an existing step
export async function updateStep(
	stepId: number,
	data: Partial<Form_JourneyStep>,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}
	try {
		return await journeyStepsService.update(stepId, data);
	} catch (error) {
		console.error("Error updating step:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to update step",
		};
	}
}

// Delete a step
export async function deleteStep(
	stepId: number,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		//clear all connection to this node
		const connects = await journeyStepConnectionsService.findAll({
			filters: {
				target_step: { id: { $eq: stepId } },
			},
		});
		connects.data?.map(async (item) => {
			await journeyStepConnectionsService.delete(item.id);
		});
		return await journeyStepsService.delete(stepId);
	} catch (error) {
		console.error("Error deleting step:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to delete step",
		};
	}
}

// Update connection priorities
export async function updateConnectionPriorities(
	connectionPriorities: { connectionId: number; priority: number }[],
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		// Update each connection with its new priority
		const updatePromises = connectionPriorities.map(
			({ connectionId, priority }) =>
				journeyStepConnectionsService.update(connectionId, { priority }),
		);

		await Promise.all(updatePromises);

		return {
			data: true,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error updating connection priorities:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to update connection priorities",
		};
	}
}

// Create a new connection between steps
export async function createConnection(
	data: Form_JourneyStepConnection,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		// Add publishedAt date if not provided
		if (!data.publishedAt) {
			data.publishedAt = new Date();
		}

		return await journeyStepConnectionsService.create(data);
	} catch (error) {
		console.error("Error creating connection:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to create connection",
		};
	}
}

// Update an existing connection
export async function updateConnection(
	connectionId: number,
	data: Partial<Form_JourneyStepConnection>,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		return await journeyStepConnectionsService.update(connectionId, data);
	} catch (error) {
		console.error("Error updating connection:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to update connection",
		};
	}
}

// Delete a connection
export async function deleteConnection(
	connectionId: number,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		return await journeyStepConnectionsService.delete(connectionId);
	} catch (error) {
		console.error("Error deleting connection:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to delete connection",
		};
	}
}

// Create a rule for a connection
export async function createRule(
	data: Form_JourneyStepRule,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		// Add publishedAt date if not provided
		if (!data.publishedAt) {
			data.publishedAt = new Date();
		}

		return await journeyStepRuleService.create(data);
	} catch (error) {
		console.error("Error creating rule:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to create rule",
		};
	}
}

// Create a rule score
export async function createRuleScore(
	data: Form_JourneyStepRuleScore,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		// Add publishedAt date if not provided
		if (!data.publishedAt) {
			data.publishedAt = new Date();
		}

		return await journeyStepRuleScoresService.create(data);
	} catch (error) {
		console.error("Error creating rule score:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to create rule score",
		};
	}
}

// Update connection rules
export async function updateConnectionRules(
	connectionId: number,
	rules: {
		id?: number;
		condition: string;
		condition_operator: string;
		ready_condition: string;
		additional_condition: string;
		additional_data: string;
		label: string;
		condition_value: string;
		scores?: { id?: number; attribute: string; value: string }[];
	}[],
	condition_type: "all" | "any",
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Not authenticated",
		};
	}

	try {
		// First, update the connection with the condition type
		const connectionUpdateResult = await journeyStepConnectionsService.update(
			connectionId,
			{
				condition_type: condition_type,
			},
		);

		if (!connectionUpdateResult.success) {
			return connectionUpdateResult;
		}

		// Get existing rules for this connection
		const existingRulesResponse = await journeyStepRuleService.find({
			filters: { journey_step_connection: { id: { $eq: connectionId } } },
			populate: {
				journey_step_rule_scores: true,
			},
		});

		if (!existingRulesResponse.success || !existingRulesResponse.data) {
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to fetch existing rules",
			};
		}

		const existingRules = existingRulesResponse.data;

		// Create a map of existing rule IDs
		const existingRuleIds = new Set(existingRules.map((rule) => rule.id));

		// Process each rule
		for (const rule of rules) {
			if (rule.id && typeof rule.id === "number") {
				// Rule exists, update it
				existingRuleIds.delete(rule.id);
				await journeyStepRuleService.update(rule.id, {
					condition: rule.condition,
					condition_operator: rule.condition_operator,
					ready_condition: rule.ready_condition,
					additional_data: rule.additional_data,
					additional_condition: rule.additional_condition,
					condition_value:
						typeof rule.condition_value === "object"
							? JSON.stringify(rule.condition_value)
							: rule.condition_value,
					label: rule.label,
				});

				// Handle scores for this rule
				if (rule.scores && rule.scores.length > 0) {
					// Get existing scores for this rule
					const existingScores =
						existingRules.find((r) => r.id === rule.id)
							?.journey_step_rule_scores || [];

					const existingScoreIds = new Set(
						existingScores.map((score) => score.id),
					);

					// Process each score
					for (const score of rule.scores) {
						if (score.id) {
							// Score exists, update it
							existingScoreIds.delete(score.id);

							await journeyStepRuleScoresService.update(score.id, {
								name: score.attribute,
								value: score.value,
							});
						} else {
							// Create new score
							await journeyStepRuleScoresService.create({
								journey_step_rule: rule.id,
								name: score.attribute,
								value: score.value,
								publishedAt: new Date(),
							});
						}
					}

					// Delete scores that no longer exist
					for (const scoreId of existingScoreIds) {
						await journeyStepRuleScoresService.delete(scoreId);
					}
				} else {
					// No scores provided, delete all existing scores for this rule
					const existingScores =
						existingRules.find((r) => r.id === rule.id)
							?.journey_step_rule_scores || [];

					for (const score of existingScores) {
						await journeyStepRuleScoresService.delete(score.id);
					}
				}
			} else {
				// Create new rule
				const newRuleResult = await journeyStepRuleService.create({
					journey_step_connection: connectionId,
					condition: rule.condition,
					condition_operator: rule.condition_operator,
					condition_value: rule.condition_value,
					label: rule.label,
					ready_condition: rule.ready_condition,
					additional_data: rule.additional_data,
					additional_condition: rule.additional_condition,
					publishedAt: new Date(),
				});

				if (
					newRuleResult.success &&
					newRuleResult.data &&
					rule.scores &&
					rule.scores.length > 0
				) {
					// Create scores for the new rule
					for (const score of rule.scores) {
						await journeyStepRuleScoresService.create({
							journey_step_rule: newRuleResult.data.id,
							name: score.attribute,
							value: score.value,
							publishedAt: new Date(),
						});
					}
				}
			}
		}

		// Delete rules that no longer exist
		for (const ruleId of existingRuleIds) {
			await journeyStepRuleService.delete(ruleId);
		}

		return {
			data: true,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error updating connection rules:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: "Failed to update connection rules",
		};
	}
}
