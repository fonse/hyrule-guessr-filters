const configs = [
  {
    id: "filter-blur",
    label: "Blur",
  },
  {
    id: "filter-invert",
    label: "Invert colors",
  },
  {
    id: "filter-greyscale",
    label: "Greyscale",
  },
  {
    id: "filter-upsidedown",
    label: "Upside Down",
  },
]

const styleElement = document.createElement('style');
document.body.append(styleElement);

const handleConfigChange = () => {
  const blur = document.getElementById('filter-blur').checked;
  const invert = document.getElementById('filter-invert').checked;
  const greyscale = document.getElementById('filter-greyscale').checked;
  const upsidedown = document.getElementById('filter-upsidedown').checked;

  const filters = [];
  const transform = [];

  if (blur) {
    filters.push('blur(8px)');
  }
  if (invert) {
    filters.push('invert(100%)');
  }
  if (greyscale) {
    filters.push('grayscale(100%)');
  }
  if (upsidedown) {
    transform.push('rotate(180deg)');
  }

  if (styleElement.sheet.cssRules.length > 0) {
    styleElement.sheet.deleteRule(0);
  }
  styleElement.sheet.insertRule('.viewer-canvas img { filter: ' + filters.join(' ') + '; transform: ' + transform.join(' ') + ' !important; }');
}

const ctaElement = document.querySelector('.start-game-btn-container');
const configContainer = document.createElement('div');
configContainer.style.marginTop = '2px';

configs.forEach(config => { 
  const div = document.createElement('div');
  div.classList.add('form-check', 'form-check-inline');
  
  const checkbox = document.createElement('input');
  checkbox.id = config.id;
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input');
  checkbox.onchange = handleConfigChange;
  
  const label = document.createElement('label');
  label.htmlFor = config.id;
  label.classList.add('form-check-label');
  label.textContent = config.label;

  div.append(checkbox, label);
  configContainer.append(div);
});

ctaElement.before(configContainer);
