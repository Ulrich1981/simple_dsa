var layText = `
Seiten:
  - id: haupt
    titel: "Charakterbogen"
    grid:
      columns_percent: [20, 20, 35, 25]
      row_height: "auto"
      gap: "6px"
    page_break_before: auto
    page_break_after: auto
    druck_header_footer: false

    bereiche:
      - ref: Kopfzeile
        titel_anzeigen: true
        # Kopf über volle Breite: optional direkt per grid_span
        grid_span:
          col_start: 1
          col_span: 4
          row_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "input.text",        header: "Name" }
            - { key: "race", type: "input.select",     header: "Rasse" }
            - { key: "profession", type: "input.select", header: "Profession" }
            - { key: "culture", type: "input.text",        header: "Kultur" }

      - ref: Eigenschaften
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 2
          row_span: 1
        spalten: 2
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "value", type: "input.number_text", header: "Wert" }

      - ref: Ressourcen
        titel_anzeigen: true
        grid_span:
          col_start: 3
          col_span: 2
          row_span: 1
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "label", header: "Name", col_width: "max-content" }
            - { key: "base", type: "computed", header: "Basis", formula_id: "display_basis", col_width: "max-content" }
            - { key: "basis_formel", type: "computed", header: " ", formula_id: "display_basis_formula", col_width: "max-content" }
            - { key: "value", type: "input.number_text", header: "Wert", col_width: "5ch", input_width: "5ch" }
            - { key: "total", type: "computed", header: "Gesamt", formula_id: "display_total", col_width: "max-content" }
            - { key: "gesamt_formel", type: "computed", header: " ", formula_id: "display_total_formula", col_width: "max-content" }

      - ref: Talente
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 3
          row_span: 1
        spalten: 3
        kompakt: true
        gruppen:
          font_size: "6pt"
          columns:
            - { key: "label", type: "label", header: "Name", col_width: "minmax(0, 1fr)" }
            - { key: "base", type: "computed", header: "Basis", formula_id: "display_basis", col_width: "5ch" }
            - { key: "value", type: "input.number_text", header: "Wert", col_width: "4ch" }
            - { key: "total", type: "computed", header: "Gesamt", formula_id: "display_total", col_width: "6ch" }

      - ref: Sprachen
        titel_anzeigen: true
        grid_span:
          col_start: 4
          col_span: 1
          row_span: 1
        kompakt: true
        spalten: 1
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "input.select", header: "Sprache", col_width: "minmax(0, 1fr)" }
            - { key: "base", type: "computed", header: "Basis", formula_id: "display_basis", col_width: "5ch" }
            - { key: "value", type: "input.number_text", header: "Wert", input_width: "3ch", col_width: "4ch" }
            - { key: "total", type: "computed", header: "Gesamt", formula_id: "display_total", col_width: "6.5ch" }

      - ref: Waffen
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 3
          row_span: 1
        kompakt: true
        spalten: 1
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "input.text", header: "Name", col_width: "minmax(0, 1.5fr)" }
            - { key: "kampftalent", type: "input.select", header: "Kampftalent", col_width: "minmax(0, 1.4fr)" }
            - { key: "f1", type: "input.number_text", header: "Schaden+", col_width: "minmax(0, 1.1fr)" }
            - { key: "f2", type: "input.number_text", header: "Präzision", col_width: "minmax(0, 1.05fr)" }
            - { key: "f3", type: "input.number_text", header: "Parade/Nachladen", col_width: "minmax(0, 1.85fr)" }
            - { key: "verbergen", type: "input.number_text", header: "Verbergen", col_width: "minmax(0, 1.1fr)" }
            - { key: "angriffswert", type: "computed", header: "Angriff", formula_id: "weapon_attack_value", col_width: "minmax(0, 0.8fr)" }
            - { key: "schaden_wurf", type: "computed", header: "Schaden", formula_id: "weapon_damage_roll", col_width: "minmax(0, 0.9fr)" }
            - { key: "paradewert", type: "computed", header: "Schutz", formula_id: "weapon_parry_value", col_width: "minmax(0, 0.7fr)" }

      - ref: Rüstung
        titel_anzeigen: true
        grid_span:
          col_start: 4
          col_span: 1
          row_span: 1
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "armor_type", type: "input.select", header: "Rüstung" }
            - { key: "armor", type: "computed", header: "RS", formula_id: "armor_rs" }

      - ref: Ausrüstung
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
          row_span: 1
        spalten: 4
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "input.text", header: "Name" }

  - id: zauber
    titel: "Zauber"
    grid:
      columns_percent: [25, 25, 25, 25]
      row_height: "auto"
      gap: "6px"
    page_break_before: always
    page_break_after: auto
    druck_header_footer: false
    visibility:
      logic: "or"
      rules:
        - { field: "Kopfzeile-character-race", operator: "equals", value: "Elf" }
        - { field: "Kopfzeile-character-profession", operator: "in", values: ["Magier", "Magiedilettant"] }
    bereiche:
      - ref: Zauber
        titel_anzeigen: true
        spalten: 2
        grid_span:
          col_start: 1
          col_span: 4
          row_span: 1
        kompakt: true
        grid:
          columns_percent: [45, 55]
          gap: "6px"
        bereiche:
          - grid_span: { col_start: 1, col_span: 1 }
            tabelle:
              layout: fields
              font_size: "6pt"
              columns:
                - { key: "label", type: "heading" }
                - { key: "group.label", type: "readonly_text", class: "hint" }
          - grid_span: { col_start: 2, col_span: 1 }
            entfernen: true
            tabelle:
              font_size: "6pt"
              columns:
                - { key: "base", type: "computed", header: "Basis", formula_id: "display_basis" }
                - { key: "value", type: "input.number_text", header: "Wert" }
                - { key: "total", type: "computed", header: "Gesamt", formula_id: "display_total" }
          - grid_span: { col_start: 1, col_span: 2 }
            spalten: 6
            tabelle:
              layout: fields
              font_size: "6pt"
              columns:
                - { key: "details.basis", type: "readonly_text", header: "Basis aus", col_width: "max-content" }
                - { key: "details.erschwernis", type: "readonly_text", header: "Grunderschwernis", col_width: "max-content" }
                - { key: "details.kosten", type: "readonly_text", header: "Kosten (AsP)", col_width: "minmax(0, 1fr)" }
                - { key: "details.zauberdauer", type: "readonly_text", header: "Zauberdauer", col_width: "max-content" }
                - { key: "details.reichweite", type: "readonly_text", header: "Reichweite", col_width: "max-content" }
                - { key: "details.wirkungsdauer", type: "readonly_text", header: "Wirkungsdauer", col_width: "max-content" }
          - grid_span: { col_start: 1, col_span: 2 }
            tabelle:
              layout: fields
              font_size: "6pt"
              columns:
                - { key: "details.wirkung", type: "readonly_text", header: "Wirkung" }
                - { key: "details.qualitaet", type: "readonly_text", header: "Qualität" }
                - { key: "details.modifikatoren", type: "list", header: "Modifikatoren" }
                - { key: "details.hinweis", type: "readonly_text" }

  - id: gottheit
    titel: "Gottheit und Liturgien"
    grid:
      columns_percent: [25, 25, 25, 25]
      row_height: "auto"
      gap: "6px"
    page_break_before: always
    page_break_after: auto
    druck_header_footer: false
    visibility:
      rules:
        - { field: "Kopfzeile-character-profession", operator: "equals", value: "Geweihter" }
    bereiche:
      - ref: gottheit
        titel_anzeigen: false
        refresh_dependent_selects: true
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 1
        kompakt: true
        type: dropdown

      - ref: liturgiekenntnis
        titel_anzeigen: true
        visibility:
          rules:
            - { field: "Kopfzeile-character-profession", operator: "equals", value: "Geweihter" }
            - { field: "gottheit", operator: "has_value" }
          logic: "and"
        grid_span:
          col_start: 3
          col_span: 2
          row_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "label",            header: "Talent" }
            - { key: "base",  type: "computed",         header: "Basis", formula_id: "display_basis" }
            - { key: "value", type: "input.number_text", header: "Wert" }
            - { key: "total", type: "computed",         header: "Gesamt", formula_id: "display_total" }

      - ref: grundsegnungen
        titel_anzeigen: true
        visibility:
          rules:
            - { field: "Kopfzeile-character-profession", operator: "equals", value: "Geweihter" }
            - { field: "gottheit", operator: "has_value" }
          logic: "and"
        grid_span:
          col_start: 1
          col_span: 2
          row_span: 1
        spalten: 2
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "level", type: "readonly_text",    header: "Stufe" }

      - ref: erlernte_liturgien
        titel_anzeigen: true
        visibility:
          rules:
            - { field: "Kopfzeile-character-profession", operator: "equals", value: "Geweihter" }
            - { field: "gottheit", operator: "has_value" }
          logic: "and"
        grid_span:
          col_start: 3
          col_span: 2
          row_span: 1
        spalten: 2
        kompakt: true
        tabelle:
          font_size: "6pt"
          columns:
            - { key: "name",  type: "input.select", header: "Liturgie" }
            - { key: "total", type: "computed",     header: "Stufe", formula_id: "display_total" }

Einstellungen:
  typography:
    base_font_size: "8.5pt"
    line_height: 1.3
    table_header_font_size: "8.5pt"
    heading_font_size: "9.5pt"
    title_font_size: "10.5pt"
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
    content_width: "194mm"
    margins: "8mm"
    hide_toolbar: true
    header_footer: false
    compact: true
    cards_break_inside: "auto"
  visibility:
    rules:
      - id: values_gt_0
        description: "Drucke Seite, wenn mind. ein Eintrag in der Sektion Wert > 0 hat"
`