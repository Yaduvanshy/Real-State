/**
 * SKS TRINITY INFRABUILD
 * Interactive Application & Client Engineering Suite
 * Founder / Director: Shivakant (9519823393)
 * Gomti Nagar, Lucknow, Uttar Pradesh
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initEstimator();
  initProjectFilters();
  initMethodologyStepper();
  initContactForm();
  initProjectModal();
});

/* -------------------------------------------------------------
 * 1. NAVBAR & MOBILE NAVIGATION
 * ------------------------------------------------------------- */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('mainHeader');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Header scroll blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('bg-slate-950/90', 'shadow-2xl', 'backdrop-blur-md', 'border-b', 'border-slate-800');
    } else {
      header?.classList.remove('bg-slate-950/90', 'shadow-2xl', 'backdrop-blur-md', 'border-b', 'border-slate-800');
    }

    // Scroll spy for active nav link
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('text-amber-400', 'font-bold');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-amber-400', 'font-bold');
          }
        });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 2. ANIMATED STATISTICS COUNTER
 * ------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const stepValue = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            count += stepValue;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            counter.textContent = count.toLocaleString('en-IN') + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* -------------------------------------------------------------
 * 3. INTERACTIVE CONSTRUCTION COST CALCULATOR
 * ------------------------------------------------------------- */
const RATE_CONFIG = {
  'residential_villa': { name: 'Independent Luxury Villa', baseRate: 1950, civilPct: 0.45, finishPct: 0.35, mepPct: 0.15, superPct: 0.05 },
  'residential_standard': { name: 'Standard Residential Home', baseRate: 1550, civilPct: 0.48, finishPct: 0.32, mepPct: 0.15, superPct: 0.05 },
  'commercial_complex': { name: 'Commercial Building & Plaza', baseRate: 1850, civilPct: 0.50, finishPct: 0.28, mepPct: 0.16, superPct: 0.06 },
  'rcc_structure': { name: 'RCC & Structural Framework Only', baseRate: 850, civilPct: 0.82, finishPct: 0.05, mepPct: 0.08, superPct: 0.05 },
  'turnkey_premium': { name: 'Complete Turnkey Construction', baseRate: 2350, civilPct: 0.42, finishPct: 0.38, mepPct: 0.15, superPct: 0.05 }
};

const QUALITY_MULTIPLIERS = {
  'standard': { multiplier: 1.0, label: 'Standard IS-Code Compliant' },
  'premium': { multiplier: 1.22, label: 'Premium Architectural Grade' },
  'luxury': { multiplier: 1.45, label: 'Ultra Luxury & Bespoke Specs' }
};

function initEstimator() {
  const areaSlider = document.getElementById('calcAreaSlider');
  const areaInput = document.getElementById('calcAreaInput');
  const projectTypeSelect = document.getElementById('calcProjectType');
  const qualityRadios = document.querySelectorAll('input[name="calcQuality"]');
  const whatsappCalcBtn = document.getElementById('whatsappCalcBtn');

  if (!areaSlider || !areaInput) return;

  function updateSync(source) {
    if (source === 'slider') {
      areaInput.value = areaSlider.value;
    } else {
      areaSlider.value = areaInput.value;
    }
    calculateCost();
  }

  areaSlider.addEventListener('input', () => updateSync('slider'));
  areaInput.addEventListener('input', () => updateSync('input'));
  projectTypeSelect?.addEventListener('change', calculateCost);
  qualityRadios.forEach(radio => radio.addEventListener('change', calculateCost));

  calculateCost();

  if (whatsappCalcBtn) {
    whatsappCalcBtn.addEventListener('click', () => {
      const area = areaInput.value;
      const typeKey = projectTypeSelect.value;
      const typeObj = RATE_CONFIG[typeKey] || RATE_CONFIG['residential_villa'];
      const qualityKey = document.querySelector('input[name="calcQuality"]:checked')?.value || 'standard';
      const qualityObj = QUALITY_MULTIPLIERS[qualityKey];
      
      const totalEstimated = document.getElementById('calcTotalEstimate')?.textContent || '';

      const message = `Hello Shivakant Ji (SKS Trinity Infrabuild),%0A%0AI used your website Construction Cost Calculator:%0A• Project: ${encodeURIComponent(typeObj.name)}%0A• Area: ${area} Sq. Ft.%0A• Finish Quality: ${encodeURIComponent(qualityObj.label)}%0A• Estimated Approx: ${encodeURIComponent(totalEstimated)}%0A%0APlease share detailed BOQ estimation and discuss site visit in Lucknow.`;
      
      window.open(`https://wa.me/919519823393?text=${message}`, '_blank');
    });
  }
}

function calculateCost() {
  const area = parseFloat(document.getElementById('calcAreaInput')?.value || '1500');
  const typeKey = document.getElementById('calcProjectType')?.value || 'residential_villa';
  const typeObj = RATE_CONFIG[typeKey] || RATE_CONFIG['residential_villa'];
  const qualityKey = document.querySelector('input[name="calcQuality"]:checked')?.value || 'standard';
  const qualityObj = QUALITY_MULTIPLIERS[qualityKey] || QUALITY_MULTIPLIERS['standard'];

  const effectiveRate = Math.round(typeObj.baseRate * qualityObj.multiplier);
  const totalCost = Math.round(area * effectiveRate);

  const civilCost = Math.round(totalCost * typeObj.civilPct);
  const finishCost = Math.round(totalCost * typeObj.finishPct);
  const mepCost = Math.round(totalCost * typeObj.mepPct);
  const superCost = Math.round(totalCost * typeObj.superPct);

  // Formatting helpers
  const formatINR = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const elemTotal = document.getElementById('calcTotalEstimate');
  const elemRate = document.getElementById('calcEffectiveRate');
  const elemCivil = document.getElementById('calcCivilCost');
  const elemFinish = document.getElementById('calcFinishCost');
  const elemMep = document.getElementById('calcMepCost');
  const elemSuper = document.getElementById('calcSuperCost');

  if (elemTotal) elemTotal.textContent = formatINR(totalCost);
  if (elemRate) elemRate.textContent = `₹${effectiveRate.toLocaleString('en-IN')} / sq.ft`;
  if (elemCivil) elemCivil.textContent = formatINR(civilCost);
  if (elemFinish) elemFinish.textContent = formatINR(finishCost);
  if (elemMep) elemMep.textContent = formatINR(mepCost);
  if (elemSuper) elemSuper.textContent = formatINR(superCost);
}

/* -------------------------------------------------------------
 * 4. PROJECT PORTFOLIO DATA & FILTERING
 * ------------------------------------------------------------- */
const PROJECTS_DATA = [
  {
    id: 'proj-01',
    title: 'Gomti Greens Luxury Villa',
    category: 'residential',
    categoryLabel: 'Residential Construction',
    location: 'Gomti Nagar Extension, Lucknow',
    area: '4,200 Sq. Ft.',
    status: 'Completed',
    statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    tag: 'Turnkey Villa',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    description: 'Turnkey architectural residence featuring earthquake-resistant RCC frame, Italian marble finishing, smart home MEP integration, and bespoke landscaped exterior elevation.',
    deliverables: ['Foundation & RCC Columns', 'Double-height Living Slabs', 'Weather-resistant Façade', 'Premium Sanitary & Modular Electrics']
  },
  {
    id: 'proj-02',
    title: 'Trinity Heights Commercial Complex',
    category: 'commercial',
    categoryLabel: 'Commercial Construction',
    location: 'Amar Shaheed Path, Lucknow',
    area: '18,500 Sq. Ft.',
    status: 'Ongoing',
    statusClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    tag: 'Commercial Space',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Multi-level corporate retail and office facility constructed to IS-code durability standards with high floor load capacities, basement parking RCC retaining walls, and modern glass façade.',
    deliverables: ['Earth Retaining RCC Wall', 'Post-Tensioned Beams & Slabs', 'Heavy Footfall Structural Core', 'Fire-Fighting & HVAC Shafts']
  },
  {
    id: 'proj-03',
    title: 'Avadh Enclave Duplex Residences',
    category: 'residential',
    categoryLabel: 'Residential Construction',
    location: 'Indira Nagar, Lucknow',
    area: '6,800 Sq. Ft.',
    status: 'Completed',
    statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    tag: 'Independent Duplex',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    description: 'Cluster of two independent premium duplex homes built with quality-conscious masonry, acoustic cavity walls, reinforced roof slabs, and designer interior woodwork.',
    deliverables: ['IS 456 Structural Framing', 'Thermal Roof Insulation Plaster', 'Vitrified Large-Format Tiling', 'Turnkey Handover in 11 Months']
  },
  {
    id: 'proj-04',
    title: 'UP Industrial Logistics & RCC Framework',
    category: 'rcc',
    categoryLabel: 'RCC & Structural Works',
    location: 'Kanpur-Lucknow Corridor, Uttar Pradesh',
    area: '24,000 Sq. Ft.',
    status: 'Completed',
    statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    tag: 'Structural RCC',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavy civil foundation, reinforced concrete piers, industrial-grade floor slabs (M25 mix design) with laser screed leveling and crack-control expansion joints.',
    deliverables: ['Mass Earthwork & Soil Compaction', 'M25/M30 Concrete Mix Verification', 'Heavy Load Slab-on-Grade', 'Substructure Drainage Systems']
  },
  {
    id: 'proj-05',
    title: 'Heritage Villa Renovation & Structural Lift',
    category: 'turnkey',
    categoryLabel: 'Renovation & Turnkey',
    location: 'Hazratganj, Lucknow',
    area: '3,400 Sq. Ft.',
    status: 'Completed',
    statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    tag: 'Turnkey Remodeling',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    description: 'Comprehensive structural retrofitting, jacketing of vintage columns, damp-proof barrier injection, modern MEP overhaul, and luxury contemporary finishes.',
    deliverables: ['Column Jacketing & Micro-concreting', 'Zero-Damp Chemical Barrier', 'Modern Plumbing & Concealed Conduits', 'Premium Textured External Plaster']
  },
  {
    id: 'proj-06',
    title: 'Skyline Business Hub & Retail Floors',
    category: 'commercial',
    categoryLabel: 'Commercial Construction',
    location: 'Vibhuti Khand, Gomti Nagar, Lucknow',
    area: '14,200 Sq. Ft.',
    status: 'Ongoing',
    statusClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    tag: 'Commercial Plazas',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    description: 'Premium business commercial hub with open-span column design, structural glazing façade anchors, high-grade waterproofing, and turnkey MEP commissioning.',
    deliverables: ['Wide Column Grids for Retail', 'Rooftop Waterproofing Membrane', 'High Speed Lift Shaft Civil Works', 'IS 1893 Seismic Compliance']
  }
];

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectGrid = document.getElementById('projectCardsGrid');

  if (!projectGrid) return;

  function renderProjects(filter = 'all') {
    projectGrid.innerHTML = '';
    const filtered = filter === 'all' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl overflow-hidden group border border-slate-800 hover:border-amber-500/50 flex flex-col';
      card.innerHTML = `
        <div class="relative h-60 overflow-hidden">
          <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-slate-900/80 text-amber-300 border border-amber-500/30">
              ${project.tag}
            </span>
          </div>

          <div class="absolute top-4 right-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${project.statusClass}">
              ● ${project.status}
            </span>
          </div>

          <div class="absolute bottom-3 left-4 right-4">
            <p class="text-xs text-amber-400 font-medium tracking-wide flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ${project.location}
            </p>
            <h3 class="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">${project.title}</h3>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col justify-between">
          <p class="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">${project.description}</p>
          
          <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 block uppercase font-medium">Built-Up Area</span>
              <span class="text-sm font-semibold text-white">${project.area}</span>
            </div>
            <button onclick="openProjectModal('${project.id}')" class="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1.5">
              <span>View Specs</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      `;
      projectGrid.appendChild(card);
    });
  }

  // Initial render
  renderProjects('all');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-slate-900', 'text-slate-300', 'hover:bg-slate-800');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-900', 'text-slate-300');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });
}

/* -------------------------------------------------------------
 * 5. PROJECT DETAILS MODAL
 * ------------------------------------------------------------- */
function initProjectModal() {
  const modal = document.getElementById('projectDetailsModal');
  const closeBtn = document.getElementById('closeProjectModalBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
}

window.openProjectModal = function(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('projectDetailsModal');
  if (!modal) return;

  document.getElementById('modalProjectImg').src = project.image;
  document.getElementById('modalProjectTitle').textContent = project.title;
  document.getElementById('modalProjectLocation').textContent = project.location;
  document.getElementById('modalProjectArea').textContent = project.area;
  document.getElementById('modalProjectCategory').textContent = project.categoryLabel;
  document.getElementById('modalProjectStatus').textContent = project.status;
  document.getElementById('modalProjectDesc').textContent = project.description;

  const deliverablesContainer = document.getElementById('modalProjectDeliverables');
  deliverablesContainer.innerHTML = '';
  project.deliverables.forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2 text-sm text-slate-300';
    li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>${item}`;
    deliverablesContainer.appendChild(li);
  });

  const whatsappInquireBtn = document.getElementById('modalProjectWhatsApp');
  if (whatsappInquireBtn) {
    whatsappInquireBtn.onclick = () => {
      const msg = `Hello Shivakant Ji, I am inquiring about your project "${project.title}" located at ${project.location}. I would like to build a similar project with SKS Trinity Infrabuild.`;
      window.open(`https://wa.me/919519823393?text=${encodeURIComponent(msg)}`, '_blank');
    };
  }

  modal.classList.remove('hidden');
};

/* -------------------------------------------------------------
 * 6. 7-STAGE EXECUTION METHODOLOGY STEPPER
 * ------------------------------------------------------------- */
const METHODOLOGY_DATA = [
  {
    step: '01',
    title: 'Requirement & Scope',
    subtitle: 'Client Discovery & Objectives',
    description: 'Understand client needs, site conditions, architectural drawings, project scope, budget limits and expected performance outcomes.',
    checklist: [
      'Site topographic and soil condition analysis',
      'Client architectural and functional brief formulation',
      'Statutory & municipal guideline review in Lucknow/UP',
      'Preliminary timeline and cost parameter benchmarking'
    ]
  },
  {
    step: '02',
    title: 'Planning & Estimation',
    subtitle: 'BOQ, Quantities & Sequences',
    description: 'Prepare detailed Bill of Quantities (BOQ), material grade selection, resource allocation schedule, activity sequence and execution priorities.',
    checklist: [
      'Accurate structural quantity take-off (Steel, Cement, Aggregates)',
      'IS-Code compliance specification drafting',
      'Subcontractor and specialist vendor scheduling',
      'Milestone-based financial cashflow & procurement planning'
    ]
  },
  {
    step: '03',
    title: 'Site Preparation',
    subtitle: 'Mobilization & Infrastructure',
    description: 'Mobilize manpower, materials, heavy machinery, power/water systems and safety protocols before starting ground activities.',
    checklist: [
      'Site clearing, leveling, boundary demarcation & benchmark set',
      'Erection of labor safety barricades and PPE stations',
      'Material storage yards & cement godown waterproofing',
      'Temporary water and electric power infrastructure setup'
    ]
  },
  {
    step: '04',
    title: 'Structural Execution',
    subtitle: 'Foundation & RCC Superstructure',
    description: 'Execute foundation, earthwork, columns, beams, slabs and related reinforced concrete works with systematic engineer supervision.',
    checklist: [
      'Precision excavation & anti-termite foundation treatment',
      'Reinforcement rebar checking (IS 1786) and shuttering alignment',
      'Controlled concrete pouring (IS 456) with cube slump tests',
      'Strict 21-day ponding & curing supervision cycles'
    ]
  },
  {
    step: '05',
    title: 'Masonry & Services',
    subtitle: 'Walls & MEP Coordination',
    description: 'Coordinate fly-ash/clay brick masonry, electrical conduits, plumbing shafts, HVAC sleeves, and other integrated building services.',
    checklist: [
      'Precision brick/block masonry with lintel band anchoring',
      'Concealed PVC conduit laying & electrical junction boxes',
      'Plumbing pressure line testing (PEX / CPVC pipelines)',
      'Waterproofing coats in sunken slabs and wet areas'
    ]
  },
  {
    step: '06',
    title: 'Finishing & Quality Review',
    subtitle: 'Plastering, Flooring & Elevation',
    description: 'Complete high-grade internal/external plastering, tiles/marble flooring, painting, exterior façade and rigorous quality check.',
    checklist: [
      'Cement sand plastering with straight-edge plumb accuracy',
      'Flooring installation, epoxy grouting and marble polishing',
      'Primer, putty coats and weather-shield acrylic exterior paint',
      'Snagging list creation and comprehensive defect rectifications'
    ]
  },
  {
    step: '07',
    title: 'Handover & Certification',
    subtitle: 'Final Handover & Peace of Mind',
    description: 'Close outstanding items, complete final site cleaning, deliver as-built drawings, hand over keys and support client moving in.',
    checklist: [
      'Comprehensive joint inspection walk-through with client',
      'Operational testing of all electrical, plumbing, sanitary fixtures',
      'Handover of warranties, test reports and maintenance guidance',
      'Formal possession sign-off and warranty commencement'
    ]
  }
];

function initMethodologyStepper() {
  const buttons = document.querySelectorAll('.method-step-btn');
  const displayTitle = document.getElementById('methodDisplayTitle');
  const displaySubtitle = document.getElementById('methodDisplaySubtitle');
  const displayDesc = document.getElementById('methodDisplayDesc');
  const displayList = document.getElementById('methodDisplayList');
  const displayStepNum = document.getElementById('methodDisplayStepNum');

  if (!buttons.length || !displayTitle) return;

  function loadStep(index) {
    const data = METHODOLOGY_DATA[index];
    if (!data) return;

    buttons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('border-amber-400', 'bg-amber-500/10', 'text-amber-300');
        btn.classList.remove('border-slate-800', 'bg-slate-900/60', 'text-slate-400');
      } else {
        btn.classList.remove('border-amber-400', 'bg-amber-500/10', 'text-amber-300');
        btn.classList.add('border-slate-800', 'bg-slate-900/60', 'text-slate-400');
      }
    });

    if (displayStepNum) displayStepNum.textContent = data.step;
    displayTitle.textContent = data.title;
    displaySubtitle.textContent = data.subtitle;
    displayDesc.textContent = data.description;

    displayList.innerHTML = '';
    data.checklist.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-3 text-slate-300 text-sm leading-relaxed';
      li.innerHTML = `
        <span class="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">✓</span>
        <span>${item}</span>
      `;
      displayList.appendChild(li);
    });
  }

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => loadStep(idx));
  });

  // Default first step
  loadStep(0);
}

/* -------------------------------------------------------------
 * 7. CONTACT & INQUIRY FORM
 * ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  const formStatus = document.getElementById('formSuccessMsg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const service = document.getElementById('contactService')?.value;
    const location = document.getElementById('contactLocation')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !phone) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    // Save lead in localStorage for persistence
    const leads = JSON.parse(localStorage.getItem('sks_infrabuild_inquiries') || '[]');
    leads.push({ name, phone, email, service, location, message, date: new Date().toISOString() });
    localStorage.setItem('sks_infrabuild_inquiries', JSON.stringify(leads));

    // Open WhatsApp directly with inquiry details to Shivakant
    const waText = `*New Construction Inquiry - SKS Trinity Infrabuild*%0A%0A• *Client Name:* ${encodeURIComponent(name)}%0A• *Phone:* ${encodeURIComponent(phone)}%0A• *Email:* ${encodeURIComponent(email || 'Not provided')}%0A• *Service Required:* ${encodeURIComponent(service)}%0A• *Site Location:* ${encodeURIComponent(location || 'Lucknow')}%0A• *Details:* ${encodeURIComponent(message || 'Requesting callback')}`;

    if (formStatus) {
      formStatus.classList.remove('hidden');
      form.reset();
      setTimeout(() => {
        formStatus.classList.add('hidden');
      }, 7000);
    }

    // Launch WhatsApp
    window.open(`https://wa.me/919519823393?text=${waText}`, '_blank');
  });
}
