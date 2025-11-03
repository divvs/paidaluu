import { useState, useRef } from 'react';
import { Languages, RotateCcw, Check } from 'lucide-react';
import { BottomSlider } from '../components/navigation/BottomSlider';
import { TranslateView } from '../views/TranslateView';
import { AddProductView } from '../views/AddProductView';
import { BrowseView } from '../views/BrowseView';
import { getVariantCombinationKey } from '../utils/variants';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import type { Status, BrowseProduct, VariantCategory, ProductImage, Folder } from '../types';

function SwipeableApp() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isTranslating, setIsTranslating] = useState(false);
	const [productName, setProductName] = useState('');
	const [productNameRu, setProductNameRu] = useState('');
	const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
	const [price, setPrice] = useState('');
	const [weight, setWeight] = useState('');
	const [translateInput, setTranslateInput] = useState('');
	const [images, setImages] = useState<ProductImage[]>([]);
	const [notes, setNotes] = useState('');
	const [assignedPersons, setAssignedPersons] = useState<string[]>([]);
	const [activeStatus, setActiveStatus] = useState<Status>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [products, setProducts] = useState<BrowseProduct[]>(SAMPLE_PRODUCTS);
	const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
	const [screenshotList, setScreenshotList] = useState<string[]>([]);
	const [folders, setFolders] = useState<Record<Exclude<Status, 'all'>, Folder[]>>({
		'postponed': [],
		'to-order': [],
		'shipping': [],
		'archive': [],
	});
	const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
	const [sidebarTab, setSidebarTab] = useState<'search' | 'add'>('search');
	const [editingProductId, setEditingProductId] = useState<string | null>(null);
	const [previousFormValues, setPreviousFormValues] = useState<{
		productName: string;
		productNameRu: string;
		selectedVariants: Record<number, number>;
		price: string;
		weight: string;
		images: ProductImage[];
		notes: string;
		assignedPersons: string[];
	} | null>(null);

	// Ref for AddProductView language toggle handler
	const addProductLanguageToggleRef = useRef<(() => void) | null>(null);

	// Demo categories with two categories
	const [categories, setCategories] = useState<VariantCategory[]>([]);
	
	// Price and weight by variant combination
	const [priceByCombination, setPriceByCombination] = useState<Record<string, string>>({});
	const [weightByCombination, setWeightByCombination] = useState<Record<string, string>>({});

	// Demo available persons
	const [availablePersons] = useState<string[]>([
		'Иван Иванов',
		'Мария Петрова',
		'Алексей Сидоров',
		'Елена Козлова'
	]);

	const handleSlide = (index: number) => {
		setActiveIndex(index);
	};

	const handleTranslate = () => {
		if (!translateInput.trim()) return;
		// TODO: Implement translation logic
		setIsTranslating(true);
		setTimeout(() => setIsTranslating(false), 1000);
	};

	const handleResetTranslateView = () => {
		setTranslateInput('');
		setScreenshotList([]);
	};

	// Check if any content exists in translate view
	const hasTranslateContent = translateInput.trim().length > 0 || screenshotList.length > 0;

	const handleStatusChange = (status: Status) => {
		setActiveStatus(status);
		// Clear selection when changing status filter
		setSelectedProductIds(new Set());
		// Reset folder filter when changing status
		setActiveFolderId(null);
	};

	const handleProductNameChange = (value: string) => {
		setProductName(value);
		// TODO: Implement actual translation logic
		// For now, simulate translation
		if (value.trim()) {
			setProductNameRu(value + ' (перевод)');
		} else {
			setProductNameRu('');
		}
	};

	const handleResetProductName = () => {
		setProductName('');
		setProductNameRu('');
	};

	const handleVariantSelect = (categoryIndex: number, variantIndex: number) => {
		setSelectedVariants(prev => {
			const newState = { ...prev };
			if (newState[categoryIndex] === variantIndex) {
				delete newState[categoryIndex];
			} else {
				newState[categoryIndex] = variantIndex;
			}
			return newState;
		});
	};

	const handleResetVariants = () => {
		setSelectedVariants({});
	};

	const handleResetCost = () => {
		setPrice('');
		setWeight('');
		setPriceByCombination({});
		setWeightByCombination({});
	};

	// Get current price and weight based on variant selection
	const variantCombinationKey = getVariantCombinationKey(categories, selectedVariants);
	const currentPrice = variantCombinationKey ? (priceByCombination[variantCombinationKey] ?? '') : price;
	const currentWeight = variantCombinationKey ? (weightByCombination[variantCombinationKey] ?? '') : weight;

	const handlePriceChange = (value: string) => {
		const combinationKey = getVariantCombinationKey(categories, selectedVariants);
		if (combinationKey) {
			// Store price by combination
			setPriceByCombination(prev => ({ ...prev, [combinationKey]: value }));
		} else {
			// Simple calculator mode
			setPrice(value);
		}
	};

	const handleWeightChange = (value: string) => {
		const combinationKey = getVariantCombinationKey(categories, selectedVariants);
		if (combinationKey) {
			// Store weight by combination
			setWeightByCombination(prev => ({ ...prev, [combinationKey]: value }));
		} else {
			// Simple calculator mode
			setWeight(value);
		}
	};

	const handleResetImages = () => {
		setImages([]);
	};

	const handleAssignedPersonToggle = (person: string) => {
		setAssignedPersons(prev => {
			if (prev.includes(person)) {
				return prev.filter(p => p !== person);
			} else {
				return [...prev, person];
			}
		});
	};

	const handleAddProduct = () => {
		// TODO: Implement add product logic
		console.log('Adding product:', productName);
		// Clear form after adding
		if (editingProductId) {
			setEditingProductId(null);
		}
		setPreviousFormValues(null);
	};

	const handleLoadProductForEdit = (product: BrowseProduct) => {
		// Save current form values before loading new product
		if (!editingProductId && (productName || productNameRu || Object.keys(selectedVariants).length > 0 || price || weight || images.length > 0 || notes || assignedPersons.length > 0)) {
			setPreviousFormValues({
				productName,
				productNameRu,
				selectedVariants,
				price,
				weight,
				images,
				notes,
				assignedPersons,
			});
		}

		// Load product data
		setEditingProductId(product.id);
		setProductName(product.name);
		setProductNameRu(product.nameRu);
		
		// Parse variants if they exist
		if (product.variants) {
			// Simple parsing - in real app, would need proper mapping
			// For now, just clear variants
			setSelectedVariants({});
		} else {
			setSelectedVariants({});
		}

		// Parse price and weight from product
		// Note: products store price in KGS, but form uses CNY
		setPrice('');
		setWeight('');

		// Load images if product has image
		if (product.image) {
			setImages([{
				id: `img-${product.id}`,
				src: product.image,
				alt: product.nameRu
			}]);
		} else {
			setImages([]);
		}

		setNotes('');
		setAssignedPersons([]);

		// Switch to add tab on desktop
		setSidebarTab('add');
		// Switch to add view on mobile
		if (window.innerWidth < 768) {
			setActiveIndex(1);
		}
	};

	const handleRestorePreviousValues = () => {
		if (previousFormValues) {
			setProductName(previousFormValues.productName);
			setProductNameRu(previousFormValues.productNameRu);
			setSelectedVariants(previousFormValues.selectedVariants);
			setPrice(previousFormValues.price);
			setWeight(previousFormValues.weight);
			setImages(previousFormValues.images);
			setNotes(previousFormValues.notes);
			setAssignedPersons(previousFormValues.assignedPersons);
			setPreviousFormValues(null);
		} else {
			// Clear form
			setProductName('');
			setProductNameRu('');
			setSelectedVariants({});
			setPrice('');
			setWeight('');
			setImages([]);
			setNotes('');
			setAssignedPersons([]);
		}
		setEditingProductId(null);
	};

	const handleProductSelect = (productId: string, selected: boolean) => {
		setSelectedProductIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				newSet.add(productId);
			} else {
				newSet.delete(productId);
			}
			return newSet;
		});
	};

	const handleBulkStatusChange = (status: Exclude<Status, 'all'>) => {
		setProducts(prev => prev.map(p => 
			selectedProductIds.has(p.id) ? { ...p, status } : p
		));
		setSelectedProductIds(new Set());
	};

	const handleBulkDelete = () => {
		setProducts(prev => prev.filter(p => !selectedProductIds.has(p.id)));
		setSelectedProductIds(new Set());
	};

	const handleCreateFolder = (status: Exclude<Status, 'all'>, name: string) => {
		const newFolder: Folder = {
			id: `folder-${Date.now()}-${status}`,
			name: name
		};
		setFolders(prev => ({
			...prev,
			[status]: [...(prev[status] || []), newFolder]
		}));
	};

	const handleFolderSelect = (folderId: string | null) => {
		setActiveFolderId(folderId);
		// Clear selection when changing folder filter
		setSelectedProductIds(new Set());
	};

	const handleBulkMoveToFolder = (folderId: string | null) => {
		setProducts(prev => prev.map(p => 
			selectedProductIds.has(p.id) ? { ...p, folderId } : p
		));
		setSelectedProductIds(new Set());
	};

	// Filter products based on status, search query, and folder
	const filteredProducts = products.filter(product => {
		const matchesStatus = activeStatus === 'all' || product.status === activeStatus;
		const matchesSearch = !searchQuery.trim() || 
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.nameRu.toLowerCase().includes(searchQuery.toLowerCase());
		// Only apply folder filter when status is not 'all' and a folder is selected
		const matchesFolder = activeStatus === 'all' || activeFolderId === null 
			? true 
			: product.folderId === activeFolderId && product.status === activeStatus;
		return matchesStatus && matchesSearch && matchesFolder;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row">
			{/* Mobile: Header */}
			<div className="p-2 md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="relative px-2 py-1 flex items-center justify-center">
					<div className="absolute left-2 flex items-center gap-2">
						{activeIndex === 1 ? (
							<button
								type="button"
								onClick={() => addProductLanguageToggleRef.current?.()}
								className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-2 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
								title="Язык"
							>
								<Languages className="w-4 h-4" />
							</button>
						) : activeIndex === 0 ? (
							<button
								type="button"
								onClick={handleResetTranslateView}
								disabled={!hasTranslateContent}
								className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-2 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
								title="Сбросить"
							>
								<RotateCcw className="w-4 h-4" />
							</button>
						) : activeIndex === 2 ? (
							<div className="w-10 h-10" />
						) : (
						<button
							type="button"
							className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-2 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
								title="Язык"
						>
							<Languages className="w-4 h-4" />
						</button>
						)}
					</div>

					<h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
						{activeIndex === 0 ? 'Поисковик' : activeIndex === 1 ? 'Добавить товар' : 'Browse'}
					</h2>

					{activeIndex === 1 && (
						<div className="absolute right-2 flex items-center gap-2">
							<button
								type="button"
								onClick={handleAddProduct}
								className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
								title="Добавить товар"
							>
								<Check className="w-4 h-4" />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Desktop: Sidebar with Поисковик and Add product */}
			<div className="hidden md:flex md:flex-col md:w-96 md:border-r md:border-gray-200 dark:md:border-gray-700 md:bg-gradient-to-br md:from-gray-50 md:to-gray-100 dark:md:from-gray-900 dark:md:to-gray-800 md:overflow-hidden">
				{/* Tab Buttons */}
				<div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
					<button
						type="button"
						onClick={() => setSidebarTab('search')}
						className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
							sidebarTab === 'search'
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-600'
								: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
						}`}
					>
						Поисковик
					</button>
					<button
						type="button"
						onClick={() => setSidebarTab('add')}
						className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
							sidebarTab === 'add'
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-600'
								: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
						}`}
					>
						Добавить товар
					</button>
				</div>

				{/* Tab Content */}
				<div className="flex-1 overflow-y-auto">
					{sidebarTab === 'search' && (
						<div className="flex-shrink-0 bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 overflow-hidden">
							{/* Header Actions */}
							<div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-blue-900/10">
								<button
									type="button"
									onClick={() => setSidebarTab('add')}
									className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
									title="Перевод"
								>
									<Languages className="w-3.5 h-3.5" />
								</button>
								<button
									type="button"
									onClick={handleResetTranslateView}
									disabled={!hasTranslateContent}
									className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
									title="Сбросить"
								>
									<RotateCcw className="w-3.5 h-3.5" />
								</button>
							</div>
							<TranslateView 
								translateInput={translateInput}
								onTranslateInputChange={setTranslateInput}
								onTranslate={handleTranslate}
								isTranslating={isTranslating}
								screenshotList={screenshotList}
								onScreenshotListChange={setScreenshotList}
							/>
						</div>
					)}

					{sidebarTab === 'add' && (
						<div 
							className="flex-shrink-0 bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 overflow-hidden"
							onClick={(e) => {
								// If clicking outside the form content area, restore previous values
								if (e.target === e.currentTarget && editingProductId) {
									handleRestorePreviousValues();
								}
							}}
						>
							{/* Header Actions */}
							<div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-blue-900/10">
								<button
									type="button"
									onClick={() => addProductLanguageToggleRef.current?.()}
									className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
									title="Язык"
								>
									<Languages className="w-3.5 h-3.5" />
								</button>
								<button
									type="button"
									onClick={handleAddProduct}
									className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-1.5 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
									title="Добавить товар"
								>
									<Check className="w-3.5 h-3.5" />
								</button>
							</div>
							<AddProductView 
								productName={productName}
								productNameRu={productNameRu}
								onProductNameChange={handleProductNameChange}
								onResetProductName={handleResetProductName}
								categories={categories}
								selectedVariants={selectedVariants}
								onVariantSelect={handleVariantSelect}
								onResetVariants={handleResetVariants}
								price={currentPrice}
								onPriceChange={handlePriceChange}
								weight={currentWeight}
								onWeightChange={handleWeightChange}
								onResetCost={handleResetCost}
								images={images}
								onImagesChange={setImages}
								onResetImages={handleResetImages}
								notes={notes}
								onNotesChange={setNotes}
								assignedPersons={assignedPersons}
								availablePersons={availablePersons}
								onAssignedPersonToggle={handleAssignedPersonToggle}
								priceByCombination={priceByCombination}
								weightByCombination={weightByCombination}
								onLanguageToggleRef={addProductLanguageToggleRef}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Mobile: Swipeable Content */}
				<div className="flex-1 overflow-y-auto pb-16 md:hidden">
					{activeIndex === 0 && (
						<TranslateView 
							translateInput={translateInput}
							onTranslateInputChange={setTranslateInput}
							onTranslate={handleTranslate}
							isTranslating={isTranslating}
							screenshotList={screenshotList}
							onScreenshotListChange={setScreenshotList}
						/>
					)}
					{activeIndex === 1 && (
						<AddProductView 
							productName={productName}
							productNameRu={productNameRu}
							onProductNameChange={handleProductNameChange}
							onResetProductName={handleResetProductName}
							categories={categories}
							selectedVariants={selectedVariants}
							onVariantSelect={handleVariantSelect}
							onResetVariants={handleResetVariants}
							price={currentPrice}
							onPriceChange={handlePriceChange}
							weight={currentWeight}
							onWeightChange={handleWeightChange}
							onResetCost={handleResetCost}
							images={images}
							onImagesChange={setImages}
							onResetImages={handleResetImages}
							notes={notes}
							onNotesChange={setNotes}
							assignedPersons={assignedPersons}
							availablePersons={availablePersons}
							onAssignedPersonToggle={handleAssignedPersonToggle}
							priceByCombination={priceByCombination}
							weightByCombination={weightByCombination}
							onLanguageToggleRef={addProductLanguageToggleRef}
						/>
					)}
					{activeIndex === 2 && (
						<BrowseView 
							activeStatus={activeStatus}
							onStatusChange={handleStatusChange}
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							products={filteredProducts}
							selectedProductIds={selectedProductIds}
							onProductSelect={handleProductSelect}
							onProductEdit={handleLoadProductForEdit}
							onBulkStatusChange={handleBulkStatusChange}
							onBulkDelete={handleBulkDelete}
							folders={folders}
							activeFolderId={activeFolderId}
							onFolderSelect={handleFolderSelect}
							onCreateFolder={handleCreateFolder}
							onBulkMoveToFolder={handleBulkMoveToFolder}
						/>
					)}
				</div>

				{/* Desktop: Always show Browse */}
				<div className="hidden md:flex md:flex-1 md:overflow-hidden">
					<div className="flex-1 overflow-y-auto">
						<BrowseView 
							activeStatus={activeStatus}
							onStatusChange={handleStatusChange}
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							products={filteredProducts}
							selectedProductIds={selectedProductIds}
							onProductSelect={handleProductSelect}
							onProductEdit={handleLoadProductForEdit}
							onBulkStatusChange={handleBulkStatusChange}
							onBulkDelete={handleBulkDelete}
							folders={folders}
							activeFolderId={activeFolderId}
							onFolderSelect={handleFolderSelect}
							onCreateFolder={handleCreateFolder}
							onBulkMoveToFolder={handleBulkMoveToFolder}
						/>
					</div>
				</div>
			</div>

			{/* Mobile: Bottom Slider */}
			<div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 bg-transparent md:hidden z-50">
				<BottomSlider 
					activeIndex={activeIndex} 
					onSelect={handleSlide}
					count={3}
				/>
			</div>
		</div>
	);
}

export default SwipeableApp;

