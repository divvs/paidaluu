<<<<<<< Updated upstream
import SwipeableApp from './app/SwipeableApp';

function App() {
	return (
		<div className="min-h-screen bg-neutral-300 dark:bg-gray-900">
			<SwipeableApp />
		</div>
	);
}

export default App;
=======
import { useState } from 'react';

function App() {
	const [cnyPriceKgs, setCnyPriceKgs] = useState<string>('');
	const [productName, setProductName] = useState<string>('');
	const [persons, setPersons] = useState<Array<{ id: string; name: string }>>([
		{ id: 'p1', name: 'Person 1' },
	]);
	const [products, setProducts] = useState<
		Array<{ id: string; name: string; description: string; assignees: string[] }>
	>([]);
	const [assignMenuFor, setAssignMenuFor] = useState<string | null>(null);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const addPerson = (initialName?: string) => {
		const name = (initialName ?? window.prompt('Person name'))?.trim();
		if (name) {
			const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			setPersons((prev) => [...prev, { id, name }]);
			return id;
		}
		return undefined;
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
			{/* Header */}
			<header className="mb-6">
				<div className="flex items-center gap-2 mb-4">
					<input
						id="productName"
						type="text"
						placeholder="Что ищем?"
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								const name = productName.trim();
								if (name) {
									const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
									setProducts((prev) => [
										...prev,
										{ id, name, description: '', assignees: [] },
									]);
									setProductName('');
								}
							}
						}}
						className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
					/>

					<div className="relative">
						<button
							type="button"
							aria-haspopup="menu"
							aria-expanded={isSettingsOpen}
							onClick={() => setIsSettingsOpen((o) => !o)}
							className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</button>
						{isSettingsOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600">
								<div className="px-4 py-2">
									<label htmlFor="cnyPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNY/KGS</label>
									<input
										id="cnyPrice"
										type="number"
										inputMode="decimal"
										value={cnyPriceKgs || 12.3}
										onChange={(e) => setCnyPriceKgs(e.target.value)}
										className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Products List */}
			<main>
				<ul className="space-y-4">
					{products.map((p) => (
						<li key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-medium text-gray-900 dark:text-white">{p.name}</h3>
								
								<div className="flex items-center gap-2">
									<div className="flex -space-x-2">
										{p.assignees.map((pid) => {
											const person = persons.find((x) => x.id === pid);
											return (
												<div key={pid} className="relative">
													<div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-100 font-medium text-sm border-2 border-white dark:border-gray-700">
														{person?.name.charAt(0).toUpperCase() ?? '?'}
													</div>
													<span className="absolute -bottom-2 -right-2 bg-white text-xs px-1 rounded-full border border-gray-200">
														{person?.name.split(' ').pop()?.charAt(0).toUpperCase() ?? '?'}
													</span>
												</div>
											);
										})}
									</div>

									<div className="relative">
										<button
											type="button"
											onClick={() => setAssignMenuFor((cur) => (cur === p.id ? null : p.id))}
											className="text-sm dark:hover:text-gray-300 text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
										>
											+ Кому
										</button>

										{assignMenuFor === p.id && (
											<div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600">
												{persons
													.filter((pr) => !p.assignees.includes(pr.id))
													.map((pr) => (
													<button
														key={pr.id}
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															setProducts((prev) =>
																prev.map((prod) =>
																	prod.id === p.id
																		? { ...prod, assignees: [...prod.assignees, pr.id] }
																		: prod
																)
															);
															setAssignMenuFor(null);
														}}
														className="w-full dark:text-gray-300 dark:hover:bg-gray-700 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														{pr.name}
													</button>
												))}
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														const newId = addPerson();
														if (newId) {
															setProducts((prev) =>
																prev.map((prod) =>
																	prod.id === p.id
																		? { ...prod, assignees: [...prod.assignees, newId] }
																		: prod
																)
															);
														}
														setAssignMenuFor(null);
													}}
													className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
												>
													+ Добавить человека
												</button>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="mt-2">
								<input
									type="text"
									placeholder="Добавь описание..."
									value={p.description}
									onChange={(e) =>
										setProducts((prev) =>
											prev.map((prod) =>
												prod.id === p.id ? { ...prod, description: e.target.value } : prod
											)
										)
									}
									className="w-full px-3 py-2 text-sm  border-0 dark:placeholder:text-gray-400 border-gray-200 rounded-md focus:ring-0 ring-0 focus:border-transparent outline-none"
								/>
							</div>
						</li>
					))}

					{products.length === 0 && (
						<div className="text-center py-12">
							<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Пусто</h3>
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Начните с добавления товара выше</p>
						</div>
					)}
				</ul>
			</main>
		</div>
	);
}

export default App;
>>>>>>> Stashed changes
