import type { Product } from '../../types/product';

export type CategoryVariantsSelectorProps = {
	categories: Product['categories'];
	activeLang: 'cn' | 'ru';
	selectedVariants: Record<number, number>;
	onVariantSelect: (categoryIndex: number, variantIndex: number) => void;
};

export const CategoryVariantsSelector = ({
	categories,
	activeLang,
	selectedVariants,
	onVariantSelect,
}: CategoryVariantsSelectorProps) => {
	if (!categories.length) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4">
			{categories.map((category, categoryIndex) => {
				const selectedVariantIndex = selectedVariants[categoryIndex];

				return (
					<div
						key={`${category.name}-${categoryIndex}`}
						className="space-y-3 rounded-xl border border-slate-200/70 bg-white/90 p-4 shadow-sm transition dark:border-slate-700/70 dark:bg-slate-900/70"
					>
						<div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
							<span>
								{activeLang === 'ru' ? category.nameRu : category.name}
							</span>
							<span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
								{selectedVariantIndex !== undefined ? 'Выбрано' : 'Не выбрано'}
							</span>
						</div>
						<div className="grid gap-2 sm:grid-cols-2">
							{category.variants.map((variant, variantIndex) => {
								const isSelected = selectedVariantIndex === variantIndex;

								return (
									<button
										key={`${variant.name}-${variantIndex}`}
										type="button"
										onClick={() => onVariantSelect(categoryIndex, variantIndex)}
										aria-pressed={isSelected}
										className={`w-full rounded-xl border px-3 py-2 text-left text-sm leading-relaxed transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
											isSelected
												? 'border-transparent bg-purple-500 text-white shadow-md shadow-purple-500/40'
												: 'border-slate-200 bg-white/80 text-slate-600 hover:border-purple-300 hover:text-purple-600 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-purple-400/60 dark:hover:text-purple-300'
										}`}
									>
										{activeLang === 'ru' ? variant.nameRu : variant.name}
									</button>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};

