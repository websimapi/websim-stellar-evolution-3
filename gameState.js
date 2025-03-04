// Game State Management
class GameState {
  constructor() {
    this.resources = {
      energy: 100,
      minerals: 50,
      knowledge: 0,
      population: 1000
    };
    
    this.resourceRates = {
      energy: 1,
      minerals: 0.5,
      knowledge: 0.2,
      population: 0.1
    };
    
    this.worlds = [
      {
        id: 'home',
        name: 'Terra Prime',
        type: 'Earth-like',
        colonized: true,
        explored: true,
        resources: {
          energy: { amount: 100, rate: 1 },
          minerals: { amount: 50, rate: 0.5 },
          knowledge: { amount: 0, rate: 0.2 }
        },
        population: 1000,
        buildings: ['settlement', 'research_outpost'],
        description: 'Your species\' homeworld - a vibrant blue planet with vast oceans and green continents.'
      }
    ];
    
    this.starSystems = [
      {
        id: 'sol',
        name: 'Sol System',
        explored: true,
        stars: [{ type: 'G-type main-sequence', name: 'Sol' }],
        worlds: ['home'],
        celestialObjects: [
          { type: 'asteroid_belt', name: 'Main Belt', explored: false },
          { type: 'gas_giant', name: 'Jovian', explored: false },
          { type: 'rocky_planet', name: 'Proxima', explored: false }
        ]
      }
    ];
    
    this.nearbyStarSystems = [
      {
        id: 'alpha_centauri',
        name: 'Alpha Centauri',
        explored: false,
        distance: 4.3, // light years
        discoverable: true
      },
      {
        id: 'barnards_star',
        name: 'Barnard\'s Star',
        explored: false,
        distance: 5.9,
        discoverable: true
      }
    ];
    
    this.technologies = {
      basic_science: { level: 1, discovered: true, researchProgress: 100 },
      solar_power: { level: 1, discovered: true, researchProgress: 100 },
      agriculture: { level: 1, discovered: true, researchProgress: 100 },
      mining: { level: 1, discovered: true, researchProgress: 100 },
      space_flight: { level: 0, discovered: true, researchProgress: 0, researchCost: 50 },
      advanced_materials: { level: 0, discovered: true, researchProgress: 0, researchCost: 75 },
      fusion_power: { level: 0, discovered: false, researchProgress: 0, researchCost: 100 },
      interstellar_travel: { level: 0, discovered: false, researchProgress: 0, researchCost: 200 }
    };
    
    this.discoveredTechnologies = ['basic_science', 'solar_power', 'agriculture', 'mining', 'space_flight', 'advanced_materials'];
    
    this.events = [];
    
    this.currentYear = 2150;
    this.lastResourceUpdate = Date.now();
    this.status = 'active';
    this.gameVersion = '1.0.0';
  }
  
  // Update resources based on time elapsed
  updateResources() {
    const now = Date.now();
    const elapsedMs = now - this.lastResourceUpdate;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    
    // Only update if some time has passed
    if (elapsedHours > 0) {
      this.resources.energy += this.resourceRates.energy * elapsedHours;
      this.resources.minerals += this.resourceRates.minerals * elapsedHours;
      this.resources.knowledge += this.resourceRates.knowledge * elapsedHours;
      this.resources.population += this.resourceRates.population * elapsedHours;
      
      // Advance game time
      this.currentYear += elapsedHours / 100; // 1 hour real time = 0.01 game years
      
      this.lastResourceUpdate = now;
    }
  }
  
  // Save game state to localStorage
  saveToLocalStorage() {
    localStorage.setItem('stellarEvolution_gameState', JSON.stringify(this));
  }
  
  // Save game state to database using WebsimSocket collection
  async saveToDatabase(room) {
    try {
      // First check if a save already exists
      const saves = room.collection('game_save').getList();
      let saveId = null;
      
      if (saves && saves.length > 0) {
        // Update existing save
        saveId = saves[0].id;
        await room.collection('game_save').update(saveId, {
          gameData: JSON.stringify(this),
          timestamp: new Date().toISOString()
        });
      } else {
        // Create new save
        await room.collection('game_save').create({
          gameData: JSON.stringify(this),
          timestamp: new Date().toISOString()
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to save game to database:', error);
      return false;
    }
  }
  
  // Load game state from localStorage
  static loadFromLocalStorage() {
    const savedData = localStorage.getItem('stellarEvolution_gameState');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const gameState = new GameState();
        
        // Restore properties from saved data
        Object.assign(gameState, parsedData);
        
        // Make sure lastResourceUpdate is a number
        gameState.lastResourceUpdate = Number(gameState.lastResourceUpdate) || Date.now();
        
        return gameState;
      } catch (error) {
        console.error('Error loading game state:', error);
        return new GameState();
      }
    }
    return new GameState();
  }
  
  // Load game state from database using WebsimSocket collection
  static async loadFromDatabase(room) {
    try {
      const saves = room.collection('game_save').getList();
      
      if (saves && saves.length > 0) {
        const latestSave = saves[0]; // Assuming most recent first
        const parsedData = JSON.parse(latestSave.gameData);
        
        const gameState = new GameState();
        Object.assign(gameState, parsedData);
        
        // Make sure lastResourceUpdate is a number
        gameState.lastResourceUpdate = Number(gameState.lastResourceUpdate) || Date.now();
        
        return gameState;
      }
      
      return new GameState();
    } catch (error) {
      console.error('Failed to load game from database:', error);
      return new GameState();
    }
  }
}

