type BottomSliderProps = {
	activeIndex: number;
	count: number;
	onSelect: (index: number) => void;
};

export const BottomSlider = ({ activeIndex, count, onSelect }: BottomSliderProps) => {
	const dots = Array.from({ length: count }, (_, index) => index);

	return (
		<div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
			<div className="pointer-events-auto flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
				{dots.map((index) => {
					const isActive = index === activeIndex;
					return (
						<button
							key={index}
							type="button"
							onClick={() => onSelect(index)}
							className={`rounded-full transition-all duration-200 ${
								isActive
									? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md scale-110'
									: 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110'
							}`}
							aria-label={`Go to slide ${index + 1}`}
							aria-current={isActive}
						/>
					);
				})}
			</div>
		</div>
	);
};
