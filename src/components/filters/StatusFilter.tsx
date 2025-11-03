import { Clock, ShoppingCart, Truck, Archive } from 'lucide-react';
import type { Status } from '../../types';

type StatusFilterProps = {
	activeStatus: Status;
	onStatusChange: (status: Status) => void;
};

export function StatusFilter({
	activeStatus,
	onStatusChange,
}: StatusFilterProps) {
	const filters: Array<{
		id: Status;
		label: string;
		icon: typeof Clock | null;
	}> = [
		{ id: 'all', label: 'Все', icon: null },
		{ id: 'postponed', label: 'Отложенные', icon: Clock },
		{ id: 'to-order', label: 'Корзина', icon: ShoppingCart },
		{ id: 'shipping', label: 'В пути', icon: Truck },
		{ id: 'archive', label: 'Полученные', icon: Archive },
	];

	return (
		<div className="flex items-center gap-2 flex-wrap pb-1">
			{filters.map((filter) => {
				const Icon = filter.icon;
				const isActive = activeStatus === filter.id;

				return (
					<button
						key={filter.id}
						onClick={() => onStatusChange(filter.id)}
						className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap font-medium text-sm ${
							isActive
								? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg scale-105'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md'
						}`}
					>
						{Icon && <Icon className="size-4" />}
						<span>{filter.label}</span>
					</button>
				);
			})}
		</div>
	);
}
