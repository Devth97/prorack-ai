import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Search, Menu, X, Activity, Cpu, Layers, ChevronRight, 
  Terminal, Check, AlertCircle, Clock, ArrowRight, ShieldCheck,
  Server, BarChart3, Database, Workflow, Settings, FileText,
  Copy, CheckCheck, RefreshCw, Zap, Sliders, Lock
} from 'lucide-react';

// ==========================================
// 1. GLOBAL COMMAND PALETTE & RESPONSIVE NAV
// ==========================================
function GlobalHeader({ activePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navLinks = [
    { name: 'Overview', href: 'index.html', id: 'index' },
    { name: 'Platform', href: 'platform.html', id: 'platform' },
    { name: 'Operations', href: 'operations.html', id: 'operations' },
    { name: 'Machines', href: 'machines.html', id: 'machines' },
    { name: 'AI Copilot', href: 'copilot.html', id: 'copilot' },
    { name: 'Architecture', href: 'architecture.html', id: 'architecture' },
    { name: 'Roadmap', href: 'roadmap.html', id: 'roadmap' },
  ];

  const searchItems = [
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

  const filteredItems = searchItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Keyboard shortcut & resize listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 1040) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="shell nav-inner">
        <a href="index.html" className="nav-brand" aria-label="ProRack AI Home">
          <img src="assets/prorack-mark.webp" alt="ProRack Monogram" width="32" height="32" />
          <div className="nav-brand-text">
            <span className="brand-title">ProRack AI</span>
            <span className="brand-sub">Connected Operations Layer</span>
          </div>
        </a>

        <div className="nav-status-pill hidden-mobile">
          <span className="pulse-dot"></span>
          <span>Layer Active</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {navLinks.map(link => (
            <a 
              key={link.id} 
              href={link.href} 
              className={activePage === link.id ? 'active' : ''}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Command Palette Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="command-trigger-btn"
            onClick={() => setCommandOpen(true)}
            title="Search systems and capabilities (Ctrl+K)"
          >
            <Search size={14} color="#64748b" />
            <span className="hidden-mobile" style={{ fontSize: '11px', color: '#64748b' }}>Quick Find</span>
            <kbd className="hidden-mobile">Ctrl K</kbd>
          </button>

          <a href="copilot.html#brief" className="nav-cta hidden-mobile">
            Live Brief
          </a>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Backdrop Overlay */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px' }}>
            <div className="nav-status-pill" style={{ width: 'fit-content', marginBottom: '8px' }}>
              <span className="pulse-dot"></span>
              <span>Connected Intelligence Layer Active</span>
            </div>

            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                className={`mobile-nav-link ${activePage === link.id ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
                <ChevronRight size={14} color="#94a3b8" />
              </a>
            ))}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' }}>
              <a 
                href="copilot.html#brief" 
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                View Live Shift Brief
              </a>
            </div>
          </div>
        </div>
        </>
      )}

      {/* shadcn-style Command Dialog / Search Modal */}
      {commandOpen && (
        <div className="command-dialog-overlay" onClick={() => setCommandOpen(false)}>
          <div className="command-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="command-input-wrap">
              <Search size={16} color="#64748b" />
              <input 
                type="text"
                placeholder="Search systems, metrics, drawings, machines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="command-input"
              />
              <kbd className="command-esc-badge" onClick={() => setCommandOpen(false)}>ESC</kbd>
            </div>

            <div className="command-results-list">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.href} 
                    className="command-item"
                    onClick={() => setCommandOpen(false)}
                  >
                    <div>
                      <div className="command-item-title">{item.title}</div>
                      <span className="command-item-cat">{item.category}</span>
                    </div>
                    <ArrowRight size={14} color="#94a3b8" />
                  </a>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No matching systems or metrics found.
                </div>
              )}
            </div>

            <div className="command-footer">
              <span>ProRack AI Intelligent Capability Routing Layer</span>
              <span>Navigate with Enter / Esc</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
    check: "Profile dimensional tolerance within ±0.03mm"
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
          <small style={{ color: '#64748b', fontSize: '9px', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Continuous Speed</small>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{speed} m/min</span>
        </div>

        <div style={{ background: 'var(--secondary)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <small style={{ color: '#64748b', fontSize: '9px', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Stroke Count</small>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)' }}>{strokes.toLocaleString()}</span>
        </div>

        <div style={{ background: 'var(--secondary)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <small style={{ color: '#64748b', fontSize: '9px', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>Bearing RMS</small>
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
    payload: `{\n  "source": "ERPNext_v15_Enterprise",\n  "sales_order": "SO-2026-089",\n  "customer": "Amazon Fulfillment Services",\n  "total_tonnage_mt": 1135,\n  "advance_cleared": true,\n  "coil_po_linked": "PO-9021-TATA-HR",\n  "status": "COMMERCIAL_RELEASED"\n}`,
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

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(activeSys.payload);
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
            className={`sys-matrix-btn ${activeSys.id === sys.id ? 'active' : ''}`}
            onClick={() => setActiveSys(sys)}
          >
            <div>
              <div style={{ color: activeSys.id === sys.id ? 'var(--foreground)' : 'var(--muted-foreground)', fontSize: '13px', fontWeight: 600 }}>{sys.name}</div>
              <small style={{ fontSize: '10px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{sys.protocol}</small>
            </div>
            <span style={{ fontSize: '11px', color: '#15803d', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{sys.latency}</span>
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
              {copied ? <CheckCheck size={13} color="#15803d" /> : <Copy size={13} />}
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
            <strong style={{ fontSize: '13px', color: '#15803d' }}>Synchronized ({activeSys.latency})</strong>
          </div>
          <div style={{ background: 'var(--secondary)', padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>INGEST COUNTER</span>
            <strong style={{ fontSize: '13px', color: 'var(--foreground)' }}>{syncCount.toLocaleString()} events</strong>
          </div>
        </div>

        {/* Live Payload Preview */}
        <div className="payload-preview-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '10px', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
            <span>UNIFIED KNOWLEDGE GRAPH INGEST PACKET</span>
            <span style={{ color: '#00e5c9' }}>SCHEMA VALID // ZERO DRIFT</span>
          </div>
          <pre style={{ margin: 0 }}>{activeSys.payload}</pre>
        </div>

        <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 'var(--radius)', padding: '12px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#15803d" />
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
            Amazon Logistics Hub (1,135 MT Execution Stream)
          </h3>
        </div>

        {/* Workstream Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'engineering', 'fabrication', 'qc', 'site'].map(f => (
            <button
              key={f}
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
          <div style={{ fontSize: '11px', color: '#15803d', marginTop: '6px', fontWeight: 700 }}>+12 MT ahead of shift plan</div>
        </div>

        <div className="ops-dial">
          <div className="ops-dial-num" style={{ color: 'var(--data-teal)' }}>98.2%</div>
          <div className="ops-dial-label">Steel Strip Yield (Nest)</div>
          <div style={{ fontSize: '11px', color: 'var(--data-teal)', marginTop: '6px', fontWeight: 700 }}>1.8% drop waste (Target: &lt;4%)</div>
        </div>

        <div className="ops-dial">
          <div className="ops-dial-num">+1.5 Days</div>
          <div className="ops-dial-label">Erection Schedule Buffer</div>
          <div style={{ fontSize: '11px', color: '#15803d', marginTop: '6px', fontWeight: 700 }}>Site receiving on schedule</div>
        </div>
      </div>

      {/* Critical Path Anomaly Simulation */}
      <div className={`ops-anomaly-banner ${anomalyResolved ? 'resolved' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {anomalyResolved ? (
            <CheckCheck size={22} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
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
    query: 'Generate executive shift handoff brief for Amazon Hyderabad Fulfillment Center.',
    answer: 'EXECUTIVE SHIFT BRIEF (06:00 - 14:00 Shift):\n• Tonnage Complete: 842 / 1,135 MT (74.2% project completion)\n• Upright Columns C220: 640/640 fabricated, passed 100% digital caliper tolerance check (±0.012mm)\n• Flatbed Logistics: 4 truckloads dispatched, verified via weighbridge Gate 3\n• Site Sync (GoSmartFit): Bays 1-8 erect, anchor torque 165 Nm verified\n• Next Shift Priority: Sequence Step Beams B140 on Mill #02 at 14:30.',
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
      setDisplayedAnswer(`ProRack AI deterministic inquiry: Querying unified knowledge graph across ERPNext, Tekla, PowerFab, and Modbus registers for "${customQuery}"...\n\nResult: 14 matching operational records located. Verified project entity: Project 2026-HYD-04. Structural drawings, roll-forming stroke records, and heat certs are synchronized with zero open non-conformances.`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(displayedAnswer);
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
                <span className="badge badge-teal" style={{ fontSize: '9px' }}>DETERMINISTIC CITATION VERIFIED</span>
                <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>LATENCY: 42MS</span>
              </div>

              <button 
                onClick={handleCopy}
                className="btn btn-outline"
                style={{ fontSize: '11px', height: '28px', padding: '0 10px', gap: '4px' }}
              >
                {copied ? <CheckCheck size={13} color="#15803d" /> : <Copy size={13} />}
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
                    <ShieldCheck size={12} color="#0284c7" />
                    <span>{c.text}</span>
                    <small style={{ color: '#64748b' }}>({c.source})</small>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              <Check size={14} />
              <span>Read Permitted</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#166534' }}>
              {activeRole.read.map((item, i) => (
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #bbf7d0' }}>• {item}</li>
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
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #fed7aa' }}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Blocked / Redacted Access */}
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              <Lock size={14} />
              <span>Enforced Blocked Boundaries</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#991b1b' }}>
              {activeRole.blocked.map((item, i) => (
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #fecaca' }}>✕ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cryptographic Audit Stream */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginBottom: '8px', fontWeight: 700 }}>
            <span>IMMUTABLE CRYPTOGRAPHIC AUDIT TRAIL (HMAC-SHA256)</span>
            <span style={{ color: '#15803d' }}>ZERO TAMPER LOGGING</span>
          </div>
          <div className="audit-stream-box">
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
document.addEventListener('DOMContentLoaded', () => {
  // Detect active page from URL
  const pathname = window.location.pathname;
  let activePage = 'index';
  if (pathname.includes('platform')) activePage = 'platform';
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
