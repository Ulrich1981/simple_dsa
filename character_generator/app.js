// app.js – vollständig generisch: keine Domain-Begriffe im Code

let defs = null; // definitions.yaml
let ui   = null; // layout.yaml

const state = {
  ap_total: 0,
  attributes: {}, // alle Attribute-Werte (von Items, typischerweise aus "Eigenschaften")
  values: {}      // item_id -> number
};

const els = {
  root: document.getElementById('characterForm'),
  apTotalBox: document.getElementById('apTotal'),
  apSpent: document.getElementById('apSpent'),
  apRemaining: document.getElementById('apRemaining'),
  printBtn: document.getElementById('printBtn'),
  saveBtn: document.getElementById('saveBtn'),
  fileInput: document.getElementById('fileInput')
};

// utils
function parseNum(v){ const s=String(v??'').trim(); if(s==='') return 0; const n=Number(s.replace(',','.')); return isNaN(n)?0:n; }
function tri(n){ n=parseNum(n); if(n<0) n=0; return (n*(n+1))/2; }
function get(o,p,d){ return p.split('.').reduce((x,k)=> x && (k in x) ? x[k] : undefined, o) ?? d; }
function createDiv(text, cls){ const d=document.createElement('div'); if (text!==undefined) d.textContent=String(text); if(cls) d.className=cls; return d; }
function setText(id,v){ const el=document.getElementById(id); if(el) el.textContent=String(v); }
function setInput(id,v){ const el=document.getElementById(id); if(el && el.tagName==='INPUT'){ el.value=(v===0||v===undefined||v==='')?'':String(v); } }
function makeNumInput(val,on){ const i=document.createElement('input'); i.type='text'; i.placeholder='0'; i.value=(val===0||val===undefined||val==='')?'':String(val); i.className='num'; i.addEventListener('input',()=>on(parseNum(i.value))); return i; }

// formulas
function basisFrom(list){
  const nums=(list||[]).map(id=>parseNum(state.attributes[id] ?? state.values[id] ?? 0));
  return Math.round(nums.reduce((a,b)=>a+b,0)/2);
}

function total(calc_id, basis, value){
  if (calc_id==='value_only') return parseNum(value);
  if (calc_id==='base_plus_value') return parseNum(basis) + parseNum(value);
  if (calc_id==='base_plus_value_minus_10') return parseNum(basis) + parseNum(value) - 10;
  if (calc_id==='weighted_base_value'){
    const b = get(defs,'globals.formulas.weighted_base_value.params.b',2);
    const w = get(defs,'globals.formulas.weighted_base_value.params.w',3);
    return b*parseNum(basis) + w*parseNum(value);
  }
  return parseNum(basis) + parseNum(value); // fallback
}
function cpi(sectionCpi, groupOv, itemOv){
  const pick = ov => ov && typeof ov.cost_per_increment !== 'undefined' ? Number(ov.cost_per_increment) : undefined;
  const x = pick(itemOv) ?? pick(groupOv) ?? Number(sectionCpi ?? 0);
  return isNaN(x)?0:x;
}

// Hilfsfunktion für konsistente Key-Generierung
function generateKey(sec, it, fieldId = null, valueKeyPrefix = null) {
  if (fieldId === 'label') {
    return `${it.id}-name`;
  }
  
  if (fieldId === null || fieldId === 'value') {
    // Standard value key
    return valueKeyPrefix ? `${valueKeyPrefix}-${it.id}` : it.id;
  } else {
    // Custom field key
    return valueKeyPrefix 
      ? `${valueKeyPrefix}-${it.id}-${fieldId}`
      : `${sec.id}-${it.id}-${fieldId}`;
  }
}

// Hilfsfunktion für Display-IDs (mit Präfix)
function generateDisplayId(prefix, sec, it, fieldId = null, valueKeyPrefix = null) {
  const key = generateKey(sec, it, fieldId, valueKeyPrefix);
  return `${prefix}-${key}`;
}


// normalization
let sections = []; // normalized view
function normalize(defs){
  sections = (defs.sections || []).map(sec => ({
    id: sec.id,
    label: sec.label || '',
    type: sec.type || 'table',
    calc_id: sec.calc_id || 'base_plus_value',
    cost_cpi: sec.cost_per_increment ?? 0,
    items: (sec.items || []).map(it => ({
      id: it.id, label: it.label || '',
      basis: it.basis || [],
      value: parseNum(it.value ?? 0),
	  fields: Array.isArray(it.fields) ? it.fields.map(f => ({ id: f.id, type: f.type || 'number', value: f.value ?? '' })) : undefined,
      overrides: {
        ...(it.calc_id ? { calc_id: it.calc_id } : {}),
        ...(typeof it.cost_per_increment !== 'undefined' ? { cost_per_increment: it.cost_per_increment } : {})
      }
    })),
    groups: (sec.groups || []).map(gr => ({
      id: gr.id, label: gr.label || '',
      basis: gr.basis || [],
      overrides: typeof gr.cost_per_increment !== 'undefined' ? { cost_per_increment: gr.cost_per_increment } : {},
      items: (gr.items || []).map(it => ({
        id: it.id, label: it.label || '',
        basis: it.basis || [],
        value: parseNum(it.value ?? 0),
        overrides: {
          ...(it.calc_id ? { calc_id: it.calc_id } : {}),
          ...(typeof it.cost_per_increment !== 'undefined' ? { cost_per_increment: it.cost_per_increment } : {})
        }
      }))
    })),
    fields: (sec.fields || []) // nur für type: header
  }));
}

// state init
function init(defText, layoutText){
  defs = jsyaml.load(defText);
  ui   = jsyaml.load(layoutText);

  state.ap_total = parseNum(get(defs,'globals.ap_total',0));

normalize(defs);

// Eigenschaften für state.attributes initialisieren
const attrSec = sections.find(s => s.id === 'Eigenschaften');
state.attributes = {};
if (attrSec) {
  (attrSec.items || []).forEach(it => {
    state.attributes[it.id] = parseNum(it.value);
  });
}

// values map initialisieren aus allen Feldern
state.values = {};
sections.forEach(sec => {
  (sec.fields || []).forEach(field => {
    const key = generateKey(sec, { id: field.id }, field.id);
    state.values[key] = field.type === 'text' ? (field.value ?? '') : parseNum(field.value ?? 0);
  });
  
  (sec.items || []).forEach(it => {
    state.values[generateKey(sec, it)] = parseNum(it.value ?? 0);
    
    (it.fields || []).forEach(field => {
      const key = generateKey(sec, it, field.id);
      state.values[key] = field.type === 'text' ? (field.value ?? '') : parseNum(field.value ?? 0);
    });
  });
  
  (sec.groups || []).forEach(gr => {
    const valueKeyPrefix = `${sec.id}-${gr.id}`;
    (gr.items || []).forEach(it => {
      state.values[generateKey(sec, it, 'value', valueKeyPrefix)] = parseNum(it.value ?? 0);
      
      (it.fields || []).forEach(field => {
        const key = generateKey(sec, it, field.id, valueKeyPrefix);
        state.values[key] = field.type === 'text' ? (field.value ?? '') : parseNum(field.value ?? 0);
      });
    });
  });
});

  render();
  recalc();
}


// Enhanced visibility system for layout.js visibility rules
function updateVisibility() {
    if (!ui || !ui.Seiten) return;
    
    // Get current state for visibility checks
    const currentState = {};
    
    // Collect all form values for visibility evaluation
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        if (input.id) {
            // Remove prefixes to get clean field names
            let fieldName = input.id;
            if (fieldName.startsWith('row-input-')) {
                fieldName = fieldName.replace('row-input-', '');
            }
            currentState[fieldName] = input.value;
        }
    });
    
    // Also include calculated values from state
    Object.assign(currentState, state.values);
    Object.assign(currentState, state.attributes);
    
    // Check each page and section for visibility conditions
    ui.Seiten.forEach(page => {
        (page.bereiche || []).forEach(secRef => {
            const sectionElement = document.querySelector(`[data-section-ref="${secRef.ref}"]`);
            if (sectionElement && secRef.visibility) {
                const shouldShow = evaluateVisibilityRules(secRef.visibility, currentState);
                sectionElement.style.display = shouldShow ? 'block' : 'none';
            }
        });
    });
}

function evaluateVisibilityRules(visibility, currentState) {
    if (!visibility || !visibility.rules) return true;
    
    const rules = visibility.rules;
    const logic = visibility.logic || 'and'; // default to 'and'
    
    const results = rules.map(rule => evaluateVisibilityRule(rule, currentState));
    
    if (logic === 'or') {
        return results.some(result => result);
    } else { // 'and' or default
        return results.every(result => result);
    }
}

function evaluateVisibilityRule(rule, currentState) {
    if (!rule.field) return true;
    
    const fieldValue = currentState[rule.field] || '';
    const operator = rule.operator || 'equals';
    
    switch (operator) {
        case 'equals':
            return fieldValue === (rule.value || '');
            
        case 'not_equals':
            return fieldValue !== (rule.value || '');
            
        case 'in':
            return Array.isArray(rule.values) && rule.values.includes(fieldValue);
            
        case 'not_in':
            return Array.isArray(rule.values) && !rule.values.includes(fieldValue);
            
        case 'has_value':
            return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
            
        case 'is_empty':
            return fieldValue === '' || fieldValue === null || fieldValue === undefined;
            
        case 'greater_than':
            return parseNum(fieldValue) > parseNum(rule.value || 0);
            
        case 'less_than':
            return parseNum(fieldValue) < parseNum(rule.value || 0);
            
        case 'greater_equal':
            return parseNum(fieldValue) >= parseNum(rule.value || 0);
            
        case 'less_equal':
            return parseNum(fieldValue) <= parseNum(rule.value || 0);
            
        default:
            return true;
    }
}

function render(){
  if (!ui || !ui.Seiten) return;
  
  els.root.innerHTML = '';

  (ui.Seiten || []).forEach(page => {
    const pageEl = document.createElement('div');
    pageEl.className = 'page page-grid';

    // Seite: Grid konfigurieren
    const gap = page.grid?.gap || '12px';
    pageEl.style.setProperty('--grid-gap', gap);

	if (page.page_break_before === 'always') {
	  pageEl.classList.add('print-page-break-before');
	}
	if (page.page_break_after === 'always') {
	  pageEl.classList.add('print-page-break-after');
	}

    if (Array.isArray(page.grid?.columns_percent) && page.grid.columns_percent.length){
      // Beispiel: [20,20,20,20,20] -> "20% 20% 20% 20% 20%"
      const cols = page.grid.columns_percent.map(x => `${x}%`).join(' ');
      pageEl.style.setProperty('--grid-columns', cols);
    } else if (page.grid?.mode === 'flow'){
      // Flow: nutzt auto-fit mit minmax, sodass Prozentbreiten pro Card funktionieren
      // Für Flow lassen wir grid-template-columns als auto-fill/auto-fit steuern; die Breite pro Card setzen wir inline.
      // Setze einen Default, z. B. 100% – wir überschreiben per Item-Breite
      pageEl.style.setProperty('--grid-columns', 'repeat(auto-fit, minmax(0, 1fr))');
    } else {
      // Fallback: 2 Spalten
      pageEl.style.setProperty('--grid-columns', 'repeat(2, minmax(0,1fr))');
    }

    // Row-Höhe steuerbar (z. B. "12rem") – optional
    if (page.grid?.row_height) {
      pageEl.style.setProperty('--grid-row-height', page.grid.row_height);
    } else {
      pageEl.style.setProperty('--grid-row-height', 'auto');
    }

    // Bereiche rendern
    (page.bereiche || []).forEach(secRef => {
      const sec = sections.find(s => s.id === secRef.ref);
      if (!sec) return;

      const area = renderSection(sec, secRef); // liefert .card
      if (!area) return;

      // Spaltenbreite/Span anwenden
      if (Array.isArray(page.grid?.columns_percent)) {
        // Rastermodus: nutze grid_span (col_start/col_span/row_span)
        const span = secRef.grid_span || {};
        if (span.col_start) area.style.gridColumnStart = String(span.col_start);
        if (span.col_span)  area.style.gridColumnEnd   = `span ${span.col_span}`;
        if (span.row_span)  area.style.gridRowEnd      = `span ${span.row_span}`;
      } else if (page.grid?.mode === 'flow') {
        // Flowmodus: Breite als Prozent setzen
        const pct = Math.max(1, Math.min(100, Number(secRef.width_percent || 100)));
        area.style.width = `${pct}%`;
        // Damit das Grid die Prozentbreite respektiert, platziere die Karten in einem flow-fähigen Grid:
        // Mit repeat(auto-fit, minmax(0, 1fr)) oben und width pro Item funktionieren prozentuale Breiten.
        // Optional: row_span unterstützen, falls definiert:
        if (secRef.row_span) area.style.gridRowEnd = `span ${secRef.row_span}`;
      }
      pageEl.appendChild(area);
    });

    els.root.appendChild(pageEl);
  });
}


function pageVisible(page){
  const vis = page.visibility;
  if (!vis) return true;
  if (vis.rule === 'values_gt_0'){
    const sec = sections.find(s=>s.id === vis.params?.section_id);
    if (!sec) return true;
    let any=false;
    (sec.items||[]).forEach(it=>{ if (parseNum(state.values[it.id])>0) any=true; });
    (sec.groups||[]).forEach(gr=>{
      (gr.items||[]).forEach(it=>{ if (parseNum(state.values[it.id])>0) any=true; });
    });
    return any;
  }
  return true;
}


function buildTable(items, sec, ref, opts = {}){
  const { baseOverride = null, valueKeyPrefix = null, columns: overrideColumns = null } = opts;

  // 1) Spalten-Konfiguration
  let columns = overrideColumns || get(ref, 'tabelle.columns', null);
  if (!columns) {
    const hdrs = get(ref, 'tabelle.headers', []);
    const fts  = get(ref, 'tabelle.fields', []);
    columns = hdrs.map((h, i) => {
      const t = fts?.[i] || 'label';
      const key =
        (i === 0 && (t === 'label' || t === 'input.text')) ? 'label' :
        (t === 'readonly_text' && /basis/i.test(h))          ? 'base'  :
        (t === 'readonly_text' && /gesamt/i.test(h))         ? 'total' :
        (t === 'input.number_text')                          ? 'value' :
        (t === 'input.text')                                 ? h.toLowerCase().replace(/\s+/g,'_') : 'value';
      return { key, type: t, header: h };
    });
  }

  // 2) Table-Grid
  const table = document.createElement('div');
  table.className = 'table-grid';
  table.style.setProperty('--cols', `repeat(${columns.length}, minmax(0,1fr))`);
  const push = node => table.appendChild(node);

  // 3) Header
  for (const col of columns) push(createDiv(col.header || col.key, 'header'));

  // 4) Rows
  for (const it of items) {
    // Vorberechnung (optional baseOverride für Gruppen)
    const basisVal = (baseOverride !== null && baseOverride !== undefined)
      ? baseOverride
      : basisFrom(it.basis || []);

    // Wichtig: „rawVal“ nur für den Standard-„value“-Key.
    // Für gruppierte Inputs benutzen wir eigene Keys via valueKeyPrefix.
    const stdKey  = it.id;
    const rawVal  = parseNum(state.values[stdKey] ?? it.value ?? 0);

    const calcId   = it.overrides?.calc_id || sec.calc_id;
    const totalVal = total(calcId, basisVal, rawVal, get(defs, `globals.formulas.${calcId}.params`, {}));

    for (const col of columns) {
    const t = col.type;
    const k = col.key;

    switch (t) {
      case 'label': {
        push(createDiv(it.label || ''));
        break;
      }

      case 'input.text': {
        if (k === 'label') {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.value = it.label || '';
          inp.id = generateDisplayId('row-input', sec, it, 'label');
          inp.addEventListener('input', () => { it.label = inp.value; });
          push(inp);
        } else {
          const key = generateKey(sec, it, k, valueKeyPrefix);
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.value = state.values[key] ?? it[k] ?? it.value ?? '';
          inp.id = generateDisplayId('row-input', sec, it, k, valueKeyPrefix);
          inp.addEventListener('input', () => { state.values[key] = inp.value; });
          push(inp);
        }
        break;
      }

      case 'input.number_text': {
        const storeKey = generateKey(sec, it, k, valueKeyPrefix);
        let initial;

        if (k === 'value') {
          initial = parseNum(state.values[storeKey] ?? it.value ?? 0);
        } else {
          const fld = Array.isArray(it.fields) ? it.fields.find(f => f.id === k) : null;
          initial = parseNum(state.values[storeKey] ?? (fld ? fld.value : 0));
        }

        const inp = makeNumInput(initial, v => {
          state.values[storeKey] = v;
          if (sec.id === 'Eigenschaften' && k === 'value') state.attributes[it.id] = v;
          recalc();
        });
        inp.id = generateDisplayId('row-input', sec, it, k, valueKeyPrefix);
        push(inp);
        break;
      }
      
        case 'input.select': {
          const key = generateKey(sec, it, k, valueKeyPrefix);
          const select = document.createElement('select');
          select.id = generateDisplayId('row-select', sec, it, k, valueKeyPrefix);
          
          // Hole Optionen aus dem Item selbst oder aus einer referenzierten Section
          const options = it.options || [];
          
          options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.id;
            option.textContent = opt.label;
            if (state.values[key] === opt.id) {
              option.selected = true;
            }
            select.appendChild(option);
          });
          
          select.addEventListener('change', () => {
            state.values[key] = select.value;
          });
          
          push(select);
          break;
        }
      case 'readonly_text': {
        if (k === 'basis') {
          const cell = createDiv(basisVal);
          cell.id = generateDisplayId('row-basis', sec, it, 'value', valueKeyPrefix);
          push(cell);
        } else if (k === 'total') {
          const cell = createDiv(totalVal);
          cell.id = generateDisplayId('row-total', sec, it, 'value', valueKeyPrefix);
          push(cell);
        } else {
          push(createDiv(it[k] ?? ''));
        }
        break;
      }
      case 'base': {
        const cell = createDiv(basisVal);
        cell.id = generateDisplayId('row-basis', sec, it, 'value', valueKeyPrefix);
        push(cell);
        break;
      }

      case 'total': {
        const cell = createDiv(totalVal);
        cell.id = generateDisplayId('row-total', sec, it, 'value', valueKeyPrefix);
        push(cell);
        break;
      }

      default: {
        push(createDiv(it[k] ?? ''));
        break;
      }
    }
  }
  }

  return table;
}

function renderDropdown(sec, ref) {
  const container = document.createElement('div');
  container.className = 'dropdown-container';
  container.style.padding = '10px';
  
  // Label
  const label = document.createElement('label');
  label.textContent = sec.label;
  label.style.display = 'block';
  label.style.marginBottom = '5px';
  label.style.fontWeight = 'bold';
  
  // Dropdown
  const select = document.createElement('select');
  select.style.width = '100%';
  select.style.padding = '5px';
  
  // Leere Option
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = '-- Auswählen --';
  select.appendChild(emptyOption);
  
  // Alle Items als Optionen
  const items = sec.items || [];
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.label;
    select.appendChild(option);
  });
  
  // Aktuellen Wert laden
  const key = sec.id;
  if (state.values[key]) {
    select.value = state.values[key];
  }
  
  // Änderungen speichern
  select.addEventListener('change', () => {
    state.values[key] = select.value;
  });
  
  container.appendChild(label);
  container.appendChild(select);
  return container;
}

function renderSection(sec, ref){
  // Header und Card-Wrapper wie gehabt ...
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-section-ref', sec.id);
  card.classList.add(ref.breite === 2 ? 'area-wide' : 'area-narrow');
  if (ref.titel_anzeigen){
    const h = document.createElement('h2'); h.textContent = sec.label; card.appendChild(h);
	
    if (sec.basis?.length){ const hint=createDiv(`Basis aus (${sec.basis.join(' + ')}) / 2, gerundet`,'hint'); card.appendChild(hint); }
  }

  
  // Prüfe ob es ein Dropdown sein soll
  if (ref.type === 'dropdown') {
    const dropdown = renderDropdown(sec, ref);
    card.appendChild(dropdown);
    return card;
  }

  const hasGroups = Array.isArray(sec.groups) && sec.groups.length > 0;

  // FLAT: immer split-grid nutzen (auch bei spalten=1)
  if (!hasGroups){
    const items = (sec.items || []).slice();
    const colsSplit = Math.max(1, Number(ref.spalten || 1));
    const per = Math.ceil(items.length / colsSplit) || items.length;

    const container = document.createElement('div');
    container.className = 'split-grid';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${colsSplit}, minmax(0,1fr))`;
    container.style.gap = '12px';

    for (let i = 0; i < colsSplit; i++){
      const chunk = items.slice(i * per, (i + 1) * per);
      container.appendChild(buildTable(chunk, sec, ref));
    }

    card.appendChild(container);
    return card;
  }

  // GROUPS: Grid + je Gruppe buildTable mit overrides
  const groupCols = Math.max(
    1,
    Number(get(ref, 'gruppen.group_columns', null)) ||
    (get(ref, 'gruppen.pair_columns', false) ? 2 : 1)
  );

  const grid = document.createElement('div');
  grid.className = 'group-grid';
  grid.style.setProperty('--group-cols', `repeat(${groupCols}, minmax(0,1fr))`);

  const groupColumns = get(ref, 'gruppen.columns', null); // optional columns je Gruppenbereich

  (sec.groups || []).forEach(gr => {
    const gbox = document.createElement('div');
    gbox.className = 'group-card';

    const gh = document.createElement('h3');
    gh.textContent = gr.label;
    gbox.appendChild(gh);
    if (gr.basis?.length){ const hint=createDiv(`Basis aus (${gr.basis.join(' + ')}) / 2, gerundet`,'hint'); gbox.appendChild(hint); }

    const baseOverride = basisFrom(gr.basis || []);
    const valueKeyPrefix = `${sec.id}-${gr.id}`;

    const table = buildTable(gr.items || [], sec, ref, {
      baseOverride,
      valueKeyPrefix,
      columns: groupColumns || [
        { key: 'label', type: 'label',            header: 'Name' },
        { key: 'base',  type: 'base',             header: 'Basis' },
        { key: 'value', type: 'input.number_text', header: 'Wert' },
        { key: 'total', type: 'total',             header: 'Gesamt' }
      ]
    });

    gbox.appendChild(table);
    grid.appendChild(gbox);
  });

  card.appendChild(grid);
  return card;
}


// recalc AP & totals
function recalc(){
  let spent=0;
sections.forEach(sec => {
  if (sec.exclude_from_ap) return;
  const secCpi = sec.cost_cpi;
  (sec.items || []).forEach(it => {
    const valueKey = generateKey(sec, it);
    const value = parseNum(state.values[valueKey]);
    const basis = basisFrom(it.basis || []);
    const calcId = it.overrides?.calc_id || sec.calc_id;
    const tot = total(calcId, basis, value);
    const k = cpi(secCpi, null, it.overrides);

    spent += tri(value) * k;

    setText(generateDisplayId('row-basis', sec, it, 'value'), basis);
    setInput(generateDisplayId('row-input', sec, it, 'value'), value);
    setText(generateDisplayId('row-total', sec, it, 'value'), tot);
  });

  (sec.groups || []).forEach(gr => {
    const valueKeyPrefix = `${sec.id}-${gr.id}`;
    const basis = basisFrom(gr.basis || []);
    (gr.items || []).forEach(it => {
      const valueKey = generateKey(sec, it, 'value', valueKeyPrefix);
      const value = parseNum(state.values[valueKey] ?? it.value ?? 0);
      const calcId = it.overrides?.calc_id || sec.calc_id;
      const tot = total(calcId, basis, value);
      const k = cpi(secCpi, gr.overrides, it.overrides);

      spent += tri(value) * k;

      setText(generateDisplayId('row-basis', sec, it, 'value', valueKeyPrefix), basis);
      setInput(generateDisplayId('row-input', sec, it, 'value', valueKeyPrefix), value);
      setText(generateDisplayId('row-total', sec, it, 'value', valueKeyPrefix), tot);
    });
  });
});


  const remaining = Math.max(0, state.ap_total - spent);
  let ap = els.apTotalBox.querySelector('input.ap');
  if (!ap){
    ap = document.createElement('input'); ap.type='text'; ap.className='ap'; ap.placeholder='0';
    ap.value=(state.ap_total===0?'':String(state.ap_total));
    ap.addEventListener('input',()=>{ state.ap_total=parseNum(ap.value); recalc(); });
    els.apTotalBox.innerHTML=''; els.apTotalBox.appendChild(ap);
  } else {
    ap.value=(state.ap_total===0?'':String(state.ap_total));
  }
  els.apSpent.textContent = String(spent);
  els.apRemaining.textContent = String(remaining);
  updateVisibility();
}

// I/O
function wireButtons(){
  if (els.printBtn && !els.printBtn.__wired){
    els.printBtn.addEventListener('click',()=>{ recalc(); setTimeout(()=>window.print(),20); });
    els.printBtn.__wired=true;
  }
  if (els.saveBtn && !els.saveBtn.__wired){
    els.saveBtn.addEventListener('click', saveSav);
    els.saveBtn.__wired=true;
  }
  if (els.fileInput && !els.fileInput.__wired){
    els.fileInput.setAttribute('accept','.yaml,.yml,.sav');
    els.fileInput.addEventListener('change',(e)=>{
      const f=e.target.files?.[0]; if(!f) return;
      const r=new FileReader();
      r.onload=()=>{ // lädt ein vollständiges Save in generischer Struktur
        const doc = jsyaml.load(r.result);
        // Re-initialize with original definitions and layout, then load character data
        init(defText, layText);
        applySaveData(doc);
        render();
        recalc();
      };
      r.readAsText(f);
    });
    els.fileInput.__wired=true;
  }
}


async function saveSav(){
  const out = buildSave();                      // dein Save-Objekt
  const yamlText = jsyaml.dump(out, { lineWidth: 120 });
  const blob = new Blob([yamlText], { type: 'text/yaml' });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${document.getElementById(`row-input-character-name`).value || 'Unbenannt'}.sav`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildSave(){
  // Rekonstruiere generische Struktur aus aktuellem state + defs.sections
const rebuilt = JSON.parse(JSON.stringify(defs)); // clone

// Update globals.ap_total
rebuilt.globals = rebuilt.globals || {};
rebuilt.globals.ap_total = state.ap_total;

// Update all sections
(rebuilt.sections || []).forEach(sec => {
  // Update section fields (falls vorhanden)
  (sec.fields || []).forEach(field => {
    const key = generateKey(sec, { id: field.id }, field.id);
    if (field.type === 'text') {
      field.value = state.values[key] ?? field.value ?? '';
    } else {
      field.value = parseNum(state.values[key] ?? field.value ?? 0);
    }
  });

  // Handle direct items (no groups)
  (sec.items || []).forEach(it => {
    // Update main value
    const mainKey = generateKey(sec, it);
    it.value = parseNum(state.values[mainKey] ?? it.value ?? 0);
    
    // Update label if it was changed
    const labelDisplayId = generateDisplayId('row-input', sec, it, 'label');
    const labelElement = document.getElementById(labelDisplayId);
    if (labelElement) {
      it.label = labelElement.value;
    }
    
    // Update custom fields if they exist
    (it.fields || []).forEach(field => {
      const fieldKey = generateKey(sec, it, field.id);
      if (field.type === 'text') {
        field.value = state.values[fieldKey] ?? field.value ?? '';
      } else {
        field.value = parseNum(state.values[fieldKey] ?? field.value ?? 0);
      }
    });
  });

  // Handle grouped items
  (sec.groups || []).forEach(gr => {
    const valueKeyPrefix = `${sec.id}-${gr.id}`;
    (gr.items || []).forEach(it => {
      // Update main value with group prefix
      const mainKey = generateKey(sec, it, 'value', valueKeyPrefix);
      it.value = parseNum(state.values[mainKey] ?? it.value ?? 0);
      
      // Update label if it was changed
      const labelDisplayId = generateDisplayId('row-input', sec, it, 'label');
      const labelElement = document.getElementById(labelDisplayId);
      if (labelElement) {
        it.label = labelElement.value;
      }
      
      // Update custom fields if they exist
      (it.fields || []).forEach(field => {
        const fieldKey = generateKey(sec, it, field.id, valueKeyPrefix);
        if (field.type === 'text') {
          field.value = state.values[fieldKey] ?? field.value ?? '';
        } else {
          field.value = parseNum(state.values[fieldKey] ?? field.value ?? 0);
        }
      });
    });
  });
});


  return rebuilt;
}

// Helper function to convert state key to display ID
function keyToDisplayId(key) {
  return `row-input-${key}`;
}

function applySaveData(saveData) {
  // Apply loaded save data to current state
  
  // Update globals
  if (saveData.globals && saveData.globals.ap_total !== undefined) {
    state.ap_total = parseNum(saveData.globals.ap_total);
  }

  // Update all sections from save data
  (saveData.sections || []).forEach(savedSec => {
    // Find corresponding section in current definitions
    const currentSec = sections.find(s => s.id === savedSec.id);
    if (!currentSec) return;

    // Update section fields
    (savedSec.fields || []).forEach(savedField => {
      const key = generateKey(currentSec, { id: savedField.id }, savedField.id);
      if (savedField.type === 'text') {
        state.values[key] = savedField.value ?? '';
      } else {
        state.values[key] = parseNum(savedField.value ?? 0);
      }
    });

    // Update direct items (no groups)
    (savedSec.items || []).forEach(savedItem => {
      const currentItem = currentSec.items?.find(it => it.id === savedItem.id);
      if (!currentItem) return;

      // Update main value
      const mainKey = generateKey(currentSec, savedItem);
      state.values[mainKey] = parseNum(savedItem.value ?? 0);

      // Update item label if it exists in save data
      if (savedItem.label !== undefined) {
        const labelKey = generateKey(currentSec, savedItem, 'label');
        state.values[labelKey] = savedItem.label;
      }

      // Update attributes if this is the Eigenschaften section
      if (currentSec.id === 'Eigenschaften') {
        state.attributes[savedItem.id] = parseNum(savedItem.value ?? 0);
      }

      // Update custom fields
      (savedItem.fields || []).forEach(savedField => {
        const fieldKey = generateKey(currentSec, savedItem, savedField.id);
        if (savedField.type === 'text') {
          state.values[fieldKey] = savedField.value ?? '';
        } else {
          state.values[fieldKey] = parseNum(savedField.value ?? 0);
        }
      });
    });

    // Update groups
    (savedSec.groups || []).forEach(savedGroup => {
      const currentGroup = currentSec.groups?.find(g => g.id === savedGroup.id);
      if (!currentGroup) return;

      const valueKeyPrefix = `${savedSec.id}-${savedGroup.id}`;
      
      (savedGroup.items || []).forEach(savedItem => {
        const currentItem = currentGroup.items?.find(it => it.id === savedItem.id);
        if (!currentItem) return;

        // Update main value
        const mainKey = generateKey(currentSec, savedItem, 'value', valueKeyPrefix);
        state.values[mainKey] = parseNum(savedItem.value ?? 0);

        // Update item label if it exists in save data
        if (savedItem.label !== undefined) {
          const labelKey = generateKey(currentSec, savedItem, 'label', valueKeyPrefix);
          state.values[labelKey] = savedItem.label;
        }

        // Update custom fields
        (savedItem.fields || []).forEach(savedField => {
          const fieldKey = generateKey(currentSec, savedItem, savedField.id, valueKeyPrefix);
          if (savedField.type === 'text') {
            state.values[fieldKey] = savedField.value ?? '';
          } else {
            state.values[fieldKey] = parseNum(savedField.value ?? 0);
          }
        });
      });
    });
  });

  // Update UI elements after loading values
  setTimeout(() => {
    // Update all form inputs with loaded values
    Object.keys(state.values).forEach(key => {
      const displayId = keyToDisplayId(key);
      const element = document.getElementById(displayId);
      if (element) {
        element.value = state.values[key];
      }
    });

    // Update attributes in UI (already handled above, but ensure it's set)
    Object.keys(state.attributes).forEach(attrId => {
      const displayId = generateDisplayId('row-input', { id: 'Eigenschaften' }, { id: attrId }, 'value');
      const element = document.getElementById(displayId);
      if (element) {
        element.value = state.attributes[attrId];
      }
    });

    // Trigger recalculation to update all computed values
    recalc();
  }, 100);
}


// Boot
document.addEventListener('DOMContentLoaded', ()=>{
  init(defText, layText);
  render();                     // baut DOM
  recalc();                     // berechnet AP/Basis/Gesamt
  wireButtons();                    // Buttons/IO
});
// Generic visibility system
function evaluateShowIf(showIf, currentState) {
    if (!showIf || !showIf.field) return true;
    
    const fieldValue = currentState[showIf.field] || '';
    const compareValue = showIf.value || '';
    
    switch (showIf.operator) {
        case 'not_empty':
            return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
        case 'equals':
            return fieldValue === compareValue;
        case 'greater_than':
            return parseNum(fieldValue) > parseNum(compareValue);
        case 'less_than':
            return parseNum(fieldValue) < parseNum(compareValue);
        case 'greater_equal':
            return parseNum(fieldValue) >= parseNum(compareValue);
        case 'less_equal':
            return parseNum(fieldValue) <= parseNum(compareValue);
        default:
            return true;
    }
}


function updateVisibility() {
    if (!defs || !defs.sections) return;
    
    // Get current state for visibility checks
    const currentState = {};
    
    
    // Collect all form values for visibility evaluation
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        if (input.id) {
            currentState[input.id] = input.value;
        }
    });
    
    // Also include calculated values from state
    Object.assign(currentState, state.values);
    
    // Check each section and group for visibility conditions
    defs.sections.forEach(section => {
        const sectionElement = document.getElementById(section.id + '_section');
        if (sectionElement && section.show_if) {
            const shouldShow = evaluateShowIf(section.show_if, currentState);
            sectionElement.style.display = shouldShow ? 'block' : 'none';
        }
        
        // Check groups within sections
        if (section.groups) {
            section.groups.forEach(group => {
                const groupElement = document.getElementById(group.id + '_section');
                if (groupElement && group.show_if) {
                    const shouldShow = evaluateShowIf(group.show_if, currentState);
                    groupElement.style.display = shouldShow ? 'block' : 'none';
                }
            });
        }
    });
  }

// Level-based cost calculation for liturgies and similar
function calculateLevelCost(level, costPerIncrement = 50) {
    return level * costPerIncrement;
}

// Update the cost calculation to handle different calc_id types
function calcCost(item, value, section) {
    const calcId = section.calc_id || 'triangular';
    
    switch (calcId) {
        case 'level_cost':
            const costPer = section.cost_per_increment || 50;
            return calculateLevelCost(value, costPer);
        case 'triangular':
        default:
            return tri(value);
    }
}

// 
// Add visibility update to existing event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Update visibility on any form change
    document.addEventListener('change', function(e) {
        if (e.target.matches('input, select')) {
            setTimeout(updateVisibility, 10); // Small delay to ensure value is updated
        }
    });
    
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, select')) {
            setTimeout(updateVisibility, 10); // Small delay to ensure value is updated
        }
    });
    
    // Initial visibility update
    setTimeout(updateVisibility, 100);
});