import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Loader2, Upload, ClipboardPaste, X } from 'lucide-react';
import { parseNumericInput, parseWeightInput, formatNumber } from '../utils/numbers';
import { DEFAULT_CNY_TO_KGS, RATE_PER_KG } from '../constants';
import { getVariantCombinationKey } from '../utils/variants';
import type { VariantCategory, ProductImage } from '../types';

type AddProductViewProps = {
  productName: string;
  productNameRu: string;
  onProductNameChange: (value: string) => void;
  onResetProductName: () => void;
  categories: VariantCategory[];
  selectedVariants: Record<number, number>;
  onVariantSelect: (categoryIndex: number, variantIndex: number) => void;
  onResetVariants: () => void;
  price: string;
  onPriceChange: (value: string) => void;
  weight: string;
  onWeightChange: (value: string) => void;
  onResetCost: () => void;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  onResetImages: () => void;
  notes: string;
  onNotesChange: (value: string) => void;
  assignedPersons: string[];
  availablePersons: string[];
  onAssignedPersonToggle: (person: string) => void;
  priceByCombination: Record<string, string>;
  weightByCombination: Record<string, string>;
  onLanguageToggleRef?: React.MutableRefObject<(() => void) | null>;
};

export const AddProductView = ({
  productName,
  productNameRu,
  onProductNameChange,
  onResetProductName,
  categories,
  selectedVariants,
  onVariantSelect,
  onResetVariants,
  price,
  onPriceChange,
  weight,
  onWeightChange,
  onResetCost,
  images,
  onImagesChange,
  onResetImages,
  notes,
  onNotesChange,
  assignedPersons,
  availablePersons,
  onAssignedPersonToggle,
  priceByCombination,
  weightByCombination,
  onLanguageToggleRef,
}: AddProductViewProps) => {
  const imagesFileInputRef = useRef<HTMLInputElement>(null);
  const variantsFileInputRef = useRef<HTMLInputElement>(null);
  const [previewImageId, setPreviewImageId] = useState<string | null>(null);
  const [showAltText, setShowAltText] = useState<Record<string, boolean>>({});
  const [isExtractingAlt, setIsExtractingAlt] = useState<Record<string, boolean>>({});
  const [activeLang, setActiveLang] = useState<'cn' | 'ru'>('ru');

  // Expose language toggle handler to parent
  useEffect(() => {
    if (onLanguageToggleRef) {
      onLanguageToggleRef.current = () => setActiveLang(prev => prev === 'cn' ? 'ru' : 'cn');
    }
    return () => {
      if (onLanguageToggleRef) {
        onLanguageToggleRef.current = null;
      }
    };
  }, [onLanguageToggleRef]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onProductNameChange(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
        alt: file.name
      }));
      onImagesChange([...images, ...newImages]);
    }
    if (imagesFileInputRef.current) {
      imagesFileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
    if (previewImageId === imageId) {
      setPreviewImageId(null);
      setShowAltText({});
    }
  };

  const handleToggleAltText = (imageId: string) => {
    setShowAltText(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const handleExtractAlt = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image || image.extractedAlt) {
      // If alt already exists, just toggle visibility
      handleToggleAltText(imageId);
      return;
    }

    setIsExtractingAlt(prev => ({ ...prev, [imageId]: true }));
    try {
      // TODO: Send image to server for text extraction and translation
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate extracted text
      const extractedText = 'Извлеченный текст из изображения';
      
      // Update image with extracted alt
      onImagesChange(images.map(img => 
        img.id === imageId 
          ? { ...img, extractedAlt: extractedText }
          : img
      ));
      
      setShowAltText(prev => ({ ...prev, [imageId]: true }));
    } catch (error) {
      console.error('Failed to extract alt text:', error);
    } finally {
      setIsExtractingAlt(prev => ({ ...prev, [imageId]: false }));
    }
  };

  const handleVariantsPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // TODO: Parse and set variants from pasted text
      console.log('Pasted variants text:', text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleVariantsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle image files
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        // TODO: Send images to server for variant extraction
        // For now, just simulate API call
        const formData = new FormData();
        imageFiles.forEach(file => formData.append('images', file));
        
        // Simulate sending to server
        console.log('Sending variant images to server:', imageFiles.length);
        // TODO: await fetch('/api/extract-variants', { method: 'POST', body: formData });
        // TODO: Update categories with extracted variants from server response
      }
    }
    // Reset input
    if (variantsFileInputRef.current) {
      variantsFileInputRef.current.value = '';
    }
  };

  // Get current price and weight based on variant selection
  const variantCombinationKey = getVariantCombinationKey(categories, selectedVariants);
  const currentPrice = variantCombinationKey ? (priceByCombination[variantCombinationKey] ?? '') : price;
  const currentWeight = variantCombinationKey ? (weightByCombination[variantCombinationKey] ?? '') : weight;

  const parsedPrice = parseNumericInput(currentPrice);
  const priceInKgs = parsedPrice !== null ? parsedPrice * DEFAULT_CNY_TO_KGS : null;
  const formattedPriceInKgs = priceInKgs !== null ? formatNumber(priceInKgs, 2) : null;

  const parsedWeight = parseWeightInput(currentWeight);
  const weightCost = parsedWeight !== null ? parsedWeight * RATE_PER_KG : null;
  const formattedWeightCost = weightCost !== null ? formatNumber(weightCost, 2) : null;

  const totalCost = (priceInKgs ?? 0) + (weightCost ?? 0);
  const formattedTotalCost = totalCost > 0 ? formatNumber(totalCost, 2) : null;

  // Build selected variants text
  const selectedVariantsList = categories
    .map((category, categoryIndex) => {
      const variantIndex = selectedVariants[categoryIndex];
      if (variantIndex !== undefined && category.variants[variantIndex]) {
        return `${category.name}: ${category.variants[variantIndex]}`;
      }
      return null;
    })
    .filter((item): item is string => item !== null);
  
  const hasSelectedVariants = selectedVariantsList.length > 0;
  const hasCost = currentPrice.trim() !== '' || currentWeight.trim() !== '';
  const hasImages = images.length > 0;
  
  const allVariantsSelected = categories.length > 0 && variantCombinationKey !== null;
  const hasVariants = categories.length > 0;
  const isCalculatorDisabled = hasVariants && !allVariantsSelected;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Images Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {hasImages && (
              <button
                type="button"
                onClick={onResetImages}
                className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                title="Сбросить"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <input
          ref={imagesFileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="grid grid-cols-6 gap-2">
          {/* Add button - always first */}
          <button
            type="button"
            onClick={() => imagesFileInputRef.current?.click()}
            className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl text-gray-400 dark:text-gray-500 hover:border-blue-400 dark:hover:border-blue-500 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Добавить изображение"
          >
            +
          </button>
          {/* Image placeholders */}
          {images.slice(0, 5).map((image) => (
            <div key={image.id} className="relative aspect-square w-full group">
              <img
                src={image.src}
                alt={image.alt || 'Product image'}
                onClick={() => setPreviewImageId(image.id)}
                className="w-full h-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(image.id);
                }}
                className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                title="Удалить"
              >
                ×
              </button>
            </div>
          ))}
          {/* Empty placeholders - only show if first row isn't filled */}
          {Array.from({ length: Math.max(0, 5 - images.length) }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="aspect-square w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            />
          ))}
        </div>
        {/* Second row - only show if first row is filled (6 images) */}
        {images.length >= 6 && (
          <div className="grid grid-cols-6 gap-2 mt-2">
            {images.slice(5).map((image) => (
              <div key={image.id} className="relative aspect-square w-full group">
                <img
                  src={image.src}
                  alt={image.alt || 'Product image'}
                  onClick={() => setPreviewImageId(image.id)}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(image.id);
                  }}
                  className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Add button for second row if there's space */}
            {images.length < 12 && (
              <button
                type="button"
                onClick={() => imagesFileInputRef.current?.click()}
                className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl text-gray-400 dark:text-gray-500 hover:border-blue-400 dark:hover:border-blue-500 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
                title="Добавить изображение"
              >
                +
              </button>
            )}
            {/* Empty placeholders for second row */}
            {Array.from({ length: Math.max(0, 11 - images.length) }).map((_, index) => (
              <div
                key={`placeholder-row2-${index}`}
                className="aspect-square w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Product Name Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Название товара</h3>
            {productName && (
              <button
                type="button"
                onClick={onResetProductName}
                className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                title="Сбросить"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handlePaste}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-sm"
            title="Вставить"
          >
            <ClipboardPaste className="w-4 h-4" />
          </button>
        </div>
        <input
          type="text"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="Введите название товара"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {productNameRu && activeLang === 'ru' && (
          <div className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {productNameRu}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Variants Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Варианты</h3>
            {hasSelectedVariants && (
              <button
                type="button"
                onClick={onResetVariants}
                className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                title="Сбросить"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleVariantsPaste}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-sm"
              title="Вставить"
            >
              <ClipboardPaste className="w-4 h-4" />
            </button>
            <input
              ref={variantsFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleVariantsUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => variantsFileInputRef.current?.click()}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-sm"
              title="Загрузить"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
        {categories.length > 0 ? (
          <div className="flex flex-col gap-3 mt-1">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {category.name}:
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {category.variants.map((variant, variantIndex) => {
                    const isSelected = selectedVariants[categoryIndex] === variantIndex;
                    return (
                      <button
                        key={variantIndex}
                        type="button"
                        onClick={() => onVariantSelect(categoryIndex, variantIndex)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-md hover:shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {variant}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-1 px-3 py-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Отправьте скриншот вариантов/опций, мы переведем и вернем как выбираемые опции
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Cost Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Стоимость</h3>
          {hasCost && (
            <button
              type="button"
              onClick={onResetCost}
              className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-1.5 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              title="Сбросить"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Price Section */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Цена</div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 dark:focus-within:border-blue-600">
              <span className="font-bold text-blue-600 dark:text-blue-400">¥</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={currentPrice}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="0.00"
                disabled={isCalculatorDisabled}
                className="flex-1 bg-transparent text-right text-sm text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {formattedPriceInKgs !== null && (
              <div className="px-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                {formattedPriceInKgs} сом
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Вес, кг</div>
            <input
              type="text"
              value={currentWeight}
              onChange={(e) => onWeightChange(e.target.value)}
              placeholder="0"
              disabled={isCalculatorDisabled}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {formattedWeightCost !== null && (
              <div className="px-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                {formattedWeightCost} сом
              </div>
            )}
          </div>
        </div>
        {hasSelectedVariants && (
          <div className="mt-1.5 px-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
            {selectedVariantsList.join(', ')}
          </div>
        )}
        {formattedTotalCost !== null && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Итого:</div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{formattedTotalCost} сом</div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Assigning to Person Section */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap pb-1">
          {availablePersons.map((person) => {
            const isSelected = assignedPersons.includes(person);
            return (
              <button
                key={person}
                type="button"
                onClick={() => onAssignedPersonToggle(person)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-md hover:shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md'
                }`}
              >
                {person}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Section */}
      <div className="flex flex-col gap-2">
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Введите заметки..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-600 resize-none transition-all duration-200 shadow-sm hover:shadow-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      {/* Image Preview Modal */}
      {previewImageId && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setPreviewImageId(null);
            setShowAltText({});
          }}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col">
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImageId(null);
                setShowAltText({});
              }}
              className="absolute top-4 right-4 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg z-20"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Images Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 py-4">
                {images.map((image) => {
                  const hasExtractedAlt = image.extractedAlt !== undefined;
                  const isAltVisible = showAltText[image.id];
                  const isExtracting = isExtractingAlt[image.id];
                  
                  return (
                    <div key={image.id} className="relative flex justify-center">
                      <div className="relative max-w-full">
                        <img
                          src={image.src}
                          alt={image.alt || 'Product image preview'}
                          className="max-w-full max-h-[80vh] object-contain rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        {/* Alt Text Rectangle - Always present but hidden */}
                        <div 
                          className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-30 transition-all duration-200 ${
                            isAltVisible && image.extractedAlt ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ 
                            top: '8px',
                            left: '8px',
                            right: '8px',
                            maxWidth: 'calc(100% - 16px)'
                          }}
                        >
                          {/* Alt Text Blinking Dot Button - Inside rectangle as close button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAltText(image.id);
                            }}
                            className="absolute top-2 left-2 bg-blue-500 rounded-full w-3 h-3 animate-pulse hover:bg-red-500 hover:scale-125 transition-all duration-200 shadow-lg z-10"
                            title="Закрыть"
                          />
                          
                          {/* Alt Text Content */}
                          <div className="p-4 pl-8">
                            <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                              {image.extractedAlt || ''}
                            </p>
                          </div>
                        </div>

                        {/* Alt Text Blinking Dot Button - On image when rectangle is hidden */}
                        {!(isAltVisible && image.extractedAlt) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (hasExtractedAlt) {
                                handleToggleAltText(image.id);
                              } else {
                                handleExtractAlt(image.id);
                              }
                            }}
                            disabled={isExtracting}
                            className="absolute top-4 left-4 bg-blue-500 rounded-full w-3 h-3 animate-pulse hover:bg-blue-600 hover:scale-125 transition-all duration-200 shadow-lg z-40 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={hasExtractedAlt ? "Показать/скрыть текст" : "Извлечь текст"}
                          />
                        )}

                        {/* Loading Indicator */}
                        {isExtracting && (
                          <div className="absolute top-4 left-4 bg-blue-500/80 rounded-full w-3 h-3 flex items-center justify-center z-10">
                            <Loader2 className="w-2 h-2 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
  );
};
