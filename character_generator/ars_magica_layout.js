var layText = `
Seiten:
  - id: ars_unified
    titel: "Ars Magica Character Generator"
    grid:
      columns_percent: [25, 25, 25, 25]
      row_height: "auto"
      gap: "6px"
    page_break_before: auto
    page_break_after: auto
    druck_header_footer: false

    bereiche:
      - ref: ArsCore
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "input.text", header: "Character" }
            - { key: "player", type: "input.text", header: "Player" }
            - { key: "saga", type: "input.text", header: "Saga" }
            - { key: "setting", type: "input.text", header: "Setting" }
            - { key: "year", type: "input.number_text", header: "Year", input_width: "6ch" }
            - { key: "house", type: "input.text", header: "House" }
            - { key: "age", type: "input.number_text", header: "Age", input_width: "4ch" }
            - { key: "size", type: "input.number_text", header: "Size", input_width: "4ch" }
            - { key: "confidence", type: "input.number_text", header: "Confidence", input_width: "4ch" }
            - { key: "confidence_points", type: "input.number_text", header: "Conf. Pts", input_width: "4ch" }
            - { key: "character_type", type: "input.select", header: "Type" }
            - { key: "social_status", type: "input.text", header: "Social Status" }

      - ref: ArsPersonalDetails
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "birth_name", type: "input.text", header: "Birth Name" }
            - { key: "year_born", type: "input.number_text", header: "Year Born", input_width: "6ch" }
            - { key: "gender", type: "input.text", header: "Gender" }
            - { key: "race_nationality", type: "input.text", header: "Race/Nationality" }
            - { key: "birth_place", type: "input.text", header: "Birth Place" }
            - { key: "religion", type: "input.text", header: "Religion" }
            - { key: "title", type: "input.text", header: "Title" }
            - { key: "height", type: "input.text", header: "Height" }
            - { key: "weight", type: "input.text", header: "Weight" }
            - { key: "hair", type: "input.text", header: "Hair" }
            - { key: "eyes", type: "input.text", header: "Eyes" }
            - { key: "handedness", type: "input.text", header: "Handedness" }
      - ref: ArsHermeticDetails
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "covenant", type: "input.text", header: "Covenant" }
            - { key: "wizards_sigil", type: "input.text", header: "Wizard's Sigil" }
            - { key: "domus_magna", type: "input.text", header: "Domus Magna" }
            - { key: "parens", type: "input.text", header: "Parens" }
            - { key: "apprenticeship_covenant", type: "input.text", header: "Covenant of Apprenticeship" }
            - { key: "gauntlet", type: "input.text", header: "Gauntlet" }
      - ref: ArsCharacteristics
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "label", header: "Characteristic" }
            - { key: "value", type: "input.number_text", header: "Score", input_width: "4ch" }

      - ref: ArsAbilities
        titel_anzeigen: true
        grid_span:
          col_start: 2
          col_span: 3
        spalten: 3
        kompakt: true
        tabelle:
          columns:
            - { key: "exp", type: "input.number_text", header: "Exp", input_width: "4ch" }
            - { key: "label", type: "label", header: "Ability" }
            - { key: "specialty", type: "input.text", header: "Specialty" }
            - { key: "value", type: "input.number_text", header: "Score", input_width: "4ch" }

      - ref: ArsVirtues
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "name", type: "input.select", header: "Virtue" }

      - ref: ArsFlaws
        titel_anzeigen: true
        grid_span:
          col_start: 2
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "name", type: "input.select", header: "Flaw" }

      - ref: ArsPersonality
        titel_anzeigen: true
        grid_span:
          col_start: 3
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "description", type: "input.text", header: "Personality" }
            - { key: "score", type: "input.number_text", header: "Score", input_width: "4ch" }

      - ref: ArsReputation
        titel_anzeigen: true
        grid_span:
          col_start: 4
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "description", type: "input.text", header: "Reputation" }
            - { key: "score", type: "input.number_text", header: "Score", input_width: "4ch" }

      - ref: ArsDecrepitude
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "score", type: "input.number_text", header: "Score", input_width: "4ch" }

      - ref: ArsDecrepitudeEffects
        titel_anzeigen: true
        grid_span:
          col_start: 2
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "effect", type: "input.text", header: "Effect" }

      - ref: ArsWarping
        titel_anzeigen: true
        grid_span:
          col_start: 3
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "score", type: "input.number_text", header: "Score", input_width: "4ch" }
            - { key: "points", type: "input.number_text", header: "Points", input_width: "4ch" }

      - ref: ArsWarpingEffects
        titel_anzeigen: true
        grid_span:
          col_start: 4
          col_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "effect", type: "input.text", header: "Effect" }

      - ref: ArsArmor
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "input.text", header: "Armor" }
            - { key: "protection", type: "input.number_text", header: "Prot", input_width: "4ch" }
            - { key: "load", type: "input.number_text", header: "Load", input_width: "4ch" }

      - ref: ArsCombatState
        titel_anzeigen: true
        grid_span:
          col_start: 3
          col_span: 2
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "label", header: "State" }
            - { key: "fatigue_penalty", type: "input.number_text", header: "Fatigue Pen." , input_width: "4ch" }
            - { key: "light_wounds", type: "input.number_text", header: "Light" , input_width: "3ch" }
            - { key: "medium_wounds", type: "input.number_text", header: "Medium" , input_width: "3ch" }
            - { key: "heavy_wounds", type: "input.number_text", header: "Heavy" , input_width: "3ch" }
            - { key: "form_bonus", type: "input.number_text", header: "Form" , input_width: "4ch" }
            - { key: "misc_load", type: "input.number_text", header: "Misc Load" , input_width: "4ch" }
            - { key: "wound_penalty", type: "computed", header: "Wound Pen." , formula_id: "ars_wound_penalty" }
            - { key: "action_penalty", type: "computed", header: "Action Pen." , formula_id: "ars_action_penalty" }
            - { key: "soak_total", type: "computed", header: "Soak" , formula_id: "ars_soak_total" }

      - ref: ArsWeapons
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "preset", type: "input.select", header: "Weapon" }
            - { key: "ability", type: "input.select", header: "Ability" }
            - { key: "init_mod", type: "input.number_text", header: "Init" , input_width: "4ch" }
            - { key: "attack_mod", type: "input.number_text", header: "Atk" , input_width: "4ch" }
            - { key: "defense_mod", type: "input.number_text", header: "Def" , input_width: "4ch" }
            - { key: "damage_mod", type: "input.number_text", header: "Dam" , input_width: "4ch" }
            - { key: "load", type: "input.number_text", header: "Load" , input_width: "4ch" }
            - { key: "burden", type: "computed", header: "Burden" , formula_id: "ars_weapon_burden" }
            - { key: "encumbrance", type: "computed", header: "Enc" , formula_id: "ars_weapon_encumbrance" }
            - { key: "soak", type: "computed", header: "Soak" , formula_id: "ars_soak_total" }
            - { key: "initiative", type: "computed", header: "Initiative" , formula_id: "ars_weapon_initiative" }
            - { key: "attack", type: "computed", header: "Attack" , formula_id: "ars_weapon_attack" }
            - { key: "defense", type: "computed", header: "Defense" , formula_id: "ars_weapon_defense" }
            - { key: "damage_base", type: "computed", header: "Damage" , formula_id: "ars_weapon_damage_base" }

      - ref: ArsRangedCombat
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "range", type: "input.text", header: "Range" }
            - { key: "penalty", type: "input.number_text", header: "Penalty", input_width: "4ch" }
            - { key: "notes", type: "input.text", header: "Notes" }

      - ref: ArsArts
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 2
        kompakt: true
        tabelle:
          columns:
            - { key: "exp", type: "input.number_text", header: "Exp", input_width: "4ch" }
            - { key: "label", type: "label", header: "Art" }
            - { key: "value", type: "input.number_text", header: "Score", input_width: "4ch" }
            - { key: "bonus", type: "input.number_text", header: "Bonus", input_width: "4ch" }
            - { key: "mr", type: "input.number_text", header: "MR", input_width: "4ch" }

      - ref: ArsVisStocks
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 3
          col_span: 2
        spalten: 2
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "label", header: "Art" }
            - { key: "pawns", type: "input.number_text", header: "# Pawns", input_width: "5ch" }
            - { key: "physical_form", type: "input.text", header: "Physical Form" }

      - ref: ArsSpells
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 2
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "input.text", header: "Spell Name" }
            - { key: "value", type: "input.number_text", header: "Level", input_width: "4ch" }
            - { key: "spell_reqs", type: "input.text", header: "Reqs", input_width: "8ch" }
            - { key: "range", type: "input.text", header: "Range", input_width: "8ch" }
            - { key: "duration", type: "input.text", header: "Duration", input_width: "8ch" }
            - { key: "target", type: "input.text", header: "Target", input_width: "8ch" }
            - { key: "mastery", type: "input.number_text", header: "Mastery", input_width: "4ch" }
            - { key: "penetration", type: "input.number_text", header: "Pen.", input_width: "4ch" }
            - { key: "notes", type: "input.text", header: "Notes" }
      - ref: ArsLaboratory
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "owner", type: "input.text", header: "Owner" }
            - { key: "location", type: "input.text", header: "Location" }
            - { key: "floor", type: "input.text", header: "Floor" }
            - { key: "build_points", type: "input.number_text", header: "Build Pts", input_width: "5ch" }
            - { key: "sanctum_marker_names", type: "input.text", header: "Sanctum Marker Names" }
            - { key: "size_sqft", type: "input.number_text", header: "Size (sq ft)", input_width: "6ch" }
            - { key: "general_quality", type: "input.number_text", header: "Gen. Quality", input_width: "4ch" }
            - { key: "safety", type: "input.number_text", header: "Safety", input_width: "4ch" }
            - { key: "health", type: "input.number_text", header: "Health", input_width: "4ch" }
            - { key: "refinement", type: "input.number_text", header: "Refinement", input_width: "4ch" }
            - { key: "upkeep", type: "input.number_text", header: "Upkeep", input_width: "4ch" }
            - { key: "warping", type: "input.number_text", header: "Warping", input_width: "4ch" }
            - { key: "aesthetics", type: "input.number_text", header: "Aesthetics", input_width: "4ch" }

      - ref: ArsCastingTotals
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "formulaic_total", type: "input.text", header: "Formulaic" }
            - { key: "ritual_total", type: "input.text", header: "Ritual" }
            - { key: "spontaneous_fatigue_total", type: "input.text", header: "Spont (Fatigue)" }
            - { key: "spontaneous_no_fatigue_total", type: "input.text", header: "Spont (No Fatigue)" }
            - { key: "fast_cast_speed", type: "input.text", header: "Fast Cast Speed" }
            - { key: "fast_cast_effect", type: "input.text", header: "Fast Cast Effect" }
            - { key: "targeting_total", type: "input.text", header: "Targeting" }
            - { key: "concentration_total", type: "input.text", header: "Concentration" }
            - { key: "magic_resistance_total", type: "input.text", header: "Magic Resistance" }
            - { key: "longevity_modifier", type: "input.number_text", header: "Longevity Mod", input_width: "5ch" }
            - { key: "age_roll_modifier", type: "input.number_text", header: "Age Roll Mod", input_width: "5ch" }
            - { key: "twilight_scars", type: "input.text", header: "Twilight Scars" }

      - ref: ArsFamiliar
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "name", type: "input.text", header: "Name" }
            - { key: "type", type: "input.text", header: "Type" }
            - { key: "might", type: "input.number_text", header: "Might", input_width: "4ch" }
            - { key: "bond_level", type: "input.number_text", header: "Bond", input_width: "4ch" }
            - { key: "gold_cord", type: "input.number_text", header: "Gold", input_width: "4ch" }
            - { key: "silver_cord", type: "input.number_text", header: "Silver", input_width: "4ch" }
            - { key: "bronze_cord", type: "input.number_text", header: "Bronze", input_width: "4ch" }

      - ref: ArsPowers
        visibility:
          logic: and
          rules:
            - field: ArsCore-character-character_type
              operator: equals
              value: Magus
        titel_anzeigen: true
        grid_span:
          col_start: 3
          col_span: 2
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "name", type: "input.text", header: "Power/Ability/Attack" }
            - { key: "type", type: "input.text", header: "Type" }
            - { key: "might_cost", type: "input.number_text", header: "Cost", input_width: "4ch" }
            - { key: "initiative", type: "input.number_text", header: "Init", input_width: "4ch" }
            - { key: "notes", type: "input.text", header: "Notes" }

      - ref: ArsNotes
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
        spalten: 2
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "input.text", header: "Notes" }

Einstellungen:
  typography:
    base_font_size: "8pt"
    line_height: 1.2
    table_header_font_size: "9pt"
    title_font_size: "11pt"
  spacing:
    gap_between_cards: "6px"
    card_padding: "6px"
    gap_2col_top: "6px"
    section_margin_bottom: "6px"
  input:
    width_num: "2.5rem"
    width_ap: "4.5rem"
    placeholder_default: "0"
    spinner: false
    max_digits_default: 2
  grid:
    gruppen:
      columns: [1fr, 1fr]
  print:
    page_size: "A4 portrait"
    margins: "8mm"
    hide_toolbar: true
    header_footer: false
    compact: true
    cards_break_inside: "auto"
`;