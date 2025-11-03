export const LanguageSwitcher = ({
	activeLang,
	onLanguageChange,
}: {
	activeLang: 'cn' | 'ru';
	onLanguageChange: (lang: 'cn' | 'ru') => void;
}) => {
	return (
		<div className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
			<button
				type="button"
				onClick={() => onLanguageChange('cn')}
				className={`rounded-full px-3 py-1.5 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
					activeLang === 'cn'
						? 'bg-purple-500 text-white shadow-sm shadow-purple-500/30'
						: 'text-slate-600 hover:bg-white hover:text-purple-600 dark:text-slate-200'
				}`}
			>
				🇨🇳
			</button>
			<button
				type="button"
				onClick={() => onLanguageChange('ru')}
				className={`rounded-full px-3 py-1.5 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
					activeLang === 'ru'
						? 'bg-purple-500 text-white shadow-sm shadow-purple-500/30'
						: 'text-slate-600 hover:bg-white hover:text-purple-600 dark:text-slate-200'
				}`}
			>
				🇷🇺
			</button>
		</div>
	);
};
