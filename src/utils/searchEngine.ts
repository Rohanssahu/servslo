import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = '@servslo_recent_v1';
const MAX_RECENT = 6;

export type ServiceResult = {
  id?: string;
  key: string;
  label: string;
  emoji: string;
  desc: string;
  price: string;
  rating: string;
  basePrice: number;
  matchScore: number;
};

type CatalogEntry = Omit<ServiceResult, 'matchScore'> & {aliases: string[]};

type ApiService = {
  id: string;
  name: string;
  name_en: string;
  emoji: string;
  category: string;
  base_price: number;
  rating: number;
  tags?: string[];
};

const CATALOG: CatalogEntry[] = [
  {
    key: 'quick', label: 'Electrician', emoji: '⚡', desc: 'Wiring & repairs',
    price: '₹199+', rating: '4.8', basePrice: 199,
    aliases: [
      'electrician', 'electric', 'bijli', 'bijlee', 'light', 'bulb', 'fan', 'pankha',
      'switch', 'wiring', 'wire', 'socket', 'plug', 'fuse', 'short circuit', 'current',
      'बिजली', 'लाइट', 'फैन', 'पंखा', 'स्विच', 'वायरिंग', 'fan repair',
      'fan chahiye', 'bijli wala', 'electrician chahiye', 'light nahi', 'bijli nahi',
    ],
  },
  {
    key: 'quick', label: 'Plumber', emoji: '🔧', desc: 'Leaks, pipes & taps',
    price: '₹149+', rating: '4.7', basePrice: 149,
    aliases: [
      'plumber', 'plumbing', 'pipe', 'leak', 'nal', 'pani', 'water',
      'drain', 'drainage', 'tap', 'faucet', 'nala', 'नल', 'पानी',
      'लीक', 'पाइप', 'plumber chahiye', 'nal thik', 'pani nahi',
      'water leak', 'pipe burst', 'nala block', 'nal se pani',
    ],
  },
  {
    key: 'cleaning', label: 'Home Cleaning', emoji: '🧹', desc: 'Full home clean',
    price: '₹299+', rating: '4.9', basePrice: 299,
    aliases: [
      'cleaning', 'clean', 'safai', 'saaf', 'jhadu', 'pocha', 'broom', 'mop',
      'home clean', 'ghar saaf', 'ghar ki safai', 'house clean', 'full clean',
      'सफाई', 'साफ', 'झाड़ू', 'पोछा', 'घर की सफाई', 'cleaning chahiye',
      'ghar saaf karna', 'safai chahiye',
    ],
  },
  {
    key: 'cleaning', label: 'Bathroom Clean', emoji: '🚿', desc: 'Deep scrub',
    price: '₹519+', rating: '4.8', basePrice: 519,
    aliases: [
      'bathroom', 'toilet', 'washroom', 'commode', 'latrine', 'bathroom clean',
      'bathroom safai', 'toilet clean', 'bathroom cleaning', 'bathroom karana',
      'बाथरूम', 'टॉयलेट', 'bathroom cleaning karani', 'bathroom saaf',
      'bathroom ki safai', 'toilet saaf',
    ],
  },
  {
    key: 'cleaning', label: 'Kitchen Clean', emoji: '🍳', desc: 'Chimney & tiles',
    price: '₹449+', rating: '4.7', basePrice: 449,
    aliases: [
      'kitchen', 'rasoi', 'chimney', 'kitchen clean', 'kitchen safai',
      'kitchen cleaning', 'रसोई', 'किचन', 'chimney clean',
      'kitchen tiles', 'chimney service', 'rasoi saaf',
    ],
  },
  {
    key: 'cleaning', label: 'Sofa Clean', emoji: '🛋️', desc: 'Dry & wet clean',
    price: '₹399+', rating: '4.6', basePrice: 399,
    aliases: ['sofa', 'couch', 'sofa clean', 'sofa safai', 'upholstery', 'सोफा', 'sofa wash'],
  },
  {
    key: 'quick', label: 'AC Repair', emoji: '❄️', desc: 'AC service & repair',
    price: '₹349+', rating: '4.8', basePrice: 349,
    aliases: [
      'ac', 'air conditioner', 'ac repair', 'ac service', 'cooling', 'thanda',
      'thanda nahi', 'ac nahi chalta', 'ac band', 'ac kharab', 'gas charge', 'ac gas',
      'एसी', 'ठंडा', 'कूलिंग', 'ac cooling nahi kar raha', 'ac cooling',
      'ac chalta nahi', 'air condition', 'ac thik karo', 'ac chahiye',
    ],
  },
  {
    key: 'appliance', label: 'AC Service', emoji: '❄️', desc: 'Clean & annual service',
    price: '₹349+', rating: '4.8', basePrice: 349,
    aliases: ['ac service', 'ac clean', 'ac filter', 'ac servicing', 'ac annual service'],
  },
  {
    key: 'quick', label: 'Carpenter', emoji: '🪚', desc: 'Furniture & doors',
    price: '₹249+', rating: '4.6', basePrice: 249,
    aliases: [
      'carpenter', 'carpentry', 'wood', 'furniture', 'door', 'darwaza', 'almirah',
      'wardrobe', 'table', 'chair', 'bed', 'shelf', 'दरवाजा', 'अलमारी', 'फर्नीचर',
      'carpenter chahiye', 'wood repair', 'lakkad',
    ],
  },
  {
    key: 'quick', label: 'Painting', emoji: '🖌️', desc: 'Interior & exterior',
    price: '₹499+', rating: '4.7', basePrice: 499,
    aliases: [
      'painting', 'paint', 'colour', 'color', 'wall paint', 'rang', 'putty',
      'primer', 'रंग', 'पेंट', 'पेंटिंग', 'rang karna', 'wall colour', 'painter',
    ],
  },
  {
    key: 'quick', label: 'Pest Control', emoji: '🐛', desc: 'All pest types',
    price: '₹599+', rating: '4.8', basePrice: 599,
    aliases: [
      'pest', 'pest control', 'cockroach', 'termite', 'ant', 'rat', 'mosquito',
      'kida', 'kide', 'makkhi', 'chooha', 'chipkali', 'lizard',
      'चूहा', 'कीड़े', 'मक्खी', 'spray', 'fumigation',
    ],
  },
  {
    key: 'quick', label: 'TV Mounting', emoji: '📺', desc: 'Wall mount setup',
    price: '₹199+', rating: '4.8', basePrice: 199,
    aliases: ['tv mount', 'wall mount', 'tv mounting', 'tv install', 'tv wall', 'tv fix'],
  },
  {
    key: 'quick', label: 'Gas Stove', emoji: '🔥', desc: 'Repair & clean',
    price: '₹149+', rating: '4.5', basePrice: 149,
    aliases: [
      'gas stove', 'gas', 'stove', 'chulha', 'burner', 'चूल्हा',
      'gas kharab', 'gas nahi jalta', 'gas repair',
    ],
  },
  {
    key: 'appliance', label: 'Washing Machine', emoji: '🫧', desc: 'Repair & service',
    price: '₹299+', rating: '4.7', basePrice: 299,
    aliases: [
      'washing machine', 'washer', 'kapde dhona', 'laundry machine',
      'वाशिंग मशीन', 'machine repair', 'washing machine repair', 'washing machine kharab',
      'machine kharab', 'kapde machine',
    ],
  },
  {
    key: 'appliance', label: 'Water Purifier', emoji: '💧', desc: 'Install & repair',
    price: '₹249+', rating: '4.7', basePrice: 249,
    aliases: [
      'water purifier', 'purifier', 'ro', 'ro service', 'ro repair', 'water filter',
      'पानी फिल्टर', 'pani filter', 'ro machine',
    ],
  },
  {
    key: 'appliance', label: 'Fridge Repair', emoji: '🧊', desc: 'All fridge types',
    price: '₹449+', rating: '4.6', basePrice: 449,
    aliases: [
      'fridge', 'refrigerator', 'freezer', 'fridge repair', 'fridge kharab',
      'फ्रिज', 'fridge service', 'fridge thanda nahi', 'fridge cooling nahi',
    ],
  },
  {
    key: 'appliance', label: 'TV Repair', emoji: '📺', desc: 'Screen & parts',
    price: '₹499+', rating: '4.6', basePrice: 499,
    aliases: [
      'tv', 'television', 'tv repair', 'tv kharab', 'टीवी', 'tv band',
      'screen', 'display', 'smart tv', 'tv nahi chalta',
    ],
  },
  {
    key: 'appliance', label: 'Microwave', emoji: '📡', desc: 'Repair & clean',
    price: '₹249+', rating: '4.5', basePrice: 249,
    aliases: ['microwave', 'oven', 'microwave repair', 'microwave kharab', 'oven repair'],
  },
  {
    key: 'cleaning', label: 'Laundry', emoji: '👕', desc: 'Wash & fold',
    price: '₹99+', rating: '4.5', basePrice: 99,
    aliases: [
      'laundry', 'kapde', 'clothes wash', 'kapde dhulai', 'कपड़े',
      'wash and fold', 'kapde saaf', 'dry cleaning',
    ],
  },
  {
    key: 'cleaning', label: 'Dishwashing', emoji: '🍽️', desc: 'Vessel cleaning',
    price: '₹149+', rating: '4.5', basePrice: 149,
    aliases: [
      'dish', 'dishwashing', 'bartan', 'bartan saaf', 'vessel', 'utensil',
      'बर्तन', 'bartan dhona', 'bartan wali',
    ],
  },
  {
    key: 'cleaning', label: 'Car Wash', emoji: '🚗', desc: 'Full detailing',
    price: '₹299+', rating: '4.6', basePrice: 299,
    aliases: ['car wash', 'car clean', 'gaadi saaf', 'car detailing', 'गाड़ी साफ', 'car wala'],
  },
  {
    key: 'salon', label: 'Waxing', emoji: '✨', desc: 'Full body wax',
    price: '₹299+', rating: '4.7', basePrice: 299,
    aliases: ['waxing', 'wax', 'body wax', 'hair removal', 'waxing chahiye'],
  },
  {
    key: 'salon', label: 'Facial', emoji: '💆', desc: 'Glowing skin',
    price: '₹399+', rating: '4.8', basePrice: 399,
    aliases: ['facial', 'face', 'face clean', 'skin care', 'चेहरा', 'glow', 'face pack'],
  },
  {
    key: 'salon', label: 'Manicure', emoji: '💅', desc: 'Hand & nail care',
    price: '₹249+', rating: '4.6', basePrice: 249,
    aliases: ['manicure', 'nail', 'hand care', 'nails', 'nail care'],
  },
  {
    key: 'salon', label: 'Pedicure', emoji: '🦶', desc: 'Foot care',
    price: '₹299+', rating: '4.7', basePrice: 299,
    aliases: ['pedicure', 'foot', 'feet', 'paaon', 'पैर', 'foot care'],
  },
  {
    key: 'salon', label: 'Haircut', emoji: '✂️', desc: 'Trim & style',
    price: '₹199+', rating: '4.7', basePrice: 199,
    aliases: ['haircut', 'hair cut', 'baal', 'trim', 'बाल', 'hair trim', 'haircut chahiye'],
  },
  {
    key: 'salon', label: 'Makeup', emoji: '💄', desc: 'Party & bridal',
    price: '₹999+', rating: '4.9', basePrice: 999,
    aliases: ['makeup', 'make up', 'bridal', 'party makeup', 'मेकअप', 'shaadi makeup'],
  },
  {
    key: 'other', label: 'Yoga / Fitness', emoji: '🧘', desc: 'At-home trainer',
    price: '₹499+', rating: '4.8', basePrice: 499,
    aliases: ['yoga', 'fitness', 'exercise', 'trainer', 'gym', 'workout', 'योग'],
  },
  {
    key: 'other', label: 'Tutoring', emoji: '📚', desc: 'Home tutor',
    price: '₹299+', rating: '4.9', basePrice: 299,
    aliases: ['tutor', 'tutoring', 'teacher', 'coaching', 'studies', 'padhai', 'पढ़ाई'],
  },
];

// Mutable active catalog — starts as hardcoded, replaced by initSearchCatalog()
let activeCatalog: CatalogEntry[] = CATALOG;

/**
 * Call once after GET /services loads. Merges API IDs into hardcoded catalog
 * entries (preserving rich aliases) and appends any API services not covered.
 */
export function initSearchCatalog(services: ApiService[]): void {
  // Augment hardcoded entries with matched API id
  const merged: CatalogEntry[] = CATALOG.map(entry => {
    const match = services.find(
      s =>
        s.name_en.toLowerCase() === entry.label.toLowerCase() ||
        s.name.toLowerCase() === entry.label.toLowerCase(),
    );
    return match ? {...entry, id: match.id} : entry;
  });

  // Append API services not covered by any hardcoded entry
  const coveredIds = new Set(merged.filter(e => e.id).map(e => e.id));
  const extra: CatalogEntry[] = services
    .filter(s => !coveredIds.has(s.id))
    .map(s => ({
      id: s.id,
      key: s.category,
      label: s.name_en,
      emoji: s.emoji,
      desc: s.tags?.join(', ') ?? s.category,
      price: `₹${Math.round(s.base_price / 100)}+`,
      rating: s.rating?.toFixed(1) ?? '4.5',
      basePrice: Math.round(s.base_price / 100),
      aliases: [
        s.name.toLowerCase(),
        s.name_en.toLowerCase(),
        s.category,
        ...(s.tags ?? []),
      ],
    }));

  activeCatalog = [...merged, ...extra];
}

export const POPULAR_SEARCHES = [
  'AC repair',
  'plumber chahiye',
  'bathroom cleaning',
  'electrician',
  'fan repair',
  'pest control',
  'washing machine',
  'home cleaning',
];

export function search(query: string): ServiceResult[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const scored = activeCatalog.map(svc => {
    let score = 0;
    const lbl = svc.label.toLowerCase();

    // Exact / prefix / partial label match
    if (lbl === q) score += 100;
    else if (lbl.startsWith(q)) score += 70;
    else if (lbl.includes(q)) score += 50;

    // Alias exact / prefix / partial match
    for (const alias of svc.aliases) {
      const a = alias.toLowerCase();
      if (a === q) { score += 90; break; }
      if (a.startsWith(q) || q.startsWith(a)) { score += 55; break; }
      if (a.includes(q) || q.includes(a)) { score += 35; break; }
    }

    // Word-level matching for multi-word natural language queries
    const words = q.split(/[\s,।]+/).filter(w => w.length >= 2);
    for (const word of words) {
      if (lbl.includes(word)) score += 20;
      for (const alias of svc.aliases) {
        if (alias.toLowerCase().includes(word)) { score += 12; break; }
      }
    }

    return {...svc, matchScore: score};
  });

  return scored
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);
}

export async function getRecentSearches(): Promise<string[]> {
  try {
    const json = await AsyncStorage.getItem(RECENT_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(query: string): Promise<void> {
  const q = query.trim();
  if (!q) return;
  try {
    const existing = await getRecentSearches();
    const updated = [q, ...existing.filter(r => r !== q)].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}
