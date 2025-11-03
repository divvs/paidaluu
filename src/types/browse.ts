export type Status = 'all' | 'postponed' | 'to-order' | 'shipping' | 'archive';

export type BrowseProduct = {
	id: string;
	name: string;
	nameRu: string;
	status: Exclude<Status, 'all'>;
	price: number; // Price in KGS
	priceCny: number; // Original price in CNY
	weight: number; // Weight in kg
	deliveryCost: number;
	image?: string;
	folderId?: string | null;
	variants?: string; // Selected variants combination as string (e.g., "Вкус: Оригинальный, Размер: Средний")
};

export type VariantCategory = {
	name: string;
	variants: string[];
};

export type ProductImage = {
	id: string;
	src: string;
	alt?: string;
	extractedAlt?: string; // Extracted and translated text from image
};

export type Folder = {
	id: string;
	name: string;
};

