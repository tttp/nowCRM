/**
 * Represent Strapi id -> string used to connect and disconnect entities
 *
 */
export type DocumentId = string;

/**
 * Represent Basic type of entity in strapi
 * `name` is common field for naming if not used -> Omit it
 *
 */
export interface BaseType {
	documentId: DocumentId;
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Represent Basic type of entity in strapi for Post requests
 * `name` is common field for naming if not used -> Omit it
 *
 */
export interface BaseFormType {
	name: string;
	publishedAt: Date;
}
