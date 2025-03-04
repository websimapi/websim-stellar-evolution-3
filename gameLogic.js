class GameLogic {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  // Process exploration commands
  exploreLocation(location) {
    // Update resources before processing command
    this.gameState.updateResources();
    
    // Lowercase location for easier matching
    const locationLower = location.toLowerCase();
    
    // Check if exploring within home system
    if (locationLower.includes('asteroid') || locationLower.includes('belt')) {
      const solSystem = this.gameState.starSystems.find(s => s.id === 'sol');
      const asteroidBelt = solSystem.celestialObjects.find(o => o.type === 'asteroid_belt');
      
      if (asteroidBelt && !asteroidBelt.explored) {
        // Check if technology level is sufficient
        if (this.gameState.technologies.space_flight.level >= 1) {
          asteroidBelt.explored = true;
          
          // Add resources discovered
          this.gameState.resources.minerals += 25;
          this.gameState.resourceRates.minerals += 0.2;
          
          // Add an event
          this.gameState.events.push({
            year: this.gameState.currentYear.toFixed(1),
            type: 'exploration',
            description: `Explored the ${asteroidBelt.name}, discovering valuable mineral deposits.`
          });
          
          return {
            success: true,
            message: `Your exploration vessels have surveyed the ${asteroidBelt.name}. They discovered rich deposits of rare minerals, boosting your mineral reserves and mining capabilities.`,
            type: 'exploration'
          };
        } else {
          return {
            success: false,
            message: "Your scientists explain that you need to develop Space Flight technology before you can explore the asteroid belt.",
            type: 'warning'
          };
        }
      }
    }
    
    // Check if exploring a planet in home system
    else if (locationLower.includes('jovian') || locationLower.includes('gas giant')) {
      const solSystem = this.gameState.starSystems.find(s => s.id === 'sol');
      const gasGiant = solSystem.celestialObjects.find(o => o.type === 'gas_giant');
      
      if (gasGiant && !gasGiant.explored) {
        if (this.gameState.technologies.space_flight.level >= 1) {
          gasGiant.explored = true;
          
          // Add knowledge discovered
          this.gameState.resources.knowledge += 15;
          this.gameState.resourceRates.knowledge += 0.1;
          
          // Add an event
          this.gameState.events.push({
            year: this.gameState.currentYear.toFixed(1),
            type: 'exploration',
            description: `Explored ${gasGiant.name}, cataloging its extensive atmospheric patterns and moon system.`
          });
          
          return {
            success: true,
            message: `Your probes have successfully studied ${gasGiant.name}. The scientific data transmitted back has expanded your understanding of gas giants, boosting your knowledge.`,
            type: 'exploration'
          };
        } else {
          return {
            success: false,
            message: "Your scientists explain that you need to develop Space Flight technology before you can explore other planets.",
            type: 'warning'
          };
        }
      }
    }
    
    // Check if exploring a rocky planet in home system
    else if (locationLower.includes('proxima') || locationLower.includes('rocky planet')) {
      const solSystem = this.gameState.starSystems.find(s => s.id === 'sol');
      const rockyPlanet = solSystem.celestialObjects.find(o => o.type === 'rocky_planet');
      
      if (rockyPlanet && !rockyPlanet.explored) {
        if (this.gameState.technologies.space_flight.level >= 1) {
          rockyPlanet.explored = true;
          
          // Add resources and knowledge discovered
          this.gameState.resources.minerals += 10;
          this.gameState.resources.knowledge += 10;
          
          // Add an event
          this.gameState.events.push({
            year: this.gameState.currentYear.toFixed(1),
            type: 'exploration',
            description: `Explored ${rockyPlanet.name}, finding potential for future mining operations.`
          });
          
          return {
            success: true,
            message: `Your expedition to ${rockyPlanet.name} was successful. The scans reveal a barren world, but one rich in rare elements that could be mined in the future.`,
            type: 'exploration'
          };
        } else {
          return {
            success: false,
            message: "Your scientists explain that you need to develop Space Flight technology before you can explore other planets.",
            type: 'warning'
          };
        }
      }
    }
    
    // Check if exploring a nearby star system
    else if (locationLower.includes('alpha centauri') || locationLower.includes('centauri')) {
      const alphaCentauri = this.gameState.nearbyStarSystems.find(s => s.id === 'alpha_centauri');
      
      if (alphaCentauri && !alphaCentauri.explored) {
        if (this.gameState.technologies.interstellar_travel && this.gameState.technologies.interstellar_travel.level >= 1) {
          alphaCentauri.explored = true;
          
          // Discover the star system in detail
          const newSystem = {
            id: 'alpha_centauri',
            name: 'Alpha Centauri',
            explored: true,
            stars: [
              { type: 'G-type main-sequence', name: 'Alpha Centauri A' },
              { type: 'K-type main-sequence', name: 'Alpha Centauri B' }
            ],
            worlds: [],
            celestialObjects: [
              { type: 'rocky_planet', name: 'Centauri Prime', explored: false },
              { type: 'gas_giant', name: 'Centauri Major', explored: false }
            ]
          };
          
          // Remove from nearby and add to explored star systems
          this.gameState.nearbyStarSystems = this.gameState.nearbyStarSystems.filter(s => s.id !== 'alpha_centauri');
          this.gameState.starSystems.push(newSystem);
          
          // Add knowledge for the discovery
          this.gameState.resources.knowledge += 50;
          
          // Add an event
          this.gameState.events.push({
            year: this.gameState.currentYear.toFixed(1),
            type: 'exploration',
            description: `The first interstellar expedition has reached Alpha Centauri, revealing a binary star system with several planets.`
          });
          
          return {
            success: true,
            message: `After years of travel, your interstellar ship has arrived at Alpha Centauri! The binary star system is even more magnificent than your astronomers predicted. Initial scans reveal several planets, including a promising rocky world and a large gas giant. This historic achievement has dramatically expanded your scientific knowledge.`,
            type: 'exploration'
          };
        } else {
          return {
            success: false,
            message: "Your scientists explain that you need to develop Interstellar Travel technology before you can explore other star systems.",
            type: 'warning'
          };
        }
      }
    }
    
    // Check if exploring Barnard's Star
    else if (locationLower.includes('barnard') || locationLower.includes('barnards star')) {
      const barnardsstar = this.gameState.nearbyStarSystems.find(s => s.id === 'barnards_star');
      
      if (barnardsstar && !barnardsstar.explored) {
        if (this.gameState.technologies.interstellar_travel && this.gameState.technologies.interstellar_travel.level >= 1) {
          barnardsstar.explored = true;
          
          // Discover the star system in detail
          const newSystem = {
            id: 'barnards_star',
            name: 'Barnard\'s Star',
            explored: true,
            stars: [
              { type: 'M-type red dwarf', name: 'Barnard\'s Star' }
            ],
            worlds: [],
            celestialObjects: [
              { type: 'rocky_planet', name: 'Barnard I', explored: false },
              { type: 'rocky_planet', name: 'Barnard II', explored: false }
            ]
          };
          
          // Remove from nearby and add to explored star systems
          this.gameState.nearbyStarSystems = this.gameState.nearbyStarSystems.filter(s => s.id !== 'barnards_star');
          this.gameState.starSystems.push(newSystem);
          
          // Add knowledge for the discovery
          this.gameState.resources.knowledge += 40;
          
          // Add an event
          this.gameState.events.push({
            year: this.gameState.currentYear.toFixed(1),
            type: 'exploration',
            description: `Interstellar expedition has reached Barnard's Star, discovering a system with two rocky planets.`
          });
          
          return {
            success: true,
            message: `Your interstellar probe has successfully reached Barnard's Star! The ancient red dwarf is smaller than Sol, but hosts at least two rocky planets. Initial readings suggest one might be potentially habitable with the right technology. Your scientists are eager to study this system further.`,
            type: 'exploration'
          };
        } else {
          return {
            success: false,
            message: "Your scientists explain that you need to develop Interstellar Travel technology before you can explore other star systems.",
            type: 'warning'
          };
        }
      }
    }
    
    // Default response if location is not recognized or already explored
    return {
      success: false,
      message: `Your scientists are unsure where "${location}" is or have already explored it. Try being more specific or explore a different location.`,
      type: 'system'
    };
  }
  
  // Process research commands
  researchTechnology(technology) {
    // Update resources before processing command
    this.gameState.updateResources();
    
    // Lowercase and simplify technology name for matching
    const techLower = technology.toLowerCase()
      .replace(/technology|tech/g, '')
      .trim();
    
    // Match with available technologies
    let techKey = null;
    
    if (techLower.includes('space') && techLower.includes('flight')) {
      techKey = 'space_flight';
    } else if ((techLower.includes('advanced') && techLower.includes('material')) || techLower.includes('composite')) {
      techKey = 'advanced_materials';
    } else if ((techLower.includes('fusion') && techLower.includes('power')) || techLower === 'fusion') {
      techKey = 'fusion_power';
    } else if ((techLower.includes('interstellar') && techLower.includes('travel')) || techLower.includes('ftl') || techLower.includes('warp')) {
      techKey = 'interstellar_travel';
    }
    
    // Process the research
    if (techKey && this.gameState.technologies[techKey]) {
      const tech = this.gameState.technologies[techKey];
      
      // Check if already researched
      if (tech.level > 0) {
        return {
          success: false,
          message: `Your scientists report that ${technology} has already been researched to level ${tech.level}.`,
          type: 'system'
        };
      }
      
      // Check if discovered
      if (!tech.discovered) {
        // Check prerequisites
        if (techKey === 'fusion_power' && this.gameState.technologies.advanced_materials.level < 1) {
          return {
            success: false,
            message: `Your scientists explain that you need to develop Advanced Materials before researching Fusion Power.`,
            type: 'warning'
          };
        }
        
        if (techKey === 'interstellar_travel' && this.gameState.technologies.fusion_power.level < 1) {
          return {
            success: false,
            message: `Your scientists explain that you need to develop Fusion Power before researching Interstellar Travel.`,
            type: 'warning'
          };
        }
        
        // Discover the technology
        tech.discovered = true;
        this.gameState.discoveredTechnologies.push(techKey);
        
        return {
          success: true,
          message: `Your scientists have begun theoretical work on ${technology}. They now understand the basic principles and can begin applied research.`,
          type: 'resource'
        };
      }
      
      // Check if we have enough knowledge
      if (this.gameState.resources.knowledge < 10) {
        return {
          success: false,
          message: `Your scientists need more knowledge to make progress on ${technology}. Current knowledge: ${this.gameState.resources.knowledge.toFixed(1)}.`,
          type: 'warning'
        };
      }
      
      // Research the technology
      const knowledgeToApply = Math.min(30, this.gameState.resources.knowledge);
      this.gameState.resources.knowledge -= knowledgeToApply;
      
      tech.researchProgress += knowledgeToApply;
      
      // Check if research is complete
      if (tech.researchProgress >= tech.researchCost) {
        tech.level = 1;
        
        // Apply effects of the technology
        switch(techKey) {
          case 'space_flight':
            this.gameState.resourceRates.knowledge += 0.3;
            // Add an event
            this.gameState.events.push({
              year: this.gameState.currentYear.toFixed(1),
              type: 'research',
              description: `Developed Space Flight technology, enabling exploration beyond your homeworld.`
            });
            return {
              success: true,
              message: `Breakthrough! Your scientists have successfully developed Space Flight technology. Your civilization can now explore other planets in your home system and establish orbital facilities. Knowledge production has increased.`,
              type: 'resource'
            };
            
          case 'advanced_materials':
            this.gameState.resourceRates.minerals += 0.3;
            this.gameState.technologies.fusion_power.discovered = true;
            this.gameState.discoveredTechnologies.push('fusion_power');
            // Add an event
            this.gameState.events.push({
              year: this.gameState.currentYear.toFixed(1),
              type: 'research',
              description: `Developed Advanced Materials technology, enabling more efficient structures and revealing the path to Fusion Power.`
            });
            return {
              success: true,
              message: `Breakthrough! Your engineers have developed Advanced Materials technology. New composite materials and manufacturing techniques have improved your infrastructure efficiency. Your mineral production has increased, and your scientists now understand the materials needed for Fusion containment.`,
              type: 'resource'
            };
            
          case 'fusion_power':
            this.gameState.resourceRates.energy += 1.0;
            this.gameState.technologies.interstellar_travel.discovered = true;
            this.gameState.discoveredTechnologies.push('interstellar_travel');
            // Add an event
            this.gameState.events.push({
              year: this.gameState.currentYear.toFixed(1),
              type: 'research',
              description: `Developed Fusion Power technology, dramatically increasing energy production and enabling research into Interstellar Travel.`
            });
            return {
              success: true,
              message: `Breakthrough! Your scientists have harnessed the power of nuclear fusion! Clean, abundant energy is now available to your civilization. Energy production has significantly increased, and the high power output has your scientists theorizing about potential interstellar propulsion systems.`,
              type: 'resource'
            };
            
          case 'interstellar_travel':
            // Add an event
            this.gameState.events.push({
              year: this.gameState.currentYear.toFixed(1),
              type: 'research',
              description: `Developed Interstellar Travel technology, opening the path to the stars.`
            });
            return {
              success: true,
              message: `Momentous breakthrough! Your scientists and engineers have developed the first working Interstellar Drive! Your civilization can now build ships capable of traveling to nearby star systems. The stars themselves are now within your reach. This marks the beginning of a new era for your species.`,
              type: 'resource'
            };
        }
      }
      
      // Research is ongoing
      return {
        success: true,
        message: `Your scientists are making progress on ${technology}. Research is ${(tech.researchProgress / tech.researchCost * 100).toFixed(1)}% complete.`,
        type: 'resource'
      };
    }
    
    // If technology wasn't recognized
    return {
      success: false,
      message: `Your scientists are not familiar with "${technology}". Try researching one of the known technologies like Space Flight, Advanced Materials, Fusion Power, or Interstellar Travel.`,
      type: 'system'
    };
  }
  
  // Process resource management commands
  manageResources(command) {
    // Update resources before processing command
    this.gameState.updateResources();
    
    const commandLower = command.toLowerCase();
    
    // Check for specific resource allocation commands
    if (commandLower.includes('energy') && (commandLower.includes('allocate') || commandLower.includes('focus'))) {
      if (this.gameState.resources.energy < 50) {
        return {
          success: false,
          message: `You don't have enough energy reserves to reallocate. Current energy: ${this.gameState.resources.energy.toFixed(1)}.`,
          type: 'warning'
        };
      }
      
      // Spend energy to boost another resource
      this.gameState.resources.energy -= 50;
      
      if (commandLower.includes('mineral')) {
        this.gameState.resourceRates.minerals += 0.2;
        return {
          success: true,
          message: `You've directed additional energy to your mining operations. Mineral production has increased by 0.2 units per hour.`,
          type: 'resource'
        };
      } else if (commandLower.includes('research') || commandLower.includes('knowledge')) {
        this.gameState.resourceRates.knowledge += 0.2;
        return {
          success: true,
          message: `You've directed additional energy to your research facilities. Knowledge production has increased by 0.2 units per hour.`,
          type: 'resource'
        };
      } else if (commandLower.includes('population') || commandLower.includes('growth')) {
        this.gameState.resourceRates.population += 0.1;
        return {
          success: true,
          message: `You've directed additional energy to your habitat systems and food production. Population growth has increased by 0.1 units per hour.`,
          type: 'resource'
        };
      }
    }
    
    // Check for building or infrastructure commands
    if (commandLower.includes('build') || commandLower.includes('construct')) {
      if (commandLower.includes('solar') || commandLower.includes('energy')) {
        // Check resources
        if (this.gameState.resources.minerals < 30) {
          return {
            success: false,
            message: `You don't have enough minerals to build energy infrastructure. Required: 30, Available: ${this.gameState.resources.minerals.toFixed(1)}.`,
            type: 'warning'
          };
        }
        
        // Build energy infrastructure
        this.gameState.resources.minerals -= 30;
        this.gameState.resourceRates.energy += 0.5;
        
        // Add an event
        this.gameState.events.push({
          year: this.gameState.currentYear.toFixed(1),
          type: 'construction',
          description: `Expanded energy infrastructure on Terra Prime, increasing energy production.`
        });
        
        return {
          success: true,
          message: `You've constructed additional energy infrastructure on Terra Prime. Energy production has increased by 0.5 units per hour.`,
          type: 'resource'
        };
      } else if (commandLower.includes('mine') || commandLower.includes('mineral')) {
        // Check resources
        if (this.gameState.resources.minerals < 20 || this.gameState.resources.energy < 30) {
          return {
            success: false,
            message: `You don't have enough resources to build mining infrastructure. Required: 20 minerals and 30 energy, Available: ${this.gameState.resources.minerals.toFixed(1)} minerals and ${this.gameState.resources.energy.toFixed(1)} energy.`,
            type: 'warning'
          };
        }
        
        // Build mining infrastructure
        this.gameState.resources.minerals -= 20;
        this.gameState.resources.energy -= 30;
        this.gameState.resourceRates.minerals += 0.3;
        
        // Add an event
        this.gameState.events.push({
          year: this.gameState.currentYear.toFixed(1),
          type: 'construction',
          description: `Expanded mining operations on Terra Prime, increasing mineral extraction.`
        });
        
        return {
          success: true,
          message: `You've constructed additional mining facilities on Terra Prime. Mineral production has increased by 0.3 units per hour.`,
          type: 'resource'
        };
      } else if (commandLower.includes('research') || commandLower.includes('lab') || commandLower.includes('science')) {
        // Check resources
        if (this.gameState.resources.minerals < 25 || this.gameState.resources.energy < 25) {
          return {
            success: false,
            message: `You don't have enough resources to build research infrastructure. Required: 25 minerals and 25 energy, Available: ${this.gameState.resources.minerals.toFixed(1)} minerals and ${this.gameState.resources.energy.toFixed(1)} energy.`,
            type: 'warning'
          };
        }
        
        // Build research infrastructure
        this.gameState.resources.minerals -= 25;
        this.gameState.resources.energy -= 25;
        this.gameState.resourceRates.knowledge += 0.25;
        
        // Add an event
        this.gameState.events.push({
          year: this.gameState.currentYear.toFixed(1),
          type: 'construction',
          description: `Constructed new research facilities on Terra Prime, accelerating scientific progress.`
        });
        
        return {
          success: true,
          message: `You've built new research facilities on Terra Prime. Knowledge production has increased by 0.25 units per hour.`,
          type: 'resource'
        };
      } else if (commandLower.includes('habitat') || commandLower.includes('housing') || commandLower.includes('population')) {
        // Check resources
        if (this.gameState.resources.minerals < 35 || this.gameState.resources.energy < 20) {
          return {
            success: false,
            message: `You don't have enough resources to build habitat infrastructure. Required: 35 minerals and 20 energy, Available: ${this.gameState.resources.minerals.toFixed(1)} minerals and ${this.gameState.resources.energy.toFixed(1)} energy.`,
            type: 'warning'
          };
        }
        
        // Build habitat infrastructure
        this.gameState.resources.minerals -= 35;
        this.gameState.resources.energy -= 20;
        this.gameState.resourceRates.population += 0.15;
        
        // Add an event
        this.gameState.events.push({
          year: this.gameState.currentYear.toFixed(1),
          type: 'construction',
          description: `Constructed new habitat domes on Terra Prime, supporting larger population growth.`
        });
        
        return {
          success: true,
          message: `You've built new habitat domes on Terra Prime. Population growth has increased by 0.15 units per hour.`,
          type: 'resource'
        };
      }
    }
    
    // Default response
    return {
      success: false,
      message: `Your administrators are unsure how to interpret your directive. Try specifying what resources to allocate or what infrastructure to build.`,
      type: 'system'
    };
  }
  
  // Get game status summary
  getStatusSummary() {
    // Update resources before generating summary
    this.gameState.updateResources();
    
    const summary = {
      year: this.gameState.currentYear.toFixed(1),
      resources: {
        energy: this.gameState.resources.energy.toFixed(1),
        minerals: this.gameState.resources.minerals.toFixed(1),
        knowledge: this.gameState.resources.knowledge.toFixed(1),
        population: this.gameState.resources.population.toFixed(0)
      },
      rates: {
        energy: this.gameState.resourceRates.energy.toFixed(2),
        minerals: this.gameState.resourceRates.minerals.toFixed(2),
        knowledge: this.gameState.resourceRates.knowledge.toFixed(2),
        population: this.gameState.resourceRates.population.toFixed(2)
      },
      technologies: this.gameState.discoveredTechnologies.map(techKey => {
        const tech = this.gameState.technologies[techKey];
        return {
          name: techKey.replace(/_/g, ' '),
          level: tech.level,
          progress: tech.level === 0 ? `${(tech.researchProgress / tech.researchCost * 100).toFixed(1)}%` : 'Complete'
        };
      }),
      exploredSystems: this.gameState.starSystems.length,
      colonizedWorlds: this.gameState.worlds.filter(w => w.colonized).length,
      recentEvents: this.gameState.events.slice(-3).reverse()
    };
    
    return {
      success: true,
      summary,
      message: `Current Year: ${summary.year}\n\nResources:\n- Energy: ${summary.resources.energy} (${summary.rates.energy}/hr)\n- Minerals: ${summary.resources.minerals} (${summary.rates.minerals}/hr)\n- Knowledge: ${summary.resources.knowledge} (${summary.rates.knowledge}/hr)\n- Population: ${summary.resources.population} (${summary.rates.population}/hr)\n\nTechnology Progress:\n${summary.technologies.map(t => `- ${t.name}: ${t.level > 0 ? 'Level ' + t.level : t.progress}`).join('\n')}\n\nExplored Systems: ${summary.exploredSystems}\nColonized Worlds: ${summary.colonizedWorlds}`,
      type: 'system'
    };
  }
}

