import type { ChangeEvent } from 'react';
import { parseNumericInput, parseWeightInput, formatNumber } from '../../utils/numbers';

type VariantCombinationSectionProps = {
	combinationKey: string | null;
	combinationLabel: string;
	isCombinationSelected: boolean;
	priceByCombination: Record<string, string>;
	weightByCombination: Record<string, string>;
	onPriceChange: (combinationKey: string, value: string) => void;
	onWeightChange: (combinationKey: string, value: string) => void;
	cnyToKgsRate: number;
	ratePerKg: number;
};

export const VariantCombinationSection = ({
	combinationKey,
	combinationLabel,
	isCombinationSelected,
	priceByCombination,
	weightByCombination,
	onPriceChange,
	onWeightChange,
	cnyToKgsRate,
	ratePerKg,
}: VariantCombinationSectionProps) => {
	const priceValue = combinationKey
		? (priceByCombination[combinationKey] ?? '')
		: '';
	const weightValue = combinationKey
		? (weightByCombination[combinationKey] ?? '')
		: '';
	const parsedPriceCny = isCombinationSelected
		? parseNumericInput(priceValue)
		: null;
	const priceInKgs =
		parsedPriceCny !== null ? parsedPriceCny * cnyToKgsRate : null;
	const parsedWeight = isCombinationSelected
		? parseWeightInput(weightValue)
		: null;
	const weightCost = parsedWeight !== null ? parsedWeight * ratePerKg : null;
	const totalCost =
		priceInKgs !== null || weightCost !== null
			? (priceInKgs ?? 0) + (weightCost ?? 0)
			: null;
	const formattedPriceInKgs =
		priceInKgs !== null ? formatNumber(priceInKgs, 2) : null;
	const formattedWeightCost =
		weightCost !== null ? formatNumber(weightCost, 2) : null;
	const formattedTotalCost =
		totalCost !== null ? formatNumber(totalCost, 2) : null;
	const displayWeight =
		parsedWeight !== null ? formatNumber(parsedWeight, 3) : null;

	const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!combinationKey) {
			return;
		}
		onPriceChange(combinationKey, event.target.value);
	};

	const handleWeightChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!combinationKey) {
			return;
		}
		onWeightChange(combinationKey, event.target.value);
	};

	return (
		<section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
					{isCombinationSelected
						? combinationLabel || 'Варианты выбраны'
						: 'Выберите вариант в каждой категории'}
				</div>
				<div className="flex items-baseline gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-lg font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
					{formattedTotalCost ? (
						<>
							~{formattedTotalCost}
							<span className="text-sm font-medium"> сом</span>
						</>
					) : (
						<span className="text-sm font-medium text-purple-500/70 dark:text-purple-300/70">
							—
						</span>
					)}
				</div>
			</header>

			<div className="mt-4 grid gap-3 sm:grid-cols-2">
				<label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
					<span>Цена, ¥</span>
					<div
						className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
							isCombinationSelected
								? 'border-purple-200 bg-white shadow-sm dark:border-purple-500/40 dark:bg-slate-900'
								: 'border-slate-200 bg-white/60 text-slate-400 dark:border-slate-700 dark:bg-slate-900/50'
						}`}
					>
						<span className="font-semibold text-purple-600 dark:text-purple-300">
							¥
						</span>
						<input
							type="number"
							step="0.01"
							min="0"
							value={priceValue}
							onChange={handlePriceChange}
							disabled={!isCombinationSelected}
							placeholder={isCombinationSelected ? '0.00' : ''}
							className="flex-1 bg-transparent text-right text-base text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100"
						/>
					</div>
				</label>
				<label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
					<span>Вес, кг</span>
					<div
						className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
							isCombinationSelected
								? 'border-purple-200 bg-white shadow-sm dark:border-purple-500/40 dark:bg-slate-900'
								: 'border-slate-200 bg-white/60 text-slate-400 dark:border-slate-700 dark:bg-slate-900/50'
						}`}
					>
						<input
							type="text"
							inputMode="decimal"
							value={weightValue}
							onChange={handleWeightChange}
							disabled={!isCombinationSelected}
							placeholder={isCombinationSelected ? '0.8' : ''}
							className="flex-1 bg-transparent text-right text-base text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100"
						/>
						{parsedWeight !== null ? (
							<span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
								≈ {displayWeight} кг
							</span>
						) : null}
					</div>
				</label>
			</div>

			<footer className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
				<div>Цена: {formattedPriceInKgs ?? '—'} сом</div>
				<div>
					Вес: {formattedWeightCost ?? '—'} сом
					{parsedWeight !== null && (
						<span className="text-slate-400 dark:text-slate-500">
							{' '}
							· @ {ratePerKg} сом/кг
						</span>
					)}
				</div>
			</footer>
		</section>
	);
};

