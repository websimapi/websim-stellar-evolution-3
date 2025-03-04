class UserInterface {
  constructor() {
    this.outputElement = document.getElementById('text-output');
    this.inputElement = document.getElementById('command-input');
    this.sendButton = document.getElementById('send-command');
    this.statusElements = {
      energy: document.getElementById('energy-status').querySelector('.value'),
      minerals: document.getElementById('minerals-status').querySelector('.value'),
      knowledge: document.getElementById('knowledge-status').querySelector('.value'),
      population: document.getElementById('population-status').querySelector('.value'),
      year: document.getElementById('current-year')
    };
    
    this.saveButton = document.getElementById('save-game');
    this.loadButton = document.getElementById('load-game');
    this.newButton = document.getElementById('new-game');
    
    this.typingIndicator = null;
    this.messageQueue = [];
    this.processingQueue = false;
    
    this.initializeEventListeners();
  }
  
  // Set up event listeners
  initializeEventListeners() {
    // Send command on button click
    this.sendButton.addEventListener('click', () => {
      const command = this.inputElement.value.trim();
      if (command) {
        this.handleUserCommand(command);
      }
    });
    
    // Send command on Enter key
    this.inputElement.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const command = this.inputElement.value.trim();
        if (command) {
          this.handleUserCommand(command);
        }
      }
    });
    
    // Save, Load, and New Game buttons
    this.saveButton.addEventListener('click', () => {
      this.onSaveGame();
    });
    
    this.loadButton.addEventListener('click', () => {
      this.onLoadGame();
    });
    
    this.newButton.addEventListener('click', () => {
      this.onNewGame();
    });
  }
  
  // Handle user command input
  handleUserCommand(command) {
    // Show the user's command
    this.addMessage(command, 'user-message');
    
    // Clear the input field
    this.inputElement.value = '';
    
    // Call the command handler callback
    if (this.onCommand) {
      this.showTypingIndicator();
      
      // Simulate a slight delay for processing
      setTimeout(() => {
        const response = this.onCommand(command);
        this.hideTypingIndicator();
        this.handleCommandResponse(response);
      }, 500);
    }
  }
  
  // Handle the response from the command processor
  handleCommandResponse(response) {
    if (!response) return;
    
    // Add the message to the queue
    this.messageQueue.push(response);
    
    // Process the queue if not already processing
    if (!this.processingQueue) {
      this.processMessageQueue();
    }
  }
  
  // Process messages in the queue with a slight delay between them
  async processMessageQueue() {
    this.processingQueue = true;
    
    while (this.messageQueue.length > 0) {
      const response = this.messageQueue.shift();
      
      // Add the message to the output
      this.addMessage(response.message, `system-message ${response.type}-message`);
      
      // Wait a short time before showing the next message
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.processingQueue = false;
  }
  
  // Add a message to the output container
  addMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    
    // Convert newlines to <br> for proper formatting
    messageElement.innerHTML = text.replace(/\n/g, '<br>');
    
    this.outputElement.appendChild(messageElement);
    
    // Scroll to the bottom
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }
  
  // Show a typing indicator
  showTypingIndicator() {
    // Remove existing indicator if any
    this.hideTypingIndicator();
    
    // Create new indicator
    this.typingIndicator = document.createElement('div');
    this.typingIndicator.className = 'typing-indicator';
    this.typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    this.outputElement.appendChild(this.typingIndicator);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }
  
  // Hide the typing indicator
  hideTypingIndicator() {
    if (this.typingIndicator && this.typingIndicator.parentNode) {
      this.typingIndicator.parentNode.removeChild(this.typingIndicator);
      this.typingIndicator = null;
    }
  }
  
  // Update the status bar
  updateStatus(gameState) {
    this.statusElements.energy.textContent = Math.floor(gameState.resources.energy);
    this.statusElements.minerals.textContent = Math.floor(gameState.resources.minerals);
    this.statusElements.knowledge.textContent = Math.floor(gameState.resources.knowledge);
    this.statusElements.population.textContent = Math.floor(gameState.resources.population);
    this.statusElements.year.textContent = `Year: ${gameState.currentYear.toFixed(0)}`;
  }
  
  // Display welcome message
  displayWelcome(isNewGame) {
    if (isNewGame) {
      const welcomeMessage = `
      STELLAR EVOLUTION
      Year: 2150
      
      Welcome to Stellar Evolution! You are the leader of a civilization on Terra Prime, taking its first steps toward the stars.
      
      Your society has developed basic technologies that allow you to harness solar power, farm efficiently, and extract minerals from your planet's crust. Now, the greater cosmos beckons.
      
      Your scientists are eager to explore space and develop new technologies. Your engineers stand ready to build the infrastructure needed for expansion.
      
      What direction will you guide your civilization?
      
      Try commands like:
      - "explore asteroid belt"
      - "research space flight technology"
      - "build solar energy infrastructure"
      - "status report"
      `;
      
      this.addMessage(welcomeMessage, 'system-message');
    } else {
      const continueMessage = `
      STELLAR EVOLUTION
      
      Game loaded successfully. Your civilization awaits your guidance.
      
      Enter a command to continue your journey.
      `;
      
      this.addMessage(continueMessage, 'system-message');
    }
  }
}

