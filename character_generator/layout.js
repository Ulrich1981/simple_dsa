var layText = `
Seiten:
  - id: haupt
    titel: "Charakterbogen"
    grid:
      columns_percent: [19, 19, 10, 10, 19, 19]
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
          col_span: 6
          row_span: 1
        spalten: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "input.text",        header: "Name" }
            - { key: "race", type: "input.text",        header: "Rasse" }
            - { key: "profession", type: "input.text",        header: "Profession" }
            - { key: "culture", type: "input.text",        header: "Kultur" }

      - ref: Eigenschaften
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
          row_span: 1
        spalten: 2
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "value", type: "input.number_text", header: "Wert" }

      - ref: Ressourcen
        titel_anzeigen: true
        grid_span:
          col_start: 5
          col_span: 2
          row_span: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "base",  type: "base",             header: "Basis" }
            - { key: "value", type: "input.number_text", header: "Wert" }
            - { key: "total", type: "total",             header: "Gesamt" }

      - ref: Talente
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
          row_span: 1
        spalten: 2
        kompakt: true
        gruppen:
          group_columns: 2
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "base",  type: "base",             header: "Basis" }
            - { key: "value", type: "input.number_text", header: "Wert" }
            - { key: "total", type: "total",             header: "Gesamt" }

      - ref: Sprachen
        titel_anzeigen: true
        grid_span:
          col_start: 5
          col_span: 2
          row_span: 1
        kompakt: true
        spalten: 1
        tabelle:
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "base",  type: "base",             header: "Basis" }
            - { key: "value", type: "input.text", header: "Wert" }
            - { key: "total", type: "total",             header: "Gesamt" }

      - ref: Waffen
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 4
          row_span: 1
        kompakt: true
        spalten: 1
        tabelle:
          columns:
            - { key: "label", type: "input.text",        header: "Name" }
            - { key: "f1",    type: "input.number_text", header: "Schaden" }
            - { key: "f2",    type: "input.number_text", header: "Präzision" }
            - { key: "f3",    type: "input.number_text", header: "Parade/Nachladen" }

      - ref: Rüstung
        titel_anzeigen: true
        grid_span:
          col_start: 5
          col_span: 2
          row_span: 1
        kompakt: true
        tabelle:
          columns:
            - { key: "label",  type: "input.text",        header: "Name" }
            - { key: "armor",  type: "input.number_text", header: "Rüstung" }

      - ref: Ausrüstung
        titel_anzeigen: true
        grid_span:
          col_start: 1
          col_span: 6
          row_span: 1
        spalten: 3
        kompakt: true
        tabelle:
          columns:
            - { key: "label", type: "input.text", header: "Name" }

  - id: zauber
    titel: "Zauber"
    page_break_before: always
    page_break_after: auto
    druck_header_footer: false
    visibility:
      rule: "values_gt_0"
      params: { section_id: "Zauber" }
    bereiche:
      - ref: Zauber
        titel_anzeigen: true
        breite: 2
        spalten: 2
        kompakt: true
        gruppen:
          group_columns: 2
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "base",  type: "base",             header: "Basis" }
            - { key: "value", type: "input.number_text", header: "Wert" }
            - { key: "total", type: "total",             header: "Gesamt" }

  - id: gottheit
    titel: "Gottheit und Liturgien"
    page_break_before: always
    page_break_after: auto
    druck_header_footer: false
    visibility:
      rule: "values_gt_0"
      params: { section_id: "gottheit" }
    bereiche:
      - ref: gottheit
        titel_anzeigen: false
        grid_span:
          col_start: 1
          col_span: 2
        spalten: 1
        kompakt: true
        type: dropdown

      - ref: praios_liturgien
        titel_anzeigen: true
        visibility:
          rules:
            - field: "gottheit"
              operator: "equals"
              value: "praios"
        grid_span:
          col_start: 1
          col_span: 6
          row_span: 1
        spalten: 2
        kompakt: true
        gruppen:
          group_columns: 2
          columns:
            - { key: "label", type: "label",            header: "Name" }
            - { key: "grad",  type: "label",             header: "Grad" }

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
  visibility:
    rules:
      - id: values_gt_0
        description: "Drucke Seite, wenn mind. ein Eintrag in der Sektion Wert > 0 hat"
`