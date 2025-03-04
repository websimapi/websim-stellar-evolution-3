class NaturalLanguageProcessor {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.lastContext = null;
  }
  
  // Process a user command
  processCommand(command) {
    // Skip empty commands
    if (!command || command.trim() === '') {
      return {
        success: false,
        message: "Please enter a command to guide your civilization.",
        type: 'system'
      };
    }
    
    // Save this command for context
    this.lastContext = command.toLowerCase();
    
    // Check for status/report commands
    if (this.isStatusCommand(command)) {
      return this.gameLogic.getStatusSummary();
    }
    
    // Check for exploration commands
    if (this.isExplorationCommand(command)) {
      const location = this.extractExplorationTarget(command);
      return this.gameLogic.exploreLocation(location);
    }
    
    // Check for research commands
    if (this.isResearchCommand(command)) {
      const technology = this.extractResearchTopic(command);
      return this.gameLogic.researchTechnology(technology);
    }
    
    // Check for resource management commands
    if (this.isResourceCommand(command)) {
      return this.gameLogic.manageResources(command);
    }
    
    // If we get here, we couldn't categorize the command
    return {
      success: false,
      message: "I'm not sure how to interpret that command. Try actions like 'explore', 'research', 'build', or 'status'.",
      type: 'system'
    };
  }
  
  // Check if this is a status command
  isStatusCommand(command) {
    const statusKeywords = ['status', 'report', 'summary', 'overview', 'situation'];
    return statusKeywords.some(keyword => command.toLowerCase().includes(keyword));
  }
  
  // Check if this is an exploration command
  isExplorationCommand(command) {
    const cmd = command.toLowerCase();
    const exploreKeywords = ['explore', 'survey', 'scan', 'investigate', 'discover', 'visit'];
    return exploreKeywords.some(keyword => cmd.includes(keyword));
  }
  
  // Extract the exploration target from a command
  extractExplorationTarget(command) {
    const cmd = command.toLowerCase();
    
    // Try to extract location based on keywords
    const locationKeywords = [
      'asteroid belt', 'asteroids', 'belt', 
      'gas giant', 'jovian', 
      'rocky planet', 'proxima',
      'alpha centauri', 'centauri', 
      'barnards star', 'barnard'
    ];
    
    for (const location of locationKeywords) {
      if (cmd.includes(location)) {
        return location;
      }
    }
    
    // If no specific location found, extract the part after "explore"
    const afterExplore = cmd.split(/explore|survey|scan|investigate|discover|visit/)[1];
    return afterExplore ? afterExplore.trim() : 'unknown location';
  }
  
  // Check if this is a research command
  isResearchCommand(command) {
    const cmd = command.toLowerCase();
    const researchKeywords = ['research', 'study', 'develop', 'advance', 'technology', 'tech', 'science'];
    return researchKeywords.some(keyword => cmd.includes(keyword));
  }
  
  // Extract the research topic from a command
  extractResearchTopic(command) {
    const cmd = command.toLowerCase();
    
    // Known technologies
    const techKeywords = [
      'space flight', 'spaceflight', 'space travel',
      'advanced materials', 'advanced material', 'composites',
      'fusion power', 'fusion energy', 'fusion',
      'interstellar travel', 'interstellar flight', 'ftl', 'warp'
    ];
    
    for (const tech of techKeywords) {
      if (cmd.includes(tech)) {
        return tech;
      }
    }
    
    // If no specific tech found, extract the part after research-related keywords
    const afterResearch = cmd.split(/research|study|develop|advance/)[1];
    return afterResearch ? afterResearch.trim() : 'unknown technology';
  }
  
  // Check if this is a resource management command
  isResourceCommand(command) {
    const cmd = command.toLowerCase();
    const resourceKeywords = [
      'build', 'construct', 'create', 'establish',
      'allocate', 'focus', 'direct', 'assign',
      'energy', 'mineral', 'knowledge', 'population',
      'mine', 'solar', 'research', 'lab', 'habitat', 'housing'
    ];
    
    // Need at least two resource-related keywords to be a resource command
    let keywordCount = 0;
    for (const keyword of resourceKeywords) {
      if (cmd.includes(keyword)) {
        keywordCount++;
        if (keywordCount >= 2) {
          return true;
        }
      }
    }
    
    return false;
  }
}

