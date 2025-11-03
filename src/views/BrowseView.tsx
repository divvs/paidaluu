import { useState, useRef, useEffect } from 'react';
import { Search, Languages, Trash2, ChevronDown, Folder, FolderPlus, Check, X } from 'lucide-react';
import { StatusFilter } from '../components/filters/StatusFilter';
import { formatNumber } from '../utils/numbers';
import type { Status, BrowseProduct, Folder as FolderType } from '../types';

type BrowseViewProps = {
  activeStatus: Status;
  onStatusChange: (status: Status) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: BrowseProduct[];
  selectedProductIds: Set<string>;
  onProductSelect: (productId: string, selected: boolean) => void;
  onProductEdit?: (product: BrowseProduct) => void;
  onBulkStatusChange: (status: Exclude<Status, 'all'>) => void;
  onBulkDelete: () => void;
  folders: Record<Exclude<Status, 'all'>, FolderType[]>;
  activeFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (status: Exclude<Status, 'all'>, name: string) => void;
  onBulkMoveToFolder: (folderId: string | null) => void;
};

export const BrowseView = ({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  products,
  selectedProductIds,
  onProductSelect,
  onProductEdit,
  onBulkStatusChange,
  onBulkDelete,
  folders,
  activeFolderId,
  onFolderSelect,
  onCreateFolder,
  onBulkMoveToFolder,
}: BrowseViewProps) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showCreateFolderInput, setShowCreateFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeLang, setActiveLang] = useState<'cn' | 'ru'>('ru');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const folderDropdownRef = useRef<HTMLDivElement>(null);
  const selectedProducts = products.filter(p => selectedProductIds.has(p.id));
  const hasSelection = selectedProductIds.size > 0;

  // Get folders for the current status
  const currentFolders = activeStatus !== 'all' ? folders[activeStatus] || [] : [];

  // Calculate totals
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const totalDeliveryCost = selectedProducts.reduce((sum, p) => sum + p.deliveryCost, 0);
  const totalCost = totalPrice + totalDeliveryCost;

  const statusOptions: Array<{ id: Exclude<Status, 'all'>; label: string }> = [
    { id: 'postponed', label: 'Отложенные' },
    { id: 'to-order', label: 'Корзина' },
    { id: 'shipping', label: 'В пути' },
    { id: 'archive', label: 'Полученные' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(event.target as Node)) {
        setShowFolderDropdown(false);
      }
    };

    if (showStatusDropdown || showFolderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown, showFolderDropdown]);

  const handleCreateFolder = () => {
    if (newFolderName.trim() && activeStatus !== 'all') {
      onCreateFolder(activeStatus, newFolderName.trim());
      setNewFolderName('');
      setShowCreateFolderInput(false);
    }
  };

  return (
    <>
      <div className="p-4 flex flex-col gap-4 pb-24 md:pb-4">
        {/* Language Button - Desktop Header */}
        <div className="hidden md:flex md:justify-end md:mb-2">
          <button
            type="button"
            onClick={() => setActiveLang(activeLang === 'cn' ? 'ru' : 'cn')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
            title="Язык"
          >
            <Languages className="w-5 h-5" />
          </button>
        </div>

        {/* Folders Section - Only show when status is not 'all' */}
        {activeStatus !== 'all' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => onFolderSelect(null)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                activeFolderId === null
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-md hover:shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              Все
            </button>
            {currentFolders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => onFolderSelect(folder.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  activeFolderId === folder.id
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-md hover:shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                {folder.name}
              </button>
            ))}
            {showCreateFolderInput ? (
              <div className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder();
                    } else if (e.key === 'Escape') {
                      setShowCreateFolderInput(false);
                      setNewFolderName('');
                    }
                  }}
                  placeholder="Название папки"
                  className="text-xs outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-24"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="p-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateFolderInput(false);
                    setNewFolderName('');
                  }}
                  className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreateFolderInput(true)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                Создать
              </button>
            )}
          </div>
        )}

        {/* Status Filters */}
        <div className="w-full">
          <StatusFilter
            activeStatus={activeStatus}
            onStatusChange={onStatusChange}
          />
        </div>

        {/* Search Field */}
        <div className="w-full">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 dark:focus-within:border-blue-600">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск товаров..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {hasSelection && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 shadow-md">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Выбрано: {selectedProductIds.size}
            </span>
            <div className="flex-1" />
            {/* Folder Move Button - Only show when status is not 'all' */}
            {activeStatus !== 'all' && (
              <div className="relative" ref={folderDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Переместить
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFolderDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showFolderDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-10 min-w-[160px] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        onBulkMoveToFolder(null);
                        setShowFolderDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 first:pt-2.5 last:pb-2.5 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                    >
                      <Folder className="w-3.5 h-3.5" />
                      Без папки
                    </button>
                    {currentFolders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => {
                          onBulkMoveToFolder(folder.id);
                          setShowFolderDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      >
                        <Folder className="w-3.5 h-3.5" />
                        {folder.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Изменить статус
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-10 min-w-[160px] overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onBulkStatusChange(option.id);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 first:pt-2.5 last:pb-2.5 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Удалить
            </button>
          </div>
        )}

        {/* Products List */}
        <div className="flex flex-col gap-2 mt-1">
          {products.length > 0 ? (
            products.map((product) => {
              const isSelected = selectedProductIds.has(product.id);
              const statusColors: Record<string, string> = {
                'to-order': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                'shipping': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                'postponed': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                'archive': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
              };
              return (
                <div
                  key={product.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                    isSelected ? 'border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={(e) => {
                    // Don't trigger edit if clicking checkbox
                    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'LABEL') {
                      onProductEdit && onProductEdit(product);
                    }
                  }}
                >
                  <div className="flex gap-3">
                    {/* Checkbox */}
                    <div className="flex items-start pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          onProductSelect(product.id, e.target.checked);
                        }}
                        className="w-4 h-4 rounded-lg border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.nameRu} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">Фото</span>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {activeLang === 'ru' ? product.nameRu : product.name}
                      </h3>
                      {product.variants && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{product.variants}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            ¥{formatNumber(product.priceCny, 2)} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({formatNumber(product.price, 2)} сом)</span> · {formatNumber(product.weight, 2)} кг <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({formatNumber(product.deliveryCost, 2)} сом)</span> · <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatNumber(product.price + product.deliveryCost, 2)} сом</span>
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[product.status] || statusColors.postponed}`}>
                          {product.status === 'to-order' && 'Корзина'}
                          {product.status === 'shipping' && 'В пути'}
                          {product.status === 'postponed' && 'Отложенные'}
                          {product.status === 'archive' && 'Полученные'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              Товары не найдены
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary */}
      {hasSelection && (
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 shadow-2xl z-20 md:relative md:shadow-none md:rounded-lg md:border md:mt-2 md:mx-4">
          <div className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Стоимость товаров:</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{totalPrice.toLocaleString()} сом</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Стоимость доставки:</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{totalDeliveryCost.toLocaleString()} сом</span>
              </div>
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-2 mt-1">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Итого:</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{totalCost.toLocaleString()} сом</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
