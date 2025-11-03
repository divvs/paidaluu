import { useState, useRef } from 'react';
import { Search, Loader2, Upload } from 'lucide-react';

type TranslateViewProps = {
	translateInput: string;
	onTranslateInputChange: (value: string) => void;
	onTranslate: () => void;
	isTranslating: boolean;
	screenshotList: string[];
	onScreenshotListChange: (list: string[]) => void;
};

export const TranslateView = ({
	translateInput,
	onTranslateInputChange,
	onTranslate,
	isTranslating,
	screenshotList,
	onScreenshotListChange,
}: TranslateViewProps) => {
	const [isProcessingScreenshot, setIsProcessingScreenshot] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handleSearch = (query: string) => {
		// Redirect to external search apps
		const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
		window.open(searchUrl, '_blank');
	};

	const handleScreenshotUpload = async (_file: File) => {
		setIsProcessingScreenshot(true);
		// TODO: Send screenshot to AI API for extraction and translation
		// For now, simulate processing
		setTimeout(() => {
			// In real app, this would come from AI API response
			onScreenshotListChange(['Extracted suggestion 1', 'Extracted suggestion 2', 'Extracted suggestion 3']);
			setIsProcessingScreenshot(false);
		}, 2000);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			handleScreenshotUpload(file);
		}
		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handlePaste = async (e: React.ClipboardEvent) => {
		const items = e.clipboardData.items;
		for (let i = 0; i < items.length; i++) {
			if (items[i].type.startsWith('image/')) {
				const file = items[i].getAsFile();
				if (file) {
					handleScreenshotUpload(file);
				}
				break;
			}
		}
	};

	return (
		<div className="p-4 flex flex-col items-center gap-4">
			{/* Translation Input Field */}
			<div className="flex items-center gap-2 w-full max-w-md">
				<div className="flex-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 dark:focus-within:border-blue-600">
					<input
						type="text"
						value={translateInput}
						onChange={(e) => onTranslateInputChange(e.target.value)}
						placeholder="Введите текст для перевода"
						disabled={isTranslating}
						className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !isTranslating) {
								onTranslate();
							}
						}}
					/>
				</div>
			</div>

			{/* Divider */}
			<div className="w-full max-w-md border-t border-gray-200 dark:border-gray-700 my-1"></div>

			{/* Screenshot Upload/Paste Area */}
			<div className="w-full max-w-md">
				<div className="flex items-center justify-between mb-2 px-1">
					<p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
						Скриншот поисковых запросов
					</p>
					<div
						className="relative"
						onPaste={handlePaste}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileInputChange}
							className="hidden"
						/>
						{isProcessingScreenshot ? (
							<button
								type="button"
								disabled
								className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-sm"
								title="Обработка..."
							>
								<Loader2 className="w-4 h-4 animate-spin" />
							</button>
						) : (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
								title="Загрузить скриншот"
							>
								<Upload className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Screenshot-based Search Suggestions List */}
			{screenshotList.length > 0 && (
				<div className="w-full max-w-md space-y-2 mt-1">
					{screenshotList.map((suggestion, index) => (
						<div
							key={index}
							className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 group"
							onClick={() => handleCopy(suggestion)}
						>
							<span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{suggestion}</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleSearch(suggestion);
								}}
								className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 ml-2 group-hover:scale-110"
								title="Искать"
							>
								<Search className="w-3.5 h-3.5" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

