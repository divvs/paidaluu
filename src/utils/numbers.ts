export const parseNumericInput = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const numericValue = Number(trimmed);
	return Number.isFinite(numericValue) ? numericValue : null;
};

export const parseWeightInput = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const normalizedDecimals = trimmed.replace(/,/g, '.');
	const numericCandidate = normalizedDecimals.replace(/\s+/g, '');
	const numericValue = Number(numericCandidate);

	if (Number.isFinite(numericValue)) {
		return numericValue;
	}

	if (/^[0-9+\-*/().\s.]+$/.test(normalizedDecimals)) {
		try {
			const result = Function('return (' + normalizedDecimals + ');')();
			return typeof result === 'number' && Number.isFinite(result)
				? result
				: null;
		} catch {
			return null;
		}
	}

	return null;
};

export const formatNumber = (value: number, fractionDigits: number) =>
	value.toLocaleString('ru-RU', {
		minimumFractionDigits: 0,
		maximumFractionDigits: fractionDigits,
	});

