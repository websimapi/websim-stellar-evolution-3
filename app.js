// Initialize WebSocket for multiplayer
const room = new WebsimSocket();

// Main Application Class
class StellarEvolutionGame {
  constructor() {
    // Initialize game components
    this.gameState = null;
    this.gameLogic = null;
    this.nlp = null;
    this.ui = new UserInterface();
    
    // Bind UI callbacks
    this.ui.onCommand = this.handleCommand.bind(this);
    this.ui.onSaveGame = this.saveGame.bind(this);
    this.ui.onLoadGame = this.loadGame.bind(this);
    this.ui.onNewGame = this.newGame.bind(this);
    
    // Setup periodic updates
    this.setupAutoSave();
    this.setupStatusUpdates();
    
    // Initialize the game
    this.initializeGame();
  }
  
  // Initialize or load game
  async initializeGame() {
    try {
      // Try to load from localStorage first
      const savedData = localStorage.getItem('stellarEvolution_gameState');
      
      if (savedData) {
        // Local save exists, load it
        this.gameState = GameState.loadFromLocalStorage();
        this.createGameComponents(false);
      } else {
        // Try to load from database
        const dbSaves = room.collection('game_save').getList();
        
        if (dbSaves && dbSaves.length > 0) {
          // Database save exists, load it
          this.gameState = await GameState.loadFromDatabase(room);
          this.createGameComponents(false);
        } else {
          // No save exists, create new game
          this.newGame();
        }
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      // Fallback to new game if loading fails
      this.newGame();
    }
  }
  
  // Create game components based on game state
  createGameComponents(isNewGame) {
    this.gameLogic = new GameLogic(this.gameState);
    this.nlp = new NaturalLanguageProcessor(this.gameLogic);
    
    // Update UI
    this.updateUI();
    
    // Display welcome message
    this.ui.displayWelcome(isNewGame);
  }
  
  // Handle user commands
  handleCommand(command) {
    // Process the command through NLP
    const response = this.nlp.processCommand(command);
    
    // Update UI after command processing
    this.updateUI();
    
    // Save game state after significant commands
    this.saveToLocalStorage();
    
    return response;
  }
  
  // Update UI elements with current game state
  updateUI() {
    if (this.gameState && this.ui) {
      this.gameState.updateResources();
      this.ui.updateStatus(this.gameState);
    }
  }
  
  // Save game to localStorage
  saveToLocalStorage() {
    if (this.gameState) {
      this.gameState.saveToLocalStorage();
    }
  }
  
  // Save game to database
  async saveGame() {
    if (this.gameState) {
      this.gameState.updateResources();
      
      try {
        // Save to localStorage as backup
        this.saveToLocalStorage();
        
        // Save to database
        const success = await this.gameState.saveToDatabase(room);
        
        if (success) {
          this.ui.addMessage("Game saved successfully to the database.", "system-message");
        } else {
          this.ui.addMessage("Failed to save game to the database, but it was saved locally.", "warning-message");
        }
      } catch (error) {
        console.error('Error saving game:', error);
        this.ui.addMessage("Error saving game. Your progress was saved locally as a backup.", "danger-message");
      }
    }
  }
  
  // Load game from localStorage or database
  async loadGame() {
    try {
      // Try to load from localStorage first
      const savedData = localStorage.getItem('stellarEvolution_gameState');
      
      if (savedData) {
        this.gameState = GameState.loadFromLocalStorage();
        this.createGameComponents(false);
        this.ui.addMessage("Game loaded from local storage.", "system-message");
      } else {
        // Try to load from database
        const dbSaves = room.collection('game_save').getList();
        
        if (dbSaves && dbSaves.length > 0) {
          this.gameState = await GameState.loadFromDatabase(room);
          this.createGameComponents(false);
          this.ui.addMessage("Game loaded from database.", "system-message");
        } else {
          this.ui.addMessage("No saved game found. Starting a new game.", "warning-message");
          this.newGame();
        }
      }
    } catch (error) {
      console.error('Error loading game:', error);
      this.ui.addMessage("Error loading game. Starting a new game.", "danger-message");
      this.newGame();
    }
  }
  
  // Start a new game
  newGame() {
    // Create a new game state
    this.gameState = new GameState();
    
    // Initialize game components
    this.createGameComponents(true);
    
    // Save initial state
    this.saveToLocalStorage();
  }
  
  // Setup auto-save
  setupAutoSave() {
    // Auto-save every 5 minutes
    setInterval(() => {
      if (this.gameState) {
        this.saveToLocalStorage();
      }
    }, 5 * 60 * 1000);
  }
  
  // Setup periodic UI updates
  setupStatusUpdates() {
    // Update UI every 10 seconds
    setInterval(() => {
      this.updateUI();
    }, 10 * 1000);
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the game
  const game = new StellarEvolutionGame();
  
  // Handle window beforeunload to save game state
  window.addEventListener('beforeunload', () => {
    if (game.gameState) {
      game.saveToLocalStorage();
    }
  });
});

