export interface Product {
	id: string;
	name: string;
	nameRu: string;
	categories: {
		name: string;
		nameRu: string;
		variants: {
			name: string;
			nameRu: string;
		}[];
	}[];
}

