/**
 * Données de test pour les items de la boutique
 * À utiliser en développement pour tester le rendu
 */

import type { ShopItemDTO } from '@/application/use-cases/shop'

export const TEST_SHOP_ITEMS: ShopItemDTO[] = [
  // Chapeaux
  {
    id: 'test_hat_common_1',
    name: 'Casquette Basique',
    description: 'Une simple casquette pour protéger du soleil',
    category: 'hat',
    rarity: 'common',
    price: 50,
    isAvailable: true
  },
  {
    id: 'test_hat_rare_1',
    name: 'Chapeau de Magicien',
    description: 'Un chapeau pointu magique avec des étoiles scintillantes',
    category: 'hat',
    rarity: 'rare',
    price: 125,
    isAvailable: true
  },
  {
    id: 'test_hat_epic_1',
    name: 'Couronne Royale',
    description: 'Une couronne majestueuse digne d\'un roi',
    category: 'hat',
    rarity: 'epic',
    price: 250,
    isAvailable: true
  },
  {
    id: 'test_hat_legendary_1',
    name: 'Auréole Céleste',
    description: 'Une auréole divine qui brille d\'une lumière éternelle',
    category: 'hat',
    rarity: 'legendary',
    price: 500,
    isAvailable: true
  },

  // Lunettes
  {
    id: 'test_glasses_common_1',
    name: 'Lunettes de Soleil',
    description: 'Des lunettes de soleil classiques et stylées',
    category: 'glasses',
    rarity: 'common',
    price: 75,
    isAvailable: true
  },
  {
    id: 'test_glasses_rare_1',
    name: 'Monocle Élégant',
    description: 'Un monocle raffiné pour un look distingué',
    category: 'glasses',
    rarity: 'rare',
    price: 187,
    isAvailable: true
  },
  {
    id: 'test_glasses_epic_1',
    name: 'Lunettes Cyber',
    description: 'Des lunettes futuristes avec affichage holographique',
    category: 'glasses',
    rarity: 'epic',
    price: 375,
    isAvailable: true
  },
  {
    id: 'test_glasses_legendary_1',
    name: 'Vision Laser',
    description: 'Des lunettes légendaires avec vision laser intégrée',
    category: 'glasses',
    rarity: 'legendary',
    price: 750,
    isAvailable: true
  },

  // Chaussures
  {
    id: 'test_shoes_common_1',
    name: 'Baskets Confortables',
    description: 'Des baskets parfaites pour courir toute la journée',
    category: 'shoes',
    rarity: 'common',
    price: 100,
    isAvailable: true
  },
  {
    id: 'test_shoes_rare_1',
    name: 'Bottes de Cowboy',
    description: 'Des bottes western authentiques et stylées',
    category: 'shoes',
    rarity: 'rare',
    price: 250,
    isAvailable: true
  },
  {
    id: 'test_shoes_epic_1',
    name: 'Chaussures Fusée',
    description: 'Des chaussures équipées de propulseurs surpuissants',
    category: 'shoes',
    rarity: 'epic',
    price: 500,
    isAvailable: true
  },
  {
    id: 'test_shoes_legendary_1',
    name: 'Bottes Ailées',
    description: 'Les bottes légendaires d\'Hermès, messager des dieux',
    category: 'shoes',
    rarity: 'legendary',
    price: 1000,
    isAvailable: true
  },

  // Fonds d'écran
  {
    id: 'test_background_rare_day',
    name: 'Chambre - Jour',
    description: 'Une chambre confortable avec une belle fenêtre ensoleillée',
    category: 'background',
    backgroundType: 'day',
    rarity: 'rare',
    price: 375,
    isAvailable: true
  },
  {
    id: 'test_background_epic_garden',
    name: 'Jardin - Jour',
    description: 'Un jardin verdoyant avec des arbres et des fleurs',
    category: 'background',
    backgroundType: 'garden',
    rarity: 'epic',
    price: 750,
    isAvailable: true
  },
  {
    id: 'test_background_legendary_night',
    name: 'Toit - Nuit',
    description: 'Un toit urbain sous un ciel étoilé',
    category: 'background',
    backgroundType: 'night',
    rarity: 'legendary',
    price: 1500,
    isAvailable: true
  }
]
