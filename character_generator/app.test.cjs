const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(`${__dirname}/app.js`, 'utf8');
const definitions = {
  globals: { ap_total: 4000 },
  sections: [
    { id: 'Eigenschaften', items: [{ id: 'A', value: 10 }, { id: 'B', value: 6 }] },
    {
      id: 'Skills', cost_per_increment: 3, calc_id: 'base_plus_value',
      groups: [{
        id: 'new', basis: ['A', 'A', 'A'],
        items: [{ id: 'retained', basis: ['B', 'B', 'B'], value: 0 }]
      }]
    },
    { id: 'Flat', cost_per_increment: 5, items: [{ id: 'known', value: 0 }] }
  ]
};

function runtime(config = definitions){
  const context = vm.createContext({
    console,
    document: { readyState: 'loading', getElementById: () => null, addEventListener(){} },
    jsyaml: { load: JSON.parse }
  });
  vm.runInContext(source, context);
  const run = code => vm.runInContext(code, context);
  const reset = () => run(`init(${JSON.stringify(JSON.stringify(config))}, '{"Seiten":[]}')`);
  reset();
  return {
    run, reset,
    load: doc => run(`applySaveData(${JSON.stringify(doc)})`),
    json: code => JSON.parse(JSON.stringify(run(code)))
  };
}

test('sheet geometry and typography come from the layout configuration', () => {
  const r = runtime();
  r.run(`
    document.documentElement = { style: { setProperty(key, value) { this[key] = value; } } };
    init(JSON.stringify({ sections: [] }), JSON.stringify({ Einstellungen: {
      print: { content_width: '194mm' },
      typography: { base_font_size: '8pt', line_height: 1.3, table_header_font_size: '9pt', heading_font_size: '10pt', title_font_size: '11pt' }
    } }));
  `);
  assert.equal(r.run("document.documentElement.style['--sheet-width']"), '194mm');
  assert.equal(r.run("document.documentElement.style['--base-font-size']"), '8pt');
  assert.equal(r.run("document.documentElement.style['--base-line-height']"), '1.3');
  assert.equal(r.run("document.documentElement.style['--table-header-font-size']"), '9pt');
  assert.equal(r.run("document.documentElement.style['--heading-font-size']"), '10pt');
  r.reset();
  assert.equal(r.run("document.documentElement.style['--sheet-width']"), '1600px');
  assert.equal(r.run("document.documentElement.style['--base-line-height']"), '1.2');
});

test('selectable entry layout is controlled by the layout reference', () => {
  const r = runtime();
  r.run(`
    document.createElement = tag => ({
      tag, children: [], dataset: {}, properties: {},
      classList: { add() {} },
      style: { setProperty(key, value) { this[key] = value; } },
      appendChild(child) { this.children.push(child); return child; },
      setAttribute(key, value) { this.properties[key] = value; },
      addEventListener(event, handler) { (this.listeners ||= {})[event] = handler; },
      get options() { return this.children; }
    });
    const section = sections[1];
    section.selectable_items = { field_id: 'selected', add_label: 'Add' };
    section.groups[0].items[0].label = 'Ability';
    section.item_details = { retained: { effect: 'Shown', hidden: 'Hidden', zero: 0, options: ['One', 'Two'] } };
    state.values['Skills-new-retained'] = 1;
    const configured = document.createElement('div');
    renderSelectableItems(section, {
      spalten: 3,
      grid: { columns_percent: [60, 40] },
      bereiche: [
        { grid_span: { col_start: 1, col_span: 2 }, spalten: 2,
          tabelle: { layout: 'fields', font_size: '7pt', columns: [
            { type: 'heading', key: 'label', col_width: 'max-content' },
            { type: 'readonly_text', key: 'details.effect', header: 'Effect' },
            { type: 'readonly_text', key: 'details.missing', header: 'Missing' },
            { type: 'readonly_text', key: 'details.zero', header: 'Zero' },
            { type: 'list', key: 'details.options', header: 'Options' }
          ] }
        }
      ]
    }, configured);
    const defaults = document.createElement('div');
    renderSelectableItems(section, {}, defaults);
  `);
  assert.equal(r.run("configured.children[1].style['--item-columns']"), 3);
  assert.equal(r.run("configured.children[1].children[0].style['--grid-columns']"), '60fr 40fr');
  assert.equal(r.run('configured.children[1].children[0].children[0].style.gridColumnEnd'), 'span 2');
  r.run('const table = configured.children[1].children[0].children[0].children[0]');
  assert.equal(r.run('table.style.fontSize'), '7pt');
  assert.equal(r.run("table.style['--table-font-size']"), '7pt');
  assert.equal(r.run("table.style['--table-header-font-size']"), '7pt');
  assert(r.run("table.style['--field-cols'].startsWith('max-content ')"));
  assert.equal(r.run("table.style['--field-columns']"), 2);
  assert.equal(r.run('table.children.length'), 4);
  assert.equal(r.run('table.children[0].children[0].textContent'), 'Ability');
  assert.equal(r.run('table.children[1].children[1].textContent'), 'Shown');
  assert.equal(r.run('table.children[2].children[1].textContent'), '0');
  assert.equal(r.run('table.children[3].children[1].children.length'), 2);
  assert.equal(r.run("defaults.children[1].style['--item-columns']"), 1);
  assert.equal(r.run('defaults.children[1].children[0].children.length'), 0);
  r.run(`
    let removedId;
    const actionTable = buildTable([section.groups[0].items[0]], section,
      { tabelle: { columns: [{ key: 'label', type: 'label' }] } },
      { valueKeyPrefix: 'Skills-new', rowActions: { removeLabel: 'Remove', remove: item => { removedId = item.id; } } });
    const removeButton = actionTable.children.at(-1);
  `);
  assert.equal(r.run('removeButton.children[0].src'), 'icons/trash-2.svg');
  assert.equal(r.run("removeButton.properties['aria-label']"), 'Remove: Ability');
  assert.equal(r.run('removeButton.title'), 'Remove: Ability');
  r.run('removeButton.listeners.click()');
  assert.equal(r.run('removedId'), 'retained');
});

test('selectable entries retain zero-valued selections through saves', () => {
  const config = JSON.parse(JSON.stringify(definitions));
  config.sections[1].selectable_items = { field_id: 'selected' };
  const r = runtime(config);
  assert.equal(r.run('sections[1].selectable_items.field_id'), 'selected');
  assert.equal(r.run("isItemSelected(sections[1], sections[1].groups[0].items[0], 'Skills-new')"), false);
  r.run("setItemSelected(sections[1], sections[1].groups[0].items[0], true, 'Skills-new')");
  const saved = r.json('buildSave()');
  r.reset();
  r.load(saved);
  assert.equal(r.run("state.values['Skills-new-retained-selected']"), 'yes');
  assert.equal(r.run("state.values['Skills-new-retained']"), 0);
});

test('grouped entries use table columns for live computed values when no group columns are configured', () => {
  const r = runtime();
  r.run("ui = { Seiten: [{ bereiche: [{ ref: 'Skills', tabelle: { columns: [{ key: 'total', type: 'computed', formula_id: 'display_total' }] } }] }] }");
  assert.equal(r.run("getSectionColumns('Skills', true)[0].key"), 'total');
  r.run("ui.Seiten[0].bereiche[0].gruppen = { columns: [{ key: 'base' }] }");
  assert.equal(r.run("getSectionColumns('Skills', true)[0].key"), 'base');
  r.run("ui.Seiten[0].bereiche[0] = { ref: 'Skills', bereiche: [{ tabelle: { columns: [{ key: 'label' }] } }, { bereiche: [{ tabelle: { columns: [{ key: 'total' }] } }] }] }");
  assert.deepEqual(r.json("getSectionColumns('Skills', true).map(column => column.key)"), ['label', 'total']);
  r.run("ui.Seiten[0].bereiche[0].tabelle = { columns: [{ key: 'base' }] }");
  assert.deepEqual(r.json("getSectionColumns('Skills', true).map(column => column.key)"), ['base', 'label', 'total']);
});

test('legacy learned entries are selected and removal releases their progression cost', () => {
  const config = JSON.parse(JSON.stringify(definitions));
  config.sections[1].selectable_items = { field_id: 'selected' };
  const r = runtime(config);
  r.load({ sections: [{ id: 'Skills', groups: [{ id: 'old', items: [{ id: 'retained', value: 4 }] }] }] });
  assert.equal(r.run("isItemSelected(sections[1], sections[1].groups[0].items[0], 'Skills-new')"), true);
  assert.equal(r.run("progressionApCost(sections[1].calc_id, state.values['Skills-new-retained'], sections[1].cost_cpi)"), 30);
  r.run("setItemSelected(sections[1], sections[1].groups[0].items[0], false, 'Skills-new')");
  assert.equal(r.run("isItemSelected(sections[1], sections[1].groups[0].items[0], 'Skills-new')"), false);
  assert.equal(r.run("progressionApCost(sections[1].calc_id, state.values['Skills-new-retained'], sections[1].cost_cpi)"), 0);
  const saved = r.json('buildSave()');
  r.reset();
  r.load(saved);
  assert.equal(r.run("isItemSelected(sections[1], sections[1].groups[0].items[0], 'Skills-new')"), false);
});

test('DSA compact descriptions retain profiles and modifier costs for all 27 spells', () => {
  const source = fs.readFileSync(`${__dirname}/simple_dsa_definitions.js`, 'utf8');
  const config = vm.runInNewContext(`${source}\ndefText`);
  const spellConfig = config.slice(config.indexOf('  - id: Zauber\n'), config.indexOf('  - id: gottheit\n'));
  const details = JSON.parse(spellConfig.split('    item_details: ')[1].split('\n    selectable_items:')[0]);
  const rules = fs.readFileSync(`${__dirname}/../simple_dsa.md`, 'utf8');
  const items = [...spellConfig.matchAll(/- \{id: (\w+), label: "([^"]+)", value: 0\}/g)];
  assert.equal(items.length, 27);
  assert.equal(Object.keys(details).length, 27);
  for (const [, id, label] of items) {
    const block = rules.split(`### ${label}\n`)[1].split(/^#{1,3} /m)[0];
    const profile = block.split('\n').filter(line => line.startsWith('|'))[2].split('|').slice(1, -1).map(value => value.trim());
    const fields = ['basis', 'erschwernis', 'kosten', 'zauberdauer', 'reichweite', 'wirkungsdauer'];
    assert.deepEqual(fields.map(field => details[id][field]), profile, label);
    const modifiers = block.split('\n').filter(line => line.startsWith('- **')).map(line => line.slice(2).replace(/\*\*/g, ''));
    const modifierKey = text => text.slice(0, text.indexOf('):') + 1);
    const compactModifiers = details[id].modifikatoren || [];
    assert.deepEqual(compactModifiers.map(modifierKey), modifiers.map(modifierKey), label);
    assert(compactModifiers.every(text => text.includes('): ') && text.split('): ')[1].trim()), label);
    assert(details[id].wirkung);
    assert(details[id].qualitaet);
    assert(Object.values(details[id]).every(value => typeof value === 'string' || Array.isArray(value)));
  }
});

test('moved items stay current and item bases override group bases', () => {
  const r = runtime();
  r.load({ save_format: 'character_state_v2', sections: [{
    id: 'Skills', groups: [{ id: 'old', items: [{ id: 'retained', value: 7 }] }]
  }] });
  assert.equal(r.run('deprecatedEntries.length'), 0);
  assert.equal(r.run("state.values['Skills-new-retained']"), 7);
  assert.equal(r.run("computeBasisAndTotal(sections[1], sections[1].groups[0].items[0], 'Skills-new').basis"), 9);
  assert.equal(r.run("basisFormulaText(sections[1], sections[1].groups[0].items[0], 'Skills-new')"), 'B + B + B / 2');
});

test('removed items, groups and sections survive repeated saves with AP costs', () => {
  const r = runtime();
  r.load({ save_format: 'character_state_v2', sections: [
    { id: 'Skills', groups: [{ id: 'old', items: [{ id: 'old_spell', label: 'Old spell', value: 4 }] }] },
    { id: 'Flat', items: [{ id: 'old_talent', value: 3, fields: [{ id: 'note', type: 'text', value: 'Keep me' }] }] },
    { id: 'Removed', cost_per_increment: 8, calc_id: 'level_cost', groups: [{ id: 'gone', items: [{ id: 'old', value: 2 }] }] }
  ] });
  assert.equal(r.run('deprecatedEntries.length'), 3);
  assert.equal(r.run('deprecatedEntries.reduce((sum, e) => sum + deprecatedApCost(e), 0)'), 76);
  for (let i = 0; i < 3; i++) {
    const save = r.json('buildSave()');
    r.reset();
    r.load(save);
    assert.equal(r.run('deprecatedEntries.length'), 3);
    assert.equal(r.run('deprecatedEntries.reduce((sum, e) => sum + deprecatedApCost(e), 0)'), 76);
    assert.equal(r.run('deprecatedEntries[0].item.label'), 'Old spell');
    assert.equal(r.run('deprecatedEntries[1].item.fields[0].value'), 'Keep me');
  }
});

test('legacy full definitions preserve historical cost overrides and exclusions', () => {
  const r = runtime();
  r.load({ globals: { ap_total: 6000 }, sections: [{
    id: 'Skills', cost_per_increment: 6,
    groups: [{ id: 'gone', cost_per_increment: 4, items: [
      { id: 'obsolete', value: 3 },
      { id: 'special', value: 2, cost_per_increment: 9 },
      { id: 'free', value: 10, exclude_from_ap: true }
    ] }]
  }] });
  assert.equal(r.run('state.ap_total'), 6000);
  assert.equal(r.run('deprecatedEntries.reduce((sum, e) => sum + deprecatedApCost(e), 0)'), 51);
});

test('legacy characters load and save only positive numeric values', () => {
  const config = JSON.parse(JSON.stringify(definitions));
  config.sections[2].items[0].fields = [
    { id: 'amount', type: 'number', value: 9 },
    { id: 'note', type: 'text', value: '' }
  ];
  const r = runtime(config);
  r.load({ sections: [
    { id: 'Eigenschaften', items: [{ id: 'A', value: 0 }, { id: 'B', value: -2 }] },
    { id: 'Skills', groups: [{ id: 'new', items: [{ id: 'retained', value: -3 }] }] },
    { id: 'Flat', items: [{ id: 'known', value: 5, fields: [
      { id: 'amount', type: 'number', value: -4 },
      { id: 'note', type: 'text', value: 'Legacy note' }
    ] }] },
    { id: 'Unknown', items: [
      { id: 'zero', value: 0 },
      { id: 'negative', value: -2 },
      { id: 'positive', value: 3 }
    ] }
  ] });

  assert.equal(r.run('state.values.A'), 10);
  assert.equal(r.run('state.attributes.A'), 10);
  assert.equal(r.run('state.values.B'), 6);
  assert.equal(r.run("state.values['Skills-new-retained']"), 0);
  assert.equal(r.run('state.values.known'), 5);
  assert.equal(r.run("state.values[generateKey(sections[2], sections[2].items[0], 'amount')]"), 9);
  assert.equal(r.run("state.values[generateKey(sections[2], sections[2].items[0], 'note')]"), 'Legacy note');
  assert.deepEqual(r.json('deprecatedEntries.map(entry => entry.item.id)'), ['positive']);

  r.run("state.values['Skills-new-retained'] = -1; state.values.known = -2; state.values[generateKey(sections[2], sections[2].items[0], 'amount')] = -3");
  const saved = r.json('buildSave()');
  const numericValues = saved.sections.flatMap(section => [
    ...(section.items || []),
    ...(section.groups || []).flatMap(group => group.items || [])
  ]).flatMap(item => [item.value, ...(item.fields || []).map(field => field.value)])
    .filter(value => typeof value === 'number');
  assert(numericValues.every(value => value > 0));
  assert.deepEqual(saved.sections.find(section => section.id === 'Unknown').items.map(item => item.id), ['positive']);

  const compact = runtime();
  compact.load({ save_format: 'character_state_v2', zero_values_omitted: true, sections: [{
    id: 'Skills', groups: [{ id: 'old', items: [
      { id: 'zero', value: 0 },
      { id: 'negative', value: -2 }
    ] }]
  }] });
  assert.equal(compact.run('deprecatedEntries.length'), 0);
});

test('legacy unknown items without positive values are ignored', () => {
  const r = runtime();
  r.load({ sections: [{ id: 'Unknown', items: [{ id: 'zero', value: 0 }] }] });
  assert.equal(r.run('deprecatedEntries.length'), 0);
  assert.equal(r.json('buildSave()').sections.some(section => section.id === 'Unknown'), false);
  r.reset();
  assert.equal(r.run('deprecatedEntries.length'), 0);
});

test('flat and grouped items can move without losing values', () => {
  const r = runtime();
  r.load({ save_format: 'character_state_v2', sections: [
    { id: 'Skills', items: [{ id: 'retained', value: 5 }] },
    { id: 'Flat', groups: [{ id: 'gone', items: [{ id: 'known', value: 2 }] }] }
  ] });
  assert.equal(r.run('deprecatedEntries.length'), 0);
  assert.equal(r.run("state.values['Skills-new-retained']"), 5);
  assert.equal(r.run("state.values.known"), 2);
});

test('ambiguous item IDs are preserved rather than assigned to the wrong group', () => {
  const r = runtime();
  r.run("sections[1].groups.push({ id: 'other', items: [{ id: 'retained', value: 0 }] })");
  r.load({ sections: [{
    id: 'Skills', groups: [{ id: 'gone', items: [{ id: 'retained', value: 5 }] }]
  }] });
  assert.equal(r.run('deprecatedEntries.length'), 1);
  assert.equal(r.run("state.values['Skills-new-retained']"), 0);
});

test('flat dynamic bases keep precedence and new saves carry labels and cost rules', () => {
  const r = runtime();
  r.run("state.values['Skills-new-retained'] = 1");
  r.run("sections[2].basis_by_state = { field: 'profile', mapping: { chosen: ['A', 'A', 'A'] } }; sections[2].items[0].basis = ['B', 'B', 'B']; state.values.profile = 'chosen'");
  assert.equal(r.run('computeBasisAndTotal(sections[2], sections[2].items[0]).basis'), 15);
  const section = r.json('buildSave()').sections.find(s => s.id === 'Skills');
  assert.equal(section.cost_per_increment, 3);
  assert.equal(section.calc_id, 'base_plus_value');
  assert.equal(section.groups[0].items[0].label, '');
  assert.deepEqual(section.groups[0].items[0].basis, ['B', 'B', 'B']);
});

test('zero values are omitted and v2 saves restore them without configuration defaults', () => {
  const config = JSON.parse(JSON.stringify(definitions));
  config.sections[2].items[0].fields = [
    { id: 'amount', type: 'number', value: 9 },
    { id: 'note', type: 'text', value: '' }
  ];
  const r = runtime(config);
  r.run(`
    state.values.A = 0; state.attributes.A = 0;
    state.values[generateKey(sections[2], sections[2].items[0], 'amount')] = 0;
    state.values[generateKey(sections[2], sections[2].items[0], 'note')] = 'Keep me';
  `);
  r.load({ sections: [{ id: 'Skills', items: [{ id: 'old', value: 0, fields: [
    { id: 'amount', type: 'number', value: 0 },
    { id: 'note', type: 'text', value: 'Old note' }
  ] }] }] });
  const saved = r.json('buildSave()');
  assert.equal(saved.zero_values_omitted, true);
  assert.equal(saved.sections.find(s => s.id === 'Eigenschaften').items.some(i => i.id === 'A'), false);
  assert.deepEqual(saved.sections.find(s => s.id === 'Skills').groups[0].items, []);
  const item = saved.sections.find(s => s.id === 'Flat').items[0];
  assert.equal('value' in item, false);
  assert.equal('value' in item.fields[0], false);
  assert.equal(item.fields[1].value, 'Keep me');
  assert.equal(r.run('deprecatedEntries.length'), 0);
  r.reset();
  r.load(saved);
  assert.equal(r.run('state.values.A'), 0);
  assert.equal(r.run('state.attributes.A'), 0);
  assert.equal(r.run("state.values['Skills-new-retained']"), 0);
  assert.equal(r.run('state.values.known'), 0);
  assert.equal(r.run("state.values[generateKey(sections[2], sections[2].items[0], 'amount')]"), 0);
  assert.equal(r.run("state.values[generateKey(sections[2], sections[2].items[0], 'note')]"), 'Keep me');
  assert.deepEqual(r.json('buildSave()').sections.find(s => s.id === 'Flat').items[0].fields[1].value, 'Keep me');
});

test('repeatable zero-valued rows retain their identities and do not inherit template values', () => {
  const r = runtime();
  r.run(`
    sections[2].repeatable_rows = { min_rows: 1 };
    sections[2].items[0].value = 9;
    sections[2].items.push(cloneItemTemplate(sections[2].items[0], 'second'));
    state.values.known = 0;
    state.values.second = 0;
  `);
  const saved = r.json('buildSave()');
  const items = saved.sections.find(s => s.id === 'Flat').items;
  assert.deepEqual(items.map(i => i.id), ['known', 'second']);
  assert(items.every(i => !('value' in i)));
  r.load(saved);
  assert.equal(r.run('state.values.known'), 0);
  assert.equal(r.run('state.values.second'), 0);
  assert.deepEqual(r.json('sections[2].items.map(i => i.id)'), ['known', 'second']);
});

test('deleting a deprecated entry releases its AP and removes it from future saves', () => {
  const r = runtime();
  r.load({ sections: [{ id: 'Skills', groups: [{ id: 'old', items: [
    { id: 'obsolete', value: 4 },
    { id: 'keep', value: 2 }
  ] }] }] });
  r.run('let renderCalls = 0; let recalcCalls = 0; render = () => renderCalls++; recalc = () => recalcCalls++');
  assert.equal(r.run('deprecatedEntries.reduce((sum, e) => sum + deprecatedApCost(e), 0)'), 39);
  r.run('removeDeprecatedEntry(deprecatedEntries[0])');
  assert.equal(r.run('renderCalls'), 1);
  assert.equal(r.run('recalcCalls'), 1);
  assert.equal(r.run('deprecatedEntries.reduce((sum, e) => sum + deprecatedApCost(e), 0)'), 9);
  const saved = r.json('buildSave()');
  assert.deepEqual(saved.sections.find(s => s.id === 'Skills').groups.find(g => g.id === 'old').items.map(i => i.id), ['keep']);
  r.reset();
  r.load(saved);
  assert.equal(r.run('deprecatedEntries.length'), 1);
  r.run('removeDeprecatedEntry(deprecatedEntries[0])');
  assert.equal(r.run('deprecatedEntries.length'), 0);
  assert.equal(r.json('buildSave()').sections.find(s => s.id === 'Skills').groups.some(g => g.id === 'old'), false);
});

test('DSA spells cost factor five and Ilyra retains her spell budget with current spells', () => {
  const config = fs.readFileSync(`${__dirname}/simple_dsa_definitions.js`, 'utf8');
  const example = fs.readFileSync(`${__dirname}/examples/ilyra-falkenstern.sav`, 'utf8');
  const spellConfig = config.slice(config.indexOf('  - id: Zauber\n'), config.indexOf('  - id: gottheit\n'));
  assert.match(spellConfig, /cost_per_increment: 5/);
  const spellSave = example.slice(example.indexOf('  - id: Zauber\n'), example.indexOf('  - id: Sprachen\n'));
  const values = [...spellSave.matchAll(/\{ id: ([a-z_]+), value: (\d+) \}/g)];
  assert.equal(values.length, 13);
  let spent = 0;
  for (const [, id, raw] of values) {
    assert(spellConfig.includes(`{id: ${id},`), `Undefined example spell: ${id}`);
    const value = Number(raw);
    spent += value * (value + 1) / 2 * 5;
  }
  assert.equal(spent, 3465);
  assert.match(example, /^ap_total: 20000$/m);
});

test('eight DSA spell categories share one basis each in rules and generator, retaining legacy values', () => {
  const config = fs.readFileSync(`${__dirname}/simple_dsa_definitions.js`, 'utf8');
  const rules = fs.readFileSync(`${__dirname}/../simple_dsa.md`, 'utf8');
  const spellConfig = config.slice(config.indexOf('  - id: Zauber\n'), config.indexOf('  - id: gottheit\n'));
  const expected = [
    ['metamagie', 'Metamagie', ['KL', 'IN', 'CH'], 5],
    ['geistmagie', 'Geistmagie', ['MU', 'IN', 'CH'], 5],
    ['erkenntnismagie', 'Erkenntnismagie', ['KL', 'IN', 'IN'], 2],
    ['illusionsmagie', 'Illusionsmagie', ['IN', 'CH', 'GE'], 3],
    ['lebensmagie', 'Lebensmagie', ['IN', 'CH', 'KO'], 4],
    ['bewegungsmagie', 'Bewegungsmagie', ['IN', 'GE', 'GE'], 3],
    ['stoffmagie', 'Stoffmagie', ['KL', 'KK', 'KO'], 2],
    ['beschwoerung', 'Beschwörung', ['MU', 'CH', 'CH'], 3]
  ];
  const groups = [...spellConfig.matchAll(/      - id: (\w+)\n        label: "([^"]+)"\n        basis: \[([^\]]+)\]\n        items:\n([\s\S]*?)(?=\n      - id:|$)/g)].map(m => ({
    id: m[1], label: m[2], basis: m[3].split(', '),
    items: [...m[4].matchAll(/- \{id: (\w+), label: "([^"]+)", value: 0\}/g)].map(item => ({
      id: item[1], label: item[2], value: 0
    }))
  }));
  assert.deepEqual(groups.map(g => [g.id, g.label, g.basis, g.items.length]), expected);
  assert.equal((spellConfig.match(/basis:/g) || []).length, 8);
  assert.equal(new Set(groups.flatMap(g => g.items.map(i => i.id))).size, 27);
  for (const group of groups) {
    const chapter = rules.split(`## ${group.label}\n`)[1].split(/^##? /m)[0];
    for (const item of group.items) {
      const block = chapter.split(`### ${item.label}\n`)[1]?.split(/^### /m)[0];
      assert(block, `${item.label} is missing in ${group.label}`);
      assert(block.includes(`| ${group.basis.join(', ')} |`), `${item.label} has a different basis`);
      assert(rules.includes(`| ${item.label} | ${group.label} |`));
    }
  }
  const r = runtime({ ...definitions, sections: [
    ...definitions.sections,
    { id: 'Zauber', calc_id: 'base_plus_value', cost_per_increment: 5, groups }
  ] });
  const legacy = {
    antimagie: ['magischer_schutz', 'magieresistenz', 'bann'],
    geistmagie: ['einfluss', 'bewusstseinstruebung', 'zwang', 'gedankenlesen'],
    erkenntnismagie: ['wahrnehmung', 'analyse', 'illusion', 'maskierung'],
    verstaendigung: ['geistiger_kontakt', 'zeichensetzung'],
    koerpermagie: ['fortbewegung', 'telekinese', 'potenzierung', 'metamorphose'],
    lebensmagie: ['heilung', 'vitalitaet'],
    elementarmagie: ['elementarbeschwoerung', 'elementare_manipulation'],
    daemonologie: ['daemonenbeschwoerung', 'sphaerenoeffnung'],
    geisterkunde: ['geisterbeschwoerung'],
    objektmagie: ['transmutation', 'artefaktbindung', 'zauberumformung']
  };
  r.load({ save_format: 'character_state_v2', sections: [{
    id: 'Zauber', groups: Object.entries(legacy).map(([id, ids]) => ({
      id, items: ids.map(id => ({ id, value: 3 }))
    }))
  }] });
  for (let pass = 0; pass < 2; pass++) {
    assert.equal(r.run('deprecatedEntries.length'), 0);
    for (const group of groups) {
      for (const item of group.items) {
        assert.equal(r.run(`state.values['Zauber-${group.id}-${item.id}']`), 3);
      }
    }
    const saved = r.json('buildSave()');
    const spells = saved.sections.find(s => s.id === 'Zauber');
    assert.equal(spells.groups.flatMap(g => g.items).reduce((sum, i) => sum + i.value * (i.value + 1) / 2 * 5, 0), 810);
    r.reset();
    r.load(saved);
  }
});
