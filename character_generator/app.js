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
function isNumericFieldType(type){ return type === 'number' || type === 'input.number_text'; }
function normalizeFieldValue(type, value){ return isNumericFieldType(type) ? parseNum(value ?? 0) : (value ?? ''); }
function formatComputedDisplay(main, bracket){ return `${main} (${bracket})`; }

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

function sectionFormulaHint(sec){
  const formula = get(defs, `globals.formulas.${sec.calc_id}`, null);
  if (!formula) return '';

  if (formula.type === 'weighted') {
    const b = parseNum(formula?.params?.b ?? 2);
    const w = parseNum(formula?.params?.w ?? 3);
    return `Gesamtberechnung: Gesamt = ${b} * Basis + ${w} * Wert`;
  }

  return '';
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

function normalizeOption(opt){
  if (typeof opt === 'string' || typeof opt === 'number') {
    const v = String(opt);
    return { id: v, label: v };
  }
  const id = String(opt?.id ?? opt?.value ?? '');
  const label = String(opt?.label ?? opt?.name ?? id);
  if (!id) return null;
  return { id, label };
}

function optionsFromSource(source){
  if (!source?.section_id) return [];
  const sec = sections.find(s => s.id === source.section_id);
  if (!sec) return [];

  let srcItems = [];
  if (source.group_id) {
    const grp = (sec.groups || []).find(g => g.id === source.group_id);
    srcItems = grp?.items || [];
  } else {
    srcItems = sec.items || [];
  }

  return srcItems.map(it => ({ id: String(it.id), label: String(it.label || it.id) }));
}

function resolveSelectOptions(field){
  if (!field) return [];
  if (Array.isArray(field.options)) {
    return field.options.map(normalizeOption).filter(Boolean);
  }
  if (field.options_from) {
    return optionsFromSource(field.options_from);
  }
  return [];
}

function getSectionColumns(sectionId, grouped = false){
  const pages = ui?.Seiten || [];
  for (const page of pages) {
    for (const ref of (page.bereiche || [])) {
      if (ref.ref !== sectionId) continue;
      return grouped ? (get(ref, 'gruppen.columns', []) || []) : (get(ref, 'tabelle.columns', []) || []);
    }
  }
  return [];
}

function findGroupItemValue(sectionId, groupId, itemId){
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return 0;
  const grp = (sec.groups || []).find(g => g.id === groupId);
  if (!grp) return 0;
  const item = (grp.items || []).find(i => i.id === itemId);
  if (!item) return 0;
  const keyPrefix = `${sec.id}-${grp.id}`;
  const valueKey = generateKey(sec, item, 'value', keyPrefix);
  return parseNum(state.values[valueKey] ?? item.value ?? 0);
}

function findGroupItemTotal(sectionId, groupId, itemId){
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return 0;
  const grp = (sec.groups || []).find(g => g.id === groupId);
  if (!grp) return 0;
  const item = (grp.items || []).find(i => i.id === itemId);
  if (!item) return 0;

  const basis = basisFrom(grp.basis || []);
  const keyPrefix = `${sec.id}-${grp.id}`;
  const valueKey = generateKey(sec, item, 'value', keyPrefix);
  const value = parseNum(state.values[valueKey] ?? item.value ?? 0);
  const calcId = item.overrides?.calc_id || sec.calc_id;
  return total(calcId, basis, value);
}

function getSectionItemFieldValue(sectionId, itemId, fieldId){
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return 0;
  const item = (sec.items || []).find(i => i.id === itemId);
  if (!item) return 0;
  const key = generateKey(sec, item, fieldId);
  return parseNum(state.values[key] ?? 0);
}

function getOwnFieldValue(sec, it, fieldId, valueKeyPrefix = null){
  if (!fieldId) return 0;
  const key = generateKey(sec, it, fieldId, valueKeyPrefix);
  return parseNum(state.values[key] ?? 0);
}

function findGroupByValueKeyPrefix(sec, valueKeyPrefix = null){
  if (!valueKeyPrefix) return null;
  const prefix = `${sec.id}-`;
  if (!valueKeyPrefix.startsWith(prefix)) return null;
  const groupId = valueKeyPrefix.slice(prefix.length);
  return (sec.groups || []).find(gr => gr.id === groupId) || null;
}

function computeBasisAndTotal(sec, it, valueKeyPrefix = null){
  const group = findGroupByValueKeyPrefix(sec, valueKeyPrefix);
  const itemBasis = (Array.isArray(it.basis) && it.basis.length) ? it.basis : (sec.basis || []);
  const basis = group ? basisFrom(group.basis || []) : basisFrom(itemBasis);
  const valueKey = valueKeyPrefix
    ? generateKey(sec, it, 'value', valueKeyPrefix)
    : generateKey(sec, it);
  const value = parseNum(state.values[valueKey] ?? it.value ?? 0);
  const calcId = it.overrides?.calc_id || sec.calc_id;
  const totalValue = total(calcId, basis, value);
  return { basis, totalValue, value, calcId };
}

function basisFormulaText(sec, it, valueKeyPrefix = null){
  const group = findGroupByValueKeyPrefix(sec, valueKeyPrefix);
  const basisList = group ? (group.basis || []) : ((Array.isArray(it.basis) && it.basis.length) ? it.basis : (sec.basis || []));
  if (!basisList.length) return '-';
  return `${basisList.join(' + ')} / 2`;
}

function totalFormulaText(sec, it, valueKeyPrefix = null){
  const { calcId } = computeBasisAndTotal(sec, it, valueKeyPrefix);
  if (calcId === 'value_only') return 'Wert';
  if (calcId === 'base_plus_value') return 'Basis + Wert';
  if (calcId === 'base_plus_value_minus_10') return 'Basis + Wert - 10';
  if (calcId === 'weighted_base_value') {
    const b = parseNum(get(defs, 'globals.formulas.weighted_base_value.params.b', 2));
    const w = parseNum(get(defs, 'globals.formulas.weighted_base_value.params.w', 3));
    return `${b} * Basis + ${w} * Wert`;
  }
  return 'Basis + Wert';
}

function formatDiceWithModifier(dice, mod){
  const d = String(dice || '1W6');
  const n = parseNum(mod);
  if (n === 0) return d;
  return n > 0 ? `${d}+${n}` : `${d}${n}`;
}

function computeCellValue(sec, it, col, valueKeyPrefix = null){
  const formulaId = col?.formula_id;
  if (!formulaId) return '';

  const formula = get(defs, `globals.formulas.${formulaId}`, null);
  if (!formula) return '';

  if (formula.type === 'selected_group_total_plus_field_minus_section_field') {
    const p = formula.params || {};
    const selectedFieldId = p.selected_field_id || '';
    const selectedKey = generateKey(sec, it, selectedFieldId, valueKeyPrefix);
    const selectedId = String(state.values[selectedKey] ?? '');

    const addFieldId = p.add_field_id || '';
    const addKey = generateKey(sec, it, addFieldId, valueKeyPrefix);
    const ownAdd = parseNum(state.values[addKey] ?? 0);

    const subtractVal = getSectionItemFieldValue(
      p.subtract_section_id,
      p.subtract_item_id,
      p.subtract_field_id
    );

    if (!selectedId) {
      return formatComputedDisplay(parseNum(ownAdd - subtractVal), 0);
    }

    const selectedTotal = findGroupItemTotal(p.source_section_id, p.source_group_id, selectedId);
    const selectedValue = findGroupItemValue(p.source_section_id, p.source_group_id, selectedId);
    const result = parseNum(selectedTotal + ownAdd - subtractVal);
    const bracket = p.bracket === 'selected_value' ? selectedValue : selectedTotal;
    return formatComputedDisplay(result, bracket);
  }

  if (formula.type === 'item_basis') {
    const { basis } = computeBasisAndTotal(sec, it, valueKeyPrefix);
    return String(basis);
  }

  if (formula.type === 'item_total') {
    const { totalValue } = computeBasisAndTotal(sec, it, valueKeyPrefix);
    return String(totalValue);
  }

  if (formula.type === 'item_basis_formula') {
    return basisFormulaText(sec, it, valueKeyPrefix);
  }

  if (formula.type === 'item_total_formula') {
    return totalFormulaText(sec, it, valueKeyPrefix);
  }

  if (formula.type === 'field_plus_section_field') {
    const p = formula.params || {};
    const ownVal = getOwnFieldValue(sec, it, p.own_field_id, valueKeyPrefix);
    const sectionVal = getSectionItemFieldValue(p.section_id, p.item_id, p.section_field_id);
    return String(parseNum(ownVal + sectionVal));
  }

  if (formula.type === 'dice_plus_field') {
    const p = formula.params || {};
    const ownVal = getOwnFieldValue(sec, it, p.own_field_id, valueKeyPrefix);
    return formatDiceWithModifier(p.dice || '1W6', ownVal);
  }

  return '';
}


// normalization
let sections = []; // normalized view
function normalize(defs){
  sections = (defs.sections || []).map(sec => ({
    id: sec.id,
    label: sec.label || '',
    type: sec.type || 'table',
    basis: sec.basis || [],
    calc_id: sec.calc_id || 'base_plus_value',
    cost_cpi: sec.cost_per_increment ?? 0,
    exclude_from_ap: !!sec.exclude_from_ap,
    items: (sec.items || []).map(it => ({
      ...it,
      id: it.id, label: it.label || '',
      basis: it.basis || [],
      value: parseNum(it.value ?? 0),
	  fields: Array.isArray(it.fields)
        ? it.fields.map(f => ({
            ...f,
            id: f.id,
            type: f.type || 'number',
            value: f.value ?? ''
          }))
        : undefined,
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
        ...it,
        id: it.id, label: it.label || '',
        basis: it.basis || [],
        value: parseNum(it.value ?? 0),
        fields: Array.isArray(it.fields)
          ? it.fields.map(f => ({
              ...f,
              id: f.id,
              type: f.type || 'number',
              value: f.value ?? ''
            }))
          : undefined,
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
    state.values[key] = normalizeFieldValue(field.type, field.value);
  });
  
  (sec.items || []).forEach(it => {
    state.values[generateKey(sec, it)] = parseNum(it.value ?? 0);
    
    (it.fields || []).forEach(field => {
      const key = generateKey(sec, it, field.id);
      state.values[key] = normalizeFieldValue(field.type, field.value);
    });
  });
  
  (sec.groups || []).forEach(gr => {
    const valueKeyPrefix = `${sec.id}-${gr.id}`;
    (gr.items || []).forEach(it => {
      state.values[generateKey(sec, it, 'value', valueKeyPrefix)] = parseNum(it.value ?? 0);
      
      (it.fields || []).forEach(field => {
        const key = generateKey(sec, it, field.id, valueKeyPrefix);
        state.values[key] = normalizeFieldValue(field.type, field.value);
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
      // Prozentwerte als fr verwenden, damit Grid+Gap nicht über 100% hinausläuft.
      const cols = page.grid.columns_percent.map(x => `${x}fr`).join(' ');
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
  const widthToCh = (width) => {
    const m = String(width || '').trim().match(/^(\d+(?:\.\d+)?)ch$/i);
    return m ? Number(m[1]) : null;
  };
  const columnTemplate = columns.map(col => {
    const header = String(col.header || col.key || '');
    const titleCh = Math.max(4, Math.min(24, header.length + 2));

    if (col.col_width) return col.col_width;
    if (col.input_width) {
      const inputCh = widthToCh(col.input_width);
      const minCh = inputCh ? Math.max(titleCh, Math.ceil(inputCh)) : titleCh;
      return `fit-content(${minCh}ch)`;
    }
    if (col.type === 'input.number_text') return `fit-content(${Math.max(titleCh, 4)}ch)`;
    if (col.type === 'computed' && (col.key === 'base' || col.key === 'total')) return `fit-content(${Math.max(titleCh, 5)}ch)`;
    if (col.type === 'computed' && (col.key || '').includes('formel')) return 'minmax(14ch, 20ch)';
    if (col.type === 'label' || (col.type === 'input.text' && col.key === 'label')) return 'minmax(12ch, 1.4fr)';
    if (col.type === 'input.text') return 'minmax(8ch, 1fr)';
    if (col.type === 'computed') return 'minmax(8ch, 1fr)';
    return 'minmax(7ch, 1fr)';
  }).join(' ');
  table.style.setProperty('--cols', columnTemplate);
  const push = node => table.appendChild(node);

  // 3) Header
  for (const col of columns) push(createDiv(col.header || col.key, 'header'));

  // 4) Rows
  for (const it of items) {
    // Vorberechnung (optional baseOverride für Gruppen)
    const metrics = computeBasisAndTotal(sec, it, valueKeyPrefix);
    const basisVal = (baseOverride !== null && baseOverride !== undefined) ? baseOverride : metrics.basis;
    const totalVal = (baseOverride !== null && baseOverride !== undefined)
      ? total(it.overrides?.calc_id || sec.calc_id, basisVal, metrics.value)
      : metrics.totalValue;

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
          if (col.input_width) {
            inp.style.width = col.input_width;
            inp.style.minWidth = col.input_width;
          }
          inp.addEventListener('input', () => { it.label = inp.value; });
          push(inp);
        } else {
          const key = generateKey(sec, it, k, valueKeyPrefix);
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.value = state.values[key] ?? it[k] ?? it.value ?? '';
          inp.id = generateDisplayId('row-input', sec, it, k, valueKeyPrefix);
          if (col.input_width) {
            inp.style.width = col.input_width;
            inp.style.minWidth = col.input_width;
          }
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
        if (col.input_width) {
          inp.style.width = col.input_width;
          inp.style.minWidth = col.input_width;
        }
        push(inp);
        break;
      }
      
        case 'input.select': {
          const key = generateKey(sec, it, k, valueKeyPrefix);
          const field = Array.isArray(it.fields) ? it.fields.find(f => f.id === k) : null;
          const select = document.createElement('select');
          select.id = generateDisplayId('row-input', sec, it, k, valueKeyPrefix);
          
          const options = resolveSelectOptions(field);
          const allowEmpty = field?.allow_empty !== false;
          const emptyLabel = field?.empty_label || '-- auswaehlen --';
          const currentValue = String(state.values[key] ?? field?.value ?? '');

          if (allowEmpty) {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = emptyLabel;
            select.appendChild(emptyOption);
          }
          
          options.forEach(opt => {
            const option = document.createElement('option');
            option.value = String(opt.id);
            option.textContent = String(opt.label);
            if (currentValue === String(opt.id)) {
              option.selected = true;
            }
            select.appendChild(option);
          });

          if (allowEmpty) {
            select.value = currentValue;
          }
          
          select.addEventListener('change', () => {
            state.values[key] = select.value;
            recalc();
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

      case 'computed': {
        const cell = createDiv(computeCellValue(sec, it, col, valueKeyPrefix));
        cell.id = generateDisplayId('row-computed', sec, it, k, valueKeyPrefix);
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
    const formulaHint = sectionFormulaHint(sec);
    if (formulaHint) card.appendChild(createDiv(formulaHint, 'hint'));
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
    const totalItems = items.length;
    const baseCount = Math.floor(totalItems / colsSplit);
    const remainder = totalItems % colsSplit;

    const container = document.createElement('div');
    container.className = 'split-grid';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${colsSplit}, minmax(0,1fr))`;
    container.style.gap = '12px';

    let start = 0;
    for (let i = 0; i < colsSplit; i++){
      const size = baseCount + (i < remainder ? 1 : 0);
      const chunk = items.slice(start, start + size);
      start += size;
      if (!chunk.length) continue;
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
        { key: 'base',  type: 'computed',         header: 'Basis', formula_id: 'display_basis' },
        { key: 'value', type: 'input.number_text', header: 'Wert' },
        { key: 'total', type: 'computed',         header: 'Gesamt', formula_id: 'display_total' }
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
  const includeInAp = !sec.exclude_from_ap;
  const secCpi = sec.cost_cpi;
  const flatComputedCols = getSectionColumns(sec.id, false).filter(col => col.type === 'computed');
  const groupComputedCols = getSectionColumns(sec.id, true).filter(col => col.type === 'computed');

  (sec.items || []).forEach(it => {
    const metrics = computeBasisAndTotal(sec, it);
    const value = metrics.value;
    const basis = metrics.basis;
    const tot = metrics.totalValue;
    const k = cpi(secCpi, null, it.overrides);

    if (includeInAp) spent += tri(value) * k;

    setText(generateDisplayId('row-basis', sec, it, 'value'), basis);
    setInput(generateDisplayId('row-input', sec, it, 'value'), value);
    setText(generateDisplayId('row-total', sec, it, 'value'), tot);
    flatComputedCols.forEach(col => {
      setText(generateDisplayId('row-computed', sec, it, col.key), computeCellValue(sec, it, col));
    });
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

      if (includeInAp) spent += tri(value) * k;

      setText(generateDisplayId('row-basis', sec, it, 'value', valueKeyPrefix), basis);
      setInput(generateDisplayId('row-input', sec, it, 'value', valueKeyPrefix), value);
      setText(generateDisplayId('row-total', sec, it, 'value', valueKeyPrefix), tot);
      groupComputedCols.forEach(col => {
        setText(
          generateDisplayId('row-computed', sec, it, col.key, valueKeyPrefix),
          computeCellValue(sec, it, col, valueKeyPrefix)
        );
      });
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

  if (!wireButtons.__visibilityWired){
    const schedule = () => setTimeout(updateVisibility, 10);
    document.addEventListener('change', (e) => {
      if (e.target.matches('input, select')) schedule();
    });
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select')) schedule();
    });
    wireButtons.__visibilityWired = true;
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
  const out = {
    save_format: 'character_state_v2',
    ap_total: state.ap_total,
    sections: []
  };

  sections.forEach(sec => {
    const secOut = { id: sec.id };

    if (typeof state.values[sec.id] !== 'undefined' && state.values[sec.id] !== '') {
      secOut.selected_value = state.values[sec.id];
    }

    if (Array.isArray(sec.fields) && sec.fields.length) {
      secOut.fields = sec.fields.map(field => {
        const key = generateKey(sec, { id: field.id }, field.id);
        return {
          id: field.id,
          type: field.type,
          value: normalizeFieldValue(field.type, state.values[key] ?? field.value ?? '')
        };
      });
    }

    if (Array.isArray(sec.items) && sec.items.length) {
      secOut.items = sec.items.map(it => {
        const itemOut = {
          id: it.id,
          value: parseNum(state.values[generateKey(sec, it)] ?? it.value ?? 0)
        };

        const labelDisplayId = generateDisplayId('row-input', sec, it, 'label');
        const labelElement = document.getElementById(labelDisplayId);
        if (labelElement) itemOut.label = labelElement.value;

        if (Array.isArray(it.fields) && it.fields.length) {
          itemOut.fields = it.fields.map(field => {
            const fieldKey = generateKey(sec, it, field.id);
            return {
              id: field.id,
              type: field.type,
              value: normalizeFieldValue(field.type, state.values[fieldKey] ?? field.value ?? '')
            };
          });
        }

        return itemOut;
      });
    }

    if (Array.isArray(sec.groups) && sec.groups.length) {
      secOut.groups = sec.groups.map(gr => {
        const valueKeyPrefix = `${sec.id}-${gr.id}`;
        return {
          id: gr.id,
          items: (gr.items || []).map(it => {
            const itemOut = {
              id: it.id,
              value: parseNum(state.values[generateKey(sec, it, 'value', valueKeyPrefix)] ?? it.value ?? 0)
            };

            const labelDisplayId = generateDisplayId('row-input', sec, it, 'label');
            const labelElement = document.getElementById(labelDisplayId);
            if (labelElement) itemOut.label = labelElement.value;

            if (Array.isArray(it.fields) && it.fields.length) {
              itemOut.fields = it.fields.map(field => {
                const fieldKey = generateKey(sec, it, field.id, valueKeyPrefix);
                return {
                  id: field.id,
                  type: field.type,
                  value: normalizeFieldValue(field.type, state.values[fieldKey] ?? field.value ?? '')
                };
              });
            }

            return itemOut;
          })
        };
      });
    }

    out.sections.push(secOut);
  });

  return out;
}

// Helper function to convert state key to display ID
function keyToDisplayId(key) {
  return `row-input-${key}`;
}

function syncUiFromStateAfterLoad() {
  setTimeout(() => {
    Object.keys(state.values).forEach(key => {
      const displayId = keyToDisplayId(key);
      const element = document.getElementById(displayId);
      if (element) {
        element.value = state.values[key];
      }
    });

    Object.keys(state.attributes).forEach(attrId => {
      const displayId = generateDisplayId('row-input', { id: 'Eigenschaften' }, { id: attrId }, 'value');
      const element = document.getElementById(displayId);
      if (element) {
        element.value = state.attributes[attrId];
      }
    });

    recalc();
  }, 100);
}

function applyCompactSaveData(saveData) {
  if (typeof saveData.ap_total !== 'undefined') {
    state.ap_total = parseNum(saveData.ap_total);
  }

  (saveData.sections || []).forEach(savedSec => {
    const currentSec = sections.find(s => s.id === savedSec.id);
    if (!currentSec) return;

    if (typeof savedSec.selected_value !== 'undefined') {
      state.values[currentSec.id] = savedSec.selected_value;
    }

    (savedSec.fields || []).forEach(savedField => {
      const currentField = (currentSec.fields || []).find(f => f.id === savedField.id);
      const type = savedField.type || currentField?.type || 'number';
      const key = generateKey(currentSec, { id: savedField.id }, savedField.id);
      state.values[key] = normalizeFieldValue(type, savedField.value ?? '');
    });

    (savedSec.items || []).forEach(savedItem => {
      const currentItem = currentSec.items?.find(it => it.id === savedItem.id);
      if (!currentItem) return;

      if (typeof savedItem.value !== 'undefined') {
        state.values[generateKey(currentSec, savedItem)] = parseNum(savedItem.value ?? 0);
      }

      if (savedItem.label !== undefined) {
        state.values[generateKey(currentSec, savedItem, 'label')] = savedItem.label;
      }

      if (currentSec.id === 'Eigenschaften' && typeof savedItem.value !== 'undefined') {
        state.attributes[savedItem.id] = parseNum(savedItem.value ?? 0);
      }

      (savedItem.fields || []).forEach(savedField => {
        const currentField = (currentItem.fields || []).find(f => f.id === savedField.id);
        const type = savedField.type || currentField?.type || 'number';
        const fieldKey = generateKey(currentSec, savedItem, savedField.id);
        state.values[fieldKey] = normalizeFieldValue(type, savedField.value ?? '');
      });
    });

    (savedSec.groups || []).forEach(savedGroup => {
      const currentGroup = currentSec.groups?.find(g => g.id === savedGroup.id);
      if (!currentGroup) return;

      const valueKeyPrefix = `${savedSec.id}-${savedGroup.id}`;
      (savedGroup.items || []).forEach(savedItem => {
        const currentItem = currentGroup.items?.find(it => it.id === savedItem.id);
        if (!currentItem) return;

        if (typeof savedItem.value !== 'undefined') {
          const mainKey = generateKey(currentSec, savedItem, 'value', valueKeyPrefix);
          state.values[mainKey] = parseNum(savedItem.value ?? 0);
        }

        if (savedItem.label !== undefined) {
          state.values[generateKey(currentSec, savedItem, 'label', valueKeyPrefix)] = savedItem.label;
        }

        (savedItem.fields || []).forEach(savedField => {
          const currentField = (currentItem.fields || []).find(f => f.id === savedField.id);
          const type = savedField.type || currentField?.type || 'number';
          const fieldKey = generateKey(currentSec, savedItem, savedField.id, valueKeyPrefix);
          state.values[fieldKey] = normalizeFieldValue(type, savedField.value ?? '');
        });
      });
    });
  });
}

function applySaveData(saveData) {
  if (saveData?.save_format === 'character_state_v2') {
    applyCompactSaveData(saveData);
    syncUiFromStateAfterLoad();
    return;
  }

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
      state.values[key] = normalizeFieldValue(savedField.type, savedField.value ?? '');
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
        state.values[fieldKey] = normalizeFieldValue(savedField.type, savedField.value ?? '');
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
          state.values[fieldKey] = normalizeFieldValue(savedField.type, savedField.value ?? '');
        });
      });
    });
  });

  syncUiFromStateAfterLoad();
}


// Boot
document.addEventListener('DOMContentLoaded', ()=>{
  init(defText, layText);
  render();                     // baut DOM
  recalc();                     // berechnet AP/Basis/Gesamt
  wireButtons();                    // Buttons/IO
});