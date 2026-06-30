import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { Button, Select, Badge, Input } from '@/components/ui';
import { ProductCard } from '@/components/product';
import { products, brands, categories } from '@/data/products';
import { useTranslation } from '@/i18n';
import { SortOption } from '@/types';

type ViewMode = 'grid' | 'list';

export default function ShopPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => colorSet.add(c.name)));
    return Array.from(colorSet);
  }, []);

  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => sizeSet.add(s)));
    return Array.from(sizeSet).sort((a, b) => parseFloat(a) - parseFloat(b));
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'popular': filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, selectedBrand, selectedColors, selectedSizes, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedCategory || selectedBrand || selectedColors.length > 0 || selectedSizes.length > 0;

  const sortOptions = [
    { value: 'newest', label: t('filter.newest') },
    { value: 'price-low', label: t('filter.priceLowHigh') },
    { value: 'price-high', label: t('filter.priceHighLow') },
    { value: 'rating', label: t('filter.rating') },
    { value: 'popular', label: t('filter.popular') },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {t('filter.allProducts')}
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              {t('filter.filterBy')}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                {t('filter.clearFilters')}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              options={sortOptions}
              className="w-36 sm:w-48 text-sm"
            />
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {selectedCategory && (
              <Badge variant="default">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="ml-1.5 hover:text-error-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedBrand && (
              <Badge variant="default">
                {selectedBrand}
                <button onClick={() => setSelectedBrand('')} className="ml-1.5 hover:text-error-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar — slides in on desktop, draws from left */}
          <AnimatePresence initial={false}>
            {isFilterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 overflow-hidden hidden sm:block"
              >
                <div className="space-y-6 pr-4">
                  {/* Category */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.category')}</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                      >All Categories</button>
                      {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.name)}
                          className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.name ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                        >{cat.name}</button>
                      ))}
                    </div>
                  </div>

                  {/* Brand */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.brand')}</h3>
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                      <option value="">All Brands</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.price')}</h3>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-20 text-sm" min={0} />
                      <span className="text-gray-400">-</span>
                      <Input type="number" value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
                        className="w-20 text-sm" min={0} />
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.color')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {allColors.slice(0, 12).map((color) => (
                        <button key={color}
                          onClick={() => setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color])}
                          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${selectedColors.includes(color) ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                        >{color}</button>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.size')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((size) => (
                        <button key={size}
                          onClick={() => setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])}
                          className={`w-9 h-9 text-xs rounded-lg border transition-colors ${selectedSizes.includes(size) ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                        >{size}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sm:hidden fixed inset-0 z-40 bg-black/50"
                onClick={() => setIsFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.category')}</h3>
                      <div className="space-y-1">
                        <button onClick={() => setSelectedCategory('')}
                          className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${!selectedCategory ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                          All Categories</button>
                        {categories.map((cat) => (
                          <button key={cat.id} onClick={() => setSelectedCategory(cat.name)}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${selectedCategory === cat.name ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                            {cat.name}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('filter.size')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {allSizes.map((size) => (
                          <button key={size}
                            onClick={() => setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])}
                            className={`w-9 h-9 text-xs rounded-lg border ${selectedSizes.includes(size) ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900' : 'border-gray-200 dark:border-gray-700 text-gray-600'}`}>
                            {size}</button>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No products found.</p>
                <Button onClick={clearAllFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}