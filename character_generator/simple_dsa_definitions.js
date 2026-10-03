var defText = `
globals:
  ap_total: 4000
  formulas:
    value_only:      { type: "value" }
    base_plus_value: { type: "sum" }
    display_basis:
      type: "item_basis"
    display_total:
      type: "item_total"
    display_basis_formula:
      type: "item_basis_formula"
    display_total_formula:
      type: "item_total_formula"
    weighted_base_value:
      type: "weighted"
      params: { b: 2, w: 3 }
    weapon_attack_value:
      type: "selected_group_total_plus_field_minus_section_field"
      params:
        selected_field_id: "kampftalent"
        source_section_id: "Talente"
        source_group_id: "kampf"
        add_field_id: "f2"
        subtract_section_id: "Rüstung"
        subtract_item_id: "armor_1"
        subtract_field_id: "armor"
        bracket: "selected_value"
    weapon_parry_value:
      type: "field_plus_section_field"
      params:
        own_field_id: "f3"
        section_id: "Rüstung"
        item_id: "armor_1"
        section_field_id: "armor"
    weapon_damage_roll:
      type: "dice_plus_field"
      params:
        dice: "1W6"
        own_field_id: "f1"

sections:
  - id: Kopfzeile
    label: "Charakter"
    type: "header"
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: character
        label: ""                  # frei befüllbar
        fields:                    # zusätzliche Felder in dieser Zeile
          - id: race
            type: "select"
            value: ""
            empty_label: "-- Rasse auswählen --"
            options: ["Mensch", "Elf", "Halbelf", "Zwerg"]
          - id: profession
            type: "select"
            value: ""
            empty_label: "-- Profession auswählen --"
            options: ["Abenteurer", "Barde", "Dieb/Streuner", "Geweihter", "Jäger/Waldläufer", "Krieger", "Magier", "Magiedilettant", "Söldner"]
          - { id: culture, type: "text", value: "" } 
  - id: Eigenschaften
    label: "Eigenschaften"
    calc_id: "value_only"
    cost_per_increment: 20
    items:
      - { id: MU, label: "Mut", value: 0 }
      - { id: KL, label: "Klugheit", value: 0 }
      - { id: IN, label: "Intuition", value: 0 }
      - { id: CH, label: "Charisma", value: 0 }
      - { id: GE, label: "Geschicklichkeit", value: 0 }
      - { id: KK, label: "Körperkraft", value: 0 }
      - { id: KO, label: "Konstitution", value: 0 }

  - id: Ressourcen
    label: "Ressourcen"
    calc_id: "weighted_base_value"
    cost_per_increment: 20
    items:
      - { id: LE, label: "Lebensenergie", basis: [KK, KO, KO], value: 0 }
      - { id: AE, label: "Astralenergie", basis: [KL, IN, CH], value: 0 }
      - { id: KE, label: "Karmaenergie", basis: [IN, CH, CH], value: 0 }
      - { id: MR, label: "Magieresistenz", calc_id: "base_plus_value_minus_10", basis: [MU, KL, KO], value: 0 }
      - { id: Heldenpunkte, label: "Heldenpunkte", calc_id: "value_only", cost_per_increment: 100, value: 0 }

  - id: Talente
    label: "Talente"
    calc_id: "base_plus_value"
    cost_per_increment: 5
    groups:
      - id: kampf
        label: "Kampftalente"
        basis: [MU, GE, KK]
        items:
          - { id: waffenloser_nahkampf,  label: "Waffenlos",  value: 0 }
          - { id: bewaffneter_nahkampf, label: "Bewaffnet", value: 0 }
          - { id: wurfwaffen,  label: "Wurfwaffen",  value: 0 }
          - { id: schusswaffen, label: "Schusswaffen", value: 0 }
      - id: koerper
        label: "Körperliche Talente"
        basis: [GE, KK, KO]
        items:
          - {id: akrobatik, label: "Akrobatik", value: 0}
          - {id: reiten, label: "Reiten", value: 0}
          - {id: schwimmen, label: "Schwimmen", value: 0}

      - id: gesellschaft
        label: "Gesellschaftliche Talente"
        basis: [IN, CH, CH]
        items:
          - {id: etikette, label: "Etikette", value: 0}
          - {id: gassenwissen, label: "Gassenwissen", value: 0}
          - {id: lehren, label: "Lehren", value: 0}
          - {id: menschenkenntnis, label: "Menschenkenntnis", value: 0}
          - {id: schaetzen, label: "Schätzen", value: 0}
          - {id: ueberzeugen, label: "Überzeugen", value: 0}
          - {id: vortrag, label: "Vortrag", value: 0}

      - id: wissen
        label: "Wissenstalente"
        basis: [KL, KL, IN]
        items:
          - {id: alchemie, label: "Alchemie", value: 0}
          - {id: goetter_und_kulte, label: "Götter und Kulte", value: 0}
          - {id: kriegskunst, label: "Kriegskunst", value: 0}
          - {id: magiekunde, label: "Magiekunde", value: 0}
          - {id: gelehrsamkeit, label: "Gelehrsamkeit", value: 0}
          - {id: prophezeihen, label: "Prophezeihen", value: 0}
          - {id: heilkunde, label: "Heilkunde", value: 0}
      
      - id: natur
        label: "Naturtalente"
        basis: [IN, GE, KO]
        items:
          - {id: jagen, label: "Jagen", value: 0}
          - {id: fesseln, label: "Fesseln", value: 0}
          - {id: sinnesschaerfe, label: "Sinnesschärfe", value: 0}
          - {id: wildnisleben, label: "Wildnisleben", value: 0}

      - id: gauner
        label: "Gaunertalente"
        basis: [MU, IN, GE]
        items:
          - {id: heimlichkeit, label: "Heimlichkeit", value: 0}
          - {id: imitieren, label: "Imitieren", value: 0}
          - {id: gluecksspiel, label: "Glücksspiel", value: 0}
          - {id: diebstahl, label: "Diebstahl", value: 0}
          - {id: schloesser_knacken, label: "Schlösser knacken", value: 0}
  
  - id: SprachenKatalog
    label: "Sprachenkatalog"
    calc_id: "value_only"
    exclude_from_ap: true
    items:
      - {id: "Garethi", label: "Garethi", value: 0}
      - {id: "Isdira", label: "Isdira", value: 0}
      - {id: "Rogolan", label: "Rogolan", value: 0}
      - {id: "Tulamydia", label: "Tulamydia", value: 0}
      - {id: "Thorwalsch", label: "Thorwalsch", value: 0}
      - {id: "Alaani", label: "Alaani", value: 0}
      - {id: "Mnujuka", label: "Mnujuka", value: 0}
      - {id: "Mohisch", label: "Mohisch", value: 0}
      - {id: "Zelemia", label: "Zelemia", value: 0}
      - {id: "Trollisch", label: "Trollisch", value: 0}
      - {id: "Rssahh", label: "Rssahh", value: 0}
      - {id: "Koboldisch", label: "Koboldisch", value: 0}
      - {id: "Orkisch", label: "Orkisch", value: 0}
      - {id: "Goblinisch", label: "Goblinisch", value: 0}
      - {id: "Atak", label: "Atak", value: 0}
      - {id: "Zhayad", label: "Zhayad", value: 0}
      - {id: "Füchsisch", label: "Füchsisch", value: 0}
      - {id: "Bosparano", label: "Bosparano", value: 0}
      - {id: "Asdharia", label: "Asdharia", value: 0}
      - {id: "Ur-Tulamydia", label: "Ur-Tulamydia", value: 0}
      - {id: "Yash'Hualay", label: "Yash'Hualay", value: 0}
      - {id: "Drachisch", label: "Drachisch", value: 0}

  - id: Sprachen
    label: "Sprachen"
    cost_per_increment: 2
    calc_id: "base_plus_value"
    basis: [KL, IN, CH]
    allowed_text_values: ["M"]
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "sprache_01"
      add_label: "+ Sprache"
      remove_label: "Entfernen"
    items:
      - id: sprache_01
        label: ""
        value: 0
        fields:
          - id: label
            type: "select"
            value: ""
            allow_empty: true
            empty_label: "-- Sprache auswählen --"
            options_from:
              section_id: "SprachenKatalog"
              exclude_selected_from_section: "Sprachen"
              exclude_selected_field_id: "label"
            on_change_set_label_from_source: false
            rerender_on_change: true
  
  
  - id: Waffen
    label: "Waffen"
    calc_id: "value_only"          # keine Berechnung
    cost_per_increment: 0          # keine Kosten
    exclude_from_ap: true        # nicht in AP-Zähler einbeziehen
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "weapon_1"
      add_label: "+ Waffe"
      remove_label: "Entfernen"
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: weapon_1
        label: ""                  # frei befüllbar
        fields:                    # zusätzliche Felder in dieser Zeile
          - { id: kampftalent, type: "select", value: "", options_from: { section_id: "Talente", group_id: "kampf" } }
          - { id: f1, type: "number", value: "" }
          - { id: f2, type: "number", value: "" }
          - { id: f3, type: "number", value: "" } 
  - id: Rüstung
    label: "Rüstung"
    calc_id: "value_only"          # keine Berechnung
    cost_per_increment: 0          # keine Kosten
    exclude_from_ap: true        # nicht in AP-Zähler einbeziehen
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: armor_1
        label: ""                  # frei befüllbar
        fields:                    # zusätzliche Felder in dieser Zeile
          - { id: armor, type: "number", value: "" }
  - id: Ausrüstung
    label: "Ausrüstung"
    calc_id: "value_only"          # keine Berechnung
    cost_per_increment: 0          # keine Kosten
    exclude_from_ap: true        # nicht in AP-Zähler einbeziehen
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "gear_1"
      add_label: "+ Eintrag"
      remove_label: "Entfernen"
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: gear_1
        label: ""
        fields:
  
  - id: Zauber
    label: "Zauber"
    calc_id: "base_plus_value"
    cost_per_increment: 3
    include_in_ap_when:
      logic: "or"
      rules:
        - { field: "Kopfzeile-character-race", operator: "equals", value: "Elf" }
        - { field: "Kopfzeile-character-profession", operator: "in", values: ["Magier", "Magiedilettant"] }
    groups:
      - id: antimagie
        label: "Antimagie"
        basis: [KL, IN, CH]
        items:
          - {id: magischer_schutz, label: "Magischer Schutz", value: 0}
          - {id: zauberbann, label: "Zauberbann", value: 0}
          - {id: magieresistenz, label: "Magieresistenz", value: 0}

      - id: beherrschung
        label: "Beherrschung"
        basis: [MU, CH, KO]
        items:
          - {id: geisteskontrolle, label: "Geisteskontrolle", value: 0}
          - {id: gefuehle_kontrollieren, label: "Gefühle kontrollieren", value: 0}
          - {id: verwirrung, label: "Verwirrung", value: 0}
          - {id: laehmung, label: "Lähmung", value: 0}
          - {id: schlaf, label: "Schlaf", value: 0}
          - {id: wahrheitszwang, label: "Wahrheitszwang", value: 0}

      - id: beschwoerung_daemonischer_maechte
        label: "Beschwörung dämonischer Mächte"
        basis: [MU, MU, CH]
        items:
          - {id: daemonenbeschwoerung, label: "Dämonenbeschwörung", value: 0}
          - {id: geisterbann, label: "Geisterbann", value: 0}
          - {id: geisterbeschwoerung, label: "Geisterbeschwörung", value: 0}
          - {id: Untotenbeschwoerung, label: "Untotenbeschwörung", value: 0}
          - {id: sphaerenriss, label: "Sphärenriss", value: 0}

      - id: beschwoerung_elementarer_kraefte
        label: "Beschwörung elementarer Kräfte"
        basis: [KL, CH, CH]
        items:
          - {id: elementarbeschwoerung, label: "Elementarbeschwörung", value: 0}
          - {id: elementarkontrolle, label: "Elementarkontrolle", value: 0}
          - {id: elementarerschaffung, label: "Elementarerschaffung", value: 0}
          - {id: elementarschutz, label: "Elementarschutz", value: 0}
          - {id: elementarangriff, label: "Elementarangriff", value: 0}
          - {id: elementarsicht, label: "Elementarsicht", value: 0}

      - id: bewegung
        label: "Bewegung"
        basis: [IN, GE, GE]
        items:
          - {id: bewegung_durch_medium, label: "Bewegung durch Medium", value: 0}
          - {id: telekinese, label: "Telekinese", value: 0}
          - {id: ausdauer_steigerung, label: "Ausdauersteigerung", value: 0}
          - {id: spurenverwischung, label: "Spurenverwischung", value: 0}
          - {id: anziehung_abstossung, label: "Anziehung/Abstoßung", value: 0}
          - {id: teleportation, label: "Teleportation", value: 0}


      - id: heilung
        label: "Heilung"
        basis: [IN, CH, KO]
        items:
          - {id: wundheilung, label: "Wundheilung", value: 0}
          - {id: gifheilung, label: "Giftheilung", value: 0}
          - {id: krankheitsheilung, label: "Krankheitsheilung", value: 0}
          - {id: regeneration, label: "Regeneration", value: 0}
          - {id: geistheilung, label: "Geistheilung", value: 0}
          - {id: schutz_umwelt, label: "Schutz (Umwelt)", value: 0}

      - id: hellsicht
        label: "Hellsicht"
        basis: [KL, IN, IN]
        items:
          - {id: magieerkennung, label: "Magieerkennen", value: 0}
          - {id: sinnesverstaerkung, label: "Sinnverstärken", value: 0}
          - {id: fernwahrnehmung, label: "Fernwahrnehmung", value: 0}
          - {id: gedanken_gedaechtnis_lesung, label: "Telepathie", value: 0}
          - {id: wesens_eigenschaft, label: "Wesenserkennung", value: 0}

      - id: illusion
        label: "Illusion"
        basis: [IN, CH, GE]
        items:
          - {id: sinnesillusion, label: "Sinnesillusion", value: 0}
          - {id: gestaltsillusion, label: "Gestaltsillusion", value: 0}
          - {id: unsichtbarkeit, label: "Unsichtbarkeit", value: 0}
          - {id: doppelgaenger, label: "Doppelgänger", value: 0}
          - {id: raumillusion, label: "Raumillusion", value: 0} 
      
      - id: metamagie
        label: "Metamagie"
        basis: [KL, KL, IN]
        items:
          - {id: umkehr, label: "Umkehr", value: 0}
          - {id: artefaktbindung, label: "Artefaktbindung", value: 0}

      - id: verwandlung_lebewesen
        label: "Verwandlung (Lebewesen)"
        basis: [MU, KK, KO]
        items:
          - {id: tierverwandlung, label: "Tierverwandlung", value: 0}
          - {id: attribute, label: "Attribute", value: 0}
          - {id: behinderung, label: "Behinderung", value: 0}
      
      - id: verstaendigung
        label: "Verständigung"
        basis: [KL, IN, CH]
        items:
          - {id: zauberschrift, label: "Zauberschrift", value: 0}
          - {id: sinnenteilen, label: "Sinnenteilen", value: 0}
          - {id: ruf_klang, label: "Ruf/Klang", value: 0}
          - {id: fernbotschaft, label: "Fernbotschaft", value: 0}
          - {id: objekt_befragen, label: "Objekt befragen", value: 0}
          - {id: geistbund, label: "Geistbund", value: 0}

      - id: verwandlung_unbelebt
        label: "Verwandlung (Unbelebt)"
        basis: [KL, KK, KO]
        items:
          - {id: materialtransformation, label: "Materialtransformation", value: 0}
          - {id: funktionsmanipulation, label: "Funktionsmanipulation", value: 0}
          - {id: formgebung_umformung, label: "Formgebung/Umformung", value: 0}
          - {id: reinigung_entgiftung_objekte, label: "Reinigung/Entgiftung (Objekte)", value: 0}

  - id: gottheit
    label: "Gottheit"
    items:
      - {id: praios, label: "Praios - Gott der Sonne, Zeit und Gerechtigkeit"}
      - {id: rondra, label: "Rondra - Göttin des Kampfes und des Sturms"}
      - {id: efferd, label: "Efferd - Gott des Meeres und der Reisen"}
      - {id: travia, label: "Travia - Göttin des Herdes und der Gastfreundschaft"}
      - {id: boron, label: "Boron - Gott des Todes und des Schweigens"}
      - {id: hesinde, label: "Hesinde - Göttin der Weisheit und Magie"}
      - {id: firun, label: "Firun - Gott der Jagd und des Winters"}
      - {id: tsa, label: "Tsa - Göttin der Erneuerung und Wiedergeburt"}
      - {id: phex, label: "Phex - Gott des Handels und der Diebe"}
      - {id: peraine, label: "Peraine - Göttin der Landwirtschaft und Heilung"}
      - {id: ingerimm, label: "Ingerimm - Gott des Feuers und der Handwerkskunst"}
      - {id: rahja, label: "Rahja - Göttin der Liebe und des Rausches"}

  - id: liturgie_katalog
    label: "Liturgienkatalog"
    calc_id: "level_cost"
    cost_per_increment: 50
    exclude_from_ap: true
    show_if:
      field: "gottheit"
      operator: "not_empty"
    groups:
      - id: grundsegnungen
        label: "Primärsegnungen"
        items:
          - {id: eidsegen, label: "Eidsegen (Praios)", level: 0}
          - {id: schutzsegen_grund, label: "Schutzsegen (Rondra)", level: 0}
          - {id: tranksegen, label: "Tranksegen (Efferd)", level: 0}
          - {id: speisesegen, label: "Speisesegen (Travia)", level: 0}
          - {id: grabsegen, label: "Grabsegen (Boron)", level: 0}
          - {id: weisheitssegen, label: "Weisheitssegen (Hesinde)", level: 0}
          - {id: maertyrersegen, label: "Märtyrersegen (Firun)", level: 0}
          - {id: geburtssegen, label: "Geburtssegen (Tsa)", level: 0}
          - {id: glueckssegen, label: "Glückssegen (Phex)", level: 0}
          - {id: heilungssegen, label: "Heilungssegen (Peraine)", level: 0}
          - {id: feuersegen, label: "Feuersegen (Ingerimm)", level: 0}
          - {id: harmoniesegen, label: "Harmoniesegen (Rahja)", level: 0}

      - id: liturgiekenntnis
        label: "Liturgiekenntnis"
        basis: [KL, IN, CH]
        show_if:
          field: "gottheit"
          operator: "not_empty"
        items:
          - {id: liturgiekenntnis, label: "Liturgiekenntnis", level: 1}

      - id: praios_liturgien
        label: "Praios-Liturgien"
        basis: [MU, KL, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "praios"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: blendstrahl, label: "Blendstrahl", level: 1}
          - {id: innere_ruhe, label: "Innere Ruhe", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: lehnseid, label: "Lehnseid", level: 2}
          - {id: magiesicht, label: "Magiesicht", level: 2}
          - {id: goldene_ruestung, label: "Goldene Rüstung", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: furcht_loesen_bannen, label: "Furcht lösen und bannen", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: argelions_mantel, label: "Argelions Mantel", level: 3}
          - {id: licht_des_herrn, label: "Licht des Herrn", level: 3}
          - {id: praios_mahnung, label: "Praios’ Mahnung", level: 3}
          - {id: ordnender_blick, label: "Ordnender Blick", level: 3}
          - {id: unverstellter_blick, label: "Unverstellter Blick", level: 3}
          - {id: magiebann, label: "Magiebann", level: 4}
          - {id: dunkelheit_vertreiben, label: "Dunkelheit vertreiben", level: 4}
          - {id: seelenheilung, label: "Seelenheilung", level: 4}
          - {id: wille_zur_wahrheit, label: "Wille zur Wahrheit", level: 4}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekration, label: "Konsekration", level: 5}
          - {id: zerschmetternder_bannstrahl, label: "Zerschmetternder Bannstrahl", level: 5}
          - {id: argelions_bannende_hand, label: "Argelions bannende Hand", level: 5}
          - {id: garafans_gleissende_schwingen, label: "Garafans Gleißende Schwingen", level: 5}
          - {id: arcanum_interdictum, label: "Arcanum Interdictum", level: 6}

      - id: rondra_liturgien
        label: "Rondra-Liturgien"
        basis: [MU, KK, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "rondra"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: wetter_und_gewaesser, label: "Wetter und Gewässer", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekration, label: "Konsekration", level: 5}
          - {id: rondras_wundersame_ruestung, label: "Rondras wundersame Rüstung", level: 5}
          - {id: segnung_der_schlacht, label: "Segnung der Schlacht", level: 5}
          - {id: kriegsruf_der_kirche, label: "Kriegsruf der Kirche", level: 6}

      - id: efferd_liturgien
        label: "Efferd-Liturgien"
        basis: [MU, KO, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "efferd"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: tierempathie, label: "Tierempathie", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: wetter_und_gewaesser, label: "Wetter und Gewässer", level: 2}
          - {id: gesegneter_fang, label: "Gesegneter Fang", level: 2}
          - {id: ruf_der_gefaehrten, label: "Ruf der Gefährten", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: bootssegen, label: "Bootssegen", level: 3}
          - {id: mannschaftssegen, label: "Mannschaftssegen", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}

      - id: travia_liturgien
        label: "Travia-Liturgien"
        basis: [KL, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "travia"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: mahlzeit_segnen, label: "Mahlzeit segnen", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: nahrung_erschaffen, label: "Nahrung erschaffen", level: 2}
          - {id: heimstein_verorten, label: "Heimstein verorten", level: 2}
          - {id: treue_des_tiergefaehrten, label: "Treue des Tiergefährten", level: 2}
          - {id: feuerhaut, label: "Feuerhaut", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: freundliche_aufnahme, label: "Freundliche Aufnahme", level: 3}
          - {id: segnung_des_heimes, label: "Segnung des Heimes", level: 3}
          - {id: schwellenbann, label: "Schwellenbann", level: 3}
          - {id: speisen_wasser_reinigen, label: "Speisen und Wasser reinigen", level: 3}
          - {id: segen_der_heiligen_noiona, label: "Segen der Heiligen Noiona", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: gebet_der_sicheren_zuflucht, label: "Gebet der sicheren Zuflucht", level: 5}
          - {id: grosse_weihe_des_heimsteins, label: "Große Weihe des Heimsteins", level: 6}
          - {id: travias_verborgene_halle, label: "Travias verborgene Halle", level: 6}

      - id: boron_liturgien
        label: "Boron-Liturgien"
        basis: [MU, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "boron"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: gesegneter_schlaf, label: "Gesegneter Schlaf", level: 1}
          - {id: ruf_zur_ruhe, label: "Ruf zur Ruhe", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: traumwirken, label: "Traumwirken", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: kraeuterwissen, label: "Kräuterwissen", level: 2}
          - {id: geisterblick, label: "Geisterblick", level: 2}
          - {id: tiefschlaf, label: "Tiefschlaf", level: 2}
          - {id: grabweihung, label: "Grabweihung", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: furcht_loesen_bannen, label: "Furcht lösen und bannen", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: hauch_borons, label: "Hauch Borons", level: 3}
          - {id: siegel_borons, label: "Siegel Borons", level: 3}
          - {id: segen_der_heiligen_noiona, label: "Segen der Heiligen Noiona", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: nemekaths_zwiesprache, label: "Nemekaths Zwiesprache", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}

      - id: hesinde_liturgien
        label: "Hesinde-Liturgien"
        basis: [KL, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "hesinde"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: sprechende_symbole, label: "Sprechende Symbole", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: magiesicht, label: "Magiesicht", level: 2}
          - {id: gift_erkennen, label: "Gift erkennen", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: argelions_mantel, label: "Argelions Mantel", level: 3}
          - {id: ordnender_blick, label: "Ordnender Blick", level: 3}
          - {id: hesindes_fingerzeig, label: "Hesindes Fingerzeig", level: 3}
          - {id: aura_der_form, label: "Aura der Form", level: 3}
          - {id: unverstellter_blick, label: "Unverstellter Blick", level: 3}
          - {id: graues_siegel, label: "Graues Siegel", level: 3}
          - {id: zauberspiegel, label: "Zauberspiegel", level: 4}
          - {id: seelenheilung, label: "Seelenheilung", level: 4}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: alchimistische_erkenntnis, label: "Alchimistische Erkenntnis", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: argelions_bannende_hand, label: "Argelions bannende Hand", level: 5}
          - {id: schoepferische_eingebung, label: "Schöpferische Eingebung", level: 5}

      - id: firun_liturgien
        label: "Firun-Liturgien"
        basis: [MU, KO, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "firun"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: wetter_und_gewaesser, label: "Wetter und Gewässer", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: furcht_loesen_bannen, label: "Furcht lösen und bannen", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}

      - id: tsa_liturgien
        label: "Tsa-Liturgien"
        basis: [KL, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "tsa"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: gegenstaende_reparieren, label: "Gegenstände reparieren", level: 1}
          - {id: kaelbchensegen, label: "Kälbchensegen", level: 1}
          - {id: wundersame_bluetenpracht, label: "Wundersame Blütenpracht", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: tierempathie, label: "Tierempathie", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: heilwunder, label: "Heilwunder", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: segensreicher_neuanfang, label: "Segensreicher Neuanfang", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: eidechsenhaut, label: "Eidechsenhaut", level: 3}
          - {id: verbergen, label: "Verbergen", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: befreiung, label: "Befreiung", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: tsas_wunderbare_erneuerung, label: "Tsas Wunderbare Erneuerung", level: 5}
          - {id: tsas_ewige_jugend, label: "Tsas ewige Jugend", level: 6}

      - id: phex_liturgien
        label: "Phex-Liturgien"
        basis: [MU, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "phex"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: magiesicht, label: "Magiesicht", level: 2}
          - {id: auge_des_haendlers, label: "Auge des Händlers", level: 2}
          - {id: auge_des_mondes, label: "Auge des Mondes", level: 2}
          - {id: blick_fuer_das_handwerk, label: "Blick für das Handwerk", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: verbergen, label: "Verbergen", level: 3}
          - {id: unverstellter_blick, label: "Unverstellter Blick", level: 3}
          - {id: graues_siegel, label: "Graues Siegel", level: 3}
          - {id: phexens_augenszwinkern, label: "Phexens Augenzwinkern", level: 3}
          - {id: phexens_elsterflug, label: "Phexens Elsterflug", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: nebelgestalt, label: "Nebelgestalt", level: 4}
          - {id: phexens_sternenwurf, label: "Phexens Sternenwurf", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: phexens_meisterschluessel, label: "Phexens Meisterschlüssel", level: 5}
          - {id: phexens_schatten, label: "Phexens Schatten", level: 5}
          - {id: schattenlarve, label: "Schattenlarve", level: 6}

      - id: peraine_liturgien
        label: "Peraine-Liturgien"
        basis: [KL, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "peraine"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: kaelbchensegen, label: "Kälbchensegen", level: 1}
          - {id: mahlzeit_segnen, label: "Mahlzeit segnen", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: heilwunder, label: "Heilwunder", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: pflanzengespuer, label: "Pflanzengespür", level: 2}
          - {id: kleiner_giftbann, label: "Kleiner Giftbann", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: saat_schuetzen, label: "Saat schützen", level: 3}
          - {id: speisen_wasser_reinigen, label: "Speisen und Wasser reinigen", level: 3}
          - {id: segen_der_heiligen_noiona, label: "Segen der Heiligen Noiona", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: fruehlingslobpreisung, label: "Frühlingslobpreisung", level: 5}

      - id: ingerimm_liturgien
        label: "Ingerimm-Liturgien"
        basis: [MU, KK, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "ingerimm"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: gegenstaende_reparieren, label: "Gegenstände reparieren", level: 1}
          - {id: heilige_schmiedeglut, label: "Heilige Schmiedeglut", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: blick_fuer_das_handwerk, label: "Blick für das Handwerk", level: 2}
          - {id: feuerhaut, label: "Feuerhaut", level: 2}
          - {id: felsenschutz, label: "Felsenschutz", level: 2}
          - {id: metall_erhitzen, label: "Metall erhitzen", level: 2}
          - {id: segensreicher_neuanfang, label: "Segensreicher Neuanfang", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: waliburias_wehr, label: "Waliburias Wehr", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: feuer_lenken, label: "Feuer lenken", level: 4}
          - {id: unterirdische_gefahr_erspueren, label: "Unterirdische Gefahr erspüren", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: lavastroeme_lenken, label: "Lavaströme lenken", level: 5}
          - {id: schutz_vor_ingerimms_zorn, label: "Schutz vor Ingerimms Zorn", level: 5}
          - {id: schoepferische_eingebung, label: "Schöpferische Eingebung", level: 5}
          - {id: eherne_kraft_lodernder_zorn, label: "Eherne Kraft – lodernder Zorn", level: 6}

      - id: rahja_liturgien
        label: "Rahja-Liturgien"
        basis: [IN, GE, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "rahja"
        items:
          - {id: goettliches_zeichen, label: "Göttliches Zeichen", level: 1}
          - {id: prophezeiung, label: "Prophezeiung", level: 1}
          - {id: gesegneter_schlaf, label: "Gesegneter Schlaf", level: 1}
          - {id: objektsegen, label: "Objektsegen", level: 1}
          - {id: rausch_loesen, label: "Rausch lösen", level: 1}
          - {id: sprachverstaendigung, label: "Sprachverständigung", level: 2}
          - {id: handwerk_segnen, label: "Handwerk segnen", level: 2}
          - {id: traumwirken, label: "Traumwirken", level: 2}
          - {id: initiation, label: "Initiation", level: 2}
          - {id: objektweihe, label: "Objektweihe", level: 2}
          - {id: heiliger_befehl, label: "Heiliger Befehl", level: 2}
          - {id: rauschsegen, label: "Rauschsegen", level: 2}
          - {id: heiliges_liebesspiel, label: "Heiliges Liebesspiel", level: 2}
          - {id: zauber_fluchbruch, label: "Zauber- und Fluchbruch", level: 3}
          - {id: exorzismus, label: "Exorzismus", level: 3}
          - {id: seelenpruefung, label: "Seelenprüfung", level: 3}
          - {id: vision, label: "Vision", level: 3}
          - {id: tiergestalt, label: "Tiergestalt", level: 3}
          - {id: fest_der_freude, label: "Fest der Freude", level: 3}
          - {id: segen_der_heiligen_noiona, label: "Segen der Heiligen Noiona", level: 3}
          - {id: liturgieeinweisung, label: "Liturgieeinweisung", level: 4}
          - {id: ordination, label: "Ordination", level: 4}
          - {id: befreiung, label: "Befreiung", level: 4}
          - {id: anathema, label: "Anathema", level: 5}
          - {id: konsekreation, label: "Konsekration", level: 5}
          - {id: khablas_makelloser_leib, label: "Khablas makelloser Leib", level: 5}
          - {id: rahjas_sinnlichkeit, label: "Rahjas Sinnlichkeit", level: 6}

  - id: grundsegnungen
    label: "Primärsegnungen"
    calc_id: "value_only"
    exclude_from_ap: true
    items:
      - {id: eidsegen, label: "Eidsegen (Praios)", level: 0}
      - {id: schutzsegen_grund, label: "Schutzsegen (Rondra,)", level: 0}
      - {id: tranksegen, label: "Tranksegen (Efferd)", level: 0}
      - {id: speisesegen, label: "Speisesegen (Travia)", level: 0}
      - {id: grabsegen, label: "Grabsegen (Boron)", level: 0}
      - {id: weisheitssegen, label: "Weisheitssegen (Hesinde)", level: 0}
      - {id: maertyrersegen, label: "Märtyrersegen (Firun)", level: 0}
      - {id: geburtssegen, label: "Geburtssegen (Tsa)", level: 0}
      - {id: glueckssegen, label: "Glückssegen (Phex)", level: 0}
      - {id: heilungssegen, label: "Heilungssegen (Peraine)", level: 0}
      - {id: feuersegen, label: "Feuersegen (Ingerimm)", level: 0}
      - {id: harmoniesegen, label: "Harmoniesegen (Rahja)", level: 0}

  - id: liturgiekenntnis
    label: "Liturgiekenntnis"
    calc_id: "base_plus_value"
    cost_per_increment: 5
    include_in_ap_when:
      logic: "and"
      rules:
        - {field: "Kopfzeile-character-profession", operator: "equals", value: "Geweihter"}
        - {field: "gottheit", operator: "has_value"}
    basis_by_state:
      field: "gottheit"
      mapping:
        praios: [MU, KL, CH]
        rondra: [MU, KK, CH]
        efferd: [MU, KO, CH]
        travia: [KL, IN, CH]
        boron: [MU, IN, CH]
        hesinde: [KL, IN, CH]
        firun: [MU, KO, CH]
        tsa: [KL, IN, CH]
        phex: [MU, IN, CH]
        peraine: [KL, IN, CH]
        ingerimm: [MU, KK, CH]
        rahja: [IN, GE, CH]
    items:
      - {id: liturgiekenntnis, label: "Liturgiekenntnis", value: 0}

  - id: erlernte_liturgien
    label: "Erlernte Liturgien"
    calc_id: "level_cost"
    cost_per_increment: 50
    include_in_ap_when:
      logic: "and"
      rules:
        - {field: "Kopfzeile-character-profession", operator: "equals", value: "Geweihter"}
        - {field: "gottheit", operator: "has_value"}
    repeatable_rows:
      enabled: true
      min_rows: 1
      template_item_id: "liturgie_01"
      add_label: "+ Liturgie"
      remove_label: "Entfernen"
    items:
      - id: liturgie_01
        label: ""
        value: 0
        fields:
          - id: name
            type: "select"
            value: ""
            allow_empty: true
            empty_label: "-- Liturgie auswählen --"
            options_from:
              section_id: "liturgie_katalog"
              group_id_by_state_key: "gottheit"
              show_level: true
              group_id_map:
                praios: "praios_liturgien"
                rondra: "rondra_liturgien"
                efferd: "efferd_liturgien"
                travia: "travia_liturgien"
                boron: "boron_liturgien"
                hesinde: "hesinde_liturgien"
                firun: "firun_liturgien"
                tsa: "tsa_liturgien"
                phex: "phex_liturgien"
                peraine: "peraine_liturgien"
                ingerimm: "ingerimm_liturgien"
                rahja: "rahja_liturgien"
              exclude_selected_from_section: "erlernte_liturgien"
              exclude_selected_field_id: "name"
            on_change_set_value_from_source: "level"
            on_change_set_label_from_source: false
            rerender_on_change: true`;