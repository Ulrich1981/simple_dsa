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
        subtract_field_id: "kampf"
        bracket: "selected_value"
    weapon_parry_value:
      type: "field_plus_section_field"
      params:
        own_field_id: "f3"
        section_id: "Rüstung"
        item_id: "armor_1"
        section_field_id: "armor"
    armor_rs:
      type: "sum_terms"
      params:
        terms:
          - { source: "section_item_field", section_id: "Rüstung", item_id: "armor_1", field_id: "armor" }
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
      # Jede Zeile: frei beschreibbarer Name und Waffenwerte
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
          - { id: verbergen, type: "number", value: "" }
  - id: Rüstungskatalog
    label: "Rüstungskatalog"
    calc_id: "value_only"
    cost_per_increment: 0
    exclude_from_ap: true
    items:
      - id: lederruestung
        label: "Lederrüstung"
        value: 1
        fields:
          - { id: armor, type: "number", value: 1 }
          - { id: malus, type: "number", value: 1 }
          - { id: kampf, type: "number", value: 0 }
      - id: verstaerkte_lederruestung
        label: "Verstärkte Lederrüstung"
        value: 2
        fields:
          - { id: armor, type: "number", value: 2 }
          - { id: malus, type: "number", value: 2 }
          - { id: kampf, type: "number", value: 1 }
      - id: kettenhemd
        label: "Kettenhemd"
        value: 3
        fields:
          - { id: armor, type: "number", value: 3 }
          - { id: malus, type: "number", value: 3 }
          - { id: kampf, type: "number", value: 1 }
      - id: schuppenpanzer
        label: "Schuppenpanzer"
        value: 4
        fields:
          - { id: armor, type: "number", value: 4 }
          - { id: malus, type: "number", value: 4 }
          - { id: kampf, type: "number", value: 2 }
      - id: plattenpanzer
        label: "Plattenpanzer"
        value: 5
        fields:
          - { id: armor, type: "number", value: 5 }
          - { id: malus, type: "number", value: 5 }
          - { id: kampf, type: "number", value: 2 }

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
          - id: armor_type
            type: "select"
            value: ""
            allow_empty: true
            empty_label: "-- Rüstung auswählen --"
            options_from:
              section_id: "Rüstungskatalog"
            on_change_set_label_from_source: false
            on_change_set_fields:
              "": { armor: 0, malus: 0, kampf: 0 }
          - { id: armor, type: "number", value: 0 }
          - { id: malus, type: "number", value: 0 }
          - { id: kampf, type: "number", value: 0 }
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
    cost_per_increment: 5
    item_details: {
      "magischer_schutz": {
        "basis": "KL, IN, CH",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Rüstung gegen direkten Magieschaden und verzauberte Waffen.",
        "qualitaet": "RS gegen Magie = QP/2 (aufgerundet).",
        "modifikatoren": [
          "Unsichtbar (+1 Kategorie): Schutz nicht sichtbar."
        ]
      },
      "magieresistenz": {
        "basis": "KL, IN, CH",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Erhöht MR; erschwert gegen das Ziel gerichtete Zauber.",
        "qualitaet": "Zusätzliche MR = QP/2 (aufgerundet).",
        "modifikatoren": [
          "Reflektierend (+2 Kategorien): Zauber zurückwerfen.",
          "Absorption (+3 Kategorien): Zauberenergie in AsP wandeln."
        ]
      },
      "bann": {
        "basis": "KL, IN, CH",
        "erschwernis": "5",
        "kosten": "15",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Std",
        "wirkung": "Beendet Zauber und permanente Beschwörungsbindungen; bannt Dämonen, beendet Untotenbelebung. Geister nur für die Wirkungsdauer fernhalten.",
        "qualitaet": "QP ≥ Zauberqualität bzw. Wesenmacht.",
        "modifikatoren": [
          "Vernichtung (+4 Kategorien): Magie oder unkörperliches Wesen zerstören; materieller Träger bleibt."
        ]
      },
      "artefaktbindung": {
        "basis": "KL, IN, CH",
        "erschwernis": "10",
        "kosten": "20 + gespeicherter Zauber",
        "zauberdauer": "1 Std",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Monat",
        "wirkung": "Speichert einen bekannten Zauber einmalig in Gegenstand/Trank. Dessen volle Kosten kommen hinzu; Profil und Wirkungsdauer bleiben beim Auslösen erhalten.",
        "qualitaet": "Gespeicherte Zauberstärke höchstens QP.",
        "modifikatoren": [
          "Ladungen (+1 Kategorie/Ladung): Zusätzliche Wirkungen.",
          "Trigger (+1 Kategorie): Berührung, Kommandowort oder Situation als Auslöser.",
          "Permanenz (+1 Kategorie, 1 AsP permanent / 10 AsP): Dauerhafte Bindung; je angefangene 10 gespeicherte AsP 1 AsP permanent. Daueraktiv nur mit Wirkungsdauer Permanent; Sofortzauber bleiben einzelne Ladungen.",
          "Intelligentes Artefakt (+5 Kategorien): Aktiviert sich selbstständig."
        ]
      },
      "zauberumformung": {
        "basis": "KL, IN, CH",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Bestehenden Zauber umkehren oder aufheben; vergleichende Probe gegen ursprüngliche Qualität. Umformung endet mit dem ersten der beiden Zauber; Aufhebung bleibt.",
        "qualitaet": "Umgekehrte Zauberstärke höchstens QP."
      },
      "einfluss": {
        "basis": "MU, IN, CH",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Lenkt Gefühle und Verhalten, keine Befehle ohne Modifikator. Unfreiwillig: MR als Erschwernis; mehrere Ziele: höchste MR +1 je weiterer Person.",
        "qualitaet": "QP 1–2: Impuls; 3–5: stark lenkend; 6+: überwältigend. Beeinträchtigte Aktionen: −QP/2. Kein Zwang gegen Selbsterhaltung/Überzeugungen.",
        "modifikatoren": [
          "Geisteskontrolle (+2 Kategorien): QP/2 einfache Befehle; keine Selbstgefährdung.",
          "Verstärkt (+4 Kategorien): Auch komplexe/selbstgefährdende Beeinflussung; QP/2 Befehle, Kontrolle enthalten.",
          "Subtil (+3 Kategorien): Beeinflussung erscheint selbstgewollt; QP/2 einfache Befehle enthalten, keine Selbstgefährdung."
        ]
      },
      "bewusstseinstruebung": {
        "basis": "MU, IN, CH",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Stört Konzentration; Schlaf nur mit Modifikator. Unfreiwillig: MR wie bei Einfluss.",
        "qualitaet": "Erschwernis für alle Proben des Ziels = QP/2.",
        "modifikatoren": [
          "Gedächtnislücken (+2 Kategorien): Informationen/Erlebnisse vergessen, auch bei Schlaf und Träumen.",
          "Schlaf (+1 Kategorie): Schlaftiefe QP; Schmerz weckt. 1 Std Schlaf: zusätzlich +2 Dauerkategorien.",
          "Traumkontrolle (+3 Kategorien): Schlaf samt Traumsteuerung; Tiefe QP, Schmerz weckt.",
          "Unaufweckbar (+4 Kategorien): Schlaf mit Tiefe QP; nur Zauberbruch weckt."
        ]
      },
      "zwang": {
        "basis": "MU, IN, CH",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Erzwingt eine Handlung/Unterlassung oder wahre Antworten aus bekanntem Wissen; MR wie Einfluss. Antworten beenden den Zauber nicht. Körperumbau gehört zu Metamorphose.",
        "qualitaet": "QP/2 Fragen. QP 1–2: knapp; 3–5: Zusammenhänge; 6+: Details. Lähmung: QP 1–2 lässt Sprechen zu, ab QP 6 vollständig.",
        "modifikatoren": [
          "Selektiv (-1 Kategorie): Nur eine Funktion oder Teilhandlung.",
          "Verstärkt (+1 Kategorie): Vollständiger Zwang; Lähmung auch der Sprache.",
          "Schmerzlos (+1 Kategorie): Keine zusätzliche Angst/Panik.",
          "Vollständigkeit (+1 Kategorie): Kein Umgehen durch Auslassungen oder Ersatzhandlungen.",
          "Subtil (+2 Kategorien): Zwang erscheint als eigene Entscheidung."
        ]
      },
      "gedankenlesen": {
        "basis": "MU, IN, CH",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "1 Min",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Liest Gedanken/Erinnerungen gegen MR. Keine objektive Wahrheit; Irrtümer bleiben. Freiwilliger Austausch: Geistiger Kontakt.",
        "qualitaet": "QP 1–2: aktuelle Gedanken/Absichten; 3–5: jüngere Erinnerungen; 6+: ältere Fragmente.",
        "modifikatoren": [
          "Verstärkt (+1 Kategorie): Tiefere/ältere Erinnerungen, detaillierter",
          "Gefühle (-1 Kategorie): Liest nur Gefühle; Lügen erkennen",
          "Oberflächengedanken (-2 Kategorien): Nur aktuelle, bewusste Gedanken",
          "Traumlesung (+2 Kategorien): Liest Träume und Unterbewusstsein"
        ]
      },
      "geistiger_kontakt": {
        "basis": "MU, IN, CH",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Sendet freiwillige Eindrücke/Botschaften oder befragt Gegenstände. Unwillige Empfänger wehren mit MR ab; kein Gedankenlesen. Bekannte Orte durch Reichweitenerhöhung; dauernder Austausch nur mit Bund-Modifikator, je ein Ziel.",
        "qualitaet": "Lebende: QP 1–2 grob, 3–5 eindeutig, 6+ nuanciert; keine Ergänzung/Korrektur. Objekte: QP/2 kurze Antworten, Komplexität QP, Ereignisalter QP Monate. Bundstärke QP.",
        "modifikatoren": [
          "Emotionaler Link (-1 Kategorie): Nur Gefühle.",
          "Vollständiges Teilen (+2 Kategorien): Alle Sinne gleichzeitig.",
          "Einseitig (+0 Kategorien): Nur senden oder empfangen.",
          "Verstärkend (+2 Kategorien): Intensivere Eindrücke/Gefühle.",
          "Traumbotschaft (+1 Kategorie): Erscheint als Traum/natürliches Zeichen.",
          "Antwortfunktion (+1 Kategorie): Unmittelbare Rückantwort.",
          "Geistbund (+1 Kategorie): Wechselseitiger Bund, gemeinsames Zaubern; keine AsP-Teilung.",
          "Kraftteilung (+2 Kategorien): Bund, gemeinsames Zaubern und AsP teilen.",
          "Gedankenaustausch (+2 Kategorien): Bund, volle Telepathie, gemeinsames Zaubern.",
          "Kampfkoordination (+3 Kategorien): Bund, perfekte Kampfkoordination, gemeinsames Zaubern.",
          "Detaillierte Antworten (+2 Kategorien): Ausführliche, zusammenhängende Auskünfte.",
          "Emotionale Eindrücke (+1 Kategorie): Gefühle zu Informationen erschließen.",
          "Lebewesenbefragung (+1 Kategorie): Auch Pflanzen/einfache Tiere, ihrem Verständnis gemäß."
        ]
      },
      "wahrnehmung": {
        "basis": "KL, IN, IN",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Selbst",
        "wirkungsdauer": "1 Min",
        "wirkung": "Verstärkt einen eigenen Sinn. Fernwahrnehmung nur mit Modifikator; Zielort innerhalb der separat erhöhten Reichweite.",
        "qualitaet": "Sinnesbonus = QP.",
        "modifikatoren": [
          "Mehrfachsinne (+1 Kategorie pro zusätzlichem Sinn): Weitere Sinne, auch fern/in der Vergangenheit.",
          "Übersinnlich (+3 Kategorien): Übernatürliche Eindrücke, z. B. Auren.",
          "Selektiv (+1 Kategorie): Störende Eindrücke ausblenden.",
          "Fernwahrnehmung (+1 Kategorie): Sinn verlagern, auch unsichtbare Orte; Klarheit QP. Reichweite ab Selbst separat, Sicht +3.",
          "Objektsuche (+2 Kategorien): Bekanntes Objekt finden, auch an bekannten Orten; Reichweite ab Selbst separat, Klarheit QP.",
          "Unbekannte Orte (+3 Kategorien): Unbekannten Ort erkunden; Klarheit QP.",
          "Vergangenheitssicht (+4 Kategorien): Vergangenes sehen; Fernwahrnehmung enthalten, Klarheit QP."
        ]
      },
      "analyse": {
        "basis": "KL, IN, IN",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Erkennt grobe Art von Magie, Wesen und Material; bei Elementen gilt Elementwahl. Formeln, Strukturen, Schwächen und Kampfwerte nur mit passendem Modifikator.",
        "qualitaet": "QP Merkmale bzw. Details im gewählten Untersuchungsfeld; ersetzt keine Modifikatoren.",
        "modifikatoren": [
          "Verstärkt (+1 Kategorie): Art/Stärke genauer bestimmen.",
          "Astralsicht (+3 Kategorien): Astrale Strukturen und Bindungen sehen.",
          "Magieanalyse (+2 Kategorien): Zauberformeln und magische Schwächen erkennen.",
          "Durchdringend (+2 Kategorien): Illusionen/Verschleierungen durchschauen.",
          "Kampfwerte (+1 Kategorie): Kampfwerte und Fertigkeiten erkennen.",
          "Schwachstellen (+2 Kategorien): Verwundbarkeiten/Angriffspunkte erkennen.",
          "Potenzial (+3 Kategorien): Verborgene Fähigkeiten erkennen.",
          "Analytisch (+1 Kategorie): Genaue Zusammensetzung/Eigenschaften bestimmen."
        ]
      },
      "illusion": {
        "basis": "IN, CH, GE",
        "erschwernis": "0",
        "kosten": "5",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Täuscht einen Sinn. Weitere Sinne/Flächen nur mit Modifikatoren. Unplausible Illusionen sind leichter zu durchschauen.",
        "qualitaet": "Realismus, Komplexität und Widerstand gegen Sinnesschärfe = QP.",
        "modifikatoren": [
          "Mehrsinnig (+1 Kategorie je zusätzlichem Sinn): Betrifft mehrere Sinne gleichzeitig",
          "Detailgrad (+1 Kategorie): Realistischere, konsistente Details",
          "Sinnzerstörung (+1 Kategorie): Nimmt den Sinn komplett weg",
          "Bewegte Illusion (+2 Kategorien): Illusion kann sich bewegen und verändern",
          "Interaktive Illusion (+3 Kategorien): Illusion reagiert auf Berührung und Interaktion",
          "Komplexität (+1-2 Kategorien): Verschachtelte Muster; größere Zonen separat."
        ]
      },
      "maskierung": {
        "basis": "IN, CH, GE",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Täuscht Erscheinung/Kleidung oder löscht Spuren, während der Dauer auch neue. Gelöschte Spuren bleiben fort. Verkleidung ohne Substanz, durch Interaktion entlarvbar. Unsichtbarkeit/Kopien nur mit Modifikatoren.",
        "qualitaet": "Tarnung, magischer Entdeckungswiderstand und Spurensuche-Erschwernis = QP; Kopien gegen Sinnesschärfe.",
        "modifikatoren": [
          "Detailgrad (+1 Kategorie): Stimmige Feinheiten von Erscheinung/Spuren.",
          "Mehrsinnig (+1 Kategorie je zusätzlichem Sinn): Weitere Sinne verändern/dämpfen.",
          "Größenänderung (+1 Kategorie): Scheinbare Größe von Ziel/Kopien/Spuren ändern.",
          "Unsichtbarkeit (+1 Kategorie): Optisch unsichtbar; Geräusche/Gerüche/Spuren bleiben.",
          "Bewegungsanpassung (+2 Kategorien): Unsichtbar auch bei schneller Bewegung.",
          "Objektunsichtbarkeit (+2 Kategorien): Unsichtbar samt getragenen/berührten Objekten.",
          "Selektive Sichtbarkeit (+3 Kategorien): Nur für gewählte Personen unsichtbar.",
          "Doppelgänger (+1 Kategorie): Bewegungsnachahmende Kopie erschwert Angriffe/Zielwahl.",
          "Mehrere Doppelgänger (+1 Kategorie für die erste Kopie, +1 pro weiterer Kopie): Mehrere nachahmende Kopien.",
          "Unabhängige Bewegung (+3 Kategorien): Selbstständig bewegte Kopie.",
          "Substanzielle Kopien (+4 Kategorien): Nachahmende Kopie mit begrenzter physischer Wirkung.",
          "Medium (+1 Kategorie): Weiteres Trägermedium; weitere Sinne stattdessen Mehrsinnig, nicht doppelt.",
          "Astrale Verwischung (+2 Kategorien): Astrale Signaturen von Ziel/Kopien/Spuren tarnen."
        ],
        "hinweis": "Mehrere Personen: Mehrere Ziele; Unsichtbarkeit nur einmal bezahlen."
      },
      "zeichensetzung": {
        "basis": "IN, CH, GE",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Verschlüsselte Schrift (etwa ein Blatt, Schlüssel nötig), Ruf oder Klang für die Wirkungsdauer. Rufe übertönen Umgebung; größere Distanz separat. Verstandenes bleibt bekannt.",
        "qualitaet": "Verschlüsselung bzw. Lautstärke/Klarheit = QP.",
        "modifikatoren": [
          "Selbstzerstörung (+1 Kategorie): Erlischt nach Nutzung/unbefugtem Zugriff.",
          "Bedingte Wahrnehmbarkeit (+1 Kategorie): Nur unter festgelegten Bedingungen wahrnehmbar.",
          "Lebende Zeichen (+3 Kategorien): Aktualisierung/Antworten aus hinterlegtem Wissen.",
          "Gerichtet (+1 Kategorie): Nur für bestimmte Personen wahrnehmbar.",
          "Kodierte Botschaft (+1 Kategorie): Zusätzliche Information verstecken.",
          "Nachahmung (+1 Kategorie): Handschrift, Stimme oder Klang imitieren."
        ]
      },
      "heilung": {
        "basis": "IN, CH, KO",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "1 Min",
        "reichweite": "Berührung",
        "wirkungsdauer": "Sofort",
        "wirkung": "Heilt je Anwendung Wunden, ein Gift, Krankheit oder mentale Belastung; schwere Verletzungen ab QP 6. Giftart meist nötig, Kontakt-/Atemgifte ggf. Zusatzaufwand. Darf LE-Maximum überschreiten. Vorbeugender Schutz braucht erhöhte Dauer ab Kat. 0.",
        "qualitaet": "Heilung bzw. maximale Gift-/Krankheitsstufe = QP. Mentaler Folgeschutz = QP, Dauer separat.",
        "modifikatoren": [
          "Vollständige Wiederherstellung (+4 Kategorien): Verlorene körperliche/geistige Strukturen, Gliedmaßen kurz nach Verletzung.",
          "Umfassende Behandlung (+2 Kategorien): Alle Ursachen derselben Leidensart; Stärke durch QP begrenzt.",
          "Präventiv (+1 Kategorie): Rückfallschutz; Schutzdauer zusätzlich erhöhen.",
          "Übernatürliche Heilung (+3 Kategorien): Auch übernatürliche Ursachen; kein Zauberbann.",
          "Symptomlinderung (-1 Kategorie): Nur Beschwerden lindern, keine LE-/Ursachenheilung.",
          "Tiefenheilung (+3 Kategorien): Chronische Folgen/Phobien/Traumata; keine Gliedmaßen.",
          "Gedächtnisheilung (+2 Kategorien): Verlorene/unterdrückte Erinnerungen wiederherstellen.",
          "Persönlichkeitsheilung (+4 Kategorien): Beschädigte/gespaltene Persönlichkeit heilen."
        ]
      },
      "vitalitaet": {
        "basis": "IN, CH, KO",
        "erschwernis": "0",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Std",
        "wirkung": "Stärkt Erholung oder Schutz gegen eine Umwelt-/Elementbelastung. Erholung einmal bei nächster Regeneration innerhalb der Dauer; nur höchste QP, bis LE-Maximum. 24 Std: +2 Dauerkategorien. Elementwahl beachten; Zonen separat, keine Luft/Nahrung/Wasser.",
        "qualitaet": "Regenerationsbonus, Umwelt-Widerstandsbonus oder Elementarschutz/-resistenz = QP.",
        "modifikatoren": [
          "Vollimmunität (+3 Kategorien): Gewählte Belastung vollständig abwehren.",
          "Mehrfachschutz (+2 Kategorien pro zusätzlicher Belastungsart): Weitere Belastungen/Elemente; Elementwahl zusätzlich.",
          "Reflektierend (+2 Kategorien): Gerichtete Einwirkung zurückwerfen; kein Zusatzschaden bei Witterung/Erholung."
        ]
      },
      "potenzierung": {
        "basis": "IN, CH, KO",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Steigert eine körperliche/geistige Eigenschaft oder vorher gewählte Leistung, ohne Gestaltwechsel. Weitere Attribute nur mit Modifikator.",
        "qualitaet": "Eigenschaft +QP für Proben/Berechnungen, keine dauerhafte Steigerung/Ressourcenänderung. Gewählte Leistung nach eigenem Spielwert.",
        "modifikatoren": [
          "Reflexsteigerung (+1 Kategorie): Zusätzlich +QP auf Kampfproben.",
          "Mehrfachattribute (+1 Kategorie pro zusätzlichem Attribut): Steigert mehrere Attribute gleichzeitig"
        ]
      },
      "metamorphose": {
        "basis": "IN, CH, KO",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Bekannte Tiergestalt samt Sinnen/Bewegung/Waffen oder körperliche Funktionsänderung/Behinderung. Formen und Anpassung nach QP. Geistiger Zwang nicht enthalten.",
        "qualitaet": "Tierform: geistige Attribute höchstens QP; Behinderungsstärke QP.",
        "modifikatoren": [
          "Verstärkt (+1-3 Kategorien): Komplexere Gestalt, bessere Werte/tiefere Funktionsänderung.",
          "Teiländerung (-1 Kategorie): Nur ein Sinn, Körperteil oder eine Funktion.",
          "Hybridform (+1 Kategorie): Menschliche/tierische Merkmale oder Funktionen kombinieren.",
          "Größenänderung (+2 Kategorien): Körper oder Körperteile vergrößern/verkleinern.",
          "Lähmung (+1 Kategorie): Bewegung betroffener Körperteile unterbinden."
        ]
      },
      "fortbewegung": {
        "basis": "IN, GE, GE",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "3 KR",
        "reichweite": "Selbst",
        "wirkungsdauer": "5 Min",
        "wirkung": "Bewegung durch ein gewähltes Medium: fliegen, schwimmen, gleiten, Oberflächen/Feststoffe passieren. Teleportation nur mit Modifikator. Ggf. Orientierung und Erschöpfung.",
        "qualitaet": "Geschwindigkeit, Manövrierfähigkeit und Traglast = QP.",
        "modifikatoren": [
          "Manövrierfähigkeit (+1 Kategorie): Präzise Bewegung, Ausrichtung und Ankunftshaltung.",
          "Teleportation (+3 Kategorien): Ein Sprung, keine Rückkehr. Sichtbarer/bekannter/markierter Ort; Präzision QP. Reichweite ab Selbst separat: Sicht +3, bekannte Orte nah +4/fern +5.",
          "Lastenteleportation (+4 Kategorien): Ein Sprung samt schwerer Last; Präzision QP, Zielorte/Reichweite wie Teleportation.",
          "Verfolgungsteleportation (+5 Kategorien): Ein Sprung zur aktuellen Position eines bewegten Ziels; Präzision QP, Reichweite separat."
        ]
      },
      "telekinese": {
        "basis": "IN, GE, GE",
        "erschwernis": "0",
        "kosten": "5",
        "zauberdauer": "1 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Bewegt Ziele und betätigt Gegenstände, auch fein. Fixieren/Kleben/Versiegeln nur mit Funktionsmanipulation; kein Stoffumbau. Jeder Schadensangriff braucht neue Probe und volle Kosten.",
        "qualitaet": "Kraft QP × 10 kg; Tempo QP m/Runde; Funktionsstärke/Mechanismenzahl QP.",
        "modifikatoren": [
          "Gewicht/Feinmotorik (+1 Kategorie): Schwerere Ziele oder präzisere Eingriffe.",
          "Kraftvoll (+1 Kategorie): Schaden 1W6 + QP/2 oder Hindernis durchbrechen.",
          "Sanft (+0 Kategorien): Kein Schaden.",
          "Funktionsmanipulation (+1 Kategorie): Fixieren, kleben, versiegeln; Kohäsion/Mechanik verändern.",
          "Komplexe Mechanismen (+3 Kategorien): Auch magische/komplizierte Vorrichtungen; Funktionsmanipulation enthalten."
        ]
      },
      "sphaerenoeffnung": {
        "basis": "IN, GE, GE",
        "erschwernis": "25",
        "kosten": "25",
        "zauberdauer": "1 Min",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Min",
        "wirkung": "Begehbarer Übergang Welt ↔ Limbus am berührten Ort. Keine anderen Sphären/Beschwörung, kein Kreis oder Korruptionsrisiko allein durch Öffnung. Kein Limbus-Schutz, sichere Orientierung oder beliebiger Fernzielort.",
        "qualitaet": "Durchmesser QP m; Kräftekontrolle QP/3.",
        "modifikatoren": [
          "Kontrolliert (+3 Kategorien): Übergangskräfte/vorhandenen Sog gezielt steuern; erzeugt keinen Sog.",
          "Sog (+2 Kategorien): Zieht nahe Wesen/lose Objekte in den Limbus; kein automatischer Zusatzschaden.",
          "Einbahnstraße (+1 Kategorie): Nur gewählte Richtung; mit Sog in den Limbus."
        ]
      },
      "elementare_manipulation": {
        "basis": "KL, KK, KO",
        "erschwernis": "0",
        "kosten": "5",
        "zauberdauer": "1 KR",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Min",
        "wirkung": "Erschafft/formt/lenkt ein Element, Licht oder lokale Kräfte. Ein Angriff je Zauber; Dauerschaden und tragfähige Bauten nur mit Modifikatoren. Nichtschädigende Form während der Dauer lenkbar.",
        "qualitaet": "Kontrolle QP; Schaden 1W6 + QP/2; Bauten QP × QP m³, Stabilität QP.",
        "modifikatoren": [
          "Feinsteuerung (+1 Kategorie): Präzise Lenkung/Formung; keine Extra-Angriffe.",
          "Elementarerschaffung (+2 Kategorien): Tragfähige Bauten für die Wirkungsdauer.",
          "Komplex (+4 Kategorien): Komplexe/bewegliche Formen samt tragfähigen Bauten.",
          "Verstärkt (+3 Kategorien): Störungsfeste Wirkung samt tragfähigen Bauten; kein Schadensbonus.",
          "Durchschlagend (+1 Kategorie): Rüstung ignorieren; keine Extra-Ziele/-Angriffe.",
          "Anhaltend (+2 Kategorien): Selbsttätige Wirkung/Schaden über QP Runden, höchstens Wirkungsdauer."
        ]
      },
      "transmutation": {
        "basis": "KL, KK, KO",
        "erschwernis": "5",
        "kosten": "10",
        "zauberdauer": "1 Min",
        "reichweite": "Berührung",
        "wirkungsdauer": "Sofort",
        "wirkung": "Formt, fügt, repariert oder reinigt unbelebte Materie einschließlich leichter Gift-/Seuchenreste. Bearbeitung bleibt bestehen; Stoff-/Zustandswechsel nur mit Modifikatoren. Keine Elementerschaffung.",
        "qualitaet": "Form: QP m³; Reinigung: QP × 10 m²; Transformation: QP kg. Präzision/Komplexität/Reinigungsstärke QP.",
        "modifikatoren": [
          "Materialtransformation (+1 bis +5 Kategorien): Zustand/Temperatur/Bindung ändern. Stoff +1, Holz +2, Stein +3, Metall +4, gehärtete Legierungen +5.",
          "Vollständige Transformation (+3 bis +7 Kategorien): Andere Stoffart. Stoff +3, Holz +4, Stein +5, Metall +6, gehärtete Legierungen +7.",
          "Selektive Transformation (+2 bis +6 Kategorien): Zustand/Temperatur/Bindung einzelner Teile. Stoff +2, Holz +3, Stein +4, Metall +5, gehärtete Legierungen +6.",
          "Temperaturkontrolle (+2 bis +6 Kategorien): Zustand/Bindung mit präziser Hitze/Kälte ändern. Stoff +2, Holz +3, Stein +4, Metall +5, gehärtete Legierungen +6.",
          "Materialfusion (+1 Kategorie): Materialien nahtlos verbinden.",
          "Tiefenwirkung (+1 Kategorie): Innere Schichten/Einschlüsse erreichen.",
          "Magische Kontamination (+2 Kategorien): Magische Verunreinigung entfernen/trennen; kein Zauberbann.",
          "Restaurierung (+1 Kategorie): Ursprüngliche Farben/Oberflächen/Details herstellen.",
          "Selektive Bearbeitung (+1 Kategorie): Nur gewählte Teile/Schäden/Verunreinigungen; kein Stoff-/Zustandswechsel. In Selektive Transformation enthalten."
        ]
      },
      "elementarbeschwoerung": {
        "basis": "MU, CH, CH",
        "erschwernis": "10",
        "kosten": "20",
        "zauberdauer": "1 Min",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Std",
        "wirkung": "Ruft Elementar für einen benannten Dienst. Ohne Bindung eigenständig, darf naturwidrige Aufträge ablehnen. Kontrolle nur mit Bindung; längere/mächtigere Dienste separat.",
        "qualitaet": "Bereitschaft: QP 1–2 einfache/sichere Bitte; 3–5 klarer Auftrag; 6+ riskante Dienste. Keine Kontrolle/Dauertreue durch QP.",
        "modifikatoren": [
          "Verstärkt (+3 Kategorien/Stufe): Mächtigeres Wesen (niedere Diener → Dschinne → Elementarherren)",
          "Bindung (+2 Kategorien): Wesen ist vollständig kontrolliert",
          "Mehrfachbeschwörung (+2 Kategorien): Ruft mehrere schwächere Wesen gleichzeitig"
        ]
      },
      "daemonenbeschwoerung": {
        "basis": "MU, CH, CH",
        "erschwernis": "10",
        "kosten": "20",
        "zauberdauer": "1 Min",
        "reichweite": "Berührung",
        "wirkungsdauer": "1 Std",
        "wirkung": "Ruft niederen Dämon in vorbereiteten Ritualkreis, zunächst unkontrolliert. Nekromantie nur mit Thargunitoth-Ausbildung und berührten Leichnamen/Knochen. Bindung/Kontrolle nur für Wirkungsdauer, Verlängerung separat.",
        "qualitaet": "Dämonenmacht QP, Kontrolle QP/2; Untote: Anzahl QP/2, Stärke QP/3.",
        "modifikatoren": [
          "Gehörnter Dämon (+3 Kategorien/Horn): Mächtigerer Dämon.",
          "Bindung (+2 Kategorien): Dämon/Untoter sofort gebunden.",
          "Pakt (+4 Kategorien): Dienstvertrag über Monate/Jahre, keine volle Kontrolle; auch für Untote.",
          "Schutzkreis (-1 Kategorie): Dämon/Untoter kann Kreis nicht verlassen.",
          "Permanenz (+4 Kategorien): Dauerbindung/-belebung bis Bannung; 2 AsP permanent. Bindung und permanente Dauer enthalten."
        ]
      },
      "geisterbeschwoerung": {
        "basis": "MU, CH, CH",
        "erschwernis": "0",
        "kosten": "15",
        "zauberdauer": "1 Min",
        "reichweite": "Nah",
        "wirkungsdauer": "1 Std",
        "wirkung": "Ruft Geist/Kobold, keine Dämonen/Elementare; kein allgemeines Korruptionsrisiko. Nach Ablauf nur freiwilliger Verbleib. Vertreiben durch Bann.",
        "qualitaet": "Macht des Geistes + Bereitschaft zur Kooperation = QP.",
        "modifikatoren": [
          "Spezifischer Geist (+1 Kategorie): Ruft einen bestimmten, bekannten Geist",
          "Mehrfachbeschwörung (+2 Kategorien): Ruft mehrere schwächere Geister gleichzeitig",
          "Bindung (+2 Kategorien): Geist ist sofort an den Beschwörer gebunden",
          "Unsichtbar (+1 Kategorie): Geist bleibt für andere unsichtbar"
        ]
      }
    }
    selectable_items:
      field_id: "selected"
      add_label: "-- Zauber hinzufügen --"
      remove_label: "Entfernen"
    include_in_ap_when:
      logic: "or"
      rules:
        - { field: "Kopfzeile-character-race", operator: "equals", value: "Elf" }
        - { field: "Kopfzeile-character-profession", operator: "in", values: ["Magier", "Magiedilettant"] }
    groups:
      - id: metamagie
        label: "Metamagie"
        basis: [KL, IN, CH]
        items:
          - {id: magischer_schutz, label: "Magischer Schutz", value: 0}
          - {id: magieresistenz, label: "Magieresistenz", value: 0}
          - {id: bann, label: "Bann", value: 0}
          - {id: artefaktbindung, label: "Artefaktbindung", value: 0}
          - {id: zauberumformung, label: "Zauberumformung", value: 0}

      - id: geistmagie
        label: "Geistmagie"
        basis: [MU, IN, CH]
        items:
          - {id: einfluss, label: "Einfluss", value: 0}
          - {id: bewusstseinstruebung, label: "Bewusstseinstrübung", value: 0}
          - {id: zwang, label: "Zwang", value: 0}
          - {id: gedankenlesen, label: "Gedankenlesen", value: 0}
          - {id: geistiger_kontakt, label: "Geistiger Kontakt", value: 0}

      - id: erkenntnismagie
        label: "Erkenntnismagie"
        basis: [KL, IN, IN]
        items:
          - {id: wahrnehmung, label: "Wahrnehmung", value: 0}
          - {id: analyse, label: "Analyse", value: 0}

      - id: illusionsmagie
        label: "Illusionsmagie"
        basis: [IN, CH, GE]
        items:
          - {id: illusion, label: "Illusion", value: 0}
          - {id: maskierung, label: "Maskierung", value: 0}
          - {id: zeichensetzung, label: "Zeichensetzung", value: 0}

      - id: lebensmagie
        label: "Lebensmagie"
        basis: [IN, CH, KO]
        items:
          - {id: heilung, label: "Heilung", value: 0}
          - {id: vitalitaet, label: "Vitalität", value: 0}
          - {id: potenzierung, label: "Potenzierung", value: 0}
          - {id: metamorphose, label: "Metamorphose", value: 0}

      - id: bewegungsmagie
        label: "Bewegungsmagie"
        basis: [IN, GE, GE]
        items:
          - {id: fortbewegung, label: "Fortbewegung", value: 0}
          - {id: telekinese, label: "Telekinese", value: 0}
          - {id: sphaerenoeffnung, label: "Limbusöffnung", value: 0}

      - id: stoffmagie
        label: "Stoffmagie"
        basis: [KL, KK, KO]
        items:
          - {id: elementare_manipulation, label: "Elementare Manipulation", value: 0}
          - {id: transmutation, label: "Transmutation", value: 0}

      - id: beschwoerung
        label: "Beschwörung"
        basis: [MU, CH, CH]
        items:
          - {id: elementarbeschwoerung, label: "Elementarbeschwörung", value: 0}
          - {id: daemonenbeschwoerung, label: "Dämonenbeschwörung", value: 0}
          - {id: geisterbeschwoerung, label: "Geisterbeschwörung", value: 0}

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