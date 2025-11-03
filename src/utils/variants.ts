import type { Product } from '../types/product';

export const getVariantCombinationKey = (
	categories: Array<{ variants: unknown[] }>,
	selectedVariants: Record<number, number>,
): string | null => {
	if (!categories.length) {
		return null;
	}

	const parts: string[] = [];

	for (let index = 0; index < categories.length; index += 1) {
		const variantIndex = selectedVariants[index];
		if (variantIndex === undefined) {
			return null;
		}
		parts.push(`${index}:${variantIndex}`);
	}

	return parts.join('|');
};

export const getCombinationLabel = (
	categories: Product['categories'],
	selectedVariants: Record<number, number>,
	activeLang: 'cn' | 'ru',
): string => {
	if (!categories.length) {
		return '';
	}

	const parts: string[] = [];
	for (let index = 0; index < categories.length; index += 1) {
		const variantIndex = selectedVariants[index];
		if (variantIndex === undefined) {
			return '';
		}
		const variant = categories[index]?.variants[variantIndex];
		if (!variant) {
			return '';
		}
		parts.push(activeLang === 'ru' ? variant.nameRu : variant.name);
	}

	return parts.join(' / ');
};

export const getDefaultSelectedVariants = (
	categories: Product['categories'],
): Record<number, number> => {
	if (categories.length === 1 && categories[0]?.variants.length === 1) {
		return { 0: 0 };
	}
	return {};
};

