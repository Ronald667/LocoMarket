/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Heart,
  Plus,
  SlidersHorizontal,
  Star,
  Tag,
  DollarSign,
  Package,
  Bell,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  User,
  Clock,
  ChevronRight,
  TrendingDown,
  ExternalLink,
  X,
  Send,
  Check,
  AlertCircle,
  Flag,
  Truck,
  Paperclip,
  Upload,
  FileText
} from 'lucide-react';

interface Item {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  location: string;
  distance: number; // km
  image: string;
  description: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewsCount: number;
    joined: string;
    verified: boolean;
  };
  createdAt: string;
  isSaved?: boolean;
  priceDrop?: boolean;
}

interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  otherUser: string;
  otherAvatar: string;
  lastMessage: string;
  unread: boolean;
  messages: Message[];
}

interface Transaction {
  id: string;
  itemId: string;
  itemTitle: string;
  price: number;
  shippingFee: number;
  type: 'buy' | 'sell';
  status: 'Escrow Funded' | 'Pending Pickup' | 'Completed' | 'Shipped';
  date: string;
  escrowCode: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'price_drop' | 'chat' | 'deal' | 'system';
  read: boolean;
}

interface UserDocument {
  id: string;
  name: string;
  size: string;
  date: string;
}

const INITIAL_ITEMS: Item[] = [
  {
    id: '1',
    title: 'Leica M3 35mm Vintage Rangefinder Film Camera',
    price: 14999,
    originalPrice: 17500,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Sandton, Johannesburg (Gauteng)',
    distance: 2.1,
    image: '/src/assets/images/item_vintage_camera_1793291857014.jpg',
    description: 'MINT condition Leica M3 double stroke film camera. Fully serviced last month with crisp viewfinder and accurate shutter speeds. Includes original leather strap and Summicron 50mm lens.',
    seller: {
      id: 's1',
      name: 'Thabo Mokoena',
      avatar: '/src/assets/images/seller_avatar_sarah_1793291857875.jpg',
      rating: 4.9,
      reviewsCount: 128,
      joined: 'Jan 2023',
      verified: true
    },
    createdAt: '2 hours ago',
    priceDrop: true
  },
  {
    id: '2',
    title: 'Specialized Stumpjumper Carbon Mountain Bike',
    price: 24500,
    category: 'Sports',
    condition: 'Good',
    location: 'Soweto, Johannesburg (Gauteng)',
    distance: 4.5,
    image: '/src/assets/images/item_mountain_bike_1793291856526.jpg',
    description: 'Size L carbon frame mountain bike. SRAM GX Eagle drivetrain, Fox suspension, freshly tuned up. Minor cosmetic trail scratches on the derailleur guard, otherwise pristine.',
    seller: {
      id: 's2',
      name: 'Sipho Zulu',
      avatar: '/src/assets/images/seller_avatar_marcus_1793291857376.jpg',
      rating: 4.8,
      reviewsCount: 94,
      joined: 'Mar 2022',
      verified: true
    },
    createdAt: '5 hours ago'
  },
  {
    id: '3',
    title: 'Mid-Century Modern Genuine Leather Sofa',
    price: 11200,
    originalPrice: 13500,
    category: 'Furniture',
    condition: 'Like New',
    location: 'Sea Point, Cape Town (Western Cape)',
    distance: 3.2,
    image: '/src/assets/images/item_leather_sofa_1793291857152.jpg',
    description: 'Rich cognac brown top-grain leather sofa. Kept in a smoke-free, pet-free home. Super comfortable kiln-dried solid wood frame. Moving sale!',
    seller: {
      id: 's1',
      name: 'Thabo Mokoena',
      avatar: '/src/assets/images/seller_avatar_sarah_1793291857875.jpg',
      rating: 4.9,
      reviewsCount: 128,
      joined: 'Jan 2023',
      verified: true
    },
    createdAt: '1 day ago',
    priceDrop: true
  },
  {
    id: '4',
    title: 'MacBook Pro 16" M2 Max (32GB / 1TB SSD)',
    price: 32000,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Umhlanga, Durban (KwaZulu-Natal)',
    distance: 1.8,
    image: '/src/assets/images/item_macbook_pro_1793291857881.jpg',
    description: 'Apple MacBook Pro 16-inch with M2 Max chip. Battery health at 98%, only 45 battery cycles. Comes in original box with 140W USB-C power adapter.',
    seller: {
      id: 's2',
      name: 'Sipho Zulu',
      avatar: '/src/assets/images/seller_avatar_marcus_1793291857376.jpg',
      rating: 4.8,
      reviewsCount: 94,
      joined: 'Mar 2022',
      verified: true
    },
    createdAt: '2 days ago'
  },
  {
    id: '5',
    title: 'Martin D-28 Acoustic Guitar (Natural Gloss)',
    price: 38000,
    category: 'Collectibles',
    condition: 'Like New',
    location: 'Polokwane (Limpopo)',
    distance: 8.5,
    image: '/src/assets/images/item_acoustic_guitar_1793291857422.jpg',
    description: 'Iconic dreadnought acoustic guitar with sitka spruce top and East Indian rosewood back and sides. Warm, resonant tone. Includes original hardshell case.',
    seller: {
      id: 's1',
      name: 'Thabo Mokoena',
      avatar: '/src/assets/images/seller_avatar_sarah_1793291857875.jpg',
      rating: 4.9,
      reviewsCount: 128,
      joined: 'Jan 2023',
      verified: true
    },
    createdAt: '3 days ago'
  }
];

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'dashboard' | 'messages' | 'notifications'>('marketplace');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [maxDistance, setMaxDistance] = useState(25);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'distance'>('newest');
  const [userLocation, setUserLocation] = useState('Sandton, Johannesburg (Gauteng)');

  // Selected Item Modal & Safety Hub
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  // User Storage / Documents Vault State
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([
    { id: 'doc-1', name: 'SA_Smart_ID_Card_Verified.pdf', size: '1.4 MB', date: 'Oct 24, 2026' },
    { id: 'doc-2', name: 'Proof_of_Address_Eskom_Bill.pdf', size: '850 KB', date: 'Oct 20, 2026' }
  ]);

  // Courier Quote State
  const [courierDestination, setCourierDestination] = useState('Gauteng (Johannesburg / Pretoria)');
  const [courierQuotes, setCourierQuotes] = useState<{ service: string; price: number; eta: string; logo: string }[] | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<{ service: string; price: number } | null>(null);
  const [calculatingCourier, setCalculatingCourier] = useState(false);

  // Secure Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');

  // Sell Item Modal State
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newCondition, setNewCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [newLocation, setNewLocation] = useState('Sandton, Johannesburg (Gauteng)');
  const [newDescription, setNewDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Camera State & Methods
  const [cameraActive, setCameraActive] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please allow camera permissions or use photo upload.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setNewImage(dataUrl);
        stopCamera();
      }
    }
  };

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(`GPS Verified (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        setItems(items.map(item => ({
          ...item,
          distance: Number((Math.random() * 8 + 0.5).toFixed(1))
        })));
        alert("Location detected successfully via GPS! Listings refreshed for your coordinates.");
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
      }
    );
  };

  const handleCalculateCourier = () => {
    setCalculatingCourier(true);
    setTimeout(() => {
      const baseFee = activeItem?.category === 'Furniture' ? 250 : activeItem?.category === 'Electronics' ? 90 : 65;
      setCourierQuotes([
        { service: 'Pudo Locker-to-Locker (The Courier Guy)', price: baseFee, eta: '2 - 3 Working Days', logo: '📦' },
        { service: 'The Courier Guy (Door-to-Door)', price: baseFee + 55, eta: 'Next Day Express', logo: '🚚' },
        { service: 'PostNet-to-Counter', price: baseFee + 35, eta: '2 - 4 Working Days', logo: '📮' },
        { service: 'Same-Day Metro Courier (Uber Direct)', price: baseFee + 95, eta: 'Today (Within 3 Hours)', logo: '⚡' }
      ]);
      setCalculatingCourier(false);
    }, 500);
  };

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      itemId: '1',
      itemTitle: 'Leica M3 35mm Vintage Rangefinder Film Camera',
      itemImage: '/src/assets/images/item_vintage_camera_1793291857014.jpg',
      otherUser: 'Thabo Mokoena',
      otherAvatar: '/src/assets/images/seller_avatar_sarah_1793291857875.jpg',
      lastMessage: 'Is this still available for local meetup in Sandton today?',
      unread: true,
      messages: [
        { id: 'm1', sender: 'buyer', text: 'Hi Thabo, is this Leica M3 still available?', timestamp: '10:14 AM' },
        { id: 'm2', sender: 'seller', text: 'Yes it is! I can meet near Sandton City this afternoon.', timestamp: '10:20 AM' },
        { id: 'm3', sender: 'buyer', text: 'Perfect. Would you take R14,000 cash or secure escrow?', timestamp: '10:25 AM' }
      ]
    }
  ]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [newMessageText, setNewMessageText] = useState('');

  // Transactions & Dashboard State
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-9921',
      itemId: '4',
      itemTitle: 'MacBook Pro 16" M2 Max',
      price: 32000,
      shippingFee: 90,
      type: 'buy',
      status: 'Escrow Funded',
      date: 'Yesterday',
      escrowCode: 'LOCO-8842-ZA'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Price Drop Alert!',
      message: 'Leica M3 Camera dropped in price from R17,500 to R14,999.',
      time: '2 hours ago',
      type: 'price_drop',
      read: false
    },
    {
      id: 'n2',
      title: 'New Message',
      message: 'Thabo Mokoena sent you a message regarding Leica M3.',
      time: '3 hours ago',
      type: 'chat',
      read: false
    },
    {
      id: 'n3',
      title: 'Escrow Secured',
      message: 'Funds for MacBook Pro secured safely in ZAR escrow.',
      time: '1 day ago',
      type: 'deal',
      read: true
    }
  ]);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
    const matchesProvince = selectedProvince === 'All' || item.location.includes(selectedProvince);
    const matchesDistance = item.distance <= maxDistance;
    return matchesSearch && matchesCategory && matchesCondition && matchesProvince && matchesDistance;
  }).sort((a, b) => {
    if (sortBy === 'newest') return 0;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'distance') return a.distance - b.distance;
    return 0;
  });

  const toggleSaveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.map(item => item.id === id ? { ...item, isSaved: !item.isSaved } : item));
  };

  const handleAiSmartLister = async () => {
    if (!newTitle && !newDescription) {
      alert('Please enter a brief item title or description first for AI assistance.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/smart-lister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newTitle || newDescription, category: newCategory, condition: newCondition })
      });
      const data = await res.json();
      if (data.title) setNewTitle(data.title);
      if (data.description) setNewDescription(data.description);
      if (data.suggestedPrice) setNewPrice(Math.round(data.suggestedPrice * 18).toString());
    } catch (err) {
      console.error(err);
      alert('AI Assistant error. Please fill in details manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const newItem: Item = {
      id: Date.now().toString(),
      title: newTitle,
      price: parseFloat(newPrice),
      category: newCategory,
      condition: newCondition,
      location: newLocation,
      distance: 0.5,
      image: newImage || (newCategory === 'Electronics' ? '/src/assets/images/item_macbook_pro_1793291857881.jpg' : '/src/assets/images/item_vintage_camera_1793291857014.jpg'),
      description: newDescription || 'Newly listed item in excellent local condition.',
      seller: {
        id: 'me',
        name: 'You (Verified Seller)',
        avatar: '/src/assets/images/seller_avatar_sarah_1793291857875.jpg',
        rating: 5.0,
        reviewsCount: 1,
        joined: 'Today',
        verified: true
      },
      createdAt: 'Just now'
    };
    setItems([newItem, ...items]);
    setSellModalOpen(false);
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewImage(null);
    alert('Item listed securely in South Africa! Verified by LocoMarket Trust system.');
  };

  const handleCompleteCheckout = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      if (activeItem) {
        const shippingCost = selectedCourier ? selectedCourier.price : 0;
        const newTx: Transaction = {
          id: 'tx-' + Math.floor(1000 + Math.random() * 9000),
          itemId: activeItem.id,
          itemTitle: activeItem.title,
          price: activeItem.price,
          shippingFee: shippingCost,
          type: 'buy',
          status: 'Escrow Funded',
          date: 'Just now',
          escrowCode: 'LOCO-' + Math.floor(1000 + Math.random() * 9000) + '-ZA'
        };
        setTransactions([newTx, ...transactions]);
      }
    }, 1500);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'buyer',
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = {
      ...activeChat,
      lastMessage: newMessageText,
      messages: [...activeChat.messages, msg]
    };
    setActiveChat(updated);
    setConversations(conversations.map(c => c.id === updated.id ? updated : c));
    setNewMessageText('');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadChatCount = conversations.filter(c => c.unread).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setCurrentTab('marketplace')}>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">LocoMarket ZA</span>
              <span className="text-[11px] text-emerald-700 font-medium tracking-wide">100% Secure SA Trade</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${currentTab === 'marketplace' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent'}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${currentTab === 'dashboard' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent'}`}
            >
              Dashboard & Orders
            </button>
            <button
              onClick={() => setCurrentTab('messages')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'messages' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent'}`}
            >
              Messages
              {unreadChatCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{unreadChatCount}</span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('notifications')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'notifications' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent'}`}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => setSafetyModalOpen(true)}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 border-transparent flex items-center gap-1.5 text-emerald-800 font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
              Safety Hub
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSellModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Post an Item
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW SWITCHER */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'marketplace' && (
          <div className="space-y-8">
            {/* HERO / SAFETY BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ZAR Escrow Protected · Local SA Courier Quotes</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  South Africa's safest local marketplace & courier hub.
                </h1>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Every transaction is secured with ZAR Escrow, verified ID badges, and instant local courier quotes (Pudo, The Courier Guy, PostNet).
                </p>

                {/* SEARCH & LOCATION CONTROLS */}
                <div className="bg-white p-2 rounded-xl shadow-md flex flex-col md:flex-row gap-2 text-slate-900">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search items by keyword, township, or brand..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 md:w-72">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs text-slate-700 truncate font-medium">{userLocation}</span>
                    </div>
                    <button
                      type="button"
                      onClick={detectUserLocation}
                      className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded font-medium whitespace-nowrap shrink-0 transition-colors shadow-sm"
                    >
                      Detect GPS
                    </button>
                  </div>

                  <button
                    onClick={() => {}}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* FILTER & CATEGORY BAR */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {['All', 'Electronics', 'Furniture', 'Sports', 'Collectibles'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Province / Township & Sort */}
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Province:</span>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Provinces</option>
                      <option value="Gauteng">Gauteng (Sandton, Soweto, Pretoria)</option>
                      <option value="Western Cape">Western Cape (Cape Town, Khayelitsha)</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal (Durban, Umlazi)</option>
                      <option value="Limpopo">Limpopo (Polokwane, Seshego)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest Listed</option>
                      <option value="price-asc">Price: Low to High (ZAR)</option>
                      <option value="price-desc">Price: High to Low (ZAR)</option>
                      <option value="distance">Nearest Distance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Condition Filters */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Condition:</span>
                {['All', 'Brand New', 'Like New', 'Good', 'Fair'].map(cond => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-3 py-1 rounded-md transition-colors ${selectedCondition === cond ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' : 'hover:text-slate-900'}`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTINGS GRID */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Verified South African Listings ({filteredItems.length})
                </h2>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Escrow & Courier Quote Active
                </span>
              </div>

              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">No items found</h3>
                  <p className="text-xs text-slate-500 mb-4">Try selecting "All Provinces" or broadening your search terms.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedCondition('All'); setSelectedProvince('All'); }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item);
                        setCourierQuotes(null);
                        setSelectedCourier(null);
                      }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer flex flex-col group"
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {item.priceDrop && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                              Price Drop
                            </span>
                          )}
                          <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                            {item.condition}
                          </span>
                        </div>
                        <button
                          onClick={(e) => toggleSaveItem(item.id, e)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${item.isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'}`}
                        >
                          <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span>{item.category}</span>
                            <span className="font-medium text-emerald-700">{item.distance} km away</span>
                          </div>
                          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">
                            {item.title}
                          </h3>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-slate-900">R{item.price.toLocaleString()}</span>
                                {item.originalPrice && (
                                  <span className="text-xs text-slate-400 line-through">R{item.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <img src={item.seller.avatar} alt={item.seller.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="truncate max-w-[90px]">{item.seller.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">User Dashboard & Secure ZAR Escrow</h1>
                <p className="text-xs text-slate-500">Track your South African listings, ZAR escrow orders, and local device document storage.</p>
              </div>
            </div>

            {/* METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block mb-1">Active Escrow Orders</span>
                <span className="text-2xl font-bold text-slate-900">1</span>
                <span className="text-[11px] text-emerald-600 block mt-1">ZAR Funds safely secured</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block mb-1">Active SA Listings</span>
                <span className="text-2xl font-bold text-slate-900">{items.filter(i => i.seller.id === 'me').length + 2}</span>
                <span className="text-[11px] text-slate-500 block mt-1">Visible in provinces</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block mb-1">Saved Favorites</span>
                <span className="text-2xl font-bold text-slate-900">{items.filter(i => i.isSaved).length}</span>
                <span className="text-[11px] text-emerald-600 block mt-1">Price drop alerts active</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block mb-1">Seller Rating</span>
                <span className="text-2xl font-bold text-slate-900">4.9</span>
                <span className="text-[11px] text-slate-500 block mt-1">128 verified reviews</span>
              </div>
            </div>

            {/* LOCAL STORAGE & DOCUMENTS VAULT */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> Device & Storage Vault (Verification & Receipts)
                  </h3>
                  <p className="text-xs text-slate-500">Upload and manage local ID proofs, certificates, or payment receipts securely.</p>
                </div>
                <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Upload from Device
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const newDoc: UserDocument = {
                          id: 'doc-' + Date.now(),
                          name: file.name,
                          size: (file.size / 1024).toFixed(1) + ' KB',
                          date: 'Just now'
                        };
                        setUserDocuments([newDoc, ...userDocuments]);
                        alert(`Successfully uploaded "${file.name}" from local storage to your Vault.`);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="space-y-2">
                {userDocuments.map(doc => (
                  <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{doc.name}</span>
                        <span className="text-[10px] text-slate-500">{doc.size} · Uploaded {doc.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setUserDocuments(userDocuments.filter(d => d.id !== doc.id))}
                      className="text-slate-400 hover:text-rose-600 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Recent ZAR Transactions & Courier Orders</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                          {tx.status}
                        </span>
                        <span className="text-xs text-slate-400">ID: {tx.id}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">{tx.itemTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Courier Fee: R{tx.shippingFee} · Escrow Code: <span className="font-mono font-bold text-slate-800">{tx.escrowCode}</span></p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-base font-bold text-slate-900">R{(tx.price + tx.shippingFee).toLocaleString()}</span>
                        <span className="text-xs text-slate-500 block">{tx.date}</span>
                      </div>
                      <button
                        onClick={() => alert(`ZAR Escrow funds of R${tx.price.toLocaleString()} + R${tx.shippingFee} courier fee are held safely until delivery. Waybill tracking active.`)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                      >
                        Track Courier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
            {/* Conversations List */}
            <div className="border-r border-slate-200 p-4 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 px-2">Messages & Chats</h2>
              <div className="space-y-1">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveChat(conv);
                      setConversations(conversations.map(c => c.id === conv.id ? { ...c, unread: false } : c));
                    }}
                    className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${activeChat?.id === conv.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  >
                    <div className="relative">
                      <img src={conv.otherAvatar} alt={conv.otherUser} className="w-11 h-11 rounded-full object-cover" />
                      {conv.unread && <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-slate-900 truncate">{conv.otherUser}</span>
                        <span className="text-[10px] text-slate-400">10m</span>
                      </div>
                      <p className="text-xs text-slate-600 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Conversation Window */}
            <div className="md:col-span-2 flex flex-col justify-between bg-slate-50/50">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={activeChat.otherAvatar} alt={activeChat.otherUser} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h3 className="text-xs font-semibold text-slate-900">{activeChat.otherUser}</h3>
                        <span className="text-[11px] text-emerald-600 font-medium">ID Verified SA Seller · Online</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <img src={activeChat.itemImage} alt={activeChat.itemTitle} className="w-8 h-8 rounded object-cover" />
                      <div className="text-left">
                        <span className="text-[11px] font-semibold text-slate-900 block truncate max-w-[150px]">{activeChat.itemTitle}</span>
                        <span className="text-[10px] text-slate-500">ZAR Escrow & Courier Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Flow */}
                  <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Local File Attachment: You can attach files, receipts, or photos directly from your device storage using the paperclip button below.</span>
                    </div>

                    {activeChat.messages.map(m => (
                      <div key={m.id} className={`flex ${m.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md rounded-2xl px-4 py-3 text-xs ${m.sender === 'buyer' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-sm'}`}>
                          <p>{m.text}</p>
                          <span className={`block text-[10px] mt-1 text-right ${m.sender === 'buyer' ? 'text-emerald-100' : 'text-slate-400'}`}>{m.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Box with File Attachment */}
                  <form onSubmit={sendChatMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                    <label className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors" title="Attach file from device storage">
                      <Paperclip className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && activeChat) {
                            const msg: Message = {
                              id: Date.now().toString(),
                              sender: 'buyer',
                              text: `📎 [Attached file from device: ${file.name}]`,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            const updated = {
                              ...activeChat,
                              lastMessage: `Attached file: ${file.name}`,
                              messages: [...activeChat.messages, msg]
                            };
                            setActiveChat(updated);
                            setConversations(conversations.map(c => c.id === updated.id ? updated : c));
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Type a message or negotiate ZAR price..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">Select a conversation to start chatting and negotiating securely in ZAR.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold text-slate-900 mb-6">Notifications & ZAR Price Drop Alerts</h1>
            <div className="space-y-4">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 rounded-xl border flex items-start gap-4 ${n.read ? 'bg-white border-slate-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'price_drop' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {n.type === 'price_drop' ? <TrendingDown className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-semibold text-slate-900">{n.title}</h3>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ITEM DETAILS MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">· {activeItem.condition}</span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Image & Title Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{activeItem.title}</h2>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl font-bold text-slate-900">R{activeItem.price.toLocaleString()}</span>
                      {activeItem.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">R{activeItem.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold block text-slate-900">Seller Location: {activeItem.location}</span>
                        <span>{activeItem.distance} km from your location</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{activeItem.description}</p>
                  </div>

                  {/* COURIER QUOTE CALCULATOR SECTION */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" /> Local Courier Quote (SA)
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={courierDestination}
                        onChange={(e) => setCourierDestination(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <option value="Gauteng (Johannesburg / Pretoria)">Deliver to Gauteng</option>
                        <option value="Western Cape (Cape Town / Stellenbosch)">Deliver to Western Cape</option>
                        <option value="KwaZulu-Natal (Durban / Pietermaritzburg)">Deliver to KwaZulu-Natal</option>
                        <option value="Limpopo (Polokwane / Thohoyandou)">Deliver to Limpopo</option>
                        <option value="Eastern Cape (Port Elizabeth / Gqeberha)">Deliver to Eastern Cape</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleCalculateCourier}
                        disabled={calculatingCourier}
                        className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap"
                      >
                        {calculatingCourier ? 'Calculating...' : 'Get Rates'}
                      </button>
                    </div>

                    {courierQuotes && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        {courierQuotes.map((q, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedCourier(q)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedCourier?.service === q.service ? 'border-emerald-600 bg-emerald-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{q.logo}</span>
                              <div>
                                <span className="text-xs font-semibold text-slate-900 block">{q.service}</span>
                                <span className="text-[10px] text-slate-500">{q.eta}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-emerald-700">R{q.price}</span>
                              {selectedCourier?.service === q.service && (
                                <span className="text-[10px] text-emerald-800 block font-semibold">Selected</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Secure Checkout & Chat Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setCheckoutModalOpen(true)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Buy Now with ZAR Escrow (R{(activeItem.price + (selectedCourier ? selectedCourier.price : 0)).toLocaleString()})
                    </button>
                    <button
                      onClick={() => {
                        setActiveItem(null);
                        setCurrentTab('messages');
                      }}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Seller & Make Offer
                    </button>
                  </div>
                </div>
              </div>

              {/* Seller Profile & Reviews */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={activeItem.seller.avatar} alt={activeItem.seller.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{activeItem.seller.name}</h3>
                      {activeItem.seller.verified && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">ID Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {activeItem.seller.rating}
                      </span>
                      <span>·</span>
                      <span>{activeItem.seller.reviewsCount} reviews</span>
                      <span>·</span>
                      <span>Member since {activeItem.seller.joined}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Listing reported to LocoMarket SA Trust & Safety Team. We investigate all flags within 2 hours.")}
                    className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-medium transition-colors"
                    title="Report Listing"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Seller ${activeItem.seller.name} has 100% successful local pickups in South Africa and fast response time.`)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:border-slate-300"
                  >
                    View Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY HUB MODAL */}
      {safetyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">LocoMarket SA Safety & Trust Center</h3>
                  <p className="text-xs text-slate-500">Your security is our highest priority during local secondhand trades.</p>
                </div>
              </div>
              <button onClick={() => setSafetyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-emerald-900 text-sm">🔒 1. ZAR Escrow Protection</h4>
                <p className="text-emerald-800 leading-relaxed">
                  Never pay cash upfront or release bank EFTs before seeing the item. When you buy on LocoMarket ZA, funds are held securely in escrow. The seller only gets paid after you inspect the item in person and approve the release code.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">📍 2. Recommended Safe Meetup Zones in South Africa</h4>
                <p className="text-slate-600 mb-2">Always meet in bright, public areas with high foot traffic or police/mall security presence:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-medium">
                  <li><strong>Gauteng:</strong> Sandton City Security Hub, Rosebank Mall Exchange Bay, or Randburg SAPS Safe Zone.</li>
                  <li><strong>Western Cape:</strong> V&A Waterfront Security Office or Claremont Police Station Zone.</li>
                  <li><strong>KwaZulu-Natal:</strong> Gateway Theatre of Shopping Security Desk or Durban Central SAPS.</li>
                  <li><strong>Limpopo:</strong> Polokwane Police Station Safe Meetup Zone.</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-900 text-sm">⚠️ 3. Scam Prevention Checklist</h4>
                <ul className="list-disc pl-5 space-y-1 text-amber-800">
                  <li>Verify the seller's pulsing <strong>ID Verified</strong> badge before meeting.</li>
                  <li>Never click external payment links sent in chat; keep all transactions inside LocoMarket ZA escrow.</li>
                  <li>Inspect electronics and serial numbers thoroughly before handing over the escrow code.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSafetyModalOpen(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              I Understand & Agree to Stay Safe
            </button>
          </div>
        </div>
      )}

      {/* SECURE CHECKOUT MODAL */}
      {checkoutModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Secure ZAR Escrow Checkout</h3>
              </div>
              <button onClick={() => setCheckoutModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentStep === 'form' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                  <span className="font-bold block mb-1">South African Buyer Protection</span>
                  Your ZAR funds are held safely in escrow. The seller only receives payment after you inspect and accept the item during local meetup or delivery.
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Item Price:</span>
                    <span className="font-semibold text-slate-900">R{activeItem.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Courier Delivery ({selectedCourier ? selectedCourier.service : 'Standard Meetup'}):</span>
                    <span className="font-semibold text-slate-900">R{selectedCourier ? selectedCourier.price : 0}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                    <span>Total Escrow:</span>
                    <span className="text-emerald-700">R{(activeItem.price + (selectedCourier ? selectedCourier.price : 0)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className="p-3 border-2 border-emerald-600 bg-emerald-50/50 rounded-xl text-xs font-semibold text-emerald-950 text-center">
                        Card / Instant EFT
                      </button>
                      <button type="button" className="p-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 text-center">
                        Cash on Pickup (Escrow)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Card Number / Ozow EFT</label>
                    <input type="text" placeholder="4242 •••• •••• 4242" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">CVC</label>
                      <input type="text" placeholder="123" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCompleteCheckout}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors mt-4"
                >
                  Authorize ZAR Escrow (R{(activeItem.price + (selectedCourier ? selectedCourier.price : 0)).toLocaleString()})
                </button>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-semibold text-slate-900">Securing ZAR in Escrow...</h4>
                <p className="text-xs text-slate-500">Please wait while we verify your secure transaction.</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">ZAR Escrow Funded Successfully!</h4>
                  <p className="text-xs text-slate-500">Your funds are safely protected. Waybill generated for {selectedCourier ? selectedCourier.service : 'local meetup'}.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs font-bold text-emerald-700">
                  Escrow Code: LOCO-4921-ZA
                </div>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    setActiveItem(null);
                    setPaymentStep('form');
                    setCurrentTab('dashboard');
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  View in Dashboard Orders
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POST AN ITEM / SELL MODAL WITH AI SMART LISTER & CAMERA */}
      {sellModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Post an Item for South African Sale</h3>
              </div>
              <button onClick={() => { stopCamera(); setSellModalOpen(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostItem} className="space-y-4">
              {/* PHOTO CAPTURE & CAMERA SECTION */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Item Photo</label>
                {newImage ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                    <img src={newImage} alt="Captured item" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImage(null)}
                      className="absolute top-3 right-3 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : cameraActive ? (
                  <div className="space-y-2 mb-2">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-500"
                      >
                        📸 Snap Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      📷 Snap with Camera
                    </button>
                    <label className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      📁 Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => setNewImage(event.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* AI Smart Lister Banner */}
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-4 rounded-2xl text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Smart Lister (ZAR)</span>
                </div>
                <p className="text-xs text-slate-300">Type what you are selling below and let AI auto-generate an optimized title, description, and ZAR market price!</p>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={handleAiSmartLister}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {aiLoading ? 'AI Generating...' : '✨ Generate with AI'}
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy S23 Ultra"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Price (R ZAR)</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Sports">Sports</option>
                    <option value="Collectibles">Collectibles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e: any) => setNewCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Province / Township / City</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="Sandton, Johannesburg (Gauteng)">Sandton, Johannesburg (Gauteng)</option>
                    <option value="Soweto, Johannesburg (Gauteng)">Soweto, Johannesburg (Gauteng)</option>
                    <option value="Pretoria Central (Gauteng)">Pretoria Central (Gauteng)</option>
                    <option value="Sea Point, Cape Town (Western Cape)">Sea Point, Cape Town (Western Cape)</option>
                    <option value="Khayelitsha, Cape Town (Western Cape)">Khayelitsha, Cape Town (Western Cape)</option>
                    <option value="Umhlanga, Durban (KwaZulu-Natal)">Umhlanga, Durban (KwaZulu-Natal)</option>
                    <option value="Umlazi, Durban (KwaZulu-Natal)">Umlazi, Durban (KwaZulu-Natal)</option>
                    <option value="Polokwane (Limpopo)">Polokwane (Limpopo)</option>
                    <option value="Seshego (Limpopo)">Seshego (Limpopo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your item, meeting location in your township or suburb..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors mt-2"
              >
                Publish Listing in South Africa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
