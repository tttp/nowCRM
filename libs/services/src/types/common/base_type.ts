
 /**
 * Represent Strapi id -> string used to connect and disconnect entities
 * 
 */
export type DocumentId = string;

export interface BaseType {
	documentId: DocumentId;
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface BaseFormType {
	name: string;
	publishedAt: Date;
}
