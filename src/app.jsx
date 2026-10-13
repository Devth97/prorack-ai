import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useEmblaCarousel from 'embla-carousel-react';
import { BolnaWebCall } from '@bolna/web-call';
gsap.registerPlugin(ScrollTrigger);
import { 
  Search, Menu, X, Activity, Cpu, Layers, ChevronRight, ArrowUp,
  Terminal, Check, AlertCircle, Clock, ArrowRight, ShieldCheck,
  Server, BarChart3, Database, Workflow, Settings, FileText,
  Copy, CheckCheck, RefreshCw, Zap, Sliders, Lock,
  Mic, MicOff, PhoneOff, Headset, ChevronUp, ChevronDown, AudioLines
} from 'lucide-react';

// ==========================================
// 0. VOICE AI ASSISTANT (Bolna web call)
// ==========================================
const VOICE_ERRORS = {
  microphone_denied: 'Microphone access was blocked. Allow the microphone for this site in your browser settings, then try again.',
  at_capacity: 'All our AI lines are busy right now. Please try again in a moment.',
  autoplay_blocked: 'Your browser blocked audio playback. Please click "Start conversation" again.',
  connect_failed: 'We could not connect the call. Check your connection and try again.',
};
const VOICE_STATUS = { connecting: 'Connecting…', ringing: 'Connecting to the assistant…', active: 'Live — go ahead and speak', ended: 'Call ended' };

function VoiceMascot({ state, muted }) {
  return <span className="voice-mascot" aria-hidden="true" data-state={state} data-muted={muted}>
    <svg className="rackbot-image" viewBox="0 0 1024 1536" focusable="false">
      <defs>
        <clipPath id="rackbot-wave-hand"><path d="M0 305H230L295 425 315 555 260 625 125 610 0 535Z"/></clipPath>
        <mask id="rackbot-wave-body"><rect width="1024" height="1536" fill="white"/><path d="M0 305H230L295 425 315 555 260 625 125 610 0 535Z" fill="black"/></mask>
        <clipPath id="rackbot-typing-hand"><path d="M383 733 471 681 574 669 649 745 584 837 455 863 390 814Z"/></clipPath>
        <mask id="rackbot-typing-body"><rect width="1024" height="1536" fill="white"/><path d="M383 733 471 681 574 669 649 745 584 837 455 863 390 814Z" fill="black"/></mask>
      </defs>
      <g className="rackbot-pose rackbot-greeting">
        <image href="assets/mascot/rackbot-greeting.png" width="1024" height="1536" mask="url(#rackbot-wave-body)"/>
        <g className="rackbot-waving-hand"><image href="assets/mascot/rackbot-greeting.png" width="1024" height="1536" clipPath="url(#rackbot-wave-hand)"/></g>
      </g>
      <g className="rackbot-pose rackbot-tablet">
        <image href="assets/mascot/rackbot-tablet.png" width="1024" height="1536" mask="url(#rackbot-typing-body)"/>
        <g className="rackbot-typing-hand"><image href="assets/mascot/rackbot-tablet.png" width="1024" height="1536" clipPath="url(#rackbot-typing-hand)"/></g>
      </g>
    </svg>
    <span className="mascot-wave"><i/><i/><i/><i/></span>
  </span>;
}

function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [state, setState] = useState('idle');
  const [muted, setMuted] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState('');
  const callRef = useRef(null);
  const launcherRef = useRef(null);
  const closeRef = useRef(null);
  const live = state === 'connecting' || state === 'ringing' || state === 'active';

  useEffect(() => () => { callRef.current?.stop(); }, []);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); launcherRef.current?.focus(); } };
    const onClick = e => { if (!e.target.closest('.voice-assistant')) setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onClick); };
  }, [open]);

  // start() must run directly inside the click handler so the browser allows audio.
  const startCall = () => {
    if (live) return;
    setError('');
    setMuted(false);
    const call = new BolnaWebCall({ sessionUrl: '/api/bolna-session', userData: { page: document.title } });
    call.on('state-change', setState);
    call.on('volume-level', setLevel);
    call.on('call-end', () => setLevel(0));
    call.on('error', e => setError(VOICE_ERRORS[e.code] || 'Something went wrong starting the call. Please try again, or call us on +91 79658 51000.'));
    callRef.current = call;
    call.start().catch(() => {});
  };
  const endCall = () => { callRef.current?.stop(); };
  const toggleMute = () => { const next = !muted; callRef.current?.setMuted(next); setMuted(next); };

  const closePanel = () => { setOpen(false); launcherRef.current?.focus(); };
  return createPortal(<div className={'voice-assistant' + (compact && !open ? ' is-compact' : '')} style={{ '--level': level }}>
    <button ref={launcherRef} className="mascot-launcher" aria-label={live ? 'Open active AI voice call' : 'Talk to ProRack AI assistant'} aria-expanded={open} aria-controls={open ? 'voice-panel' : undefined} onClick={() => setOpen(o => !o)}>
      <VoiceMascot state={error ? 'error' : state} muted={muted}/>
      <span className="mascot-caption">{live ? (muted ? 'Microphone muted' : 'On call with RackBot') : 'Ask RackBot'}</span>
    </button>
    <div className="mascot-dock">
      <a href="contact.html" aria-label="Send an enquiry" title="Send an enquiry"><FileText size={19}/></a>
      <button className={live ? 'is-live' : ''} aria-label={live ? 'Open voice call controls' : 'Open AI voice conversation'} title="Voice conversation" onClick={() => setOpen(true)}><AudioLines size={23}/></button>
      <button aria-label={compact ? 'Expand mascot' : 'Minimize mascot'} title={compact ? 'Expand mascot' : 'Minimize mascot'} aria-pressed={compact} onClick={() => { setCompact(c => !c); if (open) closePanel(); }}>{compact ? <ChevronUp size={21}/> : <ChevronDown size={21}/>}</button>
    </div>
    {open && <div className="voice-panel" id="voice-panel" role="dialog" aria-label="ProRack AI voice assistant">
      <div className="voice-panel-head">
        <div><strong>RackBot · ProRack AI</strong><small>Ask about racking, mezzanines, quotes or project timelines.</small></div>
        <button ref={closeRef} aria-label="Close assistant" onClick={closePanel}><X size={18}/></button>
      </div>
      <div className="voice-orb" data-state={state} style={{ '--level': level }} aria-hidden="true"><Mic size={26}/></div>
      <p className="voice-status" role="status">{error || VOICE_STATUS[state] || 'Talk to our AI assistant right here in your browser. You will need a microphone.'}</p>
      {live
        ? <div className="voice-controls">
            <button className="voice-mute" onClick={toggleMute} disabled={state !== 'active'} aria-pressed={muted}>{muted ? <MicOff size={18}/> : <Mic size={18}/>}{muted ? 'Unmute' : 'Mute'}</button>
            <button className="voice-end" onClick={endCall}><PhoneOff size={18}/>End call</button>
          </div>
        : <button className="voice-start" onClick={startCall}><Mic size={18}/>{state === 'ended' ? 'Start a new conversation' : 'Start conversation'}</button>}
      <p className="voice-fallback">Prefer a person? <a href="tel:+917965851000">+91 79658 51000</a> · <a href="contact.html">Send an enquiry</a></p>
    </div>}
  </div>, document.body);
}

// ==========================================
// 1. GLOBAL COMMAND PALETTE & RESPONSIVE NAV
// ==========================================
function GlobalHeader({ activePage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchDialog = useRef(null);
  const menuDialog = useRef(null);
  const navLinks = [
    ['Home','index'],['Solutions','solutions'],['Engineering','engineering'],['Execution','execution'],
    ['Digital intelligence','platform'],['Company','company']
  ];
  const digitalLinks = [['Platform','platform'],['Operations','operations'],['Machines','machines'],['AI copilot','copilot'],['Architecture','architecture'],['Roadmap','roadmap']];
  const digital = digitalLinks.some(([,id])=>id===activePage);
  const searchItems = [
    { title: 'Warehouse Storage Catalog (8 Systems)', category: 'Solutions', href: 'solutions.html' },
    { title: 'Selective Pallet Racking Specs', category: 'Solutions', href: 'solutions.html#selective' },
    { title: 'Drive-In & High-Density Racking', category: 'Solutions', href: 'solutions.html#drive-in' },
    { title: 'Heavy-Duty Cantilever Racking', category: 'Solutions', href: 'solutions.html#cantilever' },
    { title: 'Multi-Tier Shelving & Mezzanines', category: 'Solutions', href: 'solutions.html#mezzanine' },
    { title: '5-Stage Engineering Lifecycle', category: 'Engineering', href: 'engineering.html' },
    { title: 'Tekla BIM 3D & RSTAB Structural Analysis', category: 'Engineering', href: 'engineering.html#stages' },
    { title: 'Change Order Management & Cost Control', category: 'Engineering', href: 'engineering.html#change-orders' },
    { title: 'Planned IIT-Powai Structural Design Validation', category: 'Engineering', href: 'engineering.html#iit-powai' },
    { title: '3 Specialist Execution Verticals', category: 'Execution', href: 'execution.html' },
    { title: 'SmartFit Turnkey Installation', category: 'Execution', href: 'execution.html#smartfit' },
    { title: 'ProMec MEP, HVAC & Fire Safety', category: 'Execution', href: 'execution.html#promech' },
    { title: 'Silver Lining Storage Solutions Heritage', category: 'Company', href: 'company.html#heritage' },
    { title: 'MD Roshan Sudhir (20+ Years Leadership)', category: 'Company', href: 'company.html#leadership' },
    { title: 'Request Engineering RFQ / Contact', category: 'Contact', href: 'contact.html' },
    { title: 'Project Health Dashboard', category: 'Operations', href: 'operations.html' },
    { title: 'Tekla 3D Model Coherence', category: 'Platform', href: 'platform.html' },
    { title: 'ERPNext Commercial Integration', category: 'Platform', href: 'platform.html' },
    { title: 'PowerFab Nesting & Cut Lists', category: 'Platform', href: 'platform.html' },
    { title: 'Cold Roll-Forming Telemetry (Modbus TCP)', category: 'Machines', href: 'machines.html' },
    { title: 'Bearing Acoustic Vibration Sensors', category: 'Machines', href: 'machines.html' },
    { title: 'AI Assistant & Executive Queries', category: 'AI Copilot', href: 'copilot.html' },
    { title: 'Shift Project Delivery Brief', category: 'AI Copilot', href: 'copilot.html#brief' },
    { title: 'Source-Level RBAC & Audit Trails', category: 'Architecture', href: 'architecture.html' },
    { title: 'Air-Gapped OT Network Security', category: 'Architecture', href: 'architecture.html' },
    { title: 'AI Dynamic Scheduling Roadmap', category: 'Roadmap', href: 'roadmap.html' },
    { title: 'Computer Vision QC Inspection', category: 'Roadmap', href: 'roadmap.html' },
  ];


  const filteredItems = searchItems.filter(item => (item.title+' '+item.category).toLowerCase().includes(searchTerm.toLowerCase()));
  useEffect(() => {
    const shortcut = e => {
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k') {
        e.preventDefault();
        menuDialog.current?.close();
        if(searchDialog.current.open) searchDialog.current.close(); else searchDialog.current.showModal();
      }
    };
    window.addEventListener('keydown',shortcut);
    return ()=>window.removeEventListener('keydown',shortcut);
  },[]);
  const brand = <><img src="assets/Prorack%20AI%20logo%20WITHOUT%20TAGLINE.jpg" alt="ProRack" width="54" height="54"/><span className="nav-brand-text"><span className="brand-title">PRORACK</span><span className="brand-sub">STORAGE SOLUTIONS</span></span></>;
  const closeBackdrop = e => {if(e.target===e.currentTarget) e.currentTarget.close();};
  return <>
    <div className="shell nav-inner">
      <a href="index.html" className="nav-brand" aria-label="ProRack Storage Solutions home">{brand}</a>
      <nav className="nav-links" aria-label="Main navigation">
        {navLinks.map(([name,id])=><a key={id} href={id+'.html'} aria-current={(activePage===id || id==='platform' && digital)?'page':undefined}>{name}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="search-toggle" aria-label="Search the website" onClick={()=>searchDialog.current.showModal()}><Search size={19}/></button>
        <VoiceAssistant/>
        <a href="contact.html" className="nav-cta">Get in touch <ArrowRight size={16}/></a>
        <button className="menu-toggle" aria-label="Open navigation menu" onClick={()=>menuDialog.current.showModal()}><Menu size={22}/></button>
      </div>
    </div>
    {digital && <nav className="digital-subnav shell" aria-label="Digital intelligence navigation">{digitalLinks.map(([name,id])=><a key={id} href={id+'.html'} aria-current={id===activePage?'page':undefined}>{name}</a>)}</nav>}
    <dialog className="site-dialog menu-dialog" ref={menuDialog} onClick={closeBackdrop} aria-label="Navigation menu">
      <div className="dialog-heading"><span>Explore ProRack</span><button aria-label="Close navigation menu" onClick={()=>menuDialog.current.close()}><X size={24}/></button></div>
      <nav aria-label="Mobile navigation">{[...navLinks,['Contact','contact']].map(([name,id],i)=><a key={id} href={id+'.html'} aria-current={activePage===id?'page':undefined}><small>0{i+1}</small>{name}<ArrowRight size={20}/></a>)}</nav>
      <div className="menu-digital">{digitalLinks.map(([name,id])=><a key={id} href={id+'.html'}>{name}</a>)}</div>
      <a className="menu-email" href="mailto:sales@prorack.ai">sales@prorack.ai</a>
    </dialog>
    <dialog className="site-dialog search-dialog" ref={searchDialog} onClick={closeBackdrop} aria-labelledby="search-title">
      <div className="dialog-heading"><span id="search-title">Find your solution</span><button aria-label="Close search" onClick={()=>searchDialog.current.close()}><X size={22}/></button></div>
      <input autoFocus aria-label="Search systems and capabilities" placeholder="Try pallet racking, engineering or telemetry" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();searchDialog.current.querySelector('.search-result')?.focus();}if(e.key==='Enter' && filteredItems.length) window.location.href=filteredItems[0].href;}}/>
      <div className="search-results">{filteredItems.map((item,i)=><a className="search-result" key={item.href+i} href={item.href} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();e.currentTarget.nextElementSibling?.focus();}if(e.key==='ArrowUp'){e.preventDefault();(e.currentTarget.previousElementSibling||searchDialog.current.querySelector('input')).focus();}}}><span>{item.title}<small>{item.category}</small></span><ArrowRight size={18}/></a>)}{!filteredItems.length && <p>No results. Try another system or capability.</p>}</div>
      <p className="search-hint">â†‘ â†“ to navigate Â· Enter to open Â· Esc to close</p>
    </dialog>
  </>;
}

// ==========================================
// 2. INTERACTIVE 10-STAGE LIFECYCLE EXPLORER
// ==========================================
const stagesData = [
  {
    num: "01",
    name: "CRM / ERPNext",
    title: "Commercial & Procurement Release",
    sub: "Customer contractual milestones, coil purchase orders, and payment releases.",
    source: "ERPNext Financials & Purchasing",
    output: "Approved raw steel coil POs, delivery schedule commitments",
    check: "Coil heat cert confirmation & customer advance milestone cleared"
  },
  {
    num: "02",
    name: "Engineering / Tekla",
    title: "3D BIM Structural Definition",
    sub: "Complete 3D structural model with part marks, profile geometries, and connection details.",
    source: "Tekla Structures 3D Models",
    output: "Approved IFC geometry, shop drawing sheets (Rev C), connection design",
    check: "Structural EOR engineering stamp & seismic calculation sign-off"
  },
  {
    num: "03",
    name: "PowerFab Routing",
    title: "Fabrication Nesting & Shop Routing",
    sub: "Linear nesting optimization, piece routing, and cut list generation.",
    source: "Tekla PowerFab Production API",
    output: "Optimized cutting nests, work order batches, drop management",
    check: "Yield efficiency > 90% and drawing revision alignment"
  },
  {
    num: "04",
    name: "Manufacturing Floor",
    title: "Factory Shop Floor Execution",
    sub: "Work order queues, shift handovers, and WIP buffer management.",
    source: "Manufacturing Execution System (MES)",
    output: "Punching, forming, welding, and powder coating progress",
    check: "Daily tonnage target vs. scale weighed output coherence"
  },
  {
    num: "05",
    name: "Machine PLCs",
    title: "Real-Time Cold Roll-Forming Telemetry",
    sub: "Direct PLC integration tracking stroke cycles, line speeds, and tolerances.",
    source: "Modbus TCP / OPC-UA Edge Relays",
    output: "Cycle count verification, motor load, bearing vibration index",
    check: "Profile dimensional tolerance within Â±0.03mm"
  },
  {
    num: "06",
    name: "Quality Control",
    title: "Metrology & Mill Cert Verification",
    sub: "Digital caliper inspection, weld ultrasonic testing, and heat provenance.",
    source: "QC Inspection Logs & Calipers",
    output: "Certified heat cert links (IS 2062), weld inspection reports",
    check: "100% pass on flange thickness and hole pitch tolerance"
  },
  {
    num: "07",
    name: "Warehouse Staging",
    title: "Pallet Staging & Yard Allocation",
    sub: "Bundled upright posts and boxed beams staged by erection sequence.",
    source: "WMS Staging Bay Database",
    output: "Staging bay coordinates, bundle piece counts, strapping inspection",
    check: "All required hardware, base plates, and bolts accounted for"
  },
  {
    num: "08",
    name: "Dispatch Logistics",
    title: "Flatbed Load Sequencing & Manifest",
    sub: "Sequenced flatbed truck loading adhering to site receiving gates.",
    source: "Logistics Manifest & Dispatch Gates",
    output: "Gate 3 clearance, verified weighbridge slips, GPS truck dispatch",
    check: "Quality engineering release & site receiving approval"
  },
  {
    num: "09",
    name: "Site Installation",
    title: "Field Erection & GoSmartFit Sync",
    sub: "Anchor hole verification, upright plumb tolerance, and bay handover.",
    source: "GoSmartFit Installation Platform",
    output: "Verified anchor hole grid B1-F12, torque audit logs, site photos",
    check: "Floor slab strength > 35 MPa & plumb alignment verified"
  },
  {
    num: "10",
    name: "Management Intel",
    title: "Operational Leadership Intelligence",
    sub: "Real-time project health, critical blockers, and margin variance.",
    source: "ProRack AI Unified Knowledge Graph",
    output: "Automated Shift Delivery Brief, risk prediction, executive digest",
    check: "Zero unverified metrics; 100% deterministic source citations"
  }
];


const deliveryStages = [
  {
    "title": "Discover & Profile",
    "description": "Inventory data audit: SKU velocity, pallet footprint, unit loads, forklift operating envelope, throughput requirements, and 5-year growth trajectory.",
    "image": "copilot-layout-review",
    "alt": "Warehouse layout and requirement drawings"
  },
  {
    "title": "BIM & Structural Design",
    "description": "3D Tekla Structures modeling and RSTAB finite element analysis. Structural load verification planned in collaboration with IIT-Powai for design certification.",
    "image": "engineering-structural-study",
    "alt": "Structural connection and engineering drawings"
  },
  {
    "title": "Precision Manufacture",
    "description": "Automated cold roll-forming with traceable prime HR steel coils. Quality gates verify tensile strength, punch tolerances, weld penetration, and powder coat thickness.",
    "image": "precision-manufacturing-concept",
    "alt": "Illustrative cold roll-forming line with steel coil, forming rollers and finished perforated rack uprights"
  },
  {
    "title": "Certified Installation",
    "description": "Executed by certified SmartFit crews. Strict laser plumb checks, anchor pull tests, baseplate grouting, and adherence to codes & tolerances for handover.",
    "image": "indian-rack-installation-concept",
    "alt": "Indian technicians installing warehouse racking"
  },
  {
    "title": "Govern & Change Orders",
    "description": "Structured engineering change order governance, lifecycle inspection protocols, and ProRack AI digital telemetry to protect long-term warehouse safety.",
    "image": "architecture-network-detail",
    "alt": "Network equipment illustrating project governance"
  }
];
function DeliveryStages() {
  const [active,setActive]=useState(0);
  const stage=deliveryStages[active];
  const StageIcon=[Search,Layers,Settings,Workflow,ShieldCheck][active];
  return <div className="delivery-explorer">
    <div className="delivery-stage-nav" role="group" aria-label="Delivery stages">{deliveryStages.map((item,i)=><button key={item.title} aria-pressed={active===i} aria-controls="delivery-stage-detail" onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}</div>
    <div className="delivery-stage-detail" id="delivery-stage-detail">
      <figure><img key={stage.image} src={'assets/editorial-photography/'+stage.image+'.webp'} alt={stage.alt} width="1600" height="900" loading="lazy"/><figcaption>Illustrative imagery / Not a ProRack project photograph</figcaption></figure>
      <div className="delivery-stage-copy"><div className="delivery-stage-content" key={active}><StageIcon size={42} strokeWidth={1.2} aria-hidden="true"/><p className="eyebrow">Stage {String(active+1).padStart(2,'0')} / 05</p><h3>{stage.title}</h3><p>{stage.description}</p></div><span className="sr-only" aria-live="polite" aria-atomic="true">Stage {active+1} of 5: {stage.title}</span><div className="delivery-stage-controls"><button disabled={active===0} onClick={()=>setActive(active-1)}>Previous</button><button disabled={active===4} onClick={()=>setActive(active+1)}>Next stage <ArrowRight size={18}/></button></div></div>
    </div><div className="delivery-stage-progress" aria-hidden="true"><span style={{width:((active+1)/5*100)+'%'}}/></div>
  </div>;
}

function LifecycleExplorer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = stagesData[activeIdx];

  return (
    <div className="card" style={{ padding: '28px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="mono-tag">LIFECYCLE INTELLIGENCE NAVIGATOR</span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', marginTop: '2px' }}>
            Stage {current.num} // {current.name}
          </h3>
        </div>
        <span className="badge badge-teal">INTELLIGENCE LAYER CONNECTED</span>
      </div>

      {/* Stage Select Buttons */}
      <div className="lifecycle-button-grid">
        {stagesData.map((stage, idx) => (
          <button
            key={idx}
            className={`lifecycle-nav-pill ${activeIdx === idx ? 'active' : ''}`}
            onClick={() => setActiveIdx(idx)}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.85 }}>{stage.num}</span>
            <span>{stage.name}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Detail Card */}
      <div className="lifecycle-active-detail">
        <div className="lifecycle-grid">
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>
              {current.title}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: 1.65, marginBottom: '16px' }}>
              {current.sub}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span className="badge badge-secondary">Source: {current.source}</span>
              <span className="badge badge-teal">Verified Gate Check</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '18px', borderRadius: 'var(--radius)', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Deliverable Output</strong>
              <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{current.output}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--data-teal)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Gate Clearance Requirement</strong>
              <span style={{ color: 'var(--muted-foreground)' }}>{current.check}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. LIVE MACHINE TELEMETRY WAVEFORM WIDGET
// ==========================================
const machinesFeed = [
  { id: 'mill-1', name: 'Roll Mill #01 (C220 Columns)', baseSpeed: 42.2, baseStrokes: 14820, baseVib: 0.14, profile: 'C220 Upright Profile' },
  { id: 'mill-2', name: 'Roll Mill #02 (B140 Beams)', baseSpeed: 38.6, baseStrokes: 9450, baseVib: 0.16, profile: 'B140 Step Beam Profile' },
  { id: 'cnc-3', name: 'CNC Slot Puncher #03', baseSpeed: 54.0, baseStrokes: 31200, baseVib: 0.11, profile: 'Teardrop Pitch 50mm' }
];

function TelemetryLiveChart() {
  const [selectedMachine, setSelectedMachine] = useState(machinesFeed[0]);
  const [speed, setSpeed] = useState(42.2);
  const [strokes, setStrokes] = useState(14821);
  const [vibration, setVibration] = useState(0.14);
  const [running, setRunning] = useState(true);
  const [history, setHistory] = useState([41.8, 42.0, 42.2, 42.1, 42.4, 42.2, 42.3, 42.1, 42.5, 42.2]);

  const handleSelectMachine = (m) => {
    setSelectedMachine(m);
    setSpeed(m.baseSpeed);
    setStrokes(m.baseStrokes);
    setVibration(m.baseVib);
    setHistory([m.baseSpeed - 0.4, m.baseSpeed - 0.2, m.baseSpeed, m.baseSpeed + 0.2, m.baseSpeed]);
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSpeed(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        const newSpeed = +(prev + delta).toFixed(1);
        setHistory(h => [...h.slice(1), newSpeed]);
        return newSpeed;
      });
      setStrokes(prev => prev + 1);
      setVibration(prev => +(selectedMachine.baseVib + (Math.random() - 0.5) * 0.02).toFixed(2));
    }, 1500);
    return () => clearInterval(interval);
  }, [running, selectedMachine]);

  // Compute SVG Points for Waveform
  const min = selectedMachine.baseSpeed - 3, max = selectedMachine.baseSpeed + 3;
  const width = 300, height = 50;
  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const y = Math.max(0, Math.min(height, height - ((val - min) / (max - min)) * height));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="card" style={{ padding: '24px' }}>
      {/* Machine Feed Selectors */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {machinesFeed.map(m => (
          <button
            key={m.id}
            aria-pressed={selectedMachine.id === m.id}
            onClick={() => handleSelectMachine(m)}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              borderRadius: 'var(--radius-sm)',
              border: selectedMachine.id === m.id ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: selectedMachine.id === m.id ? 'var(--primary-subtle)' : '#ffffff',
              color: selectedMachine.id === m.id ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: selectedMachine.id === m.id ? 700 : 500,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--foreground)' }}>{selectedMachine.profile}</span>
          <span className="badge badge-teal" style={{ fontSize: '9px' }}>MODBUS TCP STREAM</span>
        </div>

        <button 
          onClick={() => setRunning(!running)}
          className="btn btn-outline"
          style={{ height: '30px', padding: '0 12px', fontSize: '11px' }}
        >
          {running ? 'Pause Feed' : 'Resume Feed'}
        </button>
      </div>

      <div className="responsive-stat-grid-3">
        <div style={{ background: 'var(--secondary)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <small style={{ color: '#526052', fontSize: '9px', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Continuous Speed</small>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{speed} m/min</span>
        </div>

        <div style={{ background: 'var(--secondary)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <small style={{ color: '#526052', fontSize: '9px', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Stroke Count</small>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)' }}>{strokes.toLocaleString()}</span>
        </div>

        <div style={{ background: 'var(--secondary)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <small style={{ color: '#526052', fontSize: '9px', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Bearing RMS</small>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--data-teal)' }}>{vibration} mm/s</span>
        </div>
      </div>

      {/* SVG Waveform in dark hardware chassis monitor */}
      <div style={{ background: '#090e17', padding: '14px 18px', borderRadius: 'var(--radius)', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
          <span>LIVE LINE SPEED WAVEFORM</span>
          <span style={{ color: '#00e5c9' }}>CURRENT: {speed} M/MIN</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '54px', overflow: 'visible' }}>
          <polyline
            fill="none"
            stroke="#00e5c9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 4. REACT PLATFORM DATA FLOW SIMULATOR
// ==========================================
const platformSystems = [
  {
    id: 'tekla',
    name: 'Tekla Structures (3D BIM)',
    protocol: 'gRPC / IFC Stream',
    latency: '14ms',
    entity: 'PartMark: C220-4.0-REV_C',
    payload: `{\n  "source": "Tekla_Structures_2024",\n  "project_id": "2026-HYD-04",\n  "model_guid": "7a8b9c-tekla-ifc4",\n  "drawing_sheet": "DWG-C220-REV_C",\n  "parts_count": 840,\n  "geometry_hash": "sha256:4f8e21a0c9b7...",\n  "status": "APPROVED_FOR_SHOP_CUTTING"\n}`,
    boundary: 'Read-only model extraction; zero CAD schema mutation.'
  },
  {
    id: 'erpnext',
    name: 'ERPNext Commercial',
    protocol: 'REST Webhook / OAuth2',
    latency: '18ms',
    entity: 'SalesOrder: #SO-2026-089',
    payload: `{\n  "source": "ERPNext_v15_Enterprise",\n  "sales_order": "SO-2026-089",\n  "customer": "Demonstration Customer",\n  "total_tonnage_mt": 1135,\n  "advance_cleared": true,\n  "coil_po_linked": "PO-9021-TATA-HR",\n  "status": "COMMERCIAL_RELEASED"\n}`,
    boundary: 'Non-invasive polling; writes restricted to order milestone tags.'
  },
  {
    id: 'powerfab',
    name: 'Tekla PowerFab (Nesting)',
    protocol: 'REST XML/JSON API',
    latency: '22ms',
    entity: 'NestJob: #PF-8840-C220',
    payload: `{\n  "source": "Tekla_PowerFab",\n  "nest_id": "PF-8840-C220",\n  "linear_yield_pct": 94.8,\n  "cut_list_length_mm": 12000,\n  "drop_recovery_pct": 3.8,\n  "assigned_mill": "ROLL_FORM_MILL_01",\n  "status": "ROUTING_LOCKED"\n}`,
    boundary: 'Bidirectional sync of cut completions without altering shop master.'
  },
  {
    id: 'plc',
    name: 'Modbus / OPC-UA (Cold Mills)',
    protocol: 'Modbus TCP / OPC-UA Edge',
    latency: '6ms',
    entity: 'Register: 40012-40018',
    payload: `{\n  "source": "Siemens_S7_1500_PLC",\n  "line_id": "ROLL_FORM_MILL_01",\n  "feed_rate_mpm": 42.2,\n  "flange_stand_temp_c": 44.1,\n  "hydraulic_shear_strokes": 14821,\n  "tolerance_drift_mm": 0.012,\n  "safety_interlock": "ARMED_OK"\n}`,
    boundary: 'Strict unidirectional read-only hardware gateway; write commands blocked.'
  },
  {
    id: 'smartfit',
    name: 'GoSmartFit Field App',
    protocol: 'REST / Offline-First Sync',
    latency: '34ms',
    entity: 'AnchorGrid: B1-F12 Verified',
    payload: `{\n  "source": "GoSmartFit_Mobile_Field",\n  "site_code": "HYD-04-LOGISTICS",\n  "grid_zone": "BAY_04_ANCHORS",\n  "torque_nm_verified": 165,\n  "laser_plumb_dev_mm": 0.8,\n  "inspector_signoff": "SITE_SUPER_RAJESH",\n  "status": "APPROVED_FOR_BEAM_DROP"\n}`,
    boundary: 'Syncs site installation progress; physical structural changes require EOR stamp.'
  },
  {
    id: 'm365',
    name: 'Microsoft 365 / SharePoint',
    protocol: 'Microsoft Graph API',
    latency: '45ms',
    entity: 'SOW: Rev_04_Signed.pdf',
    payload: `{\n  "source": "M365_SharePoint_Graph",\n  "document_id": "SOW-HYD04-FINAL",\n  "doc_type": "STRUCTURAL_CALC_SUMMARY",\n  "eor_signature_detected": true,\n  "storage_uri": "sp://prorack/eng/hyd04/calcs",\n  "classification": "CONFIDENTIAL_PROJECT"\n}`,
    boundary: 'Semantic parsing only; no automated document modification.'
  }
];

function PlatformSystemMatrix() {
  const [activeSys, setActiveSys] = useState(platformSystems[0]);
  const [syncCount, setSyncCount] = useState(1482);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncCount(c => c + 1);
      setIsSyncing(false);
    }, 600);
  };

  const handleCopyPayload = async () => {
    try {await navigator.clipboard.writeText(activeSys.payload);} catch {return;}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="platform-matrix-container">
      {/* Left System Selector Column */}
      <div className="platform-matrix-nav">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', textTransform: 'uppercase', fontWeight: 700 }}>
          Connected Ingest Nodes
        </div>
        {platformSystems.map(sys => (
          <button
            key={sys.id}
            aria-pressed={activeSys.id === sys.id}
            className={`sys-matrix-btn ${activeSys.id === sys.id ? 'active' : ''}`}
            onClick={() => setActiveSys(sys)}
          >
            <div>
              <div style={{ color: activeSys.id === sys.id ? 'var(--foreground)' : 'var(--muted-foreground)', fontSize: '13px', fontWeight: 600 }}>{sys.name}</div>
              <small style={{ fontSize: '10px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{sys.protocol}</small>
            </div>
            <span style={{ fontSize: '11px', color: '#166534', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{sys.latency}</span>
          </button>
        ))}
      </div>

      {/* Right Dynamic Payload & Boundary Detail */}
      <div className="platform-matrix-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <span className="mono-tag" style={{ fontSize: '10px' }}>STREAM CONNECTOR // {activeSys.protocol}</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--foreground)', marginTop: '2px' }}>
              {activeSys.name}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-outline" 
              onClick={handleSimulateSync}
              disabled={isSyncing}
              style={{ fontSize: '11px', height: '34px', gap: '6px' }}
            >
              <RefreshCw size={13} className={isSyncing ? 'spin-icon' : ''} />
              <span>{isSyncing ? 'Ingesting...' : 'Test Ingest Sync'}</span>
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleCopyPayload}
              style={{ fontSize: '11px', height: '34px', gap: '6px' }}
            >
              {copied ? <CheckCheck size={13} color="#166534" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="responsive-stat-grid-3">
          <div style={{ background: 'var(--secondary)', padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>ACTIVE ENTITY</span>
            <strong style={{ fontSize: '13px', color: 'var(--foreground)' }}>{activeSys.entity}</strong>
          </div>
          <div style={{ background: 'var(--secondary)', padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>HEALTH / LATENCY</span>
            <strong style={{ fontSize: '13px', color: '#166534' }}>Synchronized ({activeSys.latency})</strong>
          </div>
          <div style={{ background: 'var(--secondary)', padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>INGEST COUNTER</span>
            <strong style={{ fontSize: '13px', color: 'var(--foreground)' }}>{syncCount.toLocaleString()} events</strong>
          </div>
        </div>

        {/* Live Payload Preview */}
        <div className="payload-preview-box" tabIndex={0} role="region" aria-label="Sample connector payload">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '10px', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
            <span>UNIFIED KNOWLEDGE GRAPH INGEST PACKET</span>
            <span style={{ color: '#00e5c9' }}>SCHEMA VALID // ZERO DRIFT</span>
          </div>
          <pre style={{ margin: 0 }}>{activeSys.payload}</pre>
        </div>

        <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 'var(--radius)', padding: '12px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#166534" />
          <span style={{ color: '#166534' }}>
            <strong style={{ color: '#14532d' }}>Security Boundary:</strong> {activeSys.boundary}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. REACT LIVE OPERATIONS MONITOR
// ==========================================
function OperationsLiveMonitor() {
  const [filter, setFilter] = useState('all');
  const [anomalyResolved, setAnomalyResolved] = useState(false);

  return (
    <div className="ops-monitor-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <span className="mono-tag">LIVE OPERATIONS DASHBOARD // PROJECT 2026-HYD-04</span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', marginTop: '2px' }}>
            Demonstration Logistics Hub (1,135 MT Execution Stream)
          </h3>
        </div>

        {/* Workstream Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'engineering', 'fabrication', 'qc', 'site'].map(f => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className="btn btn-outline"
              style={{
                fontSize: '11px',
                height: '32px',
                padding: '0 12px',
                textTransform: 'capitalize',
                background: filter === f ? 'var(--primary)' : '#ffffff',
                color: filter === f ? '#ffffff' : 'var(--foreground)',
                borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {f === 'all' ? 'All Workstreams' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Dials Grid */}
      <div className="ops-dials-grid">
        <div className="ops-dial">
          <div className="ops-dial-num" style={{ color: 'var(--primary)' }}>74.2%</div>
          <div className="ops-dial-label">Total Fabrication Progress</div>
          <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: '74.2%', height: '100%', background: 'var(--primary)' }}></div>
          </div>
        </div>

        <div className="ops-dial">
          <div className="ops-dial-num">842 / 1,135</div>
          <div className="ops-dial-label">Metric Tons Produced (MT)</div>
          <div style={{ fontSize: '11px', color: '#166534', marginTop: '6px', fontWeight: 700 }}>+12 MT ahead of shift plan</div>
        </div>

        <div className="ops-dial">
          <div className="ops-dial-num" style={{ color: 'var(--data-teal)' }}>98.2%</div>
          <div className="ops-dial-label">Steel Strip Yield (Nest)</div>
          <div style={{ fontSize: '11px', color: 'var(--data-teal)', marginTop: '6px', fontWeight: 700 }}>1.8% drop waste (Target: &lt;4%)</div>
        </div>

        <div className="ops-dial">
          <div className="ops-dial-num">+1.5 Days</div>
          <div className="ops-dial-label">Erection Schedule Buffer</div>
          <div style={{ fontSize: '11px', color: '#166534', marginTop: '6px', fontWeight: 700 }}>Site receiving on schedule</div>
        </div>
      </div>

      {/* Critical Path Anomaly Simulation */}
      <div className={`ops-anomaly-banner ${anomalyResolved ? 'resolved' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {anomalyResolved ? (
            <CheckCheck size={22} color="#166534" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={22} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--foreground)', display: 'block' }}>
              {anomalyResolved 
                ? 'AI Auto-Sequencing Executed: Blocker Cleared' 
                : 'Active Gate Blocker: Upright Punch Pattern Revision Variance'}
            </strong>
            <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '3px' }}>
              {anomalyResolved
                ? 'Roll Mill #01 automated tooling repositioned to Bank B (+0.00mm offset). Nest PF-8840 synced to Tekla Rev C with zero lost minutes.'
                : 'Tekla Drawing Rev C updated slot pitch on column C220. Roll Mill #01 is queued with legacy Rev B cut list. 42 uprights at risk of slot misalignment.'}
            </p>
          </div>
        </div>

        {!anomalyResolved && (
          <button 
            onClick={() => setAnomalyResolved(true)}
            className="btn btn-primary"
            style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '8px 16px' }}
          >
            Simulate AI Auto-Resolution
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. REACT INTERACTIVE COPILOT CHAT
// ==========================================
const copilotScenarios = [
  {
    id: 'delay',
    title: 'Project HYD-04 Delay Analysis',
    query: 'What caused the 48-hour delivery delay on Project HYD-04?',
    answer: 'The 48-hour delay on Project HYD-04 was caused by a mill cert specification discrepancy on Raw Coil Heat #B489 (Tata Steel HR Coil 3.8mm). While the structural calculation in Tekla required IS 2062 E350 Grade steel, the vendor delivered E250 Grade. ProRack AI automated gate verification intercepted the discrepancy before coil slitting, re-routed the queue to Coil Heat #A904, and prevented 42 MT of non-compliant beam fabrication.',
    citations: [
      { text: 'ERPNext PO-9021', source: 'Purchasing Ledger' },
      { text: 'Tekla Drawing DWG-C220-REV_C', source: '3D BIM Model' },
      { text: 'QC Caliper Batch #8812', source: 'Metrology Lab' }
    ]
  },
  {
    id: 'heat',
    title: 'Heat Cert #B489 Verification',
    query: 'Verify structural grade compliance for Cold Roll-Forming Heat #B489.',
    answer: 'Coil Heat #B489 (Tata Steel Lot 4091) tested at Yield Strength 265 MPa and Tensile 410 MPa. This qualifies for standard light pallet rack bracing (IS 2062 E250) but fails the high-bay seismic load threshold for Project HYD-04 (minimum 350 MPa required). Status: REJECTED FOR HIGH-BAY // RE-ALLOCATED TO SECONDARY BRACING QUEUE.',
    citations: [
      { text: 'Mill Cert IS 2062', source: 'Tata Steel Lab Slip' },
      { text: 'Seismic Spec Zone III', source: 'EOR Engineering Calc' }
    ]
  },
  {
    id: 'mill',
    title: 'Mill #2 Schedule Simulation',
    query: 'Simulate shifting Roll-Forming Mill #2 schedule to compensate for coil arrival.',
    answer: 'Simulating 8-hour shift re-allocation: Moving 180 beam runs from Mill #02 to Mill #01 increases overall line utilization from 82% to 94.6%. Slitting tooling changeover duration is calculated at 42 minutes. The net erection delivery timeline is maintained with zero schedule slip at Hyderabad receiving bay.',
    citations: [
      { text: 'Modbus TCP Reg 40012', source: 'Mill #02 Line Status' },
      { text: 'PowerFab Job #PF-8840', source: 'Fabrication Routing' }
    ]
  },
  {
    id: 'brief',
    title: 'Executive Shift Delivery Brief',
    query: 'Generate executive shift handoff brief for sample Hyderabad fulfillment project.',
    answer: 'EXECUTIVE SHIFT BRIEF (06:00 - 14:00 Shift):\nâ€¢ Tonnage Complete: 842 / 1,135 MT (74.2% project completion)\nâ€¢ Upright Columns C220: 640/640 fabricated, passed 100% digital caliper tolerance check (Â±0.012mm)\nâ€¢ Flatbed Logistics: 4 truckloads dispatched, verified via weighbridge Gate 3\nâ€¢ Site Sync (GoSmartFit): Bays 1-8 erect, anchor torque 165 Nm verified\nâ€¢ Next Shift Priority: Sequence Step Beams B140 on Mill #02 at 14:30.',
    citations: [
      { text: 'ProRack AI Graph', source: 'Deterministic Aggregate' },
      { text: 'SmartFit Site Sync', source: 'Bay 01-08 Sign-off' }
    ]
  }
];

function InteractiveCopilotChat() {
  const [activeScenario, setActiveScenario] = useState(copilotScenarios[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [displayedAnswer, setDisplayedAnswer] = useState(copilotScenarios[0].answer);
  const [copied, setCopied] = useState(false);

  const handleSelectScenario = (sc) => {
    setActiveScenario(sc);
    setCustomQuery('');
    setDisplayedAnswer(sc.answer);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    const lower = customQuery.toLowerCase();
    const match = copilotScenarios.find(s => s.query.toLowerCase().includes(lower) || s.title.toLowerCase().includes(lower));
    if (match) {
      setActiveScenario(match);
      setDisplayedAnswer(match.answer);
    } else {
      setDisplayedAnswer('This demonstration has no live data connection. Choose a sample scenario above to explore how an evidence-backed response would be presented.');
    }
  };

  const handleCopy = async () => {
    try {await navigator.clipboard.writeText(displayedAnswer);} catch {return;}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copilot-chat-container">
      {/* Scenario Pill Buttons */}
      <div className="copilot-scenario-pills">
        {copilotScenarios.map(sc => (
          <button
            key={sc.id}
            aria-pressed={activeScenario.id === sc.id}
            className={`copilot-pill ${activeScenario.id === sc.id ? 'active' : ''}`}
            onClick={() => handleSelectScenario(sc)}
          >
            {sc.title}
          </button>
        ))}
      </div>

      <div className="copilot-stream-area">
        {/* User Prompt Bubble */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
            <FileText size={15} color="var(--primary)" />
          </div>
          <div style={{ background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', padding: '12px 18px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 600, color: '#9a3412', maxWidth: '85%' }}>
            {activeScenario.query}
          </div>
        </div>

        {/* AI Copilot Answer Area */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ffffff' }}>
            <Zap size={15} />
          </div>
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-teal" style={{ fontSize: '9px' }}>SAMPLE RESPONSE / DEMO DATA</span>
                <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>LATENCY: 42MS</span>
              </div>

              <button 
                onClick={handleCopy}
                className="btn btn-outline"
                style={{ fontSize: '11px', height: '28px', padding: '0 10px', gap: '4px' }}
              >
                {copied ? <CheckCheck size={13} color="#166534" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--foreground)', whiteSpace: 'pre-line' }}>
              {displayedAnswer}
            </div>

            {/* Citations List */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--muted-foreground)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>
                Grounded Source Records:
              </span>
              <div>
                {activeScenario.citations.map((c, i) => (
                  <span key={i} className="citation-chip" title={c.source}>
                    <ShieldCheck size={12} color="#0369a1" />
                    <span>{c.text}</span>
                    <small style={{ color: '#526052' }}>({c.source})</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Query Input */}
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <input
            type="text"
            aria-label="Ask a demonstration question"
            placeholder="Ask anything (e.g. 'coil', 'delay', 'tekla', 'mill')..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            style={{
              flex: 1,
              height: '40px',
              padding: '0 14px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              fontSize: '13px',
              background: '#ffffff',
              color: 'var(--foreground)',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', height: '40px', padding: '0 18px' }}>
            Query AI
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 7. REACT SECURITY & RBAC SIMULATOR
// ==========================================
const rbacRoles = [
  {
    id: 'commercial',
    title: 'Commercial Finance Manager',
    systems: 'ERPNext & M365 Commercial',
    read: ['Client Contracts', 'Milestone Bill of Quantities', 'Payment Releases', 'Coil Purchase Orders'],
    write: ['Advance Cleared Milestone Tag'],
    blocked: ['Direct Machine PLC Run Commands', '3D Tekla Structural Model Geometry', 'Shop Floor Cut Overrides']
  },
  {
    id: 'bim',
    title: 'Structural BIM Detailing Lead',
    systems: 'Tekla Structures & Trimble Connect',
    read: ['SOW Engineering Specs', 'Steel Grade Certs', 'Site Anchor Surveys', 'PowerFab Nest Yield'],
    write: ['IFC Geometry Rev Lock', 'Shop Drawing Sheets (DWG)'],
    blocked: ['Commercial Client Pricing Margins', 'Direct PLC Motor Overrides', 'Site Subcontractor Invoices']
  },
  {
    id: 'floor',
    title: 'Shop Floor Roll Mill Operator',
    systems: 'Modbus Edge Terminal & MES',
    read: ['Work Order Cut Lists', 'Linear Nest Lengths', 'Profile Tolerance Limits', 'Coil Heat Slips'],
    write: ['Inspection Dimension Caliper Log', 'Stroke Cycle Counter Acknowledge'],
    blocked: ['ERP Sales Order Prices', 'Tekla Model Direct Editing', 'Corporate Microsoft 365 Inboxes']
  },
  {
    id: 'super',
    title: 'Site Installation Super (GoSmartFit)',
    systems: 'GoSmartFit Mobile App',
    read: ['Bay Erection Sequence Drawings', 'Flatbed Shipping Manifest', 'Anchor Grid Dimensions'],
    write: ['Laser Plumb Inspection Sign-off', 'Bolt Torque Audit Logs', 'Site Photo Geotags'],
    blocked: ['Factory Nesting Settings', 'Factory Machine PLC Control', 'Customer Contract Payment Terms']
  }
];

function SecurityRbacSimulator() {
  const [activeRole, setActiveRole] = useState(rbacRoles[0]);
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] AUTH_OK: role="${rbacRoles[0].title}" token="hmac_sha256:7b1e..."`,
    `[${new Date().toLocaleTimeString()}] ACCESS: read ERPNext commercial ledger SO-2026-089 (GRANULAR_PERMIT)`,
    `[${new Date().toLocaleTimeString()}] AIRGAP_GUARD: block direct write to PLC Modbus port 502 (BLOCKED_POLICY_RBAC_04)`
  ]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ROLE_SWITCH: Active session changed to "${role.title}"`,
      `[${new Date().toLocaleTimeString()}] BOUNDARY_AUDIT: Scoped access applied to [${role.systems}]`,
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div className="rbac-container">
      {/* Role Tabs */}
      <div className="rbac-roles-bar">
        {rbacRoles.map(role => (
          <button
            key={role.id}
            aria-pressed={activeRole.id === role.id}
            className={`rbac-role-btn ${activeRole.id === role.id ? 'active' : ''}`}
            onClick={() => handleRoleChange(role)}
          >
            {role.title}
          </button>
        ))}
      </div>

      <div className="rbac-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <span className="mono-tag" style={{ fontSize: '10px' }}>ACCESS CONTROL MATRIX // BOUNDARY LEVEL 4</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--foreground)', marginTop: '2px' }}>
              {activeRole.title}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Primary Surface: {activeRole.systems}</span>
          </div>
          <span className="badge badge-teal">AIR-GAPPED OT ISOLATION ACTIVE</span>
        </div>

        {/* Permissions Grid */}
        <div className="responsive-rbac-grid">
          {/* Read Access */}
          <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              <Check size={14} />
              <span>Read Permitted</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#166534' }}>
              {activeRole.read.map((item, i) => (
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #bbf7d0' }}>â€¢ {item}</li>
              ))}
            </ul>
          </div>

          {/* Write Access */}
          <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              <Zap size={14} />
              <span>Scoped Write Allowed</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#9a3412' }}>
              {activeRole.write.map((item, i) => (
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #fed7aa' }}>â€¢ {item}</li>
              ))}
            </ul>
          </div>

          {/* Blocked / Redacted Access */}
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              <Lock size={14} />
              <span>Enforced Blocked Boundaries</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#991b1b' }}>
              {activeRole.blocked.map((item, i) => (
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #fecaca' }}>âœ• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cryptographic Audit Stream */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginBottom: '8px', fontWeight: 700 }}>
            <span>IMMUTABLE CRYPTOGRAPHIC AUDIT TRAIL (HMAC-SHA256)</span>
            <span style={{ color: '#166534' }}>ZERO TAMPER LOGGING</span>
          </div>
          <div className="audit-stream-box" tabIndex={0} role="region" aria-label="Sample access audit log">
            {logs.map((log, idx) => (
              <div key={idx} style={{ padding: '3px 0' }}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MOUNT COMPONENT ISLANDS
// ==========================================

const storageSystems = [{"image":"assets/editorial-photography/selective-pallet-racking.webp","name":"Selective pallet racking","description":"The flexible, freely adaptable solution for pallets and stillages with large quantities of line items or heavy goods.","id":"selective"},{"image":"assets/editorial-photography/wide-aisle-multi-bay-racking.webp","name":"Wide-aisle multi-bay racking","description":"The workhorse system for pallet storage in large quantities, adaptable to almost any load and building height.","id":"wide-aisle"},{"image":"assets/editorial-photography/narrow-aisle-multi-bay-racking.webp","name":"Very narrow-aisle (VNA) racking","description":"More efficiency when storing large quantities of palletised goods. Ideal for high throughput on a small footprint.","id":"narrow-aisle"},{"image":"assets/editorial-photography/drive-in-drive-through-racking.webp","name":"Drive-in / drive-through racking","description":"Compact block storage combined with rack stacking. Built for large quantities of heavy, similar items.","id":"drive-in"},{"image":"assets/editorial-photography/multi-tier-shelving.webp","name":"Multi-tier shelving","description":"Make full use of warehouse height and let personnel pick across several levels with walkways, stairs and gates.","id":"multi-tier"},{"image":"assets/editorial-photography/cantilever-racking.webp","name":"Cantilever racking","description":"Open-fronted storage for pipes, profiles, timber and other long goods that will not fit a standard pallet bay.","id":"cantilever"},{"image":"assets/editorial-photography/pallet-carton-flow-racking.webp","name":"Pallet and carton flow racking","description":"Gravity-fed lanes that separate loading from picking and keep FIFO stock rotation running without intervention.","id":"flow-racking"},{"image":"assets/editorial-photography/mezzanine-floors.webp","name":"Mezzanine floors","description":"Rack-supported and free-standing platforms that add usable floor area inside the existing building envelope.","id":"mezzanine"}];
function StorageExplorer() {
  const [selected,setSelected]=useState(0);
  const [reducedMotion,setReducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [viewport,carousel]=useEmblaCarousel({loop:true,duration:reducedMotion?0:28,watchFocus:false});
  useEffect(()=>{
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(preference.matches);
    preference.addEventListener('change',update);
    return ()=>preference.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    if(!carousel) return;
    const update=()=>setSelected(carousel.selectedScrollSnap());
    update();
    carousel.on('select',update).on('reInit',update);
    return ()=>{carousel.off('select',update);carousel.off('reInit',update);};
  },[carousel]);
  const system=storageSystems[selected];
  const selectSystem = index => carousel?.scrollTo((index+storageSystems.length)%storageSystems.length,reducedMotion);
  return <div className="storage-explorer portfolio-viewer">
    <div className="portfolio-tools"><p className="eyebrow">Eight systems / Designed around your operation</p><div className="portfolio-controls"><button aria-label="Previous storage system" onClick={()=>selectSystem(selected-1)}><ArrowRight className="previous-arrow" size={20}/></button><span aria-hidden="true">{String(selected+1).padStart(2,'0')} / 08</span><button aria-label="Next storage system" onClick={()=>selectSystem(selected+1)}><ArrowRight size={20}/></button></div></div>
    <div className="storage-detail" id="storage-detail"><div className="portfolio-image"><div className="portfolio-viewport" ref={viewport} tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Illustrative storage systems. Use left and right arrow keys to explore." onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();selectSystem(selected+(e.key==='ArrowRight'?1:-1));}}}><div className="portfolio-track">{storageSystems.map((item,i)=><div className="portfolio-slide" key={item.id} role="group" aria-roledescription="slide" aria-label={`${i+1} of 8: ${item.name}`} aria-hidden={selected!==i}><img className="system-image" src={item.image} alt={item.name} width="1600" height="1000" loading="lazy" draggable="false"/></div>)}</div></div><span className="portfolio-drag-hint" aria-hidden="true"><span className="desktop-drag">Drag to explore</span><span className="mobile-swipe">Swipe to explore</span><span>&#8596;</span></span></div><div className="storage-caption" aria-live="polite" aria-atomic="true"><div key={system.id} className="portfolio-caption-content"><span className="portfolio-large-number" aria-hidden="true">{String(selected+1).padStart(2,'0')}</span><span className="eyebrow">System {String(selected+1).padStart(2,'0')} / 08</span><h3>{system.name}</h3><p>{system.description}</p><a className="line-link" href={'solutions.html#'+system.id}>Explore this system <ArrowRight size={19}/></a></div></div></div>
    <div className="portfolio-mobile-select"><label htmlFor="portfolio-system">Choose a storage system</label><select id="portfolio-system" value={selected} onChange={e=>selectSystem(Number(e.target.value))}>{storageSystems.map((item,i)=><option key={item.id} value={i}>{String(i+1).padStart(2,'0')} / {item.name}</option>)}</select></div>
    <div className="storage-list" role="group" aria-label="Racking systems">{storageSystems.map((item,i)=><button key={item.id} aria-pressed={selected===i} aria-controls="storage-detail" onClick={()=>selectSystem(i)}><small>{String(i+1).padStart(2,'0')}</small><span>{item.name}</span><ArrowRight size={17}/></button>)}</div>
  </div>;
}

const storagePriorities = [
  {label:'Access every pallet directly',index:0,heading:'Keep every load within reach.',reason:'Selective pallet racking gives direct access to each pallet position. Start here when you need flexibility across a varied inventory.',check:'Pallet dimensions, load weights, aisle widths and handling equipment.'},
  {label:'Store more in the same footprint',index:3,heading:'Make density work for your stock.',reason:'Drive-in and drive-through racking reduce aisle space by storing pallets in lanes. Start here for larger batches of similar goods.',check:'SKU mix, batch sizes, stock rotation and forklift compatibility.'},
  {label:'Make use of warehouse height',index:4,heading:'Put the space above you to work.',reason:'Multi-tier shelving creates picking levels within the building height. Start here for smaller items and manually handled stock.',check:'Clear height, floor loading, access routes and fire-safety requirements.'},
  {label:'Store long or bulky materials',index:5,heading:'Give long loads room to breathe.',reason:'Cantilever racking provides open-fronted storage for pipes, timber and profiles. Start here when conventional pallet bays constrain your materials.',check:'Load lengths, weights, support spacing and handling methods.'},
  {label:'Improve stock rotation and picking',index:6,heading:'Let the system support the flow.',reason:'Pallet and carton flow racking use gravity-fed lanes to separate replenishment from picking. Start here when FIFO rotation matters.',check:'Product dimensions, lane depth, picking rate and replenishment frequency.'}
];
function RequirementsGuide() {
  const [selected,setSelected]=useState(0);
  const priority=storagePriorities[selected];
  const system=storageSystems[priority.index];
  const choosePriority = (index) => {
    setSelected(index);

  };
  return <div className="requirements-guide"><div className="requirement-mobile-select"><label htmlFor="requirement-priority">What would you like to improve?</label><select id="requirement-priority" value={selected} onChange={e=>choosePriority(Number(e.target.value))}>{storagePriorities.map((item,i)=><option key={item.index} value={i}>{item.label}</option>)}</select></div><div className="priority-options" role="group" aria-label="Storage priorities">{storagePriorities.map((item,i)=><button key={item.index} aria-pressed={selected===i} aria-controls="requirement-result" onClick={()=>choosePriority(i)}><span className="priority-number">{String(i+1).padStart(2,'0')}</span><span>{item.label}</span><ArrowRight size={18}/></button>)}</div><div className="requirement-result" id="requirement-result" aria-live="polite" aria-atomic="true"><div key={selected} className="requirement-result-content"><div className="requirement-result-top"><p className="eyebrow">A suggested starting point</p><span className="eyebrow">{String(selected+1).padStart(2,'0')} / 05</span></div><h3>{priority.heading}</h3><p className="suggested-system">{system.name}</p><p>{priority.reason}</p><div className="requirement-check"><span className="eyebrow">Our engineers will confirm</span><p>{priority.check}</p></div><div className="requirement-links"><a className="line-link" href={'solutions.html#'+system.id}>Explore {system.name.toLowerCase()} <ArrowRight size={18}/></a><a className="requirement-cta" href={'contact.html?system='+system.id}>Discuss your requirement <ArrowRight size={18}/></a></div></div></div></div>;
}

// Scroll enhancements never conceal content or replace native scrolling.
function SiteEffects() {
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    document.body.classList.toggle('motion-paused',paused);
    return ()=>document.body.classList.remove('motion-paused');
  },[paused]);
  const progress = useRef(null);
  const topLink = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1,Math.max(0,scrollY/distance)) : 0})`;
      topLink.current.hidden = scrollY < 700;

    };
    const requestUpdate = () => {if(!frame) frame=requestAnimationFrame(update);};
    const motion=gsap.matchMedia();
    motion.add({desktop:'(min-width: 761px)',mobile:'(max-width: 760px)',reduced:'(prefers-reduced-motion: reduce)'},context=>{
      if(context.conditions.reduced || paused) return;
      const distance=context.conditions.desktop?24:12;
      gsap.fromTo('.cover-hero .headline-line',{y:distance},{y:0,duration:.85,stagger:.1,ease:'power3.out',clearProps:'transform'});
      document.querySelectorAll('.editorial-section-heading h2, .story-heading h2, .heritage-section h2, .project-invitation h2, .page-hero h1, .ecosystem-layout h2').forEach(target=>{
        gsap.fromTo(target,{y:distance,opacity:.7},{y:0,opacity:1,duration:.7,ease:'power3.out',immediateRender:false,clearProps:'transform,opacity',scrollTrigger:{trigger:target,start:'top 92%',once:true}});
      });
      if(context.conditions.desktop) {
        document.querySelectorAll('.hero-photograph img,.group-detail img,.intelligence-section > img').forEach(target=>{
          gsap.fromTo(target,{scale:1.08,yPercent:-2},{yPercent:2,ease:'none',scrollTrigger:{trigger:target.parentElement,start:'top bottom',end:'bottom top',scrub:1}});
        });
      }
    });
    const surfaces=[...document.querySelectorAll('.cover-hero,.page-hero,.systems-section,.ecosystem-section,.project-invitation,.approach-feature')];
    surfaces.forEach(surface=>{
      surface.classList.add('motion-surface');
      const texture=document.createElement('span');
      texture.className='editorial-texture';
      texture.setAttribute('aria-hidden','true');
      surface.prepend(texture);
    });
    const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-in-view',entry.isIntersecting)));
    surfaces.forEach(surface=>visibility.observe(surface));
    const onVisibility=()=>document.body.classList.toggle('motion-tab-hidden',document.hidden);
    document.addEventListener('visibilitychange',onVisibility);
    onVisibility();
    const steps = new IntersectionObserver(entries => entries.forEach(e=>e.target.classList.toggle('stage-in-view',e.isIntersecting)),{rootMargin:'-25% 0px -25% 0px'});
    document.querySelectorAll('.delivery-steps li').forEach(e=>steps.observe(e));
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate);
    preference.addEventListener('change',requestUpdate);
    update();
    return ()=>{motion.revert();steps.disconnect();visibility.disconnect();surfaces.forEach(surface=>{surface.querySelector('.editorial-texture')?.remove();surface.classList.remove('motion-surface','motion-in-view');});document.removeEventListener('visibilitychange',onVisibility);document.body.classList.remove('motion-tab-hidden');cancelAnimationFrame(frame);window.removeEventListener('scroll',requestUpdate);window.removeEventListener('resize',requestUpdate);preference.removeEventListener('change',requestUpdate);};
  },[paused]);
  return <><button className="motion-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button><div className="reading-progress" aria-hidden="true"><span ref={progress}/></div><a ref={topLink} hidden className="back-to-top" href="#main-content" aria-label="Back to top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('main-content')?.focus({preventScroll:true});}}><ArrowUp size={20} aria-hidden="true"/><span>Back to top</span></a></>;
}

document.addEventListener('DOMContentLoaded', () => {
  const storageContainer = document.getElementById('react-storage-explorer');
  if(storageContainer) createRoot(storageContainer).render(<StorageExplorer />);
  const requirementsContainer = document.getElementById('react-requirements-guide');
  if(requirementsContainer) createRoot(requirementsContainer).render(<RequirementsGuide />);
  const systemSelect=document.querySelector('select[name="system_type"]');
  if(systemSelect){
    const requested=new URLSearchParams(window.location.search).get('system');
    const aliases={'narrow-aisle':'vna'};
    const value=aliases[requested]||requested;
    if([...systemSelect.options].some(o=>o.value===value)) systemSelect.value=value;
  }
  // Detect active page from URL
  const pathname = window.location.pathname;
  let activePage = 'index';
  if (pathname.includes('solutions')) activePage = 'solutions';
  else if (pathname.includes('engineering')) activePage = 'engineering';
  else if (pathname.includes('execution')) activePage = 'execution';
  else if (pathname.includes('company')) activePage = 'company';
  else if (pathname.includes('contact')) activePage = 'contact';
  else if (pathname.includes('platform')) activePage = 'platform';
  else if (pathname.includes('operations')) activePage = 'operations';
  else if (pathname.includes('machines')) activePage = 'machines';
  else if (pathname.includes('copilot')) activePage = 'copilot';
  else if (pathname.includes('architecture')) activePage = 'architecture';
  else if (pathname.includes('roadmap')) activePage = 'roadmap';

  // Mount Header
  const headerContainer = document.getElementById('react-header');
  if (headerContainer) {
    createRoot(headerContainer).render(<GlobalHeader activePage={activePage} />);
  }
  const effectsContainer = document.createElement('div');
  effectsContainer.id = 'site-effects';
  document.body.append(effectsContainer);
  createRoot(effectsContainer).render(<SiteEffects />);

  const deliveryContainer=document.getElementById('react-delivery-stages');
  if(deliveryContainer) createRoot(deliveryContainer).render(<DeliveryStages />);

  // Mount Lifecycle Explorer (if container present)
  const lifecycleContainer = document.getElementById('react-lifecycle');
  if (lifecycleContainer) {
    createRoot(lifecycleContainer).render(<LifecycleExplorer />);
  }

  // Mount Telemetry Live Chart (if container present)
  const telemetryContainer = document.getElementById('react-telemetry');
  if (telemetryContainer) {
    createRoot(telemetryContainer).render(<TelemetryLiveChart />);
  }

  // Mount Platform System Matrix (if container present)
  const platformContainer = document.getElementById('react-platform-matrix');
  if (platformContainer) {
    createRoot(platformContainer).render(<PlatformSystemMatrix />);
  }

  // Mount Operations Live Monitor (if container present)
  const operationsContainer = document.getElementById('react-operations-monitor');
  if (operationsContainer) {
    createRoot(operationsContainer).render(<OperationsLiveMonitor />);
  }

  // Mount Interactive Copilot Chat (if container present)
  const copilotContainer = document.getElementById('react-copilot-interactive');
  if (copilotContainer) {
    createRoot(copilotContainer).render(<InteractiveCopilotChat />);
  }

  // Mount Security RBAC Simulator (if container present)
  const rbacContainer = document.getElementById('react-rbac-simulator');
  if (rbacContainer) {
    createRoot(rbacContainer).render(<SecurityRbacSimulator />);
  }
});
