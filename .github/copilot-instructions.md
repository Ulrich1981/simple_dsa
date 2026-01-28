# Copilot Instructions for Simple DSA Character Generator

## Project Overview

This is a **Simple DSA** (Das Schwarze Auge) character generator - a streamlined German tabletop RPG system. The codebase implements a web-based character sheet generator with a generic formula engine and YAML-driven configuration.

### Key Design Philosophy
- **Unified Currency System**: Everything uses Abenteuerpunkte (Adventure Points) as the single resource
- **Streamlined Mechanics**: Simplified compared to classic DSA rules
- **Modular Configuration**: YAML-driven definitions for easy rule modifications
- **German Language**: All UI text, rules, and terminology are in German

## Architecture

### Core Files Structure
- **`app.js`** (926 lines): Main application logic with generic formula engine
- **`definitions.js`** (528 lines): YAML character rules and data definitions  
- **`layout.js`** (217 lines): UI layout configuration with grid system
- **`index.html`** (163 lines): Main HTML interface
- **`simple_dsa.md`** (1890 lines): Complete German ruleset documentation

### Key Components

#### 1. Formula Engine (`app.js`)
The application uses a sophisticated formula calculation system:

**Formula Types:**
- `value`: Simple value storage
- `sum`: Addition of base attributes and values  
- `weighted`: Weighted calculation with configurable parameters
- `base_plus_value`: Base attributes plus incremental value

**Core Functions to Understand:**
- `tri(a, b, c)`: Calculate average of three values (basis attributes)
- `basisFrom(item, state)`: Extract basis attributes for calculations
- `total(item, state)`: Calculate final values using formulas
- `cpi(item)`: Get cost per increment for character progression

#### 2. State Management
- Centralized character state in JavaScript objects
- Real-time calculation updates when values change
- AP (Adventure Points) tracking and validation

#### 3. YAML Configuration (`definitions.js`)
Character rules are defined in embedded YAML:
- **Sections**: Major character aspects (Eigenschaften, Talente, etc.)
- **Items**: Individual attributes/skills within sections  
- **Groups**: Organizational structure for related items
- **Formulas**: Calculation definitions with parameters

#### 4. Grid-Based Layout (`layout.js`)
UI uses percentage-based grid system:
- Responsive column layouts
- Print-friendly page breaks
- Tabular data presentation
- German terminology for all labels

## German RPG Domain Knowledge

### Core Concepts
- **Eigenschaften**: Core attributes (MU, KL, IN, CH, GE, KK, KO)
- **Talente**: Skills organized by categories (Kampf, Körper, Gesellschaft, Wissen, Natur)
- **Ressourcen**: Derived resources (LE, AE, KE, MR, Heldenpunkte)
- **Abenteuerpunkte (AP)**: Universal currency for character advancement

### Attribute Abbreviations
- **MU**: Mut (Courage)
- **KL**: Klugheit (Intelligence) 
- **IN**: Intuition
- **CH**: Charisma
- **GE**: Gewandtheit (Dexterity)
- **KK**: Körperkraft (Strength)
- **KO**: Konstitution (Constitution)

### Resource Calculations
- **LE** (Lebensenergie): Based on [KK, KO, KO]
- **AE** (Astralenergie): Based on [KL, IN, CH]  
- **KE** (Karmaenergie): Based on [IN, CH, CH]
- **MR** (Magieresistenz): Based on [MU, KL, KO] with special formula

## Coding Guidelines

### When Adding Features
1. **Follow YAML-First Approach**: New game mechanics should be definable in `definitions.js` YAML
2. **Maintain Formula Genericity**: Don't hardcode specific calculations - extend the formula engine
3. **Preserve German Terminology**: All user-facing text must remain in German
4. **Respect Grid Layout**: UI changes should work within the existing grid system

### Code Patterns to Follow

#### Adding New Formula Types
```javascript
// Extend the formula calculation in total() function
case "new_formula_type":
    // Implement calculation logic
    break;
```

#### Adding New Character Sections
```yaml
# In definitions.js defText YAML
- id: new_section
  label: "German Label"
  calc_id: "appropriate_formula"
  cost_per_increment: 20
  items:
    - { id: new_item, label: "German Label", value: 0 }
```

#### UI Layout Extensions
```yaml
# In layout.js layText YAML
- ref: new_section
  titel_anzeigen: true
  grid_span:
    col_start: 1
    col_span: 2
    row_span: 1
```

### Common Pitfalls to Avoid
1. **Don't Break Formula Dependencies**: Character sections reference each other via basis arrays
2. **Don't Hardcode German Text**: Use the YAML label system for all user-facing strings
3. **Don't Ignore AP Costs**: All character progression must respect the unified AP economy
4. **Don't Mix Languages**: Code comments can be English, but all game content stays German

### Testing Approach
- Test with typical DSA character builds (different professions/races)
- Verify AP calculations remain balanced
- Check that formulas work with edge cases (zero values, maximum values)
- Ensure print layout remains functional

### Performance Considerations
- The formula engine recalculates on every change - keep calculations efficient
- YAML parsing happens once on load - structure changes require page refresh
- Grid layout uses CSS Grid - test on different screen sizes

### Integration Points
- Character data could be exported to JSON
- Layout system could support additional page formats
- Formula engine could be extended for dice rolling mechanics

## Domain-Specific Terminology

When working with this codebase, familiarize yourself with these German RPG terms:
- **Charakterbogen**: Character sheet
- **Steigerung**: Character advancement/improvement
- **Probe**: Skill check/test
- **Kampftalente**: Combat skills
- **Wissenstalente**: Knowledge skills
- **Zauber**: Spells
- **Rüstung**: Armor
- **Waffen**: Weapons

This character generator is specifically designed for the streamlined "Simple DSA" variant described in `simple_dsa.md`, which emphasizes unified mechanics and reduced complexity compared to classic DSA rules.