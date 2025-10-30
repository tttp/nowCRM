export type StrapiImageFormat = {
	id?: string;
	ext: string;
	url: string;
	hash: string;
	name: string;
	path: string | null;
	height: number;
	width: number;
	size: number;
};

type Asset = {
	id: number;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number | null;
	height: number | null;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: string;
	provider: string;
	formats: {
		large: StrapiImageFormat;
		medium: StrapiImageFormat;
		small: StrapiImageFormat;
		thumbnail: StrapiImageFormat;
	};
	provider_metadata: string;
	createdAt: Date;
	updatedAt: Date;
};

export default Asset;
