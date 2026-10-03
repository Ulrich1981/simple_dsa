var defText = `
globals:
  ap_total: 0
  ap_total_formula:
    formula_id: "xp_total"
    read_only: true
    title: "Calculated from character type and age"
  stats:
    - id: "characteristics_points"
      label: "Characteristics"
      formula_id: "characteristics_points"
      template: "Spent {spent} / {budget} (Remaining {remaining})"
  formulas:
    value_only:      { type: "value" }
    base_plus_value: { type: "sum" }
    xp_total:
      type: "profile_age_linear_points"
      params:
        age_state_key: "ArsCore-character-age"
        profile_state_key: "ArsCore-character-character_type"
        default_age: 25
        default_profile: "Companion"
        base: 120
        start_age: 5
        per_year: 15
        profiles:
          Magus: { base: 555, start_age: 25, per_year: 30 }
          Companion: { base: 120, start_age: 5, per_year: 15 }
          Grog: { base: 120, start_age: 5, per_year: 15 }
    characteristics_points:
      type: "section_signed_tri_budget"
      params:
        section_id: "ArsCharacteristics"
        budget: 7
    ars_wound_penalty:
      type: "sum_terms"
      params:
        terms:
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "light_wounds", coeff: -1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "medium_wounds", coeff: -3 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "heavy_wounds", coeff: -5 }
    ars_action_penalty:
      type: "sum_terms"
      params:
        terms:
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "fatigue_penalty", coeff: 1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "light_wounds", coeff: -1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "medium_wounds", coeff: -3 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "heavy_wounds", coeff: -5 }
    ars_weapon_burden:
      type: "burden_from_terms"
      params:
        terms:
          - { source: "own_field", field_id: "load" }
          - { source: "section_item_field", section_id: "ArsArmor", item_id: "armor_1", field_id: "load" }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "misc_load" }
    ars_weapon_encumbrance:
      type: "encumbrance_from_terms"
      params:
        strength_section_id: "ArsCharacteristics"
        strength_item_id: "STR"
        terms:
          - { source: "own_field", field_id: "load" }
          - { source: "section_item_field", section_id: "ArsArmor", item_id: "armor_1", field_id: "load" }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "misc_load" }
    ars_weapon_initiative:
      type: "sum_terms"
      params:
        terms:
          - { source: "section_item_value", section_id: "ArsCharacteristics", item_id: "QIK" }
          - { source: "own_field", field_id: "init_mod" }
          - {
              source: "encumbrance_from_terms",
              coeff: -1,
              strength_section_id: "ArsCharacteristics",
              strength_item_id: "STR",
              terms:
                [
                  { source: "own_field", field_id: "load" },
                  { source: "section_item_field", section_id: "ArsArmor", item_id: "armor_1", field_id: "load" },
                  { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "misc_load" }
                ]
            }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "fatigue_penalty", coeff: 1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "light_wounds", coeff: -1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "medium_wounds", coeff: -3 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "heavy_wounds", coeff: -5 }
    ars_weapon_attack:
      type: "selected_section_item_value_plus_terms"
      params:
        selected_field_id: "ability"
        source_section_id: "ArsAbilities"
        terms:
          - { source: "section_item_value", section_id: "ArsCharacteristics", item_id: "DEX" }
          - { source: "own_field", field_id: "attack_mod" }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "fatigue_penalty", coeff: 1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "light_wounds", coeff: -1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "medium_wounds", coeff: -3 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "heavy_wounds", coeff: -5 }
    ars_weapon_defense:
      type: "selected_section_item_value_plus_terms"
      params:
        selected_field_id: "ability"
        source_section_id: "ArsAbilities"
        terms:
          - { source: "section_item_value", section_id: "ArsCharacteristics", item_id: "QIK" }
          - { source: "own_field", field_id: "defense_mod" }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "fatigue_penalty", coeff: 1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "light_wounds", coeff: -1 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "medium_wounds", coeff: -3 }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "heavy_wounds", coeff: -5 }
    ars_weapon_damage_base:
      type: "sum_terms"
      params:
        terms:
          - { source: "section_item_value", section_id: "ArsCharacteristics", item_id: "STR" }
          - { source: "own_field", field_id: "damage_mod" }
    ars_soak_total:
      type: "sum_terms"
      params:
        terms:
          - { source: "section_item_value", section_id: "ArsCharacteristics", item_id: "STA" }
          - { source: "section_item_field", section_id: "ArsArmor", item_id: "armor_1", field_id: "protection" }
          - { source: "section_item_field", section_id: "ArsCombatState", item_id: "state", field_id: "form_bonus" }
sections:
  - id: ArsCore
    label: "Ars Magica Character"
    type: "header"
    items:
      - id: character
        label: ""
        fields:
          - { id: concept, type: "text", value: "" }
          - { id: player, type: "text", value: "" }
          - { id: saga, type: "text", value: "" }
          - { id: setting, type: "text", value: "" }
          - { id: year, type: "number", value: 1220 }
          - { id: character_type, type: "select", value: "Magus", options: ["Magus", "Companion", "Grog"] }
          - { id: social_status, type: "text", value: "" }
          - { id: house, type: "text", value: "" }
          - { id: age, type: "number", value: 25 }
          - { id: size, type: "number", value: 0 }
          - { id: confidence, type: "number", value: 1 }
          - { id: confidence_points, type: "number", value: 3 }

  - id: ArsDecrepitude
    label: "Decrepitude"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: decrepitude
        label: ""
        fields:
          - { id: score, type: "number", value: 0 }

  - id: ArsDecrepitudeEffects
    label: "Decrepitude Effects"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "decrepitude_effect_01"
      add_label: "+ Effect"
      remove_label: "Remove"
    items:
      - id: decrepitude_effect_01
        label: ""
        fields:
          - { id: effect, type: "text", value: "" }

  - id: ArsWarping
    label: "Warping"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: warping
        label: ""
        fields:
          - { id: score, type: "number", value: 0 }
          - { id: points, type: "number", value: 0 }

  - id: ArsWarpingEffects
    label: "Warping Effects"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "warping_effect_01"
      add_label: "+ Effect"
      remove_label: "Remove"
    items:
      - id: warping_effect_01
        label: ""
        fields:
          - { id: effect, type: "text", value: "" }

  - id: ArsPersonalDetails
    label: "Personal Details"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: details
        label: ""
        fields:
          - { id: birth_name, type: "text", value: "" }
          - { id: year_born, type: "number", value: 0 }
          - { id: gender, type: "text", value: "" }
          - { id: race_nationality, type: "text", value: "" }
          - { id: birth_place, type: "text", value: "" }
          - { id: religion, type: "text", value: "" }
          - { id: title, type: "text", value: "" }
          - { id: height, type: "text", value: "" }
          - { id: weight, type: "text", value: "" }
          - { id: hair, type: "text", value: "" }
          - { id: eyes, type: "text", value: "" }
          - { id: handedness, type: "text", value: "" }

  - id: ArsHermeticDetails
    label: "Hermetic Details"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: hermetic
        label: ""
        fields:
          - { id: covenant, type: "text", value: "" }
          - { id: wizards_sigil, type: "text", value: "" }
          - { id: domus_magna, type: "text", value: "" }
          - { id: parens, type: "text", value: "" }
          - { id: apprenticeship_covenant, type: "text", value: "" }
          - { id: gauntlet, type: "text", value: "" }

  - id: ArsLaboratory
    label: "Laboratory & Covenant"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: lab
        label: ""
        fields:
          - { id: owner, type: "text", value: "" }
          - { id: location, type: "text", value: "" }
          - { id: floor, type: "text", value: "" }
          - { id: build_points, type: "number", value: 0 }
          - { id: sanctum_marker_names, type: "text", value: "" }
          - { id: size_sqft, type: "number", value: 0 }
          - { id: general_quality, type: "number", value: 0 }
          - { id: safety, type: "number", value: 0 }
          - { id: health, type: "number", value: 0 }
          - { id: refinement, type: "number", value: 0 }
          - { id: upkeep, type: "number", value: 0 }
          - { id: warping, type: "number", value: 0 }
          - { id: aesthetics, type: "number", value: 0 }

  - id: ArsVisStocks
    label: "Vis Stocks"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - { id: creo, label: "Creo" }
      - { id: intellego, label: "Intellego" }
      - { id: muto, label: "Muto" }
      - { id: perdo, label: "Perdo" }
      - { id: rego, label: "Rego" }
      - { id: animal, label: "Animal" }
      - { id: aquam, label: "Aquam" }
      - { id: auram, label: "Auram" }
      - { id: corpus, label: "Corpus" }
      - { id: herbam, label: "Herbam" }
      - { id: ignem, label: "Ignem" }
      - { id: imaginem, label: "Imaginem" }
      - { id: mentem, label: "Mentem" }
      - { id: terram, label: "Terram" }
      - { id: vim, label: "Vim" }

  - id: ArsCastingTotals
    label: "Casting & Resistance"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: casting
        label: ""
        fields:
          - { id: formulaic_total, type: "text", value: "" }
          - { id: ritual_total, type: "text", value: "" }
          - { id: spontaneous_fatigue_total, type: "text", value: "" }
          - { id: spontaneous_no_fatigue_total, type: "text", value: "" }
          - { id: fast_cast_speed, type: "text", value: "" }
          - { id: fast_cast_effect, type: "text", value: "" }
          - { id: targeting_total, type: "text", value: "" }
          - { id: concentration_total, type: "text", value: "" }
          - { id: magic_resistance_total, type: "text", value: "" }
          - { id: longevity_modifier, type: "number", value: 0 }
          - { id: age_roll_modifier, type: "number", value: 0 }
          - { id: twilight_scars, type: "text", value: "" }

  - id: ArsFamiliar
    label: "Familiar"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: familiar
        label: ""
        fields:
          - { id: name, type: "text", value: "" }
          - { id: type, type: "text", value: "" }
          - { id: might, type: "number", value: 0 }
          - { id: bond_level, type: "number", value: 0 }
          - { id: gold_cord, type: "number", value: 0 }
          - { id: silver_cord, type: "number", value: 0 }
          - { id: bronze_cord, type: "number", value: 0 }

  - id: ArsPowers
    label: "Powers, Abilities, Attacks"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "power_01"
      add_label: "+ Power"
      remove_label: "Remove"
    items:
      - id: power_01
        label: ""
        fields:
          - { id: name, type: "text", value: "" }
          - { id: type, type: "text", value: "" }
          - { id: might_cost, type: "number", value: 0 }
          - { id: initiative, type: "number", value: 0 }
          - { id: notes, type: "text", value: "" }

  - id: ArsRangedCombat
    label: "Ranged Combat"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: range_1
        label: ""
        fields:
          - { id: range, type: "text", value: "2 min." }
          - { id: penalty, type: "number", value: 0 }
          - { id: notes, type: "text", value: "" }
      - id: range_2
        label: ""
        fields:
          - { id: range, type: "text", value: "10 min." }
          - { id: penalty, type: "number", value: 0 }
          - { id: notes, type: "text", value: "" }
      - id: range_3
        label: ""
        fields:
          - { id: range, type: "text", value: "30 min." }
          - { id: penalty, type: "number", value: 0 }
          - { id: notes, type: "text", value: "" }
      - id: range_4
        label: ""
        fields:
          - { id: range, type: "text", value: "2 hrs." }
          - { id: penalty, type: "number", value: 0 }
          - { id: notes, type: "text", value: "" }

  - id: ArsPersonality
    label: "Personality"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "personality_1"
      add_label: "+ Trait"
      remove_label: "Remove"
    items:
      - id: personality_1
        label: ""
        fields:
          - { id: description, type: "text", value: "" }
          - { id: score, type: "number", value: 0 }

  - id: ArsReputation
    label: "Reputation"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "reputation_1"
      add_label: "+ Reputation"
      remove_label: "Remove"
    items:
      - id: reputation_1
        label: ""
        fields:
          - { id: description, type: "text", value: "" }
          - { id: score, type: "number", value: 0 }





  - id: ArsVirtueCatalog
    label: "Virtue Catalog"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - { id: "Special, Free: The Gift", label: "Special, Free: The Gift", value: 0 }
      - { id: "Hermetic, Major: Diedne Magic", label: "Hermetic, Major: Diedne Magic", value: 0 }
      - { id: "Hermetic, Major: Elemental Magic", label: "Hermetic, Major: Elemental Magic", value: 0 }
      - { id: "Hermetic, Major: Faerie-Raised Magic", label: "Hermetic, Major: Faerie-Raised Magic", value: 0 }
      - { id: "Hermetic, Major: Flawless Magic", label: "Hermetic, Major: Flawless Magic", value: 0 }
      - { id: "Hermetic, Major: Flexible Formulaic Magic", label: "Hermetic, Major: Flexible Formulaic Magic", value: 0 }
      - { id: "Hermetic, Major: Gentle Gift", label: "Hermetic, Major: Gentle Gift", value: 0 }
      - { id: "Hermetic, Major: Leper Magus", label: "Hermetic, Major: Leper Magus", value: 0 }
      - { id: "Hermetic, Major: Life-Linked Spontaneous Magic", label: "Hermetic, Major: Life-Linked Spontaneous Magic", value: 0 }
      - { id: "Hermetic, Major: Major Magical Focus", label: "Hermetic, Major: Major Magical Focus", value: 0 }
      - { id: "Hermetic, Major: Mercurian Magic", label: "Hermetic, Major: Mercurian Magic", value: 0 }
      - { id: "Hermetic, Major: Mythic Blood", label: "Hermetic, Major: Mythic Blood", value: 0 }
      - { id: "Hermetic, Major: Potent Magic", label: "Hermetic, Major: Potent Magic", value: 0 }
      - { id: "Hermetic, Minor: Adept Laboratory Student", label: "Hermetic, Minor: Adept Laboratory Student", value: 0 }
      - { id: "Hermetic, Minor: Affinity with Art", label: "Hermetic, Minor: Affinity with Art", value: 0 }
      - { id: "Hermetic, Minor: Atlantean Magic", label: "Hermetic, Minor: Atlantean Magic", value: 0 }
      - { id: "Hermetic, Minor: Boosted Magic", label: "Hermetic, Minor: Boosted Magic", value: 0 }
      - { id: "Hermetic, Minor: Cautious Sorcerer", label: "Hermetic, Minor: Cautious Sorcerer", value: 0 }
      - { id: "Hermetic, Minor: Clan Ilfetu", label: "Hermetic, Minor: Clan Ilfetu", value: 0 }
      - { id: "Hermetic, Minor: Cyclic Magic (positive)", label: "Hermetic, Minor: Cyclic Magic (positive)", value: 0 }
      - { id: "Hermetic, Minor: Deft Form", label: "Hermetic, Minor: Deft Form", value: 0 }
      - { id: "Hermetic, Minor: Enduring Magic", label: "Hermetic, Minor: Enduring Magic", value: 0 }
      - { id: "Hermetic, Minor: Exotic Casting", label: "Hermetic, Minor: Exotic Casting", value: 0 }
      - { id: "Hermetic, Minor: Extractor of (Form) Vis", label: "Hermetic, Minor: Extractor of (Form) Vis", value: 0 }
      - { id: "Hermetic, Minor: Faerie Magic", label: "Hermetic, Minor: Faerie Magic", value: 0 }
      - { id: "Hermetic, Minor: Fast Caster", label: "Hermetic, Minor: Fast Caster", value: 0 }
      - { id: "Hermetic, Minor: Free Study", label: "Hermetic, Minor: Free Study", value: 0 }
      - { id: "Hermetic, Minor: Gorgiastic", label: "Hermetic, Minor: Gorgiastic", value: 0 }
      - { id: "Hermetic, Minor: Guest of House Criamon", label: "Hermetic, Minor: Guest of House Criamon", value: 0 }
      - { id: "Hermetic, Minor: Harnessed Magic", label: "Hermetic, Minor: Harnessed Magic", value: 0 }
      - { id: "Hermetic, Minor: Heartbeast", label: "Hermetic, Minor: Heartbeast", value: 0 }
      - { id: "Hermetic, Minor: Hermetic Prestige", label: "Hermetic, Minor: Hermetic Prestige", value: 0 }
      - { id: "Hermetic, Minor: Imbued with the Spirit of (Form)", label: "Hermetic, Minor: Imbued with the Spirit of (Form)", value: 0 }
      - { id: "Hermetic, Minor: Inoffensive to (Beings)", label: "Hermetic, Minor: Inoffensive to (Beings)", value: 0 }
      - { id: "Hermetic, Minor: Inventive Genius", label: "Hermetic, Minor: Inventive Genius", value: 0 }
      - { id: "Hermetic, Minor: Life Boost", label: "Hermetic, Minor: Life Boost", value: 0 }
      - { id: "Hermetic, Minor: Magical Memory", label: "Hermetic, Minor: Magical Memory", value: 0 }
      - { id: "Hermetic, Minor: Mastered Spells", label: "Hermetic, Minor: Mastered Spells", value: 0 }
      - { id: "Hermetic, Minor: Masterpiece", label: "Hermetic, Minor: Masterpiece", value: 0 }
      - { id: "Hermetic, Minor: Method Caster", label: "Hermetic, Minor: Method Caster", value: 0 }
      - { id: "Hermetic, Minor: Minor Magical Focus", label: "Hermetic, Minor: Minor Magical Focus", value: 0 }
      - { id: "Hermetic, Minor: Mystical Choreography", label: "Hermetic, Minor: Mystical Choreography", value: 0 }
      - { id: "Hermetic, Minor: Performance Magic", label: "Hermetic, Minor: Performance Magic", value: 0 }
      - { id: "Hermetic, Minor: Personal Vis Source", label: "Hermetic, Minor: Personal Vis Source", value: 0 }
      - { id: "Hermetic, Minor: Potent Magic", label: "Hermetic, Minor: Potent Magic", value: 0 }
      - { id: "Hermetic, Minor: Puissant Art", label: "Hermetic, Minor: Puissant Art", value: 0 }
      - { id: "Hermetic, Minor: Quiet Magic", label: "Hermetic, Minor: Quiet Magic", value: 0 }
      - { id: "Hermetic, Minor: Secondary Insight", label: "Hermetic, Minor: Secondary Insight", value: 0 }
      - { id: "Hermetic, Minor: Side Effect", label: "Hermetic, Minor: Side Effect", value: 0 }
      - { id: "Hermetic, Minor: Skilled Parens", label: "Hermetic, Minor: Skilled Parens", value: 0 }
      - { id: "Hermetic, Minor: Special Circumstances", label: "Hermetic, Minor: Special Circumstances", value: 0 }
      - { id: "Hermetic, Minor: Spell Improvisation", label: "Hermetic, Minor: Spell Improvisation", value: 0 }
      - { id: "Hermetic, Minor: Study Bonus", label: "Hermetic, Minor: Study Bonus", value: 0 }
      - { id: "Hermetic, Minor: Subtle Magic", label: "Hermetic, Minor: Subtle Magic", value: 0 }
      - { id: "Hermetic, Minor: Tethered Magic", label: "Hermetic, Minor: Tethered Magic", value: 0 }
      - { id: "Hermetic, Minor: The Enigma", label: "Hermetic, Minor: The Enigma", value: 0 }
      - { id: "Hermetic, Minor: Verditius Magic", label: "Hermetic, Minor: Verditius Magic", value: 0 }
      - { id: "Hermetic, Minor: Withstand Casting", label: "Hermetic, Minor: Withstand Casting", value: 0 }
      - { id: "Supernatural, Major: Amorphous", label: "Supernatural, Major: Amorphous", value: 0 }
      - { id: "Supernatural, Major: Bee King", label: "Supernatural, Major: Bee King", value: 0 }
      - { id: "Supernatural, Major: Blood Of The Nephilim", label: "Supernatural, Major: Blood Of The Nephilim", value: 0 }
      - { id: "Supernatural, Major: Command Animals", label: "Supernatural, Major: Command Animals", value: 0 }
      - { id: "Supernatural, Major: Corpse Magic", label: "Supernatural, Major: Corpse Magic", value: 0 }
      - { id: "Supernatural, Major: Curse-Throwing", label: "Supernatural, Major: Curse-Throwing", value: 0 }
      - { id: "Supernatural, Major: Demonic Blood", label: "Supernatural, Major: Demonic Blood", value: 0 }
      - { id: "Supernatural, Major: Embitterment", label: "Supernatural, Major: Embitterment", value: 0 }
      - { id: "Supernatural, Major: Entrancement", label: "Supernatural, Major: Entrancement", value: 0 }
      - { id: "Supernatural, Major: Focus Power", label: "Supernatural, Major: Focus Power", value: 0 }
      - { id: "Supernatural, Major: Greater Benediction", label: "Supernatural, Major: Greater Benediction", value: 0 }
      - { id: "Supernatural, Major: Greater Immunity", label: "Supernatural, Major: Greater Immunity", value: 0 }
      - { id: "Supernatural, Major: Greater Power", label: "Supernatural, Major: Greater Power", value: 0 }
      - { id: "Supernatural, Major: Greater Purifying Touch", label: "Supernatural, Major: Greater Purifying Touch", value: 0 }
      - { id: "Supernatural, Major: Hex", label: "Supernatural, Major: Hex", value: 0 }
      - { id: "Supernatural, Major: Immune to Disease", label: "Supernatural, Major: Immune to Disease", value: 0 }
      - { id: "Supernatural, Major: Induction", label: "Supernatural, Major: Induction", value: 0 }
      - { id: "Supernatural, Major: Ritual Power", label: "Supernatural, Major: Ritual Power", value: 0 }
      - { id: "Supernatural, Major: Sense Passions", label: "Supernatural, Major: Sense Passions", value: 0 }
      - { id: "Supernatural, Major: Shapeshifter", label: "Supernatural, Major: Shapeshifter", value: 0 }
      - { id: "Supernatural, Major: Skinchanger (Dove)", label: "Supernatural, Major: Skinchanger (Dove)", value: 0 }
      - { id: "Supernatural, Major: Spiritual Pact", label: "Supernatural, Major: Spiritual Pact", value: 0 }
      - { id: "Supernatural, Major: Strong Faerie Blood", label: "Supernatural, Major: Strong Faerie Blood", value: 0 }
      - { id: "Supernatural, Major: Summon Animals", label: "Supernatural, Major: Summon Animals", value: 0 }
      - { id: "Supernatural, Major: Supernatural Beauty", label: "Supernatural, Major: Supernatural Beauty", value: 0 }
      - { id: "Supernatural, Major: Whistle Up The Wind", label: "Supernatural, Major: Whistle Up The Wind", value: 0 }
      - { id: "Supernatural, Minor: (Land) Regio Network", label: "Supernatural, Minor: (Land) Regio Network", value: 0 }
      - { id: "Supernatural, Minor: Amorphous", label: "Supernatural, Minor: Amorphous", value: 0 }
      - { id: "Supernatural, Minor: Animal Ken", label: "Supernatural, Minor: Animal Ken", value: 0 }
      - { id: "Supernatural, Minor: Crafter’s Healing", label: "Supernatural, Minor: Crafter’s Healing", value: 0 }
      - { id: "Supernatural, Minor: Demonic Might", label: "Supernatural, Minor: Demonic Might", value: 0 }
      - { id: "Supernatural, Minor: Demonic Powers", label: "Supernatural, Minor: Demonic Powers", value: 0 }
      - { id: "Supernatural, Minor: Dowsing", label: "Supernatural, Minor: Dowsing", value: 0 }
      - { id: "Supernatural, Minor: Dust Devil", label: "Supernatural, Minor: Dust Devil", value: 0 }
      - { id: "Supernatural, Minor: Enchanting (Ability)", label: "Supernatural, Minor: Enchanting (Ability)", value: 0 }
      - { id: "Supernatural, Minor: Eye of Hephaestus", label: "Supernatural, Minor: Eye of Hephaestus", value: 0 }
      - { id: "Supernatural, Minor: Fabric Ripper", label: "Supernatural, Minor: Fabric Ripper", value: 0 }
      - { id: "Supernatural, Minor: Familiarity with the Fae", label: "Supernatural, Minor: Familiarity with the Fae", value: 0 }
      - { id: "Supernatural, Minor: Feather Messenger", label: "Supernatural, Minor: Feather Messenger", value: 0 }
      - { id: "Supernatural, Minor: Font of Knowledge", label: "Supernatural, Minor: Font of Knowledge", value: 0 }
      - { id: "Supernatural, Minor: Frightful Presence", label: "Supernatural, Minor: Frightful Presence", value: 0 }
      - { id: "Supernatural, Minor: Gender Shift", label: "Supernatural, Minor: Gender Shift", value: 0 }
      - { id: "Supernatural, Minor: Homing Instinct", label: "Supernatural, Minor: Homing Instinct", value: 0 }
      - { id: "Supernatural, Minor: Immunity to Cold", label: "Supernatural, Minor: Immunity to Cold", value: 0 }
      - { id: "Supernatural, Minor: Infernal Heirloom", label: "Supernatural, Minor: Infernal Heirloom", value: 0 }
      - { id: "Supernatural, Minor: Kassalan Exorcism", label: "Supernatural, Minor: Kassalan Exorcism", value: 0 }
      - { id: "Supernatural, Minor: Leather Ripper", label: "Supernatural, Minor: Leather Ripper", value: 0 }
      - { id: "Supernatural, Minor: Lesser Benediction", label: "Supernatural, Minor: Lesser Benediction", value: 0 }
      - { id: "Supernatural, Minor: Lesser Immunity", label: "Supernatural, Minor: Lesser Immunity", value: 0 }
      - { id: "Supernatural, Minor: Lesser Power", label: "Supernatural, Minor: Lesser Power", value: 0 }
      - { id: "Supernatural, Minor: Lesser Purifying Touch", label: "Supernatural, Minor: Lesser Purifying Touch", value: 0 }
      - { id: "Supernatural, Minor: Magic Sensitivity", label: "Supernatural, Minor: Magic Sensitivity", value: 0 }
      - { id: "Supernatural, Minor: Magical Blood", label: "Supernatural, Minor: Magical Blood", value: 0 }
      - { id: "Supernatural, Minor: Maker of Textured Vessels", label: "Supernatural, Minor: Maker of Textured Vessels", value: 0 }
      - { id: "Supernatural, Minor: Maker of Water Vessels", label: "Supernatural, Minor: Maker of Water Vessels", value: 0 }
      - { id: "Supernatural, Minor: Master of (Form) Creatures", label: "Supernatural, Minor: Master of (Form) Creatures", value: 0 }
      - { id: "Supernatural, Minor: Muse", label: "Supernatural, Minor: Muse", value: 0 }
      - { id: "Supernatural, Minor: Persona", label: "Supernatural, Minor: Persona", value: 0 }
      - { id: "Supernatural, Minor: Personal Power", label: "Supernatural, Minor: Personal Power", value: 0 }
      - { id: "Supernatural, Minor: Premonitions", label: "Supernatural, Minor: Premonitions", value: 0 }
      - { id: "Supernatural, Minor: Ripper", label: "Supernatural, Minor: Ripper", value: 0 }
      - { id: "Supernatural, Minor: Second Sight", label: "Supernatural, Minor: Second Sight", value: 0 }
      - { id: "Supernatural, Minor: See in Darkness", label: "Supernatural, Minor: See in Darkness", value: 0 }
      - { id: "Supernatural, Minor: Sense Holiness and Unholiness", label: "Supernatural, Minor: Sense Holiness and Unholiness", value: 0 }
      - { id: "Supernatural, Minor: Skinchanger", label: "Supernatural, Minor: Skinchanger", value: 0 }
      - { id: "Supernatural, Minor: Strong Angelic Heritage", label: "Supernatural, Minor: Strong Angelic Heritage", value: 0 }
      - { id: "Supernatural, Minor: Sufi", label: "Supernatural, Minor: Sufi", value: 0 }
      - { id: "Supernatural, Minor: Unaging", label: "Supernatural, Minor: Unaging", value: 0 }
      - { id: "Supernatural, Minor: Unbound Tongue", label: "Supernatural, Minor: Unbound Tongue", value: 0 }
      - { id: "Supernatural, Minor: Variable Power", label: "Supernatural, Minor: Variable Power", value: 0 }
      - { id: "Supernatural, Minor: Voice of the (Land)", label: "Supernatural, Minor: Voice of the (Land)", value: 0 }
      - { id: "Supernatural, Minor: Wilderness Sense", label: "Supernatural, Minor: Wilderness Sense", value: 0 }
      - { id: "Supernatural, Minor: Wisdom from Ignorance", label: "Supernatural, Minor: Wisdom from Ignorance", value: 0 }
      - { id: "Supernatural, Free: Commanding Aura", label: "Supernatural, Free: Commanding Aura", value: 0 }
      - { id: "Social Status, Major: Archieunuch", label: "Social Status, Major: Archieunuch", value: 0 }
      - { id: "Social Status, Major: Capo", label: "Social Status, Major: Capo", value: 0 }
      - { id: "Social Status, Major: Cathedral School Master", label: "Social Status, Major: Cathedral School Master", value: 0 }
      - { id: "Social Status, Major: Doctor in (Faculty)", label: "Social Status, Major: Doctor in (Faculty)", value: 0 }
      - { id: "Social Status, Major: Guild Dean", label: "Social Status, Major: Guild Dean", value: 0 }
      - { id: "Social Status, Major: Landed Noble", label: "Social Status, Major: Landed Noble", value: 0 }
      - { id: "Social Status, Major: Lasiq", label: "Social Status, Major: Lasiq", value: 0 }
      - { id: "Social Status, Major: Magister in Artibus", label: "Social Status, Major: Magister in Artibus", value: 0 }
      - { id: "Social Status, Major: Magister in Medicina", label: "Social Status, Major: Magister in Medicina", value: 0 }
      - { id: "Social Status, Major: Master Bard", label: "Social Status, Major: Master Bard", value: 0 }
      - { id: "Social Status, Major: Muqta‘ (Muq-Ta‘)", label: "Social Status, Major: Muqta‘ (Muq-Ta‘)", value: 0 }
      - { id: "Social Status, Major: Partner", label: "Social Status, Major: Partner", value: 0 }
      - { id: "Social Status, Major: Redcap", label: "Social Status, Major: Redcap", value: 0 }
      - { id: "Social Status, Major: Rosh Beth Din", label: "Social Status, Major: Rosh Beth Din", value: 0 }
      - { id: "Social Status, Major: Senior Clergy", label: "Social Status, Major: Senior Clergy", value: 0 }
      - { id: "Social Status, Major: Senior Master", label: "Social Status, Major: Senior Master", value: 0 }
      - { id: "Social Status, Major: Templar Commander", label: "Social Status, Major: Templar Commander", value: 0 }
      - { id: "Social Status, Major: Venditor", label: "Social Status, Major: Venditor", value: 0 }
      - { id: "Social Status, Minor: Almogaten", label: "Social Status, Minor: Almogaten", value: 0 }
      - { id: "Social Status, Minor: Almogavar", label: "Social Status, Minor: Almogavar", value: 0 }
      - { id: "Social Status, Minor: Baccalaureus", label: "Social Status, Minor: Baccalaureus", value: 0 }
      - { id: "Social Status, Minor: Beadle", label: "Social Status, Minor: Beadle", value: 0 }
      - { id: "Social Status, Minor: Brother Chaplain", label: "Social Status, Minor: Brother Chaplain", value: 0 }
      - { id: "Social Status, Minor: Brother Knight", label: "Social Status, Minor: Brother Knight", value: 0 }
      - { id: "Social Status, Minor: Brother Sergeant", label: "Social Status, Minor: Brother Sergeant", value: 0 }
      - { id: "Social Status, Minor: Bureaucrat", label: "Social Status, Minor: Bureaucrat", value: 0 }
      - { id: "Social Status, Minor: Clerk", label: "Social Status, Minor: Clerk", value: 0 }
      - { id: "Social Status, Minor: Custos", label: "Social Status, Minor: Custos", value: 0 }
      - { id: "Social Status, Minor: Emir", label: "Social Status, Minor: Emir", value: 0 }
      - { id: "Social Status, Minor: Eunuch", label: "Social Status, Minor: Eunuch", value: 0 }
      - { id: "Social Status, Minor: Factor", label: "Social Status, Minor: Factor", value: 0 }
      - { id: "Social Status, Minor: Failed Apprentice", label: "Social Status, Minor: Failed Apprentice", value: 0 }
      - { id: "Social Status, Minor: Falconer", label: "Social Status, Minor: Falconer", value: 0 }
      - { id: "Social Status, Minor: Fida’i", label: "Social Status, Minor: Fida’i", value: 0 }
      - { id: "Social Status, Minor: Forge-Companion", label: "Social Status, Minor: Forge-Companion", value: 0 }
      - { id: "Social Status, Minor: Gentleman/woman", label: "Social Status, Minor: Gentleman/woman", value: 0 }
      - { id: "Social Status, Minor: Guild Apprentice", label: "Social Status, Minor: Guild Apprentice", value: 0 }
      - { id: "Social Status, Minor: Guild Master", label: "Social Status, Minor: Guild Master", value: 0 }
      - { id: "Social Status, Minor: Ineslemen", label: "Social Status, Minor: Ineslemen", value: 0 }
      - { id: "Social Status, Minor: Journeyman", label: "Social Status, Minor: Journeyman", value: 0 }
      - { id: "Social Status, Minor: Jurist", label: "Social Status, Minor: Jurist", value: 0 }
      - { id: "Social Status, Minor: Knight", label: "Social Status, Minor: Knight", value: 0 }
      - { id: "Social Status, Minor: Lone Redcap", label: "Social Status, Minor: Lone Redcap", value: 0 }
      - { id: "Social Status, Minor: Mamluk", label: "Social Status, Minor: Mamluk", value: 0 }
      - { id: "Social Status, Minor: Marshal", label: "Social Status, Minor: Marshal", value: 0 }
      - { id: "Social Status, Minor: Master of Kennels", label: "Social Status, Minor: Master of Kennels", value: 0 }
      - { id: "Social Status, Minor: Mazdean Priest", label: "Social Status, Minor: Mazdean Priest", value: 0 }
      - { id: "Social Status, Minor: Mendicant Friar", label: "Social Status, Minor: Mendicant Friar", value: 0 }
      - { id: "Social Status, Minor: Mercenary Captain", label: "Social Status, Minor: Mercenary Captain", value: 0 }
      - { id: "Social Status, Minor: Merchant Adventurer", label: "Social Status, Minor: Merchant Adventurer", value: 0 }
      - { id: "Social Status, Minor: Notary", label: "Social Status, Minor: Notary", value: 0 }
      - { id: "Social Status, Minor: Perfectus", label: "Social Status, Minor: Perfectus", value: 0 }
      - { id: "Social Status, Minor: Priest", label: "Social Status, Minor: Priest", value: 0 }
      - { id: "Social Status, Minor: Rabbi", label: "Social Status, Minor: Rabbi", value: 0 }
      - { id: "Social Status, Minor: Religious", label: "Social Status, Minor: Religious", value: 0 }
      - { id: "Social Status, Minor: Senior Bard", label: "Social Status, Minor: Senior Bard", value: 0 }
      - { id: "Social Status, Minor: Shadchan", label: "Social Status, Minor: Shadchan", value: 0 }
      - { id: "Social Status, Minor: Simple Student", label: "Social Status, Minor: Simple Student", value: 0 }
      - { id: "Social Status, Minor: Sufi", label: "Social Status, Minor: Sufi", value: 0 }
      - { id: "Social Status, Minor: Templar Administrator", label: "Social Status, Minor: Templar Administrator", value: 0 }
      - { id: "Social Status, Minor: Templar Office Holder", label: "Social Status, Minor: Templar Office Holder", value: 0 }
      - { id: "Social Status, Minor: Templar Specialist", label: "Social Status, Minor: Templar Specialist", value: 0 }
      - { id: "Social Status, Minor: Town Magistrate", label: "Social Status, Minor: Town Magistrate", value: 0 }
      - { id: "Social Status, Minor: Troubadour/Trobairitz", label: "Social Status, Minor: Troubadour/Trobairitz", value: 0 }
      - { id: "Social Status, Minor: University Grammar Teacher", label: "Social Status, Minor: University Grammar Teacher", value: 0 }
      - { id: "Social Status, Minor: Wise One", label: "Social Status, Minor: Wise One", value: 0 }
      - { id: "Social Status, Minor: ’Alim", label: "Social Status, Minor: ’Alim", value: 0 }
      - { id: "Social Status, Free: Apprentice", label: "Social Status, Free: Apprentice", value: 0 }
      - { id: "Social Status, Free: Bard", label: "Social Status, Free: Bard", value: 0 }
      - { id: "Social Status, Free: Covenfolk", label: "Social Status, Free: Covenfolk", value: 0 }
      - { id: "Social Status, Free: Craftsman", label: "Social Status, Free: Craftsman", value: 0 }
      - { id: "Social Status, Free: Domestic Animal", label: "Social Status, Free: Domestic Animal", value: 0 }
      - { id: "Social Status, Free: Hermetic Magus", label: "Social Status, Free: Hermetic Magus", value: 0 }
      - { id: "Social Status, Free: Laborer", label: "Social Status, Free: Laborer", value: 0 }
      - { id: "Social Status, Free: Male Guild Sponsor", label: "Social Status, Free: Male Guild Sponsor", value: 0 }
      - { id: "Social Status, Free: Merchant", label: "Social Status, Free: Merchant", value: 0 }
      - { id: "Social Status, Free: Nuntius", label: "Social Status, Free: Nuntius", value: 0 }
      - { id: "Social Status, Free: Paid Rights", label: "Social Status, Free: Paid Rights", value: 0 }
      - { id: "Social Status, Free: Peasant", label: "Social Status, Free: Peasant", value: 0 }
      - { id: "Social Status, Free: Shamash", label: "Social Status, Free: Shamash", value: 0 }
      - { id: "Social Status, Free: Sofer", label: "Social Status, Free: Sofer", value: 0 }
      - { id: "Social Status, Free: Templar Confrere/Consoeur", label: "Social Status, Free: Templar Confrere/Consoeur", value: 0 }
      - { id: "Social Status, Free: Templar Servant", label: "Social Status, Free: Templar Servant", value: 0 }
      - { id: "Social Status, Free: Wanderer", label: "Social Status, Free: Wanderer", value: 0 }
      - { id: "General, Major: Death Prophecy", label: "General, Major: Death Prophecy", value: 0 }
      - { id: "General, Major: Ghostly Warder", label: "General, Major: Ghostly Warder", value: 0 }
      - { id: "General, Major: Giant Blood", label: "General, Major: Giant Blood", value: 0 }
      - { id: "General, Major: Guardian Angel", label: "General, Major: Guardian Angel", value: 0 }
      - { id: "General, Major: License of Absence", label: "General, Major: License of Absence", value: 0 }
      - { id: "General, Major: Magian Lineage", label: "General, Major: Magian Lineage", value: 0 }
      - { id: "General, Major: Magical Warder", label: "General, Major: Magical Warder", value: 0 }
      - { id: "General, Major: Powerful Relic", label: "General, Major: Powerful Relic", value: 0 }
      - { id: "General, Major: True Faith", label: "General, Major: True Faith", value: 0 }
      - { id: "General, Major: Ways Of The (Land)", label: "General, Major: Ways Of The (Land)", value: 0 }
      - { id: "General, Major: Wealthy", label: "General, Major: Wealthy", value: 0 }
      - { id: "General, Minor: Academic Concentration (Subject)", label: "General, Minor: Academic Concentration (Subject)", value: 0 }
      - { id: "General, Minor: Affinity with Ability", label: "General, Minor: Affinity with Ability", value: 0 }
      - { id: "General, Minor: All According to Plan", label: "General, Minor: All According to Plan", value: 0 }
      - { id: "General, Minor: Alluring to (Beings)", label: "General, Minor: Alluring to (Beings)", value: 0 }
      - { id: "General, Minor: Apt Student", label: "General, Minor: Apt Student", value: 0 }
      - { id: "General, Minor: Aptitude for (Sin)", label: "General, Minor: Aptitude for (Sin)", value: 0 }
      - { id: "General, Minor: Arcane Lore", label: "General, Minor: Arcane Lore", value: 0 }
      - { id: "General, Minor: Aristotelian Training", label: "General, Minor: Aristotelian Training", value: 0 }
      - { id: "General, Minor: Berserk", label: "General, Minor: Berserk", value: 0 }
      - { id: "General, Minor: Book Learner", label: "General, Minor: Book Learner", value: 0 }
      - { id: "General, Minor: Cautious with (Ability)", label: "General, Minor: Cautious with (Ability)", value: 0 }
      - { id: "General, Minor: Clear Thinker", label: "General, Minor: Clear Thinker", value: 0 }
      - { id: "General, Minor: Common Sense", label: "General, Minor: Common Sense", value: 0 }
      - { id: "General, Minor: Convoluted Mind", label: "General, Minor: Convoluted Mind", value: 0 }
      - { id: "General, Minor: Craft Guild Training", label: "General, Minor: Craft Guild Training", value: 0 }
      - { id: "General, Minor: Educated", label: "General, Minor: Educated", value: 0 }
      - { id: "General, Minor: Educated (Bardic)", label: "General, Minor: Educated (Bardic)", value: 0 }
      - { id: "General, Minor: Educated (Hebrew)", label: "General, Minor: Educated (Hebrew)", value: 0 }
      - { id: "General, Minor: Educated (Islamic)", label: "General, Minor: Educated (Islamic)", value: 0 }
      - { id: "General, Minor: Educated (Vernacular)", label: "General, Minor: Educated (Vernacular)", value: 0 }
      - { id: "General, Minor: Enduring Constitution", label: "General, Minor: Enduring Constitution", value: 0 }
      - { id: "General, Minor: Enticer of Multitudes", label: "General, Minor: Enticer of Multitudes", value: 0 }
      - { id: "General, Minor: Faerie Blood", label: "General, Minor: Faerie Blood", value: 0 }
      - { id: "General, Minor: Falls Like a Cat", label: "General, Minor: Falls Like a Cat", value: 0 }
      - { id: "General, Minor: Famous", label: "General, Minor: Famous", value: 0 }
      - { id: "General, Minor: Ferocity", label: "General, Minor: Ferocity", value: 0 }
      - { id: "General, Minor: Finding Hidden Loot", label: "General, Minor: Finding Hidden Loot", value: 0 }
      - { id: "General, Minor: Forgettable Face", label: "General, Minor: Forgettable Face", value: 0 }
      - { id: "General, Minor: Free Expression", label: "General, Minor: Free Expression", value: 0 }
      - { id: "General, Minor: Good Teacher", label: "General, Minor: Good Teacher", value: 0 }
      - { id: "General, Minor: Gossip", label: "General, Minor: Gossip", value: 0 }
      - { id: "General, Minor: Great (Characteristic)", label: "General, Minor: Great (Characteristic)", value: 0 }
      - { id: "General, Minor: Hermetic Experience", label: "General, Minor: Hermetic Experience", value: 0 }
      - { id: "General, Minor: Improved Characteristics", label: "General, Minor: Improved Characteristics", value: 0 }
      - { id: "General, Minor: Independent Study", label: "General, Minor: Independent Study", value: 0 }
      - { id: "General, Minor: Indescribable Face", label: "General, Minor: Indescribable Face", value: 0 }
      - { id: "General, Minor: Inoffensive to (Beings)", label: "General, Minor: Inoffensive to (Beings)", value: 0 }
      - { id: "General, Minor: Inspirational", label: "General, Minor: Inspirational", value: 0 }
      - { id: "General, Minor: Intuition", label: "General, Minor: Intuition", value: 0 }
      - { id: "General, Minor: Jack-of-All-Trades", label: "General, Minor: Jack-of-All-Trades", value: 0 }
      - { id: "General, Minor: Just an Instant", label: "General, Minor: Just an Instant", value: 0 }
      - { id: "General, Minor: Keen Sense of Smell", label: "General, Minor: Keen Sense of Smell", value: 0 }
      - { id: "General, Minor: Keen Vision", label: "General, Minor: Keen Vision", value: 0 }
      - { id: "General, Minor: Knows People", label: "General, Minor: Knows People", value: 0 }
      - { id: "General, Minor: Large", label: "General, Minor: Large", value: 0 }
      - { id: "General, Minor: Latent Magic Ability", label: "General, Minor: Latent Magic Ability", value: 0 }
      - { id: "General, Minor: Learn (Ability) From Mistakes", label: "General, Minor: Learn (Ability) From Mistakes", value: 0 }
      - { id: "General, Minor: Light Touch", label: "General, Minor: Light Touch", value: 0 }
      - { id: "General, Minor: Lightning Reflexes", label: "General, Minor: Lightning Reflexes", value: 0 }
      - { id: "General, Minor: Linguist", label: "General, Minor: Linguist", value: 0 }
      - { id: "General, Minor: Long-Winded", label: "General, Minor: Long-Winded", value: 0 }
      - { id: "General, Minor: Luck", label: "General, Minor: Luck", value: 0 }
      - { id: "General, Minor: Magian Lineage", label: "General, Minor: Magian Lineage", value: 0 }
      - { id: "General, Minor: Magic Items", label: "General, Minor: Magic Items", value: 0 }
      - { id: "General, Minor: Magical Mount", label: "General, Minor: Magical Mount", value: 0 }
      - { id: "General, Minor: Mentored by Demons", label: "General, Minor: Mentored by Demons", value: 0 }
      - { id: "General, Minor: Mild Aging", label: "General, Minor: Mild Aging", value: 0 }
      - { id: "General, Minor: Natural Leader", label: "General, Minor: Natural Leader", value: 0 }
      - { id: "General, Minor: Perfect Balance", label: "General, Minor: Perfect Balance", value: 0 }
      - { id: "General, Minor: Perfect Eye for (Commodity)", label: "General, Minor: Perfect Eye for (Commodity)", value: 0 }
      - { id: "General, Minor: Physician of Salerno", label: "General, Minor: Physician of Salerno", value: 0 }
      - { id: "General, Minor: Piercing Gaze", label: "General, Minor: Piercing Gaze", value: 0 }
      - { id: "General, Minor: Prestigious Student", label: "General, Minor: Prestigious Student", value: 0 }
      - { id: "General, Minor: Privileged Upbringing", label: "General, Minor: Privileged Upbringing", value: 0 }
      - { id: "General, Minor: Protection", label: "General, Minor: Protection", value: 0 }
      - { id: "General, Minor: Puissant Ability", label: "General, Minor: Puissant Ability", value: 0 }
      - { id: "General, Minor: Rapid Convalescence", label: "General, Minor: Rapid Convalescence", value: 0 }
      - { id: "General, Minor: Rat Up a Drainpipe", label: "General, Minor: Rat Up a Drainpipe", value: 0 }
      - { id: "General, Minor: Relic", label: "General, Minor: Relic", value: 0 }
      - { id: "General, Minor: Reserves of Strength", label: "General, Minor: Reserves of Strength", value: 0 }
      - { id: "General, Minor: Schooled in Crime", label: "General, Minor: Schooled in Crime", value: 0 }
      - { id: "General, Minor: Self-Confident", label: "General, Minor: Self-Confident", value: 0 }
      - { id: "General, Minor: Sharp Ears", label: "General, Minor: Sharp Ears", value: 0 }
      - { id: "General, Minor: Skilled Smuggler", label: "General, Minor: Skilled Smuggler", value: 0 }
      - { id: "General, Minor: Social Contacts", label: "General, Minor: Social Contacts", value: 0 }
      - { id: "General, Minor: Strong-Willed", label: "General, Minor: Strong-Willed", value: 0 }
      - { id: "General, Minor: Student of (Realm)", label: "General, Minor: Student of (Realm)", value: 0 }
      - { id: "General, Minor: Tainted Treasure", label: "General, Minor: Tainted Treasure", value: 0 }
      - { id: "General, Minor: Templar Prestige", label: "General, Minor: Templar Prestige", value: 0 }
      - { id: "General, Minor: Temporal Influence", label: "General, Minor: Temporal Influence", value: 0 }
      - { id: "General, Minor: Tough", label: "General, Minor: Tough", value: 0 }
      - { id: "General, Minor: Trained Assassin", label: "General, Minor: Trained Assassin", value: 0 }
      - { id: "General, Minor: Troupe Upbringing", label: "General, Minor: Troupe Upbringing", value: 0 }
      - { id: "General, Minor: True Love (PC)", label: "General, Minor: True Love (PC)", value: 0 }
      - { id: "General, Minor: Unaffected by The Gift", label: "General, Minor: Unaffected by The Gift", value: 0 }
      - { id: "General, Minor: Venus’ Blessing", label: "General, Minor: Venus’ Blessing", value: 0 }
      - { id: "General, Minor: Warrior", label: "General, Minor: Warrior", value: 0 }
      - { id: "General, Minor: Well-Traveled", label: "General, Minor: Well-Traveled", value: 0 }
      - { id: "Mythic Companion, Free: Devil Child", label: "Mythic Companion, Free: Devil Child", value: 0 }
      - { id: "Mythic Companion, Free: Faerie Doctor", label: "Mythic Companion, Free: Faerie Doctor", value: 0 }
      - { id: "Mythic Companion, Free: Nephilim", label: "Mythic Companion, Free: Nephilim", value: 0 }
      - { id: "Mythic Companion, Free: Spirit Votary", label: "Mythic Companion, Free: Spirit Votary", value: 0 }

  - id: ArsFlawCatalog
    label: "Flaw Catalog"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - { id: "Hermetic, Major: Blatant Gift", label: "Hermetic, Major: Blatant Gift", value: 0 }
      - { id: "Hermetic, Major: Chaotic Magic", label: "Hermetic, Major: Chaotic Magic", value: 0 }
      - { id: "Hermetic, Major: Deficient Technique", label: "Hermetic, Major: Deficient Technique", value: 0 }
      - { id: "Hermetic, Major: Difficult Longevity Ritual", label: "Hermetic, Major: Difficult Longevity Ritual", value: 0 }
      - { id: "Hermetic, Major: Environmental Magic Condition", label: "Hermetic, Major: Environmental Magic Condition", value: 0 }
      - { id: "Hermetic, Major: Magic Addiction", label: "Hermetic, Major: Magic Addiction", value: 0 }
      - { id: "Hermetic, Major: Monastic Vows (Hermetic)", label: "Hermetic, Major: Monastic Vows (Hermetic)", value: 0 }
      - { id: "Hermetic, Major: Necessary Condition", label: "Hermetic, Major: Necessary Condition", value: 0 }
      - { id: "Hermetic, Major: Painful Magic", label: "Hermetic, Major: Painful Magic", value: 0 }
      - { id: "Hermetic, Major: Restriction", label: "Hermetic, Major: Restriction", value: 0 }
      - { id: "Hermetic, Major: Rigid Magic", label: "Hermetic, Major: Rigid Magic", value: 0 }
      - { id: "Hermetic, Major: Short-Ranged Magic", label: "Hermetic, Major: Short-Ranged Magic", value: 0 }
      - { id: "Hermetic, Major: Study Requirement", label: "Hermetic, Major: Study Requirement", value: 0 }
      - { id: "Hermetic, Major: Suppressed Gift", label: "Hermetic, Major: Suppressed Gift", value: 0 }
      - { id: "Hermetic, Major: The Constant Expression", label: "Hermetic, Major: The Constant Expression", value: 0 }
      - { id: "Hermetic, Major: Twilight Prone", label: "Hermetic, Major: Twilight Prone", value: 0 }
      - { id: "Hermetic, Major: Unnatural Magic", label: "Hermetic, Major: Unnatural Magic", value: 0 }
      - { id: "Hermetic, Major: Unstructured Caster", label: "Hermetic, Major: Unstructured Caster", value: 0 }
      - { id: "Hermetic, Major: Vulnerable Magic", label: "Hermetic, Major: Vulnerable Magic", value: 0 }
      - { id: "Hermetic, Major: Waster of Vis", label: "Hermetic, Major: Waster of Vis", value: 0 }
      - { id: "Hermetic, Major: Weak Magic Resistance", label: "Hermetic, Major: Weak Magic Resistance", value: 0 }
      - { id: "Hermetic, Major: Weak Spontaneous Magic", label: "Hermetic, Major: Weak Spontaneous Magic", value: 0 }
      - { id: "Hermetic, Minor: Bound Casting Tools", label: "Hermetic, Minor: Bound Casting Tools", value: 0 }
      - { id: "Hermetic, Minor: Bound Magic", label: "Hermetic, Minor: Bound Magic", value: 0 }
      - { id: "Hermetic, Minor: Brutal Artist", label: "Hermetic, Minor: Brutal Artist", value: 0 }
      - { id: "Hermetic, Minor: Careless Sorcerer", label: "Hermetic, Minor: Careless Sorcerer", value: 0 }
      - { id: "Hermetic, Minor: Ceremonial Spontaneous Magic", label: "Hermetic, Minor: Ceremonial Spontaneous Magic", value: 0 }
      - { id: "Hermetic, Minor: Clumsy Magic", label: "Hermetic, Minor: Clumsy Magic", value: 0 }
      - { id: "Hermetic, Minor: Consumed Casting Tools", label: "Hermetic, Minor: Consumed Casting Tools", value: 0 }
      - { id: "Hermetic, Minor: Corrupted Arts", label: "Hermetic, Minor: Corrupted Arts", value: 0 }
      - { id: "Hermetic, Minor: Corrupted Spells", label: "Hermetic, Minor: Corrupted Spells", value: 0 }
      - { id: "Hermetic, Minor: Creative Block", label: "Hermetic, Minor: Creative Block", value: 0 }
      - { id: "Hermetic, Minor: Cyclic Magic (negative)", label: "Hermetic, Minor: Cyclic Magic (negative)", value: 0 }
      - { id: "Hermetic, Minor: Deficient Form", label: "Hermetic, Minor: Deficient Form", value: 0 }
      - { id: "Hermetic, Minor: Deleterious Circumstances", label: "Hermetic, Minor: Deleterious Circumstances", value: 0 }
      - { id: "Hermetic, Minor: Difficult Spontaneous Magic", label: "Hermetic, Minor: Difficult Spontaneous Magic", value: 0 }
      - { id: "Hermetic, Minor: Disjointed Magic", label: "Hermetic, Minor: Disjointed Magic", value: 0 }
      - { id: "Hermetic, Minor: Disorientating Magic", label: "Hermetic, Minor: Disorientating Magic", value: 0 }
      - { id: "Hermetic, Minor: Exciting Experimentation", label: "Hermetic, Minor: Exciting Experimentation", value: 0 }
      - { id: "Hermetic, Minor: Fettered Magic", label: "Hermetic, Minor: Fettered Magic", value: 0 }
      - { id: "Hermetic, Minor: Flawed Parma Magica", label: "Hermetic, Minor: Flawed Parma Magica", value: 0 }
      - { id: "Hermetic, Minor: Harmless Magic", label: "Hermetic, Minor: Harmless Magic", value: 0 }
      - { id: "Hermetic, Minor: Hedge Wizard", label: "Hermetic, Minor: Hedge Wizard", value: 0 }
      - { id: "Hermetic, Minor: Incompatible Arts", label: "Hermetic, Minor: Incompatible Arts", value: 0 }
      - { id: "Hermetic, Minor: Inconstant Magic", label: "Hermetic, Minor: Inconstant Magic", value: 0 }
      - { id: "Hermetic, Minor: Infamous Master", label: "Hermetic, Minor: Infamous Master", value: 0 }
      - { id: "Hermetic, Minor: Limited Magic Resistance", label: "Hermetic, Minor: Limited Magic Resistance", value: 0 }
      - { id: "Hermetic, Minor: Loose Magic", label: "Hermetic, Minor: Loose Magic", value: 0 }
      - { id: "Hermetic, Minor: Offensive to (Beings)", label: "Hermetic, Minor: Offensive to (Beings)", value: 0 }
      - { id: "Hermetic, Minor: Poor Formulaic Magic", label: "Hermetic, Minor: Poor Formulaic Magic", value: 0 }
      - { id: "Hermetic, Minor: Primogeniture Lineage", label: "Hermetic, Minor: Primogeniture Lineage", value: 0 }
      - { id: "Hermetic, Minor: Short-Lived Magic", label: "Hermetic, Minor: Short-Lived Magic", value: 0 }
      - { id: "Hermetic, Minor: Slow Caster", label: "Hermetic, Minor: Slow Caster", value: 0 }
      - { id: "Hermetic, Minor: Spontaneous Casting Tools", label: "Hermetic, Minor: Spontaneous Casting Tools", value: 0 }
      - { id: "Hermetic, Minor: Stockade Parma Magica", label: "Hermetic, Minor: Stockade Parma Magica", value: 0 }
      - { id: "Hermetic, Minor: Susceptibility to Divine Power", label: "Hermetic, Minor: Susceptibility to Divine Power", value: 0 }
      - { id: "Hermetic, Minor: Susceptibility to Faerie Power", label: "Hermetic, Minor: Susceptibility to Faerie Power", value: 0 }
      - { id: "Hermetic, Minor: Susceptibility to Infernal Power", label: "Hermetic, Minor: Susceptibility to Infernal Power", value: 0 }
      - { id: "Hermetic, Minor: Unbearable to (Beings)", label: "Hermetic, Minor: Unbearable to (Beings)", value: 0 }
      - { id: "Hermetic, Minor: Unimaginative Learner", label: "Hermetic, Minor: Unimaginative Learner", value: 0 }
      - { id: "Hermetic, Minor: Unpredictable Magic", label: "Hermetic, Minor: Unpredictable Magic", value: 0 }
      - { id: "Hermetic, Minor: Vulnerable Casting", label: "Hermetic, Minor: Vulnerable Casting", value: 0 }
      - { id: "Hermetic, Minor: Warped Magic", label: "Hermetic, Minor: Warped Magic", value: 0 }
      - { id: "Hermetic, Minor: Weak Enchanter", label: "Hermetic, Minor: Weak Enchanter", value: 0 }
      - { id: "Hermetic, Minor: Weak Magic", label: "Hermetic, Minor: Weak Magic", value: 0 }
      - { id: "Hermetic, Minor: Weak Parens", label: "Hermetic, Minor: Weak Parens", value: 0 }
      - { id: "Hermetic, Minor: Weak Scholar", label: "Hermetic, Minor: Weak Scholar", value: 0 }
      - { id: "Hermetic, Minor: Weird Magic", label: "Hermetic, Minor: Weird Magic", value: 0 }
      - { id: "Personality, Major or Minor: Ambitious", label: "Personality, Major or Minor: Ambitious", value: 0 }
      - { id: "Personality, Major or Minor: Avaricious", label: "Personality, Major or Minor: Avaricious", value: 0 }
      - { id: "Personality, Major or Minor: Compassionate", label: "Personality, Major or Minor: Compassionate", value: 0 }
      - { id: "Personality, Major or Minor: Compulsion", label: "Personality, Major or Minor: Compulsion", value: 0 }
      - { id: "Personality, Major or Minor: Compulsive Lying", label: "Personality, Major or Minor: Compulsive Lying", value: 0 }
      - { id: "Personality, Major or Minor: Depraved", label: "Personality, Major or Minor: Depraved", value: 0 }
      - { id: "Personality, Major or Minor: Driven", label: "Personality, Major or Minor: Driven", value: 0 }
      - { id: "Personality, Major or Minor: Envious", label: "Personality, Major or Minor: Envious", value: 0 }
      - { id: "Personality, Major or Minor: Gender Nonconforming", label: "Personality, Major or Minor: Gender Nonconforming", value: 0 }
      - { id: "Personality, Major or Minor: Generous", label: "Personality, Major or Minor: Generous", value: 0 }
      - { id: "Personality, Major or Minor: Greedy", label: "Personality, Major or Minor: Greedy", value: 0 }
      - { id: "Personality, Major or Minor: Hatred", label: "Personality, Major or Minor: Hatred", value: 0 }
      - { id: "Personality, Major or Minor: Higher Purpose", label: "Personality, Major or Minor: Higher Purpose", value: 0 }
      - { id: "Personality, Major or Minor: Lecherous", label: "Personality, Major or Minor: Lecherous", value: 0 }
      - { id: "Personality, Major or Minor: Meddler", label: "Personality, Major or Minor: Meddler", value: 0 }
      - { id: "Personality, Major or Minor: Obsessed", label: "Personality, Major or Minor: Obsessed", value: 0 }
      - { id: "Personality, Major or Minor: Optimistic", label: "Personality, Major or Minor: Optimistic", value: 0 }
      - { id: "Personality, Major or Minor: Overconfident", label: "Personality, Major or Minor: Overconfident", value: 0 }
      - { id: "Personality, Major or Minor: Oversensitive", label: "Personality, Major or Minor: Oversensitive", value: 0 }
      - { id: "Personality, Major or Minor: Pagan", label: "Personality, Major or Minor: Pagan", value: 0 }
      - { id: "Personality, Major or Minor: Pious", label: "Personality, Major or Minor: Pious", value: 0 }
      - { id: "Personality, Major or Minor: Proud", label: "Personality, Major or Minor: Proud", value: 0 }
      - { id: "Personality, Major or Minor: Rebellious", label: "Personality, Major or Minor: Rebellious", value: 0 }
      - { id: "Personality, Major or Minor: Reckless", label: "Personality, Major or Minor: Reckless", value: 0 }
      - { id: "Personality, Major or Minor: Vow", label: "Personality, Major or Minor: Vow", value: 0 }
      - { id: "Personality, Major or Minor: Weakness", label: "Personality, Major or Minor: Weakness", value: 0 }
      - { id: "Personality, Major or Minor: Wrathful", label: "Personality, Major or Minor: Wrathful", value: 0 }
      - { id: "Personality, Minor: Busybody", label: "Personality, Minor: Busybody", value: 0 }
      - { id: "Personality, Minor: Carefree", label: "Personality, Minor: Carefree", value: 0 }
      - { id: "Personality, Minor: Church Upbringing", label: "Personality, Minor: Church Upbringing", value: 0 }
      - { id: "Personality, Minor: Continence", label: "Personality, Minor: Continence", value: 0 }
      - { id: "Personality, Minor: Covenant Upbringing", label: "Personality, Minor: Covenant Upbringing", value: 0 }
      - { id: "Personality, Minor: Delusion", label: "Personality, Minor: Delusion", value: 0 }
      - { id: "Personality, Minor: Depressed", label: "Personality, Minor: Depressed", value: 0 }
      - { id: "Personality, Minor: Dutybound", label: "Personality, Minor: Dutybound", value: 0 }
      - { id: "Personality, Minor: Faerie Upbringing", label: "Personality, Minor: Faerie Upbringing", value: 0 }
      - { id: "Personality, Minor: Fear", label: "Personality, Minor: Fear", value: 0 }
      - { id: "Personality, Minor: Fickle Nature", label: "Personality, Minor: Fickle Nature", value: 0 }
      - { id: "Personality, Minor: Follower", label: "Personality, Minor: Follower", value: 0 }
      - { id: "Personality, Minor: Foreign Upbringing", label: "Personality, Minor: Foreign Upbringing", value: 0 }
      - { id: "Personality, Minor: Grudge", label: "Personality, Minor: Grudge", value: 0 }
      - { id: "Personality, Minor: Humble", label: "Personality, Minor: Humble", value: 0 }
      - { id: "Personality, Minor: Imagined Folk Tradition Vulnerability", label: "Personality, Minor: Imagined Folk Tradition Vulnerability", value: 0 }
      - { id: "Personality, Minor: Lost Love", label: "Personality, Minor: Lost Love", value: 0 }
      - { id: "Personality, Minor: Magical Fascination", label: "Personality, Minor: Magical Fascination", value: 0 }
      - { id: "Personality, Minor: Noncombatant", label: "Personality, Minor: Noncombatant", value: 0 }
      - { id: "Personality, Minor: Pessimistic", label: "Personality, Minor: Pessimistic", value: 0 }
      - { id: "Personality, Minor: Poor Memory", label: "Personality, Minor: Poor Memory", value: 0 }
      - { id: "Personality, Minor: Reclusive", label: "Personality, Minor: Reclusive", value: 0 }
      - { id: "Personality, Minor: Secretive", label: "Personality, Minor: Secretive", value: 0 }
      - { id: "Personality, Minor: Seeker", label: "Personality, Minor: Seeker", value: 0 }
      - { id: "Personality, Minor: Sheltered Upbringing", label: "Personality, Minor: Sheltered Upbringing", value: 0 }
      - { id: "Personality, Minor: Short Attention Span", label: "Personality, Minor: Short Attention Span", value: 0 }
      - { id: "Personality, Minor: Simple-Minded", label: "Personality, Minor: Simple-Minded", value: 0 }
      - { id: "Personality, Minor: Slothful", label: "Personality, Minor: Slothful", value: 0 }
      - { id: "Personality, Minor: Soft-Hearted", label: "Personality, Minor: Soft-Hearted", value: 0 }
      - { id: "Personality, Minor: Temperate", label: "Personality, Minor: Temperate", value: 0 }
      - { id: "Personality, Minor: Weak-Willed", label: "Personality, Minor: Weak-Willed", value: 0 }
      - { id: "Story, Major: A Deal with the Devil", label: "Story, Major: A Deal with the Devil", value: 0 }
      - { id: "Story, Major: Abandoned Apprentice", label: "Story, Major: Abandoned Apprentice", value: 0 }
      - { id: "Story, Major: Beloved Rival", label: "Story, Major: Beloved Rival", value: 0 }
      - { id: "Story, Major: Bigamist", label: "Story, Major: Bigamist", value: 0 }
      - { id: "Story, Major: Black Sheep", label: "Story, Major: Black Sheep", value: 0 }
      - { id: "Story, Major: Curse of Venus", label: "Story, Major: Curse of Venus", value: 0 }
      - { id: "Story, Major: Dark Secret", label: "Story, Major: Dark Secret", value: 0 }
      - { id: "Story, Major: Dependent", label: "Story, Major: Dependent", value: 0 }
      - { id: "Story, Major: Diabolic Past", label: "Story, Major: Diabolic Past", value: 0 }
      - { id: "Story, Major: Difficult Underlings", label: "Story, Major: Difficult Underlings", value: 0 }
      - { id: "Story, Major: Enemies", label: "Story, Major: Enemies", value: 0 }
      - { id: "Story, Major: Envied Beauty", label: "Story, Major: Envied Beauty", value: 0 }
      - { id: "Story, Major: Evil Destiny", label: "Story, Major: Evil Destiny", value: 0 }
      - { id: "Story, Major: Excommunicate", label: "Story, Major: Excommunicate", value: 0 }
      - { id: "Story, Major: Favors", label: "Story, Major: Favors", value: 0 }
      - { id: "Story, Major: Feud", label: "Story, Major: Feud", value: 0 }
      - { id: "Story, Major: Fury", label: "Story, Major: Fury", value: 0 }
      - { id: "Story, Major: Indiscreet", label: "Story, Major: Indiscreet", value: 0 }
      - { id: "Story, Major: Many Marriageable Daughters", label: "Story, Major: Many Marriageable Daughters", value: 0 }
      - { id: "Story, Major: Mistaken Identity", label: "Story, Major: Mistaken Identity", value: 0 }
      - { id: "Story, Major: Monastic Vows", label: "Story, Major: Monastic Vows", value: 0 }
      - { id: "Story, Major: Oath of Fealty", label: "Story, Major: Oath of Fealty", value: 0 }
      - { id: "Story, Major: Plagued by Supernatural Entity", label: "Story, Major: Plagued by Supernatural Entity", value: 0 }
      - { id: "Story, Major: Raised from the Dead", label: "Story, Major: Raised from the Dead", value: 0 }
      - { id: "Story, Major: Rector/Proctor", label: "Story, Major: Rector/Proctor", value: 0 }
      - { id: "Story, Major: Servant of the (Land)", label: "Story, Major: Servant of the (Land)", value: 0 }
      - { id: "Story, Major: Supernatural Nuisance", label: "Story, Major: Supernatural Nuisance", value: 0 }
      - { id: "Story, Major: Suppressed Gift", label: "Story, Major: Suppressed Gift", value: 0 }
      - { id: "Story, Major: Tainted Offspring", label: "Story, Major: Tainted Offspring", value: 0 }
      - { id: "Story, Major: Tormenting Master", label: "Story, Major: Tormenting Master", value: 0 }
      - { id: "Story, Major: Tragic Life", label: "Story, Major: Tragic Life", value: 0 }
      - { id: "Story, Major: True Love (NPC)", label: "Story, Major: True Love (NPC)", value: 0 }
      - { id: "Story, Major: Tzadik Nistar", label: "Story, Major: Tzadik Nistar", value: 0 }
      - { id: "Story, Major: Unbaptized", label: "Story, Major: Unbaptized", value: 0 }
      - { id: "Story, Major: Unhappily Married", label: "Story, Major: Unhappily Married", value: 0 }
      - { id: "Story, Major: University Dean", label: "Story, Major: University Dean", value: 0 }
      - { id: "Story, Major: Vendetta", label: "Story, Major: Vendetta", value: 0 }
      - { id: "Story, Major: Vengeful Powers", label: "Story, Major: Vengeful Powers", value: 0 }
      - { id: "Story, Major: Wanderlust", label: "Story, Major: Wanderlust", value: 0 }
      - { id: "Story, Minor: Animal Companion", label: "Story, Minor: Animal Companion", value: 0 }
      - { id: "Story, Minor: Beloved Rival", label: "Story, Minor: Beloved Rival", value: 0 }
      - { id: "Story, Minor: Blackmail", label: "Story, Minor: Blackmail", value: 0 }
      - { id: "Story, Minor: Close Family Ties", label: "Story, Minor: Close Family Ties", value: 0 }
      - { id: "Story, Minor: Demonic Familiar", label: "Story, Minor: Demonic Familiar", value: 0 }
      - { id: "Story, Minor: Employed by Company", label: "Story, Minor: Employed by Company", value: 0 }
      - { id: "Story, Minor: Faerie Friend", label: "Story, Minor: Faerie Friend", value: 0 }
      - { id: "Story, Minor: Heir", label: "Story, Minor: Heir", value: 0 }
      - { id: "Story, Minor: Hermetic Patron", label: "Story, Minor: Hermetic Patron", value: 0 }
      - { id: "Story, Minor: Impious Friend", label: "Story, Minor: Impious Friend", value: 0 }
      - { id: "Story, Minor: Magical (Being) Companion", label: "Story, Minor: Magical (Being) Companion", value: 0 }
      - { id: "Story, Minor: Manufactured Ignorance", label: "Story, Minor: Manufactured Ignorance", value: 0 }
      - { id: "Story, Minor: Mentor", label: "Story, Minor: Mentor", value: 0 }
      - { id: "Story, Minor: Primogeniture Lineage", label: "Story, Minor: Primogeniture Lineage", value: 0 }
      - { id: "Story, Minor: Visions", label: "Story, Minor: Visions", value: 0 }
      - { id: "Story, Minor: Weak Personality", label: "Story, Minor: Weak Personality", value: 0 }
      - { id: "Social Status, Major: Outlaw", label: "Social Status, Major: Outlaw", value: 0 }
      - { id: "Social Status, Major: Outsider", label: "Social Status, Major: Outsider", value: 0 }
      - { id: "Social Status, Minor: Branded Criminal", label: "Social Status, Minor: Branded Criminal", value: 0 }
      - { id: "Social Status, Minor: Companion Animal", label: "Social Status, Minor: Companion Animal", value: 0 }
      - { id: "Social Status, Minor: Failed Journeyman", label: "Social Status, Minor: Failed Journeyman", value: 0 }
      - { id: "Social Status, Minor: Failed Master", label: "Social Status, Minor: Failed Master", value: 0 }
      - { id: "Social Status, Minor: Failed Monk/Nun", label: "Social Status, Minor: Failed Monk/Nun", value: 0 }
      - { id: "Social Status, Minor: Gabai", label: "Social Status, Minor: Gabai", value: 0 }
      - { id: "Social Status, Minor: Outcast", label: "Social Status, Minor: Outcast", value: 0 }
      - { id: "Social Status, Minor: Outlaw Leader", label: "Social Status, Minor: Outlaw Leader", value: 0 }
      - { id: "Social Status, Minor: Outsider", label: "Social Status, Minor: Outsider", value: 0 }
      - { id: "Social Status, Minor: Surgical Empiricus", label: "Social Status, Minor: Surgical Empiricus", value: 0 }
      - { id: "Social Status, Minor: Usurer", label: "Social Status, Minor: Usurer", value: 0 }
      - { id: "Supernatural, Major: Age Quickly", label: "Supernatural, Major: Age Quickly", value: 0 }
      - { id: "Supernatural, Major: Blatant Magical Air", label: "Supernatural, Major: Blatant Magical Air", value: 0 }
      - { id: "Supernatural, Major: Bound to (Realm)", label: "Supernatural, Major: Bound to (Realm)", value: 0 }
      - { id: "Supernatural, Major: False Power", label: "Supernatural, Major: False Power", value: 0 }
      - { id: "Supernatural, Major: Greater Malediction", label: "Supernatural, Major: Greater Malediction", value: 0 }
      - { id: "Supernatural, Major: Horrifying Appearance – Snake Legs", label: "Supernatural, Major: Horrifying Appearance – Snake Legs", value: 0 }
      - { id: "Supernatural, Major: Hunger for (Form) Magic", label: "Supernatural, Major: Hunger for (Form) Magic", value: 0 }
      - { id: "Supernatural, Major: Lycanthrope", label: "Supernatural, Major: Lycanthrope", value: 0 }
      - { id: "Supernatural, Major: Raised from the Dead", label: "Supernatural, Major: Raised from the Dead", value: 0 }
      - { id: "Supernatural, Minor: (Form) Monstrosity", label: "Supernatural, Minor: (Form) Monstrosity", value: 0 }
      - { id: "Supernatural, Minor: (Realm) Stigmatic", label: "Supernatural, Minor: (Realm) Stigmatic", value: 0 }
      - { id: "Supernatural, Minor: Baneful Circumstances", label: "Supernatural, Minor: Baneful Circumstances", value: 0 }
      - { id: "Supernatural, Minor: Corrupted Abilities", label: "Supernatural, Minor: Corrupted Abilities", value: 0 }
      - { id: "Supernatural, Minor: Curse of Slander", label: "Supernatural, Minor: Curse of Slander", value: 0 }
      - { id: "Supernatural, Minor: Cursed Guile", label: "Supernatural, Minor: Cursed Guile", value: 0 }
      - { id: "Supernatural, Minor: Deteriorating Power", label: "Supernatural, Minor: Deteriorating Power", value: 0 }
      - { id: "Supernatural, Minor: Evil Eye", label: "Supernatural, Minor: Evil Eye", value: 0 }
      - { id: "Supernatural, Minor: Exiled Atlantean", label: "Supernatural, Minor: Exiled Atlantean", value: 0 }
      - { id: "Supernatural, Minor: Flawed Powers", label: "Supernatural, Minor: Flawed Powers", value: 0 }
      - { id: "Supernatural, Minor: Fluctuating Fortune", label: "Supernatural, Minor: Fluctuating Fortune", value: 0 }
      - { id: "Supernatural, Minor: Folk Magic", label: "Supernatural, Minor: Folk Magic", value: 0 }
      - { id: "Supernatural, Minor: Inscribed Shadow", label: "Supernatural, Minor: Inscribed Shadow", value: 0 }
      - { id: "Supernatural, Minor: Lesser Malediction", label: "Supernatural, Minor: Lesser Malediction", value: 0 }
      - { id: "Supernatural, Minor: Manifest Sin", label: "Supernatural, Minor: Manifest Sin", value: 0 }
      - { id: "Supernatural, Minor: Monstrous Blood", label: "Supernatural, Minor: Monstrous Blood", value: 0 }
      - { id: "Supernatural, Minor: Necessary (Realm) Aura for (Ability)", label: "Supernatural, Minor: Necessary (Realm) Aura for (Ability)", value: 0 }
      - { id: "Supernatural, Minor: Prohibition", label: "Supernatural, Minor: Prohibition", value: 0 }
      - { id: "Supernatural, Minor: Restricted Power", label: "Supernatural, Minor: Restricted Power", value: 0 }
      - { id: "Supernatural, Minor: Slow Power", label: "Supernatural, Minor: Slow Power", value: 0 }
      - { id: "Supernatural, Minor: Stigmatic Catalyst", label: "Supernatural, Minor: Stigmatic Catalyst", value: 0 }
      - { id: "Supernatural, Minor: Susceptibility to Sunlight", label: "Supernatural, Minor: Susceptibility to Sunlight", value: 0 }
      - { id: "Supernatural, Minor: Susceptibility to Warping", label: "Supernatural, Minor: Susceptibility to Warping", value: 0 }
      - { id: "Supernatural, Minor: Unruly Air", label: "Supernatural, Minor: Unruly Air", value: 0 }
      - { id: "Supernatural, Minor: Viaticarus", label: "Supernatural, Minor: Viaticarus", value: 0 }
      - { id: "Supernatural, Minor: Visions", label: "Supernatural, Minor: Visions", value: 0 }
      - { id: "Supernatural, Minor: Warped by Magic", label: "Supernatural, Minor: Warped by Magic", value: 0 }
      - { id: "General, Major: Blind", label: "General, Major: Blind", value: 0 }
      - { id: "General, Major: Crippled", label: "General, Major: Crippled", value: 0 }
      - { id: "General, Major: Deaf", label: "General, Major: Deaf", value: 0 }
      - { id: "General, Major: Dwarf", label: "General, Major: Dwarf", value: 0 }
      - { id: "General, Major: Enfeebled", label: "General, Major: Enfeebled", value: 0 }
      - { id: "General, Major: Leprosy", label: "General, Major: Leprosy", value: 0 }
      - { id: "General, Major: Low Self-Esteem", label: "General, Major: Low Self-Esteem", value: 0 }
      - { id: "General, Major: Magical Air", label: "General, Major: Magical Air", value: 0 }
      - { id: "General, Major: Mute", label: "General, Major: Mute", value: 0 }
      - { id: "General, Major: No Hands", label: "General, Major: No Hands", value: 0 }
      - { id: "General, Major: Poor", label: "General, Major: Poor", value: 0 }
      - { id: "General, Major: Repellent", label: "General, Major: Repellent", value: 0 }
      - { id: "General, Major: The Falling Evil", label: "General, Major: The Falling Evil", value: 0 }
      - { id: "General, Minor: Ability Block", label: "General, Minor: Ability Block", value: 0 }
      - { id: "General, Minor: Afflicted Tongue", label: "General, Minor: Afflicted Tongue", value: 0 }
      - { id: "General, Minor: Anchored to the (Land)", label: "General, Minor: Anchored to the (Land)", value: 0 }
      - { id: "General, Minor: Apostate", label: "General, Minor: Apostate", value: 0 }
      - { id: "General, Minor: Arthritis", label: "General, Minor: Arthritis", value: 0 }
      - { id: "General, Minor: Careless with (Ability)", label: "General, Minor: Careless with (Ability)", value: 0 }
      - { id: "General, Minor: Castratus", label: "General, Minor: Castratus", value: 0 }
      - { id: "General, Minor: Clumsy", label: "General, Minor: Clumsy", value: 0 }
      - { id: "General, Minor: Craving for Travel", label: "General, Minor: Craving for Travel", value: 0 }
      - { id: "General, Minor: Curse of Slander", label: "General, Minor: Curse of Slander", value: 0 }
      - { id: "General, Minor: Devoted Parent/Child", label: "General, Minor: Devoted Parent/Child", value: 0 }
      - { id: "General, Minor: Dhimmi", label: "General, Minor: Dhimmi", value: 0 }
      - { id: "General, Minor: Disfigured", label: "General, Minor: Disfigured", value: 0 }
      - { id: "General, Minor: Environmental Sensitivity", label: "General, Minor: Environmental Sensitivity", value: 0 }
      - { id: "General, Minor: Failed Student", label: "General, Minor: Failed Student", value: 0 }
      - { id: "General, Minor: Feral Scent", label: "General, Minor: Feral Scent", value: 0 }
      - { id: "General, Minor: Feral Upbringing", label: "General, Minor: Feral Upbringing", value: 0 }
      - { id: "General, Minor: Fish Out of Water (Terrain)", label: "General, Minor: Fish Out of Water (Terrain)", value: 0 }
      - { id: "General, Minor: Flashbacks", label: "General, Minor: Flashbacks", value: 0 }
      - { id: "General, Minor: Fragile Constitution", label: "General, Minor: Fragile Constitution", value: 0 }
      - { id: "General, Minor: Frail", label: "General, Minor: Frail", value: 0 }
      - { id: "General, Minor: Gullible", label: "General, Minor: Gullible", value: 0 }
      - { id: "General, Minor: Hallucinations", label: "General, Minor: Hallucinations", value: 0 }
      - { id: "General, Minor: Hobbled", label: "General, Minor: Hobbled", value: 0 }
      - { id: "General, Minor: Hunchback", label: "General, Minor: Hunchback", value: 0 }
      - { id: "General, Minor: Incomprehensible", label: "General, Minor: Incomprehensible", value: 0 }
      - { id: "General, Minor: Independent Craftsman", label: "General, Minor: Independent Craftsman", value: 0 }
      - { id: "General, Minor: Infamous", label: "General, Minor: Infamous", value: 0 }
      - { id: "General, Minor: Jinxed", label: "General, Minor: Jinxed", value: 0 }
      - { id: "General, Minor: Judged Unfairly", label: "General, Minor: Judged Unfairly", value: 0 }
      - { id: "General, Minor: Lame", label: "General, Minor: Lame", value: 0 }
      - { id: "General, Minor: Lingering Injury", label: "General, Minor: Lingering Injury", value: 0 }
      - { id: "General, Minor: Low Tolerance", label: "General, Minor: Low Tolerance", value: 0 }
      - { id: "General, Minor: Master of None", label: "General, Minor: Master of None", value: 0 }
      - { id: "General, Minor: Missing Ear", label: "General, Minor: Missing Ear", value: 0 }
      - { id: "General, Minor: Missing Eye", label: "General, Minor: Missing Eye", value: 0 }
      - { id: "General, Minor: Missing Hand", label: "General, Minor: Missing Hand", value: 0 }
      - { id: "General, Minor: Motion Sickness", label: "General, Minor: Motion Sickness", value: 0 }
      - { id: "General, Minor: Night Terrors", label: "General, Minor: Night Terrors", value: 0 }
      - { id: "General, Minor: No Sense of Direction", label: "General, Minor: No Sense of Direction", value: 0 }
      - { id: "General, Minor: Nocturnal", label: "General, Minor: Nocturnal", value: 0 }
      - { id: "General, Minor: Obese", label: "General, Minor: Obese", value: 0 }
      - { id: "General, Minor: Offensive to (Beings)", label: "General, Minor: Offensive to (Beings)", value: 0 }
      - { id: "General, Minor: Palsied Hands", label: "General, Minor: Palsied Hands", value: 0 }
      - { id: "General, Minor: Poor (Characteristic)", label: "General, Minor: Poor (Characteristic)", value: 0 }
      - { id: "General, Minor: Poor Concentration", label: "General, Minor: Poor Concentration", value: 0 }
      - { id: "General, Minor: Poor Eyesight", label: "General, Minor: Poor Eyesight", value: 0 }
      - { id: "General, Minor: Poor Hearing", label: "General, Minor: Poor Hearing", value: 0 }
      - { id: "General, Minor: Poor Living Conditions", label: "General, Minor: Poor Living Conditions", value: 0 }
      - { id: "General, Minor: Poor Student", label: "General, Minor: Poor Student", value: 0 }
      - { id: "General, Minor: Primitive Equipment", label: "General, Minor: Primitive Equipment", value: 0 }
      - { id: "General, Minor: Raised in the Gutter", label: "General, Minor: Raised in the Gutter", value: 0 }
      - { id: "General, Minor: Regular", label: "General, Minor: Regular", value: 0 }
      - { id: "General, Minor: Restricted Learning", label: "General, Minor: Restricted Learning", value: 0 }
      - { id: "General, Minor: Rolling Stone", label: "General, Minor: Rolling Stone", value: 0 }
      - { id: "General, Minor: Savantism", label: "General, Minor: Savantism", value: 0 }
      - { id: "General, Minor: Short of Breath", label: "General, Minor: Short of Breath", value: 0 }
      - { id: "General, Minor: Sleep Disorder", label: "General, Minor: Sleep Disorder", value: 0 }
      - { id: "General, Minor: Slow Reflexes", label: "General, Minor: Slow Reflexes", value: 0 }
      - { id: "General, Minor: Small Frame", label: "General, Minor: Small Frame", value: 0 }
      - { id: "General, Minor: Social Handicap", label: "General, Minor: Social Handicap", value: 0 }
      - { id: "General, Minor: Stuck in Your Ways", label: "General, Minor: Stuck in Your Ways", value: 0 }
      - { id: "General, Minor: Tainted With Evil", label: "General, Minor: Tainted With Evil", value: 0 }
      - { id: "General, Minor: Unbearable to (Beings)", label: "General, Minor: Unbearable to (Beings)", value: 0 }
      - { id: "General, Minor: Uncertain Faith", label: "General, Minor: Uncertain Faith", value: 0 }
      - { id: "General, Minor: Uncontrollable Strength", label: "General, Minor: Uncontrollable Strength", value: 0 }
      - { id: "General, Minor: Uninspirational", label: "General, Minor: Uninspirational", value: 0 }
      - { id: "General, Minor: Unlucky", label: "General, Minor: Unlucky", value: 0 }
      - { id: "General, Minor: Unspecialized", label: "General, Minor: Unspecialized", value: 0 }
      - { id: "General, Minor: Warped Senses", label: "General, Minor: Warped Senses", value: 0 }
      - { id: "General, Minor: Weak Characteristics", label: "General, Minor: Weak Characteristics", value: 0 }
      - { id: "General, Minor: Witch Marks", label: "General, Minor: Witch Marks", value: 0 }



  - id: ArsVirtues
    label: "Virtues"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "virtue_01"
      add_label: "+ Virtue"
      remove_label: "Remove"
    items:
      - id: virtue_01
        label: ""
        fields:
          - { id: name, type: "select", value: "", options_from: { section_id: "ArsVirtueCatalog" }, allow_empty: true, empty_label: "-- Virtue --" }

  - id: ArsFlaws
    label: "Flaws"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "flaw_01"
      add_label: "+ Flaw"
      remove_label: "Remove"
    items:
      - id: flaw_01
        label: ""
        fields:
          - { id: name, type: "select", value: "", options_from: { section_id: "ArsFlawCatalog" }, allow_empty: true, empty_label: "-- Flaw --" }

  - id: ArsCharacteristics
    label: "Characteristics"
    provides_attributes: true
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - { id: INT, label: "Intelligence", value: 0 }
      - { id: PER, label: "Perception", value: 0 }
      - { id: STR, label: "Strength", value: 0 }
      - { id: STA, label: "Stamina", value: 0 }
      - { id: PRE, label: "Presence", value: 0 }
      - { id: COM, label: "Communication", value: 0 }
      - { id: DEX, label: "Dexterity", value: 0 }
      - { id: QIK, label: "Quickness", value: 0 }

  - id: ArsAbilities
    label: "Abilities"
    calc_id: "value_only"
    cost_per_increment: 5
    items:
      - { id: native_language, label: "Native Language", value: 0 }
      - { id: area_lore, label: "Area Lore", value: 0 }
      - { id: athletics, label: "Athletics", value: 0 }
      - { id: awareness, label: "Awareness", value: 0 }
      - { id: brawl, label: "Brawl", value: 0 }
      - { id: single_weapon, label: "Single Weapon", value: 0 }
      - { id: great_weapon, label: "Great Weapon", value: 0 }
      - { id: bow, label: "Bow", value: 0 }
      - { id: thrown_weapon, label: "Thrown Weapon", value: 0 }
      - { id: leadership, label: "Leadership", value: 0 }
      - { id: charm, label: "Charm", value: 0 }
      - { id: folk_ken, label: "Folk Ken", value: 0 }
      - { id: guile, label: "Guile", value: 0 }
      - { id: living_language, label: "Living Language", value: 0 }
      - { id: stealth, label: "Stealth", value: 0 }
      - { id: survival, label: "Survival", value: 0 }
      - { id: swim, label: "Swim", value: 0 }
      - { id: latin, label: "Latin", value: 0 }
      - { id: artes_liberales, label: "Artes Liberales", value: 0 }
      - { id: magic_theory, label: "Magic Theory", value: 0 }
      - { id: parma_magica, label: "Parma Magica", value: 0 }
      - { id: code_of_hermes, label: "Code of Hermes", value: 0 }
      - { id: concentration, label: "Concentration", value: 0 }
      - { id: finesse, label: "Finesse", value: 0 }
      - { id: penetration, label: "Penetration", value: 0 }
      - { id: order_of_hermes_lore, label: "Order of Hermes Lore", value: 0 }
      - { id: profession_scribe, label: "Profession (Scribe)", value: 0 }

  - id: ArsArts
    label: "Arts"
    calc_id: "value_only"
    cost_per_increment: 1
    items:
      - { id: creo, label: "Creo", value: 0 }
      - { id: intellego, label: "Intellego", value: 0 }
      - { id: muto, label: "Muto", value: 0 }
      - { id: perdo, label: "Perdo", value: 0 }
      - { id: rego, label: "Rego", value: 0 }
      - { id: animal, label: "Animal", value: 0 }
      - { id: aquam, label: "Aquam", value: 0 }
      - { id: auram, label: "Auram", value: 0 }
      - { id: corpus, label: "Corpus", value: 0 }
      - { id: herbam, label: "Herbam", value: 0 }
      - { id: ignem, label: "Ignem", value: 0 }
      - { id: imaginem, label: "Imaginem", value: 0 }
      - { id: mentem, label: "Mentem", value: 0 }
      - { id: terram, label: "Terram", value: 0 }
      - { id: vim, label: "Vim", value: 0 }

  - id: ArsSpells
    label: "Spells"
    calc_id: "value_only"
    cost_per_increment: 1
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "spell_01"
      add_label: "+ Spell"
      remove_label: "Remove"
    items:
      - id: spell_01
        label: ""
        value: 0
        fields:
          - { id: spell_reqs, type: "text", value: "" }
          - { id: range, type: "text", value: "" }
          - { id: duration, type: "text", value: "" }
          - { id: target, type: "text", value: "" }
          - { id: mastery, type: "number", value: 0 }
          - { id: penetration, type: "number", value: 0 }
          - { id: notes, type: "text", value: "" }

  - id: ArsArmor
    label: "Armor"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: armor_1
        label: ""
        fields:
          - { id: protection, type: "number", value: 0 }
          - { id: load, type: "number", value: 0 }

  - id: ArsCombatState
    label: "Combat State"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: state
        label: "Current State"
        fields:
          - { id: fatigue_penalty, type: "number", value: 0 }
          - { id: light_wounds, type: "number", value: 0 }
          - { id: medium_wounds, type: "number", value: 0 }
          - { id: heavy_wounds, type: "number", value: 0 }
          - { id: form_bonus, type: "number", value: 0 }
          - { id: misc_load, type: "number", value: 0 }

  - id: ArsWeaponPresets
    label: "Weapon Presets"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: dodge
        label: "Dodge"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 0 }
          - { id: load, type: "number", value: 0 }
      - id: fist
        label: "Fist"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 0 }
          - { id: load, type: "number", value: 0 }
      - id: kick
        label: "Kick"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: -1 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: -1 }
          - { id: damage_mod, type: "number", value: 3 }
          - { id: load, type: "number", value: 0 }
      - id: gauntlet
        label: "Gauntlet"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 2 }
          - { id: load, type: "number", value: 0 }
      - id: bludgeon
        label: "Bludgeon"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 2 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 2 }
          - { id: load, type: "number", value: 1 }
      - id: dagger
        label: "Dagger"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 2 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 3 }
          - { id: load, type: "number", value: 0 }
      - id: knife
        label: "Knife"
        fields:
          - { id: ability, type: "text", value: "brawl" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 1 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 2 }
          - { id: load, type: "number", value: 0 }
      - id: axe
        label: "Axe"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 4 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 6 }
          - { id: load, type: "number", value: 1 }
      - id: club
        label: "Club"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 2 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 3 }
          - { id: load, type: "number", value: 1 }
      - id: hatchet
        label: "Hatchet"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 4 }
          - { id: load, type: "number", value: 1 }
      - id: lance
        label: "Lance"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 2 }
          - { id: attack_mod, type: "number", value: 4 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 5 }
          - { id: load, type: "number", value: 2 }
      - id: mace
        label: "Mace"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 8 }
          - { id: load, type: "number", value: 2 }
      - id: mace_and_chain
        label: "Mace and Chain"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 2 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 7 }
          - { id: load, type: "number", value: 2 }
      - id: sword_short
        label: "Sword, Short"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 5 }
          - { id: load, type: "number", value: 1 }
      - id: sword_long
        label: "Sword, Long"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 2 }
          - { id: attack_mod, type: "number", value: 4 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 6 }
          - { id: load, type: "number", value: 1 }
      - id: spear_short
        label: "Spear, Short"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 2 }
          - { id: attack_mod, type: "number", value: 2 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 5 }
          - { id: load, type: "number", value: 1 }
      - id: shield_round
        label: "Shield, Round"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 2 }
          - { id: damage_mod, type: "number", value: 0 }
          - { id: load, type: "number", value: 2 }
      - id: shield_buckler
        label: "Shield, Buckler"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 0 }
          - { id: load, type: "number", value: 1 }
      - id: bow_long
        label: "Bow, Long"
        fields:
          - { id: ability, type: "text", value: "bow" }
          - { id: init_mod, type: "number", value: -2 }
          - { id: attack_mod, type: "number", value: 4 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 8 }
          - { id: load, type: "number", value: 2 }
      - id: shield_heater
        label: "Shield, Heater"
        fields:
          - { id: ability, type: "text", value: "single_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 3 }
          - { id: damage_mod, type: "number", value: 0 }
          - { id: load, type: "number", value: 2 }
      - id: cudgel
        label: "Cudgel"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 4 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 7 }
          - { id: load, type: "number", value: 2 }
      - id: farm_implement
        label: "Farm Implement"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 5 }
          - { id: load, type: "number", value: 2 }
      - id: flail
        label: "Flail"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 8 }
          - { id: load, type: "number", value: 2 }
      - id: pole_arm
        label: "Pole Arm"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 3 }
          - { id: attack_mod, type: "number", value: 4 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 8 }
          - { id: load, type: "number", value: 2 }
      - id: pole_axe
        label: "Pole Axe"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 1 }
          - { id: attack_mod, type: "number", value: 5 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 11 }
          - { id: load, type: "number", value: 2 }
      - id: spear_long
        label: "Spear, Long"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 3 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 1 }
          - { id: damage_mod, type: "number", value: 7 }
          - { id: load, type: "number", value: 3 }
      - id: sword_great
        label: "Sword, Great"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 2 }
          - { id: attack_mod, type: "number", value: 5 }
          - { id: defense_mod, type: "number", value: 2 }
          - { id: damage_mod, type: "number", value: 9 }
          - { id: load, type: "number", value: 2 }
      - id: staff
        label: "Staff"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 2 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 3 }
          - { id: damage_mod, type: "number", value: 2 }
          - { id: load, type: "number", value: 2 }
      - id: warhammer
        label: "Warhammer"
        fields:
          - { id: ability, type: "text", value: "great_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 6 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 12 }
          - { id: load, type: "number", value: 3 }
      - id: axe_throwing
        label: "Axe, Throwing"
        fields:
          - { id: ability, type: "text", value: "thrown_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 2 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 6 }
          - { id: load, type: "number", value: 1 }
      - id: bow_short
        label: "Bow, Short"
        fields:
          - { id: ability, type: "text", value: "bow" }
          - { id: init_mod, type: "number", value: -1 }
          - { id: attack_mod, type: "number", value: 3 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 6 }
          - { id: load, type: "number", value: 2 }
      - id: javelin
        label: "Javelin"
        fields:
          - { id: ability, type: "text", value: "thrown_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 2 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 5 }
          - { id: load, type: "number", value: 1 }
      - id: knife_throwing
        label: "Knife, Throwing"
        fields:
          - { id: ability, type: "text", value: "thrown_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 1 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 2 }
          - { id: load, type: "number", value: 0 }
      - id: sling
        label: "Sling"
        fields:
          - { id: ability, type: "text", value: "thrown_weapon" }
          - { id: init_mod, type: "number", value: -3 }
          - { id: attack_mod, type: "number", value: 1 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 4 }
          - { id: load, type: "number", value: 0 }
      - id: stone
        label: "Stone"
        fields:
          - { id: ability, type: "text", value: "thrown_weapon" }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 1 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 2 }
          - { id: load, type: "number", value: 1 }

  - id: ArsWeapons
    label: "Weapons"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "weapon_1"
      add_label: "+ Weapon"
      remove_label: "Remove"
    items:
      - id: weapon_1
        label: ""
        fields:
          - { id: preset, type: "select", value: "", options_from: { section_id: "ArsWeaponPresets" }, allow_empty: true, empty_label: "-- Preset --", on_change_set_fields_from: { section_id: "ArsWeaponPresets" } }
          - { id: ability, type: "select", value: "single_weapon", options: [{ id: "brawl", label: "Brawl" }, { id: "single_weapon", label: "Single Weapon" }, { id: "great_weapon", label: "Great Weapon" }, { id: "bow", label: "Bow" }, { id: "thrown_weapon", label: "Thrown Weapon" }] }
          - { id: init_mod, type: "number", value: 0 }
          - { id: attack_mod, type: "number", value: 0 }
          - { id: defense_mod, type: "number", value: 0 }
          - { id: damage_mod, type: "number", value: 0 }
          - { id: load, type: "number", value: 0 }

  - id: ArsNotes
    label: "Notes"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "note_1"
      add_label: "+ Note"
      remove_label: "Remove"
    items:
      - { id: note_1, label: "" }
`;
