import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe } from '../types'

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Vegan Pasta',
    description: 'Rich and satisfying pasta with a silky cashew cream sauce, garlic, and nutritional yeast.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Italian', 'Pasta', 'Quick', 'Vegan'],
    ingredients: [
      { amount: '400', unit: 'g', name: 'spaghetti or fettuccine' },
      { amount: '150', unit: 'g', name: 'raw cashews, soaked 2 hrs' },
      { amount: '3', unit: 'cloves', name: 'garlic' },
      { amount: '3', unit: 'tbsp', name: 'nutritional yeast' },
      { amount: '1', unit: 'tbsp', name: 'lemon juice' },
      { amount: '1', unit: 'cup', name: 'pasta water' },
      { amount: '', unit: '', name: 'salt and black pepper' },
      { amount: '2', unit: 'tbsp', name: 'olive oil' },
      { amount: '1', unit: 'handful', name: 'fresh parsley, chopped' },
    ],
    steps: [
      'Bring a large pot of salted water to boil and cook pasta until al dente.',
      'Blend soaked cashews, garlic, nutritional yeast, lemon juice, and a pinch of salt with 1/2 cup water until completely smooth.',
      'Reserve 1 cup pasta water, then drain pasta.',
      'Heat olive oil in the pasta pot over low heat, add cashew cream and thin with pasta water to desired consistency.',
      'Toss in pasta and stir to coat, adding more pasta water as needed.',
      'Season generously with salt and pepper. Serve topped with parsley.',
    ],
    createdAt: '2024-01-15',
    isCustom: false,
  },
  {
    id: '2',
    title: 'Chickpea Tikka Masala',
    description: 'Hearty chickpeas simmered in a fragrant, spiced tomato and coconut cream sauce.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600',
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Indian', 'Curry', 'Vegan'],
    ingredients: [
      { amount: '2', unit: 'cans', name: 'chickpeas (400g each), drained' },
      { amount: '1', unit: 'can', name: 'full-fat coconut cream (400ml)' },
      { amount: '1', unit: 'can', name: 'crushed tomatoes (400g)' },
      { amount: '1', unit: 'large', name: 'onion, diced' },
      { amount: '4', unit: 'cloves', name: 'garlic, minced' },
      { amount: '1', unit: 'tbsp', name: 'fresh ginger, grated' },
      { amount: '2', unit: 'tbsp', name: 'tikka masala spice blend' },
      { amount: '2', unit: 'tbsp', name: 'coconut oil' },
      { amount: '', unit: '', name: 'salt to taste' },
      { amount: '1', unit: 'handful', name: 'fresh coriander to serve' },
    ],
    steps: [
      'Heat coconut oil in a large pan, sauté onion until golden (8 min).',
      'Add garlic and ginger, cook 2 minutes.',
      'Add spice blend and toast for 1 minute until fragrant.',
      'Add crushed tomatoes, stir well, and simmer 10 minutes.',
      'Add chickpeas and coconut cream, simmer 15 minutes until sauce thickens.',
      'Season with salt and serve over basmati rice, topped with coriander.',
    ],
    createdAt: '2024-01-20',
    isCustom: false,
  },
  {
    id: '3',
    title: 'Avocado Toast with Dukkah',
    description: 'Creamy smashed avocado on toasted sourdough, topped with crunchy dukkah and lemon.',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Quick', 'Vegan'],
    ingredients: [
      { amount: '2', unit: 'slices', name: 'sourdough bread' },
      { amount: '2', unit: '', name: 'ripe avocados' },
      { amount: '1', unit: '', name: 'lemon, juiced' },
      { amount: '2', unit: 'tbsp', name: 'dukkah (nut and spice blend)' },
      { amount: '1', unit: 'tbsp', name: 'extra virgin olive oil' },
      { amount: '', unit: '', name: 'flaky salt and black pepper' },
      { amount: '', unit: '', name: 'chilli flakes (optional)' },
    ],
    steps: [
      'Toast the sourdough bread to your desired crispness.',
      'Halve and pit the avocados. Scoop flesh into a bowl.',
      'Mash avocado with lemon juice, salt, and pepper until just chunky.',
      'Spread generously on toast.',
      'Drizzle with olive oil, sprinkle with dukkah, chilli flakes, and flaky salt.',
    ],
    createdAt: '2024-02-01',
    isCustom: false,
  },
  {
    id: '4',
    title: 'Black Bean Tacos',
    description: 'Smoky spiced black beans in crispy corn tortillas with all the fresh vegan fixings.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Mexican', 'Quick', 'Vegan'],
    ingredients: [
      { amount: '2', unit: 'cans', name: 'black beans (400g each), drained' },
      { amount: '8', unit: '', name: 'small corn tortillas' },
      { amount: '1', unit: 'tbsp', name: 'taco seasoning' },
      { amount: '1', unit: '', name: 'avocado, sliced' },
      { amount: '1', unit: '', name: 'tomato, diced' },
      { amount: '1', unit: 'cup', name: 'shredded red cabbage' },
      { amount: '1', unit: '', name: 'lime, juiced' },
      { amount: '', unit: '', name: 'fresh coriander and salsa to serve' },
    ],
    steps: [
      'Heat a pan over medium heat, add black beans and taco seasoning with a splash of water.',
      'Cook 5 minutes until beans are heated through and sauce clings.',
      'Lightly mash about a third of the beans with a fork.',
      'Warm tortillas in a dry pan until slightly charred.',
      'Fill tortillas with black beans, avocado, tomato, and cabbage.',
      'Squeeze lime over each taco and top with coriander and salsa.',
    ],
    createdAt: '2024-02-10',
    isCustom: false,
  },
]

const SEED_VERSION = '2'

function loadRecipes(): Recipe[] {
  if (localStorage.getItem('recipesSeedVersion') !== SEED_VERSION) {
    localStorage.removeItem('recipes')
    localStorage.setItem('recipesSeedVersion', SEED_VERSION)
  }
  return JSON.parse(localStorage.getItem('recipes') ?? 'null') ?? SAMPLE_RECIPES
}

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>(loadRecipes())

  function save() {
    localStorage.setItem('recipes', JSON.stringify(recipes.value))
  }

  const allTags = computed<string[]>(() => {
    const tags = new Set<string>()
    recipes.value.forEach(r => r.tags.forEach(t => tags.add(t)))
    return [...tags].sort()
  })

  function getById(id: string): Recipe | undefined {
    return recipes.value.find(r => r.id === id)
  }

  function addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'isCustom'>): Recipe {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    }
    recipes.value.unshift(newRecipe)
    save()
    return newRecipe
  }

  function updateRecipe(id: string, updates: Partial<Recipe>): void {
    const idx = recipes.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      recipes.value[idx] = { ...recipes.value[idx], ...updates }
      save()
    }
  }

  function deleteRecipe(id: string): void {
    recipes.value = recipes.value.filter(r => r.id !== id)
    save()
  }

  function searchRecipes(query: string, tags: string[] = [], ingredientSearch = ''): Recipe[] {
    return recipes.value.filter(r => {
      const matchesQuery = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase())
      const matchesTags = tags.length === 0 || tags.some(t => r.tags.includes(t))
      const matchesIngredient = !ingredientSearch || r.ingredients.some(i => i.name.toLowerCase().includes(ingredientSearch.toLowerCase()))
      return matchesQuery && matchesTags && matchesIngredient
    })
  }

  return { recipes, allTags, getById, addRecipe, updateRecipe, deleteRecipe, searchRecipes }
})
