'use client';

/**
 * SOLAR PRODUCTS E-COMMERCE SHOP
 * Complete solar equipment marketplace with M-Pesa payment
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Battery, Zap, Search, Filter, Grid, List,
  ShoppingCart, X, Plus, Minus, Heart, Eye, Shield,
  Truck, Package, Tag, ChevronDown, Star
} from 'lucide-react';

// Product Categories
const SOLAR_CATEGORIES = [
  { id: 'panels', name: 'Solar Panels', icon: '☀️', count: 45 },
  { id: 'inverters', name: 'Inverters', icon: '⚡', count: 38 },
  { id: 'batteries', name: 'Batteries', icon: '🔋', count: 42 },
  { id: 'controllers', name: 'Charge Controllers', icon: '🎛️', count: 25 },
  { id: 'mounting', name: 'Mounting Systems', icon: '🔩', count: 18 },
  { id: 'cables', name: 'Cables & Connectors', icon: '🔌', count: 30 },
  { id: 'accessories', name: 'Accessories', icon: '🛠️', count: 35 },
];

// Solar Products Database
interface SolarProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specifications: Record<string, string>;
  features: string[];
  warranty: string;
  tags: string[];
}

const SOLAR_PRODUCTS: SolarProduct[] = [
  // Solar Panels
  { id: 'panel-ja-550', name: 'JA Solar 550W Mono PERC Panel', brand: 'JA Solar', category: 'panels', price: 28500, originalPrice: 32000, rating: 4.8, reviews: 156, inStock: true, specifications: { 'Power': '550W', 'Efficiency': '21.3%', 'Type': 'Monocrystalline', 'Voltage': '49.65V', 'Warranty': '25 Years' }, features: ['Half-cell technology', 'Anti-reflective glass', 'PID resistant', 'Salt mist resistant'], warranty: '25 years', tags: ['bestseller', 'premium'] },
  { id: 'panel-longi-545', name: 'Longi Hi-MO 5 545W Panel', brand: 'Longi', category: 'panels', price: 28000, rating: 4.9, reviews: 203, inStock: true, specifications: { 'Power': '545W', 'Efficiency': '21.1%', 'Type': 'Monocrystalline', 'Voltage': '49.50V' }, features: ['M10 wafer technology', 'Low LID/LETID', 'Excellent low-light performance'], warranty: '25 years', tags: ['premium', 'tier-1'] },
  { id: 'panel-canadian-550', name: 'Canadian Solar HiKu6 550W', brand: 'Canadian Solar', category: 'panels', price: 27500, rating: 4.7, reviews: 128, inStock: true, specifications: { 'Power': '550W', 'Efficiency': '21.2%', 'Type': 'Monocrystalline' }, features: ['High efficiency cells', 'Excellent durability'], warranty: '25 years', tags: ['value', 'tier-1'] },
  { id: 'panel-jinko-555', name: 'Jinko Tiger Neo N-type 555W', brand: 'Jinko Solar', category: 'panels', price: 29800, rating: 4.9, reviews: 89, inStock: true, specifications: { 'Power': '555W', 'Efficiency': '21.6%', 'Type': 'N-type Monocrystalline' }, features: ['N-type technology', 'Lower degradation', 'Better temperature coefficient'], warranty: '30 years', tags: ['premium', 'n-type'] },
  { id: 'panel-risen-450', name: 'Risen 450W Mono Panel', brand: 'Risen', category: 'panels', price: 22000, rating: 4.5, reviews: 94, inStock: true, specifications: { 'Power': '450W', 'Efficiency': '20.5%', 'Type': 'Monocrystalline' }, features: ['Budget-friendly', 'Good performance'], warranty: '25 years', tags: ['value', 'budget'] },
  { id: 'panel-dmegc-540', name: 'DMEGC 540W Mono Panel', brand: 'DMEGC', category: 'panels', price: 25500, rating: 4.6, reviews: 67, inStock: true, specifications: { 'Power': '540W', 'Efficiency': '21.2%' }, features: ['Cost-effective', 'Reliable performance'], warranty: '25 years', tags: ['value'] },

  // Inverters
  { id: 'inv-deye-8kw', name: 'Deye 8kW Hybrid Inverter', brand: 'Deye', category: 'inverters', price: 185000, rating: 4.8, reviews: 234, inStock: true, specifications: { 'Power': '8kW', 'Type': 'Hybrid', 'MPPT': '2 Channels', 'Efficiency': '97.6%', 'Battery Voltage': '48V' }, features: ['WiFi monitoring', 'Parallel capability', '3-phase option', 'Battery priority modes'], warranty: '10 years', tags: ['bestseller', 'premium'] },
  { id: 'inv-deye-5kw', name: 'Deye 5kW Hybrid Inverter', brand: 'Deye', category: 'inverters', price: 125000, rating: 4.8, reviews: 312, inStock: true, specifications: { 'Power': '5kW', 'Type': 'Hybrid', 'MPPT': '2 Channels' }, features: ['WiFi monitoring', 'Parallel up to 9 units'], warranty: '10 years', tags: ['bestseller'] },
  { id: 'inv-growatt-sph8', name: 'Growatt SPH 8000TL3 BH', brand: 'Growatt', category: 'inverters', price: 195000, rating: 4.7, reviews: 156, inStock: true, specifications: { 'Power': '8kW', 'Type': 'Hybrid', 'Phase': '3-Phase' }, features: ['Smart energy management', 'Touch screen display'], warranty: '10 years', tags: ['premium', '3-phase'] },
  { id: 'inv-sunsynk-5kw', name: 'Sunsynk 5kW Hybrid Inverter', brand: 'Sunsynk', category: 'inverters', price: 125000, rating: 4.7, reviews: 189, inStock: true, specifications: { 'Power': '5kW', 'Type': 'Hybrid' }, features: ['Built-in WiFi', 'Smart load management'], warranty: '10 years', tags: ['popular'] },
  { id: 'inv-must-5kw', name: 'Must PV1800 5kW Off-Grid', brand: 'Must', category: 'inverters', price: 65000, originalPrice: 72000, rating: 4.4, reviews: 267, inStock: true, specifications: { 'Power': '5kW', 'Type': 'Off-Grid', 'MPPT': '80A' }, features: ['Built-in MPPT', 'Pure sine wave', 'Generator support'], warranty: '2 years', tags: ['value', 'budget'] },
  { id: 'inv-felicity-5kw', name: 'Felicity IVPM 5kW', brand: 'Felicity Solar', category: 'inverters', price: 55000, rating: 4.3, reviews: 198, inStock: true, specifications: { 'Power': '5kW', 'Type': 'Off-Grid', 'MPPT': '80A' }, features: ['Budget-friendly', 'Reliable'], warranty: '2 years', tags: ['budget'] },

  // Batteries
  { id: 'bat-pylontech-us5000', name: 'Pylontech US5000 4.8kWh', brand: 'Pylontech', category: 'batteries', price: 165000, rating: 4.9, reviews: 287, inStock: true, specifications: { 'Capacity': '4.8kWh', 'Voltage': '48V', 'Type': 'LiFePO4', 'Cycles': '6000+', 'DoD': '95%' }, features: ['Long cycle life', 'Modular design', 'BMS included', 'Excellent communication'], warranty: '10 years', tags: ['bestseller', 'premium'] },
  { id: 'bat-pylontech-us3000c', name: 'Pylontech US3000C 3.5kWh', brand: 'Pylontech', category: 'batteries', price: 125000, rating: 4.9, reviews: 312, inStock: true, specifications: { 'Capacity': '3.5kWh', 'Voltage': '48V', 'Type': 'LiFePO4' }, features: ['Stack up to 8 units', 'Smart BMS'], warranty: '10 years', tags: ['bestseller'] },
  { id: 'bat-byd-hvs', name: 'BYD Battery-Box HVS 5.1', brand: 'BYD', category: 'batteries', price: 285000, rating: 4.8, reviews: 89, inStock: true, specifications: { 'Capacity': '5.1kWh', 'Voltage': '51.2V', 'Type': 'LiFePO4', 'Cycles': '8000+' }, features: ['High voltage system', 'Excellent efficiency'], warranty: '10 years', tags: ['premium'] },
  { id: 'bat-growatt-ark', name: 'Growatt ARK 5.12kWh', brand: 'Growatt', category: 'batteries', price: 155000, rating: 4.7, reviews: 134, inStock: true, specifications: { 'Capacity': '5.12kWh', 'Voltage': '51.2V', 'Type': 'LiFePO4' }, features: ['Perfect Growatt match', 'Easy installation'], warranty: '10 years', tags: ['popular'] },
  { id: 'bat-felicity-5kwh', name: 'Felicity 5kWh LiFePO4', brand: 'Felicity Solar', category: 'batteries', price: 95000, originalPrice: 105000, rating: 4.5, reviews: 178, inStock: true, specifications: { 'Capacity': '5kWh', 'Voltage': '48V', 'Type': 'LiFePO4', 'Cycles': '4000+' }, features: ['Affordable lithium', 'Good performance'], warranty: '5 years', tags: ['value', 'budget'] },
  { id: 'bat-ritar-200gel', name: 'Ritar 200Ah Gel Battery', brand: 'Ritar', category: 'batteries', price: 38000, rating: 4.3, reviews: 234, inStock: true, specifications: { 'Capacity': '200Ah', 'Voltage': '12V', 'Type': 'Gel' }, features: ['Maintenance-free', 'Deep cycle'], warranty: '3 years', tags: ['budget', 'gel'] },

  // Charge Controllers
  { id: 'ctrl-victron-150-70', name: 'Victron SmartSolar 150/70', brand: 'Victron', category: 'controllers', price: 85000, rating: 4.9, reviews: 156, inStock: true, specifications: { 'Max PV Voltage': '150V', 'Charge Current': '70A', 'Type': 'MPPT' }, features: ['Bluetooth built-in', 'Ultra-fast tracking', 'VE.Direct'], warranty: '5 years', tags: ['premium', 'bestseller'] },
  { id: 'ctrl-victron-100-50', name: 'Victron SmartSolar 100/50', brand: 'Victron', category: 'controllers', price: 45000, rating: 4.9, reviews: 203, inStock: true, specifications: { 'Max PV Voltage': '100V', 'Charge Current': '50A', 'Type': 'MPPT' }, features: ['Bluetooth built-in', 'Programmable'], warranty: '5 years', tags: ['popular'] },
  { id: 'ctrl-epever-100a', name: 'EPEver Tracer 100A MPPT', brand: 'EPEver', category: 'controllers', price: 28000, rating: 4.5, reviews: 312, inStock: true, specifications: { 'Max Current': '100A', 'Max PV': '150V', 'Type': 'MPPT' }, features: ['LCD display', 'Timer function', 'RS485'], warranty: '2 years', tags: ['value'] },
  { id: 'ctrl-must-80a', name: 'Must PC18-8015F 80A MPPT', brand: 'Must', category: 'controllers', price: 18000, rating: 4.4, reviews: 267, inStock: true, specifications: { 'Max Current': '80A', 'Type': 'MPPT' }, features: ['Budget MPPT', 'LCD display'], warranty: '1 year', tags: ['budget'] },

  // Mounting Systems
  { id: 'mount-roof-kit', name: 'Roof Mounting Kit (10 panels)', brand: 'Generic', category: 'mounting', price: 35000, rating: 4.6, reviews: 89, inStock: true, specifications: { 'Capacity': '10 Panels', 'Material': 'Aluminum', 'Roof Type': 'Iron Sheet' }, features: ['Pre-drilled holes', 'Includes all hardware'], warranty: '10 years', tags: ['essential'] },
  { id: 'mount-ground-kit', name: 'Ground Mount Kit (10 panels)', brand: 'Generic', category: 'mounting', price: 55000, rating: 4.5, reviews: 67, inStock: true, specifications: { 'Capacity': '10 Panels', 'Material': 'Hot-dip Galvanized', 'Tilt': 'Adjustable 10-60°' }, features: ['Heavy-duty', 'Adjustable angle'], warranty: '15 years', tags: ['ground'] },

  // Cables & Connectors
  { id: 'cable-solar-6mm', name: 'Solar DC Cable 6mm² (100m)', brand: 'Generic', category: 'cables', price: 12000, rating: 4.7, reviews: 234, inStock: true, specifications: { 'Size': '6mm²', 'Length': '100m', 'Type': 'PV1-F' }, features: ['UV resistant', 'TUV certified'], warranty: '25 years', tags: ['essential'] },
  { id: 'cable-solar-4mm', name: 'Solar DC Cable 4mm² (100m)', brand: 'Generic', category: 'cables', price: 8500, rating: 4.6, reviews: 189, inStock: true, specifications: { 'Size': '4mm²', 'Length': '100m' }, features: ['UV resistant', 'Double insulated'], warranty: '25 years', tags: ['essential'] },
  { id: 'mc4-connectors', name: 'MC4 Connectors (10 pairs)', brand: 'Generic', category: 'cables', price: 2500, rating: 4.5, reviews: 456, inStock: true, specifications: { 'Quantity': '10 pairs', 'Rating': '30A' }, features: ['IP67 rated', 'Easy installation'], warranty: '5 years', tags: ['essential', 'budget'] },
  { id: 'battery-cable-35mm', name: 'Battery Cable 35mm² (5m pair)', brand: 'Generic', category: 'cables', price: 4500, rating: 4.6, reviews: 178, inStock: true, specifications: { 'Size': '35mm²', 'Length': '5m pair' }, features: ['With lugs', 'Flexible copper'], warranty: '5 years', tags: ['essential'] },

  // Accessories
  { id: 'acc-combiner-4', name: 'PV Combiner Box 4-String', brand: 'Generic', category: 'accessories', price: 8500, rating: 4.5, reviews: 123, inStock: true, specifications: { 'Strings': '4', 'Fuse': '15A per string' }, features: ['IP65 rated', 'Surge protection'], warranty: '2 years', tags: ['essential'] },
  { id: 'acc-dc-breaker-250a', name: 'DC Circuit Breaker 250A', brand: 'Generic', category: 'accessories', price: 3500, rating: 4.6, reviews: 234, inStock: true, specifications: { 'Rating': '250A', 'Voltage': '48V DC' }, features: ['Manual disconnect', 'Thermal protection'], warranty: '2 years', tags: ['essential'] },
  { id: 'acc-surge-dc', name: 'DC Surge Protector SPD', brand: 'Generic', category: 'accessories', price: 5500, rating: 4.7, reviews: 156, inStock: true, specifications: { 'Voltage': '500V DC', 'Type': 'Type II' }, features: ['Lightning protection', 'DIN rail mount'], warranty: '5 years', tags: ['safety'] },
  { id: 'acc-monitor-wifi', name: 'WiFi Monitoring Dongle', brand: 'Generic', category: 'accessories', price: 4500, rating: 4.4, reviews: 289, inStock: true, specifications: { 'Compatibility': 'Most inverters', 'App': 'iOS/Android' }, features: ['Real-time monitoring', 'Push notifications'], warranty: '1 year', tags: ['monitoring'] },
];

interface CartItem extends SolarProduct {
  quantity: number;
}

export default function SolarProductsShop() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedProduct, setSelectedProduct] = useState<SolarProduct | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...SOLAR_PRODUCTS];

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags.some(t => t.includes(query))
      );
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - prioritize bestsellers
        filtered.sort((a, b) => {
          const aScore = a.tags.includes('bestseller') ? 2 : a.tags.includes('popular') ? 1 : 0;
          const bScore = b.tags.includes('bestseller') ? 2 : b.tags.includes('popular') ? 1 : 0;
          return bScore - aScore;
        });
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  // Cart functions
  const addToCart = useCallback((product: SolarProduct) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(p => p.id !== id));
    } else {
      setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: qty } : p));
    }
  }, []);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // WhatsApp checkout
  const handleWhatsAppCheckout = () => {
    const itemsList = cart.map(item =>
      `- ${item.name} x${item.quantity} @ KES ${item.price.toLocaleString()} = KES ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = encodeURIComponent(
`*SOLAR EQUIPMENT ORDER*

${itemsList}

*TOTAL: KES ${cartTotal.toLocaleString()}*

Please confirm availability and delivery options.
Payment: M-Pesa to 0768860665`
    );

    window.open(`https://wa.me/254768860665?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Solar Equipment Shop</h1>
          <p className="text-amber-100">Premium solar products with M-Pesa payment | Same-day delivery in Nairobi</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Products ({SOLAR_PRODUCTS.length})
          </button>
          {SOLAR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solar products..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <div className="flex border border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-slate-400 mb-4">{filteredProducts.length} products found</p>

        {/* Products Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Image placeholder */}
              <div className={`bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ${
                viewMode === 'list' ? 'w-32 h-32' : 'aspect-square'
              }`}>
                <Sun className="w-12 h-12 text-amber-500/30" />
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                {/* Tags */}
                <div className="flex gap-1 mb-2">
                  {product.tags.includes('bestseller') && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">Bestseller</span>
                  )}
                  {product.originalPrice && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Sale</span>
                  )}
                </div>

                <p className="text-amber-400 text-xs font-medium">{product.brand}</p>
                <h3 className="text-white font-semibold mb-1 line-clamp-2">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white text-sm">{product.rating}</span>
                  <span className="text-slate-500 text-sm">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-amber-400">
                    KES {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-slate-500 text-sm line-through">
                      KES {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <p className={`text-sm mb-3 ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 border border-slate-600 rounded-lg hover:border-slate-500"
                  >
                    <Eye className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-500 text-white p-4 rounded-full shadow-2xl"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </motion.button>
      )}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Shopping Cart ({cartCount})</h2>
                  <button onClick={() => setCartOpen(false)}>
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-slate-800 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-slate-400 text-sm">{item.brand}</p>
                      </div>
                      <button onClick={() => updateQuantity(item.id, 0)}>
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-slate-700 rounded"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-8 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-slate-700 rounded"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <p className="text-amber-400 font-bold">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-800">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-400">Total</span>
                  <span className="text-2xl font-bold text-amber-400">
                    KES {cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  Order via WhatsApp
                </button>
                <p className="text-center text-slate-500 text-sm mt-2">
                  M-Pesa Payment: 0768860665
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-amber-400 font-medium">{selectedProduct.brand}</p>
                    <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                  </div>
                  <button onClick={() => setSelectedProduct(null)}>
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-white">{selectedProduct.rating}</span>
                    <span className="text-slate-500">({selectedProduct.reviews} reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-amber-400">
                      KES {selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-slate-500 line-through">
                        KES {selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="bg-slate-800 p-3 rounded-lg">
                        <p className="text-slate-400 text-sm">{key}</p>
                        <p className="text-white font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warranty */}
                <div className="flex items-center gap-2 text-slate-300 mb-6">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>Warranty: {selectedProduct.warranty}</span>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
