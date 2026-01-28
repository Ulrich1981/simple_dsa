var defText = `
globals:
  ap_total: 4000
  formulas:
    value_only:      { type: "value" }
    base_plus_value: { type: "sum" }
    weighted_base_value:
      type: "weighted"
      params: { b: 2, w: 3 }

sections:
  - id: Kopfzeile
    label: "Charakter"
    type: "header"
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: character
        label: ""                  # frei befüllbar
        fields:                    # zusätzliche Felder in dieser Zeile
          - { id: race, type: "text", value: "" }
          - { id: profession, type: "text", value: "" }
          - { id: culture, type: "text", value: "" } 
  - id: Eigenschaften
    label: "Eigenschaften"
    calc_id: "value_only"
    cost_per_increment: 20
    items:
      - { id: MU, label: "MU", value: 0 }
      - { id: KL, label: "KL", value: 0 }
      - { id: IN, label: "IN", value: 0 }
      - { id: CH, label: "CH", value: 0 }
      - { id: GE, label: "GE", value: 0 }
      - { id: KK, label: "KK", value: 0 }
      - { id: KO, label: "KO", value: 0 }

  - id: Ressourcen
    label: "Ressourcen"
    calc_id: "weighted_base_value"
    cost_per_increment: 20
    items:
      - { id: LE, label: "LE", basis: [KK, KO, KO], value: 0 }
      - { id: AE, label: "AE", basis: [KL, IN, CH], value: 0 }
      - { id: KE, label: "KE", basis: [IN, CH, CH], value: 0 }
      - { id: MR, label: "MR", calc_id: "base_plus_value_minus_10", basis: [MU, KL, KO], value: 0 }
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
  
  - id: Sprachen2
    label: "Sprachen  (KL, IN, CH)/2"
    cost_per_increment: 2
    calc_id: "base_plus_value"
    basis: [KL, IN, CH]
    items:
      - {id: garethi, label: "Garethi", value: 0}
      - {id: isdira, label: "Isdira", value: 0}
  
  - id: Sprachen
    label: "Sprachen  (KL, IN, CH)/2"
    cost_per_increment: 2
    calc_id: "base_plus_value"
    basis: [KL, IN, CH]
    items:
      - {id: garethi, basis: [KL, IN, CH], label: "Garethi", value: 0}
      - {id: isdira, basis: [KL, IN, CH], label: "Isdira", value: 0}
      - {id: rogolan, basis: [KL, IN, CH], label: "Rogolan", value: 0}
      - {id: tulamydia, basis: [KL, IN, CH], label: "Tulamydia", value: 0}
      - {id: thorwalsch, basis: [KL, IN, CH], label: "Thorwalsch", value: 0}
      - {id: alaani, basis: [KL, IN, CH], label: "Alaani", value: 0}
      - {id: mnujuka, basis: [KL, IN, CH], label: "Mnujuka", value: 0}
      - {id: mohisch, basis: [KL, IN, CH], label: "Mohisch", value: 0}
      - {id: zelemia, basis: [KL, IN, CH], label: "Zelemia", value: 0}
      - {id: trollisch, basis: [KL, IN, CH], label: "Trollisch", value: 0}
      - {id: rssahh, basis: [KL, IN, CH], label: "Rssahh", value: 0}
      - {id: koboldisch, basis: [KL, IN, CH], label: "Koboldisch", value: 0}
      - {id: orkisch, basis: [KL, IN, CH], label: "Orkisch", value: 0}
      - {id: goblinisch, basis: [KL, IN, CH], label: "Goblinisch", value: 0}
      - {id: atak, basis: [KL, IN, CH], label: "Atak", value: 0}
      - {id: zhayad, basis: [KL, IN, CH], label: "Zhayad", value: 0}
      - {id: fuechsisch, basis: [KL, IN, CH], label: "Füchsisch", value: 0}
      - {id: bosparano, basis: [KL, IN, CH], label: "Bosparano", value: 0}
      - {id: asdharia, basis: [KL, IN, CH], label: "Asdharia", value: 0}
      - {id: ur_tulamydia, basis: [KL, IN, CH], label: "Ur-Tulamydia", value: 0}
      - {id: yash_hualay, basis: [KL, IN, CH], label: "Yash'Hualay", value: 0}
      - {id: drachisch, basis: [KL, IN, CH], label: "Drachisch", value: 0}
  
  
  - id: Waffen
    label: "Waffen"
    calc_id: "value_only"          # keine Berechnung
    cost_per_increment: 0          # keine Kosten
    exclude_from_ap: true        # nicht in AP-Zähler einbeziehen
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: weapon_1
        label: ""                  # frei befüllbar
        fields:                    # zusätzliche Felder in dieser Zeile
          - { id: f1, type: "number", value: "" }
          - { id: f2, type: "number", value: "" }
          - { id: f3, type: "number", value: "" } 
      - id: weapon_2
        label: ""                  # frei befüllbar
        fields:                    # zusätzliche Felder in dieser Zeile
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
          - { id: f1, type: "number", value: "" }
  - id: Ausrüstung
    label: "Ausrüstung"
    calc_id: "value_only"          # keine Berechnung
    cost_per_increment: 0          # keine Kosten
    exclude_from_ap: true        # nicht in AP-Zähler einbeziehen
    items:
      # Jede Zeile: frei beschreibbarer Name und drei Werte
      - id: gear_1
        label: ""
        fields:
      - id: gear_2
        label: ""
        fields:
      - id: gear_3
        label: ""
        fields:
      - id: gear_4
        label: ""
        fields:
      - id: gear_5
        label: ""
        fields:
      - id: gear_6
        label: ""
        fields:
  
  - id: Zauber
    label: "Zauber"
    calc_id: "base_plus_value"
    cost_per_increment: 3
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

  - id: liturgien
    label: "Liturgien"
    calc_id: "level_cost"
    cost_per_increment: 50
    show_if:
      field: "gottheit"
      operator: "not_empty"
    groups:
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
          - {id: licht_der_wahrheit, label: "Licht der Wahrheit", level: 0}
          - {id: sonnenstrahl, label: "Sonnenstrahl", level: 0}
          - {id: zeitstillstand, label: "Zeitstillstand", level: 2}
          - {id: urteil_des_lichts, label: "Urteil des Lichts", level: 0}
          - {id: bannstrahl, label: "Bannstrahl", level: 0}

      - id: rondra_liturgien
        label: "Rondra-Liturgien"
        basis: [MU, KO, KK]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "rondra"
        items:
          - {id: segen_des_mutes, label: "Segen des Mutes", level: 0}
          - {id: segen_des_schutzes, label: "Segen des Schutzes", level: 0}
          - {id: sturmruf, label: "Sturmruf", level: 0}
          - {id: kampfwut, label: "Kampfwut", level: 0}
          - {id: unbesiegbarkeit, label: "Unbesiegbarkeit", level: 0}

      - id: efferd_liturgien
        label: "Efferd-Liturgien"
        basis: [MU, IN, GE]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "efferd"
        items:
          - {id: wasseratmung, label: "Wasseratmung", level: 0}
          - {id: wellenkontrolle, label: "Wellenkontrolle", level: 0}
          - {id: sturmbeschwichtigung, label: "Sturmbeschwichtigung", level: 0}
          - {id: meeresruf, label: "Meeresruf", level: 0}
          - {id: gezeitenwandel, label: "Gezeitenwandel", level: 0}

      - id: travia_liturgien
        label: "Travia-Liturgien"
        basis: [MU, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "travia"
        items:
          - {id: gastfreundschaft, label: "Gastfreundschaft", level: 0}
          - {id: friedensstiftung, label: "Friedensstiftung", level: 0}
          - {id: heimsegen, label: "Heimsegen", level: 0}
          - {id: familienbund, label: "Familienbund", level: 0}
          - {id: ewiger_frieden, label: "Ewiger Frieden", level: 0}

      - id: boron_liturgien
        label: "Boron-Liturgien"
        basis: [MU, IN, KO]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "boron"
        items:
          - {id: totenruhe, label: "Totenruhe", level: 0}
          - {id: leichenrede, label: "Leichenrede", level: 0}
          - {id: untotenbann, label: "Untotenbann", level: 0}
          - {id: seelenfuehrung, label: "Seelenführung", level: 0}
          - {id: ewige_ruhe, label: "Ewige Ruhe", level: 0}

      - id: hesinde_liturgien
        label: "Hesinde-Liturgien"
        basis: [KL, KL, IN]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "hesinde"
        items:
          - {id: wissensschau, label: "Wissensschau", level: 0}
          - {id: gedaechtnispalast, label: "Gedächtnispalast", level: 0}
          - {id: inspiration, label: "Inspiration", level: 0}
          - {id: weisheit_der_schlange, label: "Weisheit der Schlange", level: 0}
          - {id: allwissen, label: "Allwissen", level: 0}

      - id: firun_liturgien
        label: "Firun-Liturgien"
        basis: [MU, IN, KO]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "firun"
        items:
          - {id: kaelteschutz, label: "Kälteschutz", level: 0}
          - {id: jagdsegen, label: "Jagdsegen", level: 0}
          - {id: winterruf, label: "Winterruf", level: 0}
          - {id: eiswall, label: "Eiswall", level: 0}
          - {id: ewiger_winter, label: "Ewiger Winter", level: 0}

      - id: tsa_liturgien
        label: "Tsa-Liturgien"
        basis: [MU, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "tsa"
        items:
          - {id: wunder_der_heilung, label: "Wunder der Heilung", level: 0}
          - {id: lebenssegen, label: "Lebenssegen", level: 0}
          - {id: wiedergeburt, label: "Wiedergeburt", level: 0}
          - {id: fruchtbarkeitssegen, label: "Fruchtbarkeitssegen", level: 0}
          - {id: ewiges_leben, label: "Ewiges Leben", level: 0}

      - id: phex_liturgien
        label: "Phex-Liturgien"
        basis: [MU, IN, GE]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "phex"
        items:
          - {id: glueckssegen, label: "Glückssegen", level: 0}
          - {id: unsichtbarkeit, label: "Unsichtbarkeit", level: 0}
          - {id: handelssegen, label: "Handelssegen", level: 0}
          - {id: diebessegen, label: "Diebessegen", level: 0}
          - {id: grosses_glueck, label: "Großes Glück", level: 0}

      - id: peraine_liturgien
        label: "Peraine-Liturgien"
        basis: [MU, IN, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "peraine"
        items:
          - {id: erntesegen, label: "Erntesegen", level: 0}
          - {id: pflanzenwachstum, label: "Pflanzenwachstum", level: 0}
          - {id: krankheitsheilung, label: "Krankheitsheilung", level: 0}
          - {id: giftbann, label: "Giftbann", level: 0}
          - {id: goldene_ernte, label: "Goldene Ernte", level: 0}

      - id: ingerimm_liturgien
        label: "Ingerimm-Liturgien"
        basis: [MU, KK, KO]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "ingerimm"
        items:
          - {id: feuersegen, label: "Feuersegen", level: 0}
          - {id: schmiedekunst, label: "Schmiedekunst", level: 0}
          - {id: metallbeherrschung, label: "Metallbeherrschung", level: 0}
          - {id: vulkanruf, label: "Vulkanruf", level: 0}
          - {id: ewiges_feuer, label: "Ewiges Feuer", level: 0}

      - id: rahja_liturgien
        label: "Rahja-Liturgien"
        basis: [MU, CH, CH]
        show_if:
          field: "gottheit"
          operator: "equals"
          value: "rahja"
        items:
          - {id: liebeszauber, label: "Liebeszauber", level: 0}
          - {id: ekstase, label: "Ekstase", level: 0}
          - {id: rauschsegen, label: "Rauschsegen", level: 0}
          - {id: verfuehrung, label: "Verführung", level: 0}
          - {id: ewige_leidenschaft, label: "Ewige Leidenschaft", level: 0}`;