import { useState, useEffect, useRef } from "react";

const BILLS_KEY   = "janta_bills_v5";
const CATALOG_KEY = "janta_catalog_v3";
const CUSTOM_KEY  = "janta_custom_v3";
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const BASE_MEDICINES = [
  "Crocin 500mg","Crocin 650mg","Crocin Advance 500mg","Crocin Cold & Flu",
  "Dolo 650mg","Dolo 500mg","Dolo-Cold",
  "Paracetamol 500mg","Paracetamol 650mg","Paracetamol 1000mg",
  "Combiflam Tablet","Combiflam Plus","Combiflam ICY Hot Gel",
  "Ibuprofen 200mg","Ibuprofen 400mg","Ibuprofen 600mg",
  "Brufen 400mg","Brufen 600mg","Brufen Retard 800mg",
  "Aspirin 75mg","Aspirin 150mg","Aspirin 325mg","Ecosprin 75mg","Ecosprin 150mg",
  "Diclofenac 50mg","Diclofenac 100mg","Voveran 50mg","Voveran SR 100mg",
  "Nimesulide 100mg","Nimulid 100mg","Nise 100mg",
  "Aceclofenac 100mg","Zerodol 100mg","Zerodol-P","Zerodol-SP",
  "Tramadol 50mg","Tramazac 50mg",
  "Mefenamic Acid 250mg","Mefenamic Acid 500mg","Ponstan 500mg",
  "Amoxicillin 250mg","Amoxicillin 500mg","Novamox 500mg","Mox 500mg",
  "Amoxicillin + Clavulanate 625mg","Augmentin 625mg","Clavam 625mg",
  "Azithromycin 250mg","Azithromycin 500mg","Azee 500mg","Azithral 500mg",
  "Ciprofloxacin 250mg","Ciprofloxacin 500mg","Cifran 500mg","Ciplox 500mg",
  "Doxycycline 100mg","Doxt-SL 100mg","Doxolin 100mg",
  "Metronidazole 200mg","Metronidazole 400mg","Flagyl 400mg","Metrogyl 400mg",
  "Cefixime 200mg","Taxim-O 200mg","Zifi 200mg","Cefix 200mg",
  "Cefuroxime 250mg","Cefuroxime 500mg","Cefakind 500mg",
  "Ofloxacin 200mg","Ofloxacin 400mg","Zanocin 200mg","Tarivid 400mg",
  "Levofloxacin 250mg","Levofloxacin 500mg","Levoday 500mg",
  "Co-trimoxazole 480mg","Bactrim DS","Septran DS",
  "Clindamycin 150mg","Clindamycin 300mg","Dalacin 300mg",
  "Clarithromycin 250mg","Clarithromycin 500mg","Claribid 500mg",
  "Fluconazole 150mg","Zocon 150mg","Forcan 150mg",
  "Itraconazole 100mg","Itracip 100mg","Canditral 100mg",
  "Acyclovir 200mg","Acyclovir 400mg","Zovirax 400mg","Acivir 400mg",
  "Omeprazole 20mg","Omeprazole 40mg","Omez 20mg","Omez 40mg",
  "Pantoprazole 20mg","Pantoprazole 40mg","Pan 40mg","Pantocid 40mg",
  "Rabeprazole 20mg","Razo 20mg","Rablet 20mg",
  "Esomeprazole 20mg","Esomeprazole 40mg","Neksium 40mg","Raciper 40mg",
  "Ranitidine 150mg","Ranitidine 300mg","Aciloc 150mg","Zinetac 150mg",
  "Famotidine 20mg","Famotidine 40mg","Famocid 40mg",
  "Domperidone 10mg","Vomistop 10mg","Domstal 10mg",
  "Ondansetron 4mg","Ondansetron 8mg","Emeset 4mg","Zofran 8mg",
  "Metoclopramide 10mg","Perinorm 10mg",
  "Gelusil MPS Tablet","Gelusil MPS Syrup","Digene Gel","Digene Tablet",
  "Eno Sachet","Pudin Hara","Hajmola","Antacid Suspension","Mucaine Gel","Gaviscon",
  "Lactulose Syrup 100ml","Cremaffin Syrup","Isabgol Husk",
  "ORS Sachet Electral","Electral Powder","Pedialyte Sachet",
  "Cetirizine 10mg","Cetzine 10mg","Alerid 10mg","Zyrtec 10mg",
  "Loratadine 10mg","Lorfast 10mg","Clarityn 10mg",
  "Fexofenadine 120mg","Fexofenadine 180mg","Allegra 120mg","Allegra 180mg",
  "Levocetrizine 5mg","Levocet 5mg","Xyzal 5mg",
  "Montelukast 5mg","Montelukast 10mg","Montair 10mg","Singulair 10mg",
  "Chlorpheniramine 4mg","Piriton 4mg",
  "Benadryl Cough Syrup","Benadryl DR Syrup","Corex Cough Syrup",
  "Alex Cough Syrup","Ascoril LS Syrup","Ascoril D Syrup","Grilinctus Syrup",
  "Honitus Cough Syrup","Zedex Syrup","Phensedyl Syrup",
  "Vicks Action 500","Coldarin","Sinarest Tablet","Nasivion Nasal Drops",
  "Otrivin Nasal Drops","Nasoclear Spray","Flonase Nasal Spray",
  "Metformin 500mg","Metformin 850mg","Metformin 1000mg","Glycomet 500mg",
  "Glimepiride 1mg","Glimepiride 2mg","Amaryl 2mg","Glimer 1mg",
  "Glibenclamide 5mg","Daonil 5mg",
  "Sitagliptin 50mg","Sitagliptin 100mg","Januvia 100mg","Janumet 50/500",
  "Vildagliptin 50mg","Galvus 50mg","Galvus Met",
  "Pioglitazone 15mg","Pioglitazone 30mg","Actos 30mg","Pioz 15mg",
  "Insulin Glargine","Insulin Regular","Insulin NPH","Mixtard 30",
  "Amlodipine 5mg","Amlodipine 10mg","Norvasc 5mg","Amlong 5mg",
  "Atenolol 25mg","Atenolol 50mg","Tenormin 50mg",
  "Bisoprolol 2.5mg","Bisoprolol 5mg","Concor 5mg","Biselect 5mg",
  "Losartan 25mg","Losartan 50mg","Losartan 100mg","Cozaar 50mg","Losar 50mg",
  "Telmisartan 40mg","Telmisartan 80mg","Telma 40mg","Telmikind 40mg",
  "Ramipril 2.5mg","Ramipril 5mg","Cardace 5mg","Ramistar 5mg",
  "Enalapril 2.5mg","Enalapril 5mg","Envas 5mg",
  "Hydrochlorothiazide 12.5mg","Hydrochlorothiazide 25mg",
  "Furosemide 20mg","Furosemide 40mg","Lasix 40mg","Frusenex 40mg",
  "Clopidogrel 75mg","Plavix 75mg","Clopilet 75mg",
  "Atorvastatin 10mg","Atorvastatin 20mg","Atorvastatin 40mg","Lipitor 20mg","Atorlip 10mg",
  "Rosuvastatin 10mg","Rosuvastatin 20mg","Crestor 10mg","Rozavel 10mg",
  "Levothyroxine 25mcg","Levothyroxine 50mcg","Levothyroxine 100mcg",
  "Thyroxine 50mcg","Eltroxin 50mcg","Thyronorm 50mcg","Thyronorm 100mcg",
  "Vitamin C 500mg","Limcee 500mg","Celin 500mg",
  "Vitamin D3 1000IU","Vitamin D3 2000IU","Vitamin D3 60000IU sachet","Calcirol Sachet",
  "Calcium + Vitamin D3","Shelcal 500mg","Calcimax 500mg","Cipcal 500mg",
  "Zinc 10mg","Zincovit Tablet","Zinconia Tablet",
  "B-Complex Tablet","Neurobion Forte","Polybion","Becosules",
  "Methylcobalamin 500mcg","Methylcobalamin 1500mcg","Nervijen","Mecobal",
  "Multivitamin Tablet","Supradyn","Revital","Centrum",
  "Iron + Folic Acid","Ferrous Sulphate 200mg","Autrin","Orofer XT",
  "Folic Acid 5mg","Dexorange Syrup","Haemolift Syrup","Fish Oil Omega-3",
  "Betadine Solution 100ml","Betadine Ointment","Povidone Iodine Ointment",
  "Savlon Antiseptic Liquid","Dettol Antiseptic",
  "Clotrimazole Cream 1%","Candid Cream","Canesten Cream",
  "Mupirocin Cream 2%","T-Bact Ointment","Bactroban Ointment",
  "Hydrocortisone Cream 1%","Calamine Lotion","Lacto Calamine","Soframycin Cream",
  "Neosporin Cream","Cipladine Ointment",
  "Volini Gel 30g","Volini Spray","Moov Cream","Moov Spray","Iodex Balm",
  "Diclofenac Gel 1%","Voveran Gel","Emugel",
  "Ciprofloxacin Eye Drops 0.3%","Ciplox Eye Drops",
  "Ofloxacin Eye Drops 0.3%","Ocuflox Eye Drops",
  "Tobramycin Eye Drops","Refresh Tears Eye Drops","Systane Eye Drops","I-Lube Eye Drops",
  "Waxsol Ear Drops","Earex Ear Drops",
  "Prednisolone 5mg","Prednisolone 10mg","Wysolone 5mg","Omnacortil 5mg",
  "Dexamethasone 0.5mg","Dexamethasone 4mg","Decadron 0.5mg",
  "Methylprednisolone 4mg","Medrol 4mg","Betamethasone 0.5mg","Betnelan 0.5mg",
  "Salbutamol 2mg","Salbutamol 4mg","Ventolin 2mg","Asthalin 2mg",
  "Salbutamol Inhaler","Asthalin Inhaler","Ventolin Inhaler","Budesonide Inhaler","Budecort Inhaler",
  "Formoterol + Budesonide Inhaler","Foracort Inhaler","Symbicort Inhaler",
  "Theophylline 100mg","Theophylline 200mg","Deriphyllin Tablet",
  "Alprazolam 0.25mg","Alprazolam 0.5mg","Alprax 0.5mg","Restyl 0.5mg",
  "Clonazepam 0.25mg","Clonazepam 0.5mg","Rivotril 0.5mg",
  "Diazepam 2mg","Diazepam 5mg","Valium 5mg","Calmpose 5mg",
  "Zolpidem 5mg","Zolpidem 10mg","Stilnox 10mg","Zolfresh 10mg",
  "Gabapentin 100mg","Gabapentin 300mg","Neurontin 300mg","Gabapin 300mg",
  "Pregabalin 75mg","Pregabalin 150mg","Lyrica 75mg","Pregeb 75mg",
  "Amitriptyline 10mg","Amitriptyline 25mg","Tryptomer 10mg",
  "Sertraline 50mg","Zoloft 50mg","Serlift 50mg",
  "Fluoxetine 20mg","Prozac 20mg","Fludac 20mg",
  "Albendazole 400mg","Bandy 400mg","Zentel 400mg",
  "Mebendazole 100mg","Vermox 100mg","Ivermectin 3mg","Ivermectin 6mg","Ivecop 6mg",
  "Colchicine 0.5mg","Colchicine 1mg",
  "Allopurinol 100mg","Allopurinol 300mg","Zyloric 100mg",
  "Warfarin 1mg","Warfarin 2mg","Warf 2mg",
  "Digoxin 0.25mg","Lanoxin 0.25mg",
  "Burnol Ointment","Silver Sulphadiazine Cream","Silverex Ointment",
  "Glucose Powder","Glucon-D Powder","Oral Rehydration Salts",
].sort();

const LOW_STOCK_THRESHOLD = 10;

const R = {
  bg:"#0a1628", card:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.08)",
  blue:"#1e88e5", blueD:"#1255a0", blueL:"#64b5f6",
  green:"#4ade80", greenD:"#14532d", greenL:"#81c784",
  amber:"#ffb74d", red:"#f87171", orange:"#fb923c",
  muted:"#4a7aaa", text:"#e2eaf6",
};

const fmt  = n => `₹${Number(n||0).toFixed(2)}`;
const pct  = n => `${Number(n||0).toFixed(1)}%`;
const iB   = s => s ? { background:"rgba(0,0,0,0.3)", border:`1px solid ${R.border}`, borderRadius:"10px", padding:"10px 12px", color:"#fff", fontSize:"14px", outline:"none", width:"100%", boxSizing:"border-box" } : {};

export default function App() {
  /* ── state ── */
  const [catalog, setCatalog]     = useState(() => { try { return JSON.parse(localStorage.getItem(CATALOG_KEY)||"{}"); } catch { return {}; } });
  const [customMeds, setCustomMeds] = useState(() => { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)||"[]"); } catch { return []; } });
  const [bills, setBills]         = useState(() => { try { return JSON.parse(localStorage.getItem(BILLS_KEY)||"[]"); } catch { return []; } });
  const [tab, setTab]             = useState("billing");
  const [toast, setToast]         = useState(null);

  // billing
  const [search, setSearch]       = useState("");
  const [sugg, setSugg]           = useState([]);
  const [showSugg, setShowSugg]   = useState(false);
  const [selMed, setSelMed]       = useState(null);
  const [mrp, setMrp]             = useState("");
  const [custDisc, setCustDisc]   = useState("");
  const [qty, setQty]             = useState("1");
  const [cart, setCart]           = useState([]);
  const [selDate, setSelDate]     = useState(getTodayKey());
  const [expandedBill, setExpandedBill] = useState(null);

  // strip calc
  const [stripMrp, setStripMrp]   = useState("");
  const [stripTotal, setStripTotal] = useState("");
  const [stripSell, setStripSell] = useState("");
  const [stripCustDisc, setStripCustDisc] = useState("");
  const [stripResult, setStripResult] = useState(null);
  const [stripMed, setStripMed]   = useState(null);
  const [stripSearch, setStripSearch] = useState("");
  const [stripSugg, setStripSugg] = useState([]);
  const [showStripSugg, setShowStripSugg] = useState(false);

  // catalog form
  const [showForm, setShowForm]   = useState(false);
  const [editName, setEditName]   = useState(null);
  const [fName, setFName]         = useState("");
  const [fMrp, setFMrp]           = useState("");
  const [fRetDisc, setFRetDisc]   = useState("");
  const [fStock, setFStock]       = useState("");
  const [fLowAt, setFLowAt]       = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");

  // CSV
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvError, setCsvError]   = useState("");
  const fileRef = useRef(null);

  const wrapRef  = useRef(null);
  const swrapRef = useRef(null);

  const allMeds = [...new Set([...BASE_MEDICINES, ...customMeds])].sort();

  /* ── persist ── */
  useEffect(() => { localStorage.setItem(BILLS_KEY,   JSON.stringify(bills));    }, [bills]);
  useEffect(() => { localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));  }, [catalog]);
  useEffect(() => { localStorage.setItem(CUSTOM_KEY,  JSON.stringify(customMeds));}, [customMeds]);

  const showToast = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  /* ── search helpers ── */
  const doSearch = (val, all) => {
    if (!val.trim()) return [];
    const q = val.toLowerCase();
    return all.filter(m => m.toLowerCase().includes(q)).slice(0,10);
  };

  const handleSearch = val => {
    setSearch(val); setSelMed(null);
    setSugg(doSearch(val, allMeds));
    setShowSugg(true);
  };

  const handleStripSearch = val => {
    setStripSearch(val); setStripMed(null);
    setStripSugg(doSearch(val, allMeds));
    setShowStripSugg(true);
  };

  const pickMed = name => {
    setSelMed(name); setSearch(name); setShowSugg(false);
    const c = catalog[name];
    setMrp(c?.mrp ? String(c.mrp) : "");
    setCustDisc(""); setQty("1");
  };

  const pickStripMed = name => {
    setStripMed(name); setStripSearch(name); setShowStripSugg(false);
    const c = catalog[name];
    // auto-fill strip MRP from catalog
    if (c?.mrp) setStripMrp(String(c.mrp));
    setStripCustDisc("");
  };

  /* click-outside */
  useEffect(() => {
    const fn = e => {
      if (!wrapRef.current?.contains(e.target))   setShowSugg(false);
      if (!swrapRef.current?.contains(e.target))  setShowStripSugg(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ── billing calc ── */
  const mrpN      = parseFloat(mrp)||0;
  const custDiscN = parseFloat(custDisc)||0;
  const qtyN      = parseInt(qty)||1;
  const catEntry  = selMed ? catalog[selMed] : null;
  const retDiscN  = parseFloat(catEntry?.retailerDisc)||0;
  const costPU    = mrpN>0 ? +(mrpN*(1-retDiscN/100)).toFixed(2) : 0;
  const discAmt   = +(mrpN*custDiscN/100).toFixed(2);
  const salePU    = +(mrpN-discAmt).toFixed(2);
  const totalSale = +(salePU*qtyN).toFixed(2);
  const totalCost = +(costPU*qtyN).toFixed(2);
  const totalDisc = +(discAmt*qtyN).toFixed(2);
  const totalMrpV = +(mrpN*qtyN).toFixed(2);
  const profitAmt = retDiscN>0 ? +(totalSale-totalCost).toFixed(2) : null;
  const profitPct = profitAmt!==null&&totalSale>0 ? +((profitAmt/totalSale)*100).toFixed(1) : null;

  /* stock check */
  const getStock = name => catalog[name]?.stock ?? null;
  const isLow    = name => {
    const c = catalog[name]; if (!c||c.stock==null) return false;
    return c.stock <= (c.lowAt ?? LOW_STOCK_THRESHOLD);
  };

  /* deduct stock on bill save */
  const deductStock = items => {
    setCatalog(prev => {
      const next = { ...prev };
      items.forEach(item => {
        const rawName = item.name.includes("(") ? item.name.split("(")[0].trim() : item.name;
        if (next[rawName]?.stock != null) {
          next[rawName] = { ...next[rawName], stock: Math.max(0, next[rawName].stock - item.qty) };
        }
      });
      return next;
    });
  };

  const addToCart = () => {
    if (!selMed||mrpN<=0) return;
    const stock = getStock(selMed);
    if (stock !== null && stock < qtyN) {
      showToast(`⚠️ Only ${stock} units in stock!`, "err"); return;
    }
    setCart(p=>[...p,{
      id:Date.now(), name:selMed, mrp:mrpN, custDisc:custDiscN, retDisc:retDiscN,
      costPU, salePU, qty:qtyN, totalSale, totalCost, totalDisc, totalMrpV,
      profit:profitAmt,
    }]);
    setSelMed(null); setSearch(""); setMrp(""); setCustDisc(""); setQty("1");
  };

  const cartSum = cart.reduce((a,i)=>({
    mrp:  +(a.mrp  +i.totalMrpV).toFixed(2),
    disc: +(a.disc +i.totalDisc).toFixed(2),
    sale: +(a.sale +i.totalSale).toFixed(2),
    cost: +(a.cost +i.totalCost).toFixed(2),
    profit: i.profit!==null ? +(a.profit+i.profit).toFixed(2) : a.profit,
    hasP: a.hasP||i.profit!==null,
  }), {mrp:0,disc:0,sale:0,cost:0,profit:0,hasP:false});
  const cartPPct = cartSum.hasP&&cartSum.sale>0 ? +((cartSum.profit/cartSum.sale)*100).toFixed(1) : null;

  const saveBill = () => {
    if (!cart.length) return;
    setBills(p=>[{id:Date.now(), date:getTodayKey(), time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), items:cart, ...cartSum},...p]);
    deductStock(cart);
    setCart([]);
    showToast("✅ Bill saved!");
  };

  /* ── strip calc ── */
  const calcStrip = () => {
    const pm = parseFloat(stripMrp); const tt = parseFloat(stripTotal); const ss = parseFloat(stripSell);
    if (!pm||!tt||tt<1) return;
    const perPc = +(pm/tt).toFixed(2);
    const cd    = parseFloat(stripCustDisc)||0;
    const afterDisc = +(perPc*(1-cd/100)*ss).toFixed(2);
    const gross = +(perPc*ss).toFixed(2);
    setStripResult({ perPc, gross, afterDisc, sellPcs:ss, custDisc:cd });
  };

  const addStripToCart = () => {
    if (!stripResult||!stripMed) return;
    const {perPc,afterDisc,gross,sellPcs,custDisc:cd} = stripResult;
    const c2 = catalog[stripMed];
    const rD = parseFloat(c2?.retailerDisc)||0;
    const cPU = +(perPc*(1-rD/100)).toFixed(2);
    const tCost = +(cPU*sellPcs).toFixed(2);
    const prof = rD>0 ? +(afterDisc-tCost).toFixed(2) : null;
    setCart(p=>[...p,{
      id:Date.now(),
      name:`${stripMed} (${sellPcs}/${stripTotal} pcs)`,
      mrp:perPc, custDisc:cd, retDisc:rD,
      costPU:cPU, salePU:+(perPc*(1-cd/100)).toFixed(2), qty:sellPcs,
      totalSale:afterDisc, totalCost:tCost,
      totalDisc:+(gross-afterDisc).toFixed(2),
      totalMrpV:gross, profit:prof,
    }]);
    setStripResult(null); setStripMrp(""); setStripTotal(""); setStripSell(""); setStripCustDisc(""); setStripMed(null); setStripSearch("");
    showToast("✅ Strip sale added to bill"); setTab("billing");
  };

  /* ── catalog CRUD ── */
  const openAddForm = (name="") => {
    setEditName(null); setFName(name); setFMrp(""); setFRetDisc(""); setFStock(""); setFLowAt(""); setShowForm(true);
  };
  const openEditForm = name => {
    const c = catalog[name]||{};
    setEditName(name); setFName(name); setFMrp(c.mrp?String(c.mrp):""); setFRetDisc(c.retailerDisc?String(c.retailerDisc):"");
    setFStock(c.stock!=null?String(c.stock):""); setFLowAt(c.lowAt!=null?String(c.lowAt):"");
    setShowForm(true);
  };
  const saveForm = () => {
    const name = (editName||fName).trim(); if (!name) return;
    const entry = {
      ...(catalog[name]||{}),
      mrp:          parseFloat(fMrp)||null,
      retailerDisc: parseFloat(fRetDisc)||null,
      stock:        fStock!=="" ? parseInt(fStock) : (catalog[name]?.stock??null),
      lowAt:        fLowAt!=="" ? parseInt(fLowAt) : (catalog[name]?.lowAt??null),
    };
    setCatalog(p=>({...p,[name]:entry}));
    if (!BASE_MEDICINES.includes(name)&&!customMeds.includes(name)) setCustomMeds(p=>[...p,name]);
    showToast(`✅ "${name}" saved`);
    setShowForm(false); setEditName(null); setFName(""); setFMrp(""); setFRetDisc(""); setFStock(""); setFLowAt("");
  };
  const removeMed = name => {
    if (!window.confirm(`Remove "${name}" from catalog?`)) return;
    setCustomMeds(p=>p.filter(m=>m!==name));
    setCatalog(p=>{ const c={...p}; delete c[name]; return c; });
    showToast(`🗑️ Removed`);
  };
  const restockMed = (name, amt) => {
    setCatalog(p=>({...p,[name]:{...p[name], stock:(p[name]?.stock??0)+amt}}));
    showToast(`📦 Restocked ${amt} units of ${name}`);
  };

  /* ── CSV import ── */
  const parseCSV = text => {
    const lines = text.trim().split("\n").map(l=>l.trim()).filter(Boolean);
    if (lines.length<2) return null;
    const headers = lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/[^a-z_]/g,"_"));
    // expected: name, mrp, retailer_disc (or margin), stock, low_at
    const rows = [];
    for (let i=1;i<lines.length;i++) {
      const cols = lines[i].split(",").map(c=>c.trim().replace(/^"|"$/g,""));
      const obj = {};
      headers.forEach((h,idx)=>{ obj[h]=cols[idx]||""; });
      const name = obj.name||obj.medicine||obj.medicine_name||obj.drug||"";
      if (!name) continue;
      rows.push({
        name,
        mrp:          parseFloat(obj.mrp)||null,
        retailerDisc: parseFloat(obj.retailer_disc||obj.margin||obj.retailer_margin||obj.disc||0)||null,
        stock:        obj.stock!==""&&obj.stock!==undefined ? parseInt(obj.stock)||null : null,
        lowAt:        obj.low_at!==""&&obj.low_at!==undefined ? parseInt(obj.low_at)||null : null,
      });
    }
    return rows;
  };

  const handleCSV = e => {
    const file = e.target.files[0]; if (!file) return;
    setCsvError(""); setCsvPreview(null);
    const reader = new FileReader();
    reader.onload = ev => {
      const rows = parseCSV(ev.target.result);
      if (!rows||rows.length===0) { setCsvError("Could not parse CSV. Check format below."); return; }
      setCsvPreview(rows);
    };
    reader.readAsText(file);
    e.target.value="";
  };

  const importCSV = () => {
    if (!csvPreview) return;
    const newCat = {...catalog};
    const newCustom = [...customMeds];
    csvPreview.forEach(row => {
      newCat[row.name] = { ...(newCat[row.name]||{}), mrp:row.mrp, retailerDisc:row.retailerDisc, stock:row.stock, lowAt:row.lowAt };
      if (!BASE_MEDICINES.includes(row.name)&&!newCustom.includes(row.name)) newCustom.push(row.name);
    });
    setCatalog(newCat); setCustomMeds(newCustom);
    showToast(`✅ Imported ${csvPreview.length} medicines`);
    setCsvPreview(null);
  };

  const downloadTemplate = () => {
    const csv = "name,mrp,retailer_disc,stock,low_at\nCrocin 500mg,30,20,100,15\nDolo 650mg,32,18,50,10\nAugmentin 625mg,210,15,30,5";
    const blob = new Blob([csv],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download="janta_medicines_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── dashboard ── */
  const dayBills = bills.filter(b=>b.date===selDate);
  const daySum   = dayBills.reduce((a,b)=>({
    rev:  +(a.rev  +b.sale).toFixed(2),
    disc: +(a.disc +b.disc).toFixed(2),
    profit: b.hasP ? +(a.profit+b.profit).toFixed(2) : a.profit,
    hasP: a.hasP||b.hasP,
  }), {rev:0,disc:0,profit:0,hasP:false});
  const dayPPct  = daySum.hasP&&daySum.rev>0 ? +((daySum.profit/daySum.rev)*100).toFixed(1) : null;
  const clearBills = () => { if (!window.confirm(`Delete all ${bills.length} bills?`)) return; setBills([]); localStorage.removeItem(BILLS_KEY); showToast("🗑️ Cleared","err"); };

  /* ── low stock list ── */
  const lowStockItems = Object.entries(catalog).filter(([name,c])=> c.stock!=null && c.stock<=(c.lowAt??LOW_STOCK_THRESHOLD));

  /* ── catalog filtered list ── */
  const catalogEntries = [...new Set([...customMeds,...Object.keys(catalog)])].filter(Boolean)
    .filter(n => !catalogSearch || n.toLowerCase().includes(catalogSearch.toLowerCase()))
    .sort();

  /* ── RENDER ── */
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(155deg,#0a1628 0%,#112240 55%,#0a1628 100%)",fontFamily:"'Segoe UI',system-ui,sans-serif",color:R.text}}>

      {toast && (
        <div style={{position:"fixed",top:66,left:"50%",transform:"translateX(-50%)",background:toast.type==="err"?"#7f1d1d":"#14532d",color:"#fff",padding:"10px 26px",borderRadius:"30px",fontWeight:700,fontSize:"14px",zIndex:999,boxShadow:"0 4px 20px #0008",whiteSpace:"nowrap"}}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{background:"linear-gradient(90deg,#0d3b8e,#1565c0)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 18px #0006",position:"sticky",top:0,zIndex:100}}>
        <div>
          <div style={{fontSize:"18px",fontWeight:800,color:"#fff"}}>💊 Janta Medical</div>
          <div style={{fontSize:"10px",color:"#90caf9",letterSpacing:"2px"}}>&amp; GENERAL STORE</div>
        </div>
        <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
          {[["billing","🧾 Billing"],["strip","✂️ Strip"],["dashboard","📊 Dashboard"],["medicines","💊 Catalog"],["stock","📦 Stock"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"6px 11px",borderRadius:"20px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"11px",background:tab===id?"#fff":"rgba(255,255,255,0.12)",color:tab===id?"#0d47a1":"#fff",position:"relative"}}>
              {lbl}
              {id==="stock"&&lowStockItems.length>0&&<span style={{position:"absolute",top:"-4px",right:"-4px",background:"#ef4444",color:"#fff",borderRadius:"50%",width:"16px",height:"16px",fontSize:"9px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{lowStockItems.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ─── BILLING ─── */}
      {tab==="billing" && (
        <div style={{padding:"16px",maxWidth:"900px",margin:"0 auto"}}>

          {/* Low stock warning banner */}
          {lowStockItems.length>0&&(
            <div onClick={()=>setTab("stock")} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",borderRadius:"12px",padding:"10px 16px",marginBottom:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"18px"}}>🔴</span>
              <span style={{fontSize:"13px",color:"#fca5a5",fontWeight:600}}>{lowStockItems.length} medicine{lowStockItems.length>1?"s":""} running low — tap to view</span>
            </div>
          )}

          {/* Search */}
          <div ref={wrapRef} style={{position:"relative",marginBottom:"14px"}}>
            <div style={{background:R.card,border:`1px solid ${R.border}`,borderRadius:"14px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px"}}>
              <span>🔍</span>
              <input value={search} onChange={e=>handleSearch(e.target.value)} onFocus={()=>sugg.length&&setShowSugg(true)}
                placeholder="Search medicine… e.g. Crocin, Dolo, Pan 40"
                style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:"15px",color:R.text}} />
              {search&&<button onClick={()=>{setSearch("");setSelMed(null);setSugg([]);setShowSugg(false);}} style={{background:"none",border:"none",color:R.muted,cursor:"pointer",fontSize:"20px"}}>×</button>}
            </div>
            {showSugg&&sugg.length>0&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#16304f",border:`1px solid ${R.border}`,borderRadius:"12px",boxShadow:"0 8px 30px #0009",zIndex:60,overflow:"hidden",maxHeight:"300px",overflowY:"auto"}}>
                {sugg.map((s,i)=>{
                  const c=catalog[s]; const low=isLow(s);
                  return (
                    <div key={i} onClick={()=>pickMed(s)} style={{padding:"10px 16px",cursor:"pointer",fontSize:"14px",borderBottom:`1px solid ${R.border}`,display:"flex",alignItems:"center",gap:"8px"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(21,101,192,0.2)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <span>{customMeds.includes(s)?"⭐":"💊"}</span>
                      <span style={{flex:1}}>{s}</span>
                      {c?.mrp&&<span style={{fontSize:"11px",color:R.blueL,background:"rgba(21,101,192,0.15)",padding:"2px 7px",borderRadius:"8px"}}>{fmt(c.mrp)}</span>}
                      {c?.stock!=null&&<span style={{fontSize:"11px",color:low?"#fca5a5":R.greenL,background:low?"rgba(239,68,68,0.15)":"rgba(74,222,128,0.1)",padding:"2px 7px",borderRadius:"8px"}}>{low?"🔴":""} {c.stock} left</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {search.length>1&&sugg.length===0&&(
              <div style={{background:"#16304f",border:`1px solid ${R.border}`,borderRadius:"12px",padding:"14px 16px",marginTop:"4px"}}>
                <div style={{fontSize:"13px",color:R.muted,marginBottom:"10px"}}>No medicine found for "{search}"</div>
                <button onClick={()=>{openAddForm(search);setTab("medicines");setShowSugg(false);}}
                  style={{background:"rgba(21,101,192,0.25)",border:"1px solid rgba(21,101,192,0.5)",borderRadius:"8px",padding:"8px 14px",color:R.blueL,cursor:"pointer",fontWeight:600,fontSize:"13px",width:"100%"}}>
                  ➕ Add "{search}" to catalog
                </button>
              </div>
            )}
          </div>

          {/* Entry form */}
          {selMed&&(
            <div style={{background:"rgba(21,101,192,0.1)",border:"1px solid rgba(21,101,192,0.3)",borderRadius:"16px",padding:"16px",marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"6px"}}>
                <span style={{fontWeight:700,color:R.blueL,fontSize:"15px"}}>💊 {selMed}</span>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  {catEntry?.mrp&&<span style={{fontSize:"11px",color:R.blueL,background:"rgba(21,101,192,0.15)",padding:"3px 9px",borderRadius:"10px"}}>MRP auto-filled</span>}
                  {catEntry?.retailerDisc&&<span style={{fontSize:"11px",color:R.amber,background:"rgba(251,140,0,0.12)",padding:"3px 9px",borderRadius:"10px"}}>{catEntry.retailerDisc}% margin</span>}
                  {catEntry?.stock!=null&&<span style={{fontSize:"11px",color:isLow(selMed)?"#fca5a5":R.greenL,background:isLow(selMed)?"rgba(239,68,68,0.15)":"rgba(74,222,128,0.1)",padding:"3px 9px",borderRadius:"10px"}}>{catEntry.stock} in stock{isLow(selMed)?" 🔴":""}</span>}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"14px"}}>
                {[
                  {lbl:"MRP (₹) *",val:mrp,set:setMrp,ph:"120",hint:catEntry?.mrp?"From catalog":""},
                  {lbl:"Customer Disc (%)",val:custDisc,set:setCustDisc,ph:"10",hint:"Discount given to customer"},
                  {lbl:"Qty",val:qty,set:setQty,ph:"1",hint:catEntry?.stock!=null?`Max: ${catEntry.stock}`:""},
                ].map(f=>(
                  <div key={f.lbl}>
                    <div style={{fontSize:"11px",color:R.muted,marginBottom:"5px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.4px"}}>{f.lbl}</div>
                    <input type="number" min="0" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{...iB(true)}} />
                    {f.hint&&<div style={{fontSize:"10px",color:"#2a4a60",marginTop:"3px"}}>{f.hint}</div>}
                  </div>
                ))}
              </div>

              {mrpN>0&&(
                <div style={{background:"rgba(0,0,0,0.25)",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px"}}>
                  <div style={{display:"grid",gridTemplateColumns:`repeat(${profitAmt!==null?6:4},1fr)`,gap:"8px",textAlign:"center"}}>
                    {[
                      {lbl:"MRP Total",val:fmt(totalMrpV),col:"#7a9ec0",strike:custDiscN>0},
                      {lbl:`Disc ${custDiscN}%`,val:custDiscN>0?`−${fmt(totalDisc)}`:"—",col:R.amber},
                      {lbl:"Sale/Unit",val:fmt(salePU),col:R.blueL},
                      {lbl:"Customer Pays",val:fmt(totalSale),col:R.greenL,big:true},
                      ...(profitAmt!==null?[
                        {lbl:"Your Cost",val:fmt(totalCost),col:R.red},
                        {lbl:`Profit ${pct(profitPct)}`,val:fmt(profitAmt),col:profitAmt>=0?R.green:R.red,big:true},
                      ]:[]),
                    ].map(s=>(
                      <div key={s.lbl} style={{padding:"9px 4px",background:"rgba(255,255,255,0.03)",borderRadius:"10px"}}>
                        <div style={{fontSize:"10px",color:"#3a5a7a",textTransform:"uppercase",marginBottom:"3px"}}>{s.lbl}</div>
                        <div style={{fontSize:s.big?"19px":"14px",fontWeight:800,color:s.col,textDecoration:s.strike?"line-through":"none",textDecorationColor:"#3a5a7a"}}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  {retDiscN===0&&<div style={{fontSize:"11px",color:"#2a4a60",marginTop:"8px",textAlign:"center"}}>💡 Set retailer margin in Catalog to see profit automatically</div>}
                </div>
              )}

              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={addToCart} disabled={mrpN<=0} style={{flex:1,padding:"12px",background:mrpN>0?`linear-gradient(135deg,${R.blueD},${R.blue})`:R.card,border:"none",borderRadius:"10px",color:mrpN>0?"#fff":R.muted,fontWeight:700,fontSize:"15px",cursor:mrpN>0?"pointer":"not-allowed"}}>➕ Add to Bill</button>
                <button onClick={()=>{setTab("strip");setStripMed(selMed);setStripSearch(selMed);const c=catalog[selMed];if(c?.mrp)setStripMrp(String(c.mrp));}} style={{padding:"12px 13px",background:"rgba(251,140,0,0.15)",border:"1px solid rgba(251,140,0,0.3)",borderRadius:"10px",color:R.amber,cursor:"pointer",fontSize:"12px",fontWeight:600,whiteSpace:"nowrap"}}>✂️ Strip</button>
                <button onClick={()=>{setSelMed(null);setSearch("");}} style={{padding:"12px 15px",background:R.card,border:`1px solid ${R.border}`,borderRadius:"10px",color:R.muted,cursor:"pointer",fontSize:"18px"}}>×</button>
              </div>
            </div>
          )}

          {/* Cart */}
          {cart.length>0&&(
            <div style={{background:R.card,border:`1px solid ${R.border}`,borderRadius:"16px",overflow:"hidden",marginBottom:"14px"}}>
              <div style={{padding:"11px 16px",background:"rgba(21,101,192,0.2)",fontWeight:700,fontSize:"13px"}}>🛒 Bill Items ({cart.length})</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                  <thead><tr style={{background:"rgba(0,0,0,0.2)"}}>
                    {["Medicine","MRP","Disc%","Sale/Unit","Qty","Amount","Profit",""].map(h=>(
                      <th key={h} style={{padding:"8px 10px",textAlign:"left",color:R.muted,fontSize:"11px",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {cart.map((item,i)=>(
                      <tr key={item.id} style={{borderTop:`1px solid ${R.border}`,background:i%2?"rgba(255,255,255,0.01)":"transparent"}}>
                        <td style={{padding:"9px 10px",fontWeight:600,maxWidth:"200px"}}>{item.name}</td>
                        <td style={{padding:"9px 10px",color:"#7a9ec0"}}>{fmt(item.mrp)}</td>
                        <td style={{padding:"9px 10px",color:R.amber}}>{item.custDisc>0?`${item.custDisc}%`:"—"}</td>
                        <td style={{padding:"9px 10px",color:R.blueL}}>{fmt(item.salePU)}</td>
                        <td style={{padding:"9px 10px"}}>{item.qty}</td>
                        <td style={{padding:"9px 10px",fontWeight:700,color:R.greenL}}>{fmt(item.totalSale)}</td>
                        <td style={{padding:"9px 10px"}}>{item.profit!==null?<span style={{color:item.profit>=0?R.green:R.red,fontWeight:700}}>{fmt(item.profit)}</span>:<span style={{color:"#2a4a60",fontSize:"11px"}}>—</span>}</td>
                        <td style={{padding:"9px 10px"}}><button onClick={()=>setCart(p=>p.filter(x=>x.id!==item.id))} style={{background:"rgba(220,38,38,0.15)",border:"1px solid rgba(220,38,38,0.3)",color:"#fca5a5",borderRadius:"6px",padding:"3px 9px",cursor:"pointer",fontSize:"12px"}}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"12px 16px",borderTop:"2px solid rgba(21,101,192,0.3)",background:"rgba(0,0,0,0.2)",display:"flex",justifyContent:"flex-end",gap:"20px",flexWrap:"wrap",alignItems:"center"}}>
                <div style={{textAlign:"right"}}><div style={{fontSize:"11px",color:R.muted}}>TOTAL MRP</div><div style={{fontSize:"15px",fontWeight:700,color:R.muted,textDecoration:"line-through"}}>{fmt(cartSum.mrp)}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:"11px",color:R.muted}}>DISCOUNT</div><div style={{fontSize:"15px",fontWeight:700,color:R.amber}}>−{fmt(cartSum.disc)}</div></div>
                {cartSum.hasP&&<div style={{textAlign:"right"}}><div style={{fontSize:"11px",color:R.muted}}>PROFIT{cartPPct!==null?` (${pct(cartPPct)})`:""}</div><div style={{fontSize:"20px",fontWeight:800,color:cartSum.profit>=0?R.green:R.red}}>{fmt(cartSum.profit)}</div></div>}
                <div style={{textAlign:"right"}}><div style={{fontSize:"11px",color:R.muted}}>CUSTOMER PAYS</div><div style={{fontSize:"28px",fontWeight:900,color:R.greenL}}>{fmt(cartSum.sale)}</div></div>
              </div>
              <div style={{padding:"0 16px 16px"}}>
                <button onClick={saveBill} style={{width:"100%",padding:"13px",background:`linear-gradient(135deg,${R.greenD},#16a34a)`,border:"none",borderRadius:"12px",color:"#fff",fontWeight:800,fontSize:"15px",cursor:"pointer"}}>✅ Save Bill</button>
              </div>
            </div>
          )}

          {!cart.length&&!selMed&&(
            <div style={{textAlign:"center",padding:"50px 20px"}}>
              <div style={{fontSize:"50px"}}>💊</div>
              <div style={{fontSize:"16px",fontWeight:600,marginTop:"12px",color:"#3a6080"}}>Search a medicine to start billing</div>
              <div style={{fontSize:"12px",marginTop:"6px",color:"#2a4a60"}}>Add medicines with MRP + margin in Catalog → auto-fills here</div>
            </div>
          )}
        </div>
      )}

      {/* ─── STRIP CALC ─── */}
      {tab==="strip"&&(
        <div style={{padding:"16px",maxWidth:"600px",margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:"17px",color:R.amber,marginBottom:"6px"}}>✂️ Strip / Pack Cutting Calculator</div>
          <div style={{fontSize:"13px",color:R.muted,marginBottom:"18px"}}>Sell individual tablets from a pack — MRP and margin auto-fill from catalog.</div>

          <div ref={swrapRef} style={{position:"relative",marginBottom:"14px"}}>
            <div style={{background:R.card,border:`1px solid ${R.border}`,borderRadius:"14px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px"}}>
              <span>🔍</span>
              <input value={stripSearch} onChange={e=>handleStripSearch(e.target.value)} onFocus={()=>stripSugg.length&&setShowStripSugg(true)}
                placeholder="Search medicine for strip sale…"
                style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:"15px",color:R.text}} />
              {stripSearch&&<button onClick={()=>{setStripSearch("");setStripMed(null);setStripSugg([]);setShowStripSugg(false);setStripMrp("");}} style={{background:"none",border:"none",color:R.muted,cursor:"pointer",fontSize:"20px"}}>×</button>}
            </div>
            {showStripSugg&&stripSugg.length>0&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#16304f",border:`1px solid ${R.border}`,borderRadius:"12px",boxShadow:"0 8px 30px #0009",zIndex:60,overflow:"hidden",maxHeight:"260px",overflowY:"auto"}}>
                {stripSugg.map((s,i)=>{
                  const c=catalog[s];
                  return (
                    <div key={i} onClick={()=>pickStripMed(s)} style={{padding:"10px 16px",cursor:"pointer",fontSize:"14px",borderBottom:`1px solid ${R.border}`,display:"flex",gap:"8px",alignItems:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(21,101,192,0.2)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      💊 <span style={{flex:1}}>{s}</span>
                      {c?.mrp&&<span style={{fontSize:"11px",color:R.blueL}}>MRP {fmt(c.mrp)} ✓ auto-fill</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {stripMed&&<div style={{background:"rgba(21,101,192,0.1)",border:"1px solid rgba(21,101,192,0.3)",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",fontSize:"14px",fontWeight:600,color:R.blueL,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>💊 {stripMed}</span>
            {catalog[stripMed]?.mrp&&<span style={{fontSize:"11px",color:R.amber}}>MRP auto-filled from catalog ✓</span>}
          </div>}

          <div style={{background:R.card,border:`1px solid ${R.border}`,borderRadius:"16px",padding:"18px",marginBottom:"14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
              {[
                {lbl:"Pack / Strip MRP (₹)",val:stripMrp,set:setStripMrp,ph:"60",hint:"Auto-filled if in catalog"},
                {lbl:"Total Tablets in Pack",val:stripTotal,set:setStripTotal,ph:"10",hint:"e.g. 10 per strip"},
                {lbl:"Tablets Customer Wants",val:stripSell,set:setStripSell,ph:"2",hint:"How many to sell"},
                {lbl:"Customer Discount (%)",val:stripCustDisc,set:setStripCustDisc,ph:"0",hint:"Optional discount"},
              ].map(f=>(
                <div key={f.lbl}>
                  <div style={{fontSize:"11px",color:R.muted,marginBottom:"5px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.4px"}}>{f.lbl}</div>
                  <input type="number" min="0" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{...iB(true)}} />
                  <div style={{fontSize:"10px",color:"#2a4a60",marginTop:"3px"}}>{f.hint}</div>
                </div>
              ))}
            </div>

            <button onClick={calcStrip} disabled={!stripMrp||!stripTotal} style={{width:"100%",padding:"12px",background:stripMrp&&stripTotal?`linear-gradient(135deg,#92400e,${R.amber})`:"rgba(255,255,255,0.06)",border:"none",borderRadius:"10px",color:stripMrp&&stripTotal?"#fff":R.muted,fontWeight:700,fontSize:"15px",cursor:stripMrp&&stripTotal?"pointer":"not-allowed",marginBottom:"14px"}}>
              Calculate ✂️
            </button>

            {stripResult&&(
              <div style={{background:"rgba(251,140,0,0.08)",border:"1px solid rgba(251,140,0,0.3)",borderRadius:"12px",padding:"16px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",textAlign:"center",marginBottom:"14px"}}>
                  {[
                    {lbl:"Per Tablet MRP",val:fmt(stripResult.perPc),col:R.blueL},
                    {lbl:`${stripResult.sellPcs} Tabs (MRP)`,val:fmt(stripResult.gross),col:R.greenL},
                    {lbl:"Customer Pays",val:fmt(stripResult.afterDisc),col:R.green,big:true},
                  ].map(s=>(
                    <div key={s.lbl} style={{background:"rgba(0,0,0,0.2)",borderRadius:"10px",padding:"12px 8px"}}>
                      <div style={{fontSize:"10px",color:R.muted,textTransform:"uppercase",marginBottom:"4px"}}>{s.lbl}</div>
                      <div style={{fontSize:s.big?"22px":"16px",fontWeight:800,color:s.col}}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <button onClick={addStripToCart} disabled={!stripMed} style={{width:"100%",padding:"11px",background:stripMed?`linear-gradient(135deg,${R.blueD},${R.blue})`:R.card,border:"none",borderRadius:"10px",color:stripMed?"#fff":R.muted,fontWeight:700,cursor:stripMed?"pointer":"not-allowed",fontSize:"14px"}}>
                  {stripMed?`➕ Add to Bill`:"⬆️ Search a medicine above first"}
                </button>
              </div>
            )}
          </div>

          <div style={{background:"rgba(251,140,0,0.06)",border:"1px solid rgba(251,140,0,0.2)",borderRadius:"12px",padding:"14px 16px",fontSize:"12px",color:R.muted,lineHeight:"1.8"}}>
            <strong style={{color:R.amber}}>Example:</strong> Diclogem 10-pack MRP ₹60 → each tablet ₹6.00 · Customer wants 2 → charge ₹12.00
          </div>
        </div>
      )}

      {/* ─── DASHBOARD ─── */}
      {tab==="dashboard"&&(
        <div style={{padding:"16px",maxWidth:"900px",margin:"0 auto"}}>
          <div style={{display:"flex",gap:"10px",marginBottom:"16px"}}>
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
              style={{flex:1,background:R.card,border:`1px solid ${R.border}`,borderRadius:"12px",padding:"11px 14px",color:R.text,fontSize:"14px",outline:"none"}} />
            <button onClick={()=>setSelDate(getTodayKey())} style={{padding:"11px 16px",background:"rgba(21,101,192,0.2)",border:"1px solid rgba(21,101,192,0.4)",borderRadius:"12px",color:R.blueL,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>Today</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px",marginBottom:"16px"}}>
            {[
              {lbl:"Revenue Collected",val:fmt(daySum.rev),icon:"💰",bg:"rgba(21,101,192,0.15)",border:"rgba(21,101,192,0.4)",col:R.blueL},
              {lbl:"Discounts Given",val:fmt(daySum.disc),icon:"🎁",bg:"rgba(251,140,0,0.1)",border:"rgba(251,140,0,0.35)",col:R.amber},
              {lbl:daySum.hasP?`Profit Earned${dayPPct!==null?` (${pct(dayPPct)})`:""}`:  "Profit Earned",val:daySum.hasP?fmt(daySum.profit):"—",icon:daySum.profit>=0?"📈":"📉",bg:daySum.hasP?(daySum.profit>=0?"rgba(74,222,128,0.08)":"rgba(248,113,113,0.08)"):"rgba(0,0,0,0.15)",border:daySum.hasP?(daySum.profit>=0?"rgba(74,222,128,0.3)":"rgba(248,113,113,0.3)"):R.border,col:daySum.hasP?(daySum.profit>=0?R.green:R.red):"#2a4a60",note:!daySum.hasP?"Set retailer margin in Catalog to track profit":null},
              {lbl:"Bills Today",val:dayBills.length,icon:"🧾",bg:"rgba(22,163,74,0.1)",border:"rgba(22,163,74,0.35)",col:R.greenL},
            ].map(s=>(
              <div key={s.lbl} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:"16px",padding:"16px"}}>
                <div style={{fontSize:"26px"}}>{s.icon}</div>
                <div style={{fontSize:"11px",color:R.muted,textTransform:"uppercase",letterSpacing:"0.8px",marginTop:"8px"}}>{s.lbl}</div>
                <div style={{fontSize:"26px",fontWeight:800,color:s.col,marginTop:"4px"}}>{s.val}</div>
                {s.note&&<div style={{fontSize:"11px",color:"#2a4a60",marginTop:"4px"}}>{s.note}</div>}
              </div>
            ))}
          </div>
          <div style={{fontWeight:700,fontSize:"13px",color:R.muted,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.5px"}}>
            Bills — {new Date(selDate+"T12:00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </div>
          {dayBills.length===0
            ?<div style={{textAlign:"center",padding:"36px",color:"#2a4a60"}}><div style={{fontSize:"34px"}}>📋</div><div style={{marginTop:"8px"}}>No bills for this date</div></div>
            :<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {dayBills.map((bill,idx)=>(
                <div key={bill.id} style={{background:R.card,border:`1px solid ${R.border}`,borderRadius:"14px",overflow:"hidden"}}>
                  <div onClick={()=>setExpandedBill(expandedBill===bill.id?null:bill.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",cursor:"pointer",background:"rgba(21,101,192,0.1)"}}>
                    <div><span style={{fontWeight:700,color:R.blueL}}>Bill #{dayBills.length-idx}</span><span style={{fontSize:"12px",color:R.muted,marginLeft:"8px"}}>{bill.time} · {bill.items.length} item{bill.items.length>1?"s":""}</span></div>
                    <div style={{display:"flex",gap:"14px",alignItems:"center"}}>
                      {bill.disc>0&&<div style={{textAlign:"right"}}><div style={{fontSize:"10px",color:R.muted}}>Discount</div><div style={{fontWeight:700,color:R.amber,fontSize:"13px"}}>−{fmt(bill.disc)}</div></div>}
                      {bill.hasP&&<div style={{textAlign:"right"}}><div style={{fontSize:"10px",color:R.muted}}>Profit</div><div style={{fontWeight:700,color:bill.profit>=0?R.green:R.red,fontSize:"14px"}}>{fmt(bill.profit)}</div></div>}
                      <div style={{textAlign:"right"}}><div style={{fontSize:"10px",color:R.muted}}>Collected</div><div style={{fontWeight:800,color:R.greenL,fontSize:"16px"}}>{fmt(bill.sale)}</div></div>
                      <span style={{color:R.muted}}>{expandedBill===bill.id?"▲":"▼"}</span>
                    </div>
                  </div>
                  {expandedBill===bill.id&&(
                    <div style={{padding:"10px 14px"}}>
                      {bill.items.map((it,j)=>(
                        <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${R.border}`,fontSize:"13px",flexWrap:"wrap",gap:"4px"}}>
                          <span style={{fontWeight:600}}>{it.name}</span>
                          <span style={{color:R.muted}}>×{it.qty} @ {fmt(it.mrp)}{it.custDisc>0&&<span style={{color:R.amber}}> −{it.custDisc}%</span>} = <strong style={{color:R.greenL}}>{fmt(it.totalSale)}</strong>{it.profit!==null&&<span style={{color:it.profit>=0?R.green:R.red}}> · profit {fmt(it.profit)}</span>}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          }
          {bills.length>0&&<button onClick={clearBills} style={{marginTop:"18px",width:"100%",padding:"11px",background:"rgba(127,29,29,0.2)",border:"1px solid rgba(220,38,38,0.35)",borderRadius:"10px",color:"#fca5a5",cursor:"pointer",fontSize:"13px",fontWeight:600}}>🗑️ Clear All Bills ({bills.length} total)</button>}
        </div>
      )}

      {/* ─── CATALOG ─── */}
      {tab==="medicines"&&(
        <div style={{padding:"16px",maxWidth:"900px",margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexWrap:"wrap",gap:"10px"}}>
            <div>
              <div style={{fontWeight:800,fontSize:"16px",color:R.blueL}}>💊 Medicine Catalog</div>
              <div style={{fontSize:"12px",color:R.muted,marginTop:"2px"}}>{Object.keys(catalog).length} medicines saved</div>
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={downloadTemplate} style={{padding:"8px 14px",background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:"10px",color:R.greenL,cursor:"pointer",fontWeight:600,fontSize:"12px"}}>⬇️ CSV Template</button>
              <button onClick={()=>fileRef.current.click()} style={{padding:"8px 14px",background:"rgba(21,101,192,0.2)",border:"1px solid rgba(21,101,192,0.4)",borderRadius:"10px",color:R.blueL,cursor:"pointer",fontWeight:600,fontSize:"12px"}}>📂 Import CSV</button>
              <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} style={{display:"none"}} />
              <button onClick={()=>openAddForm()} style={{padding:"8px 14px",background:`linear-gradient(135deg,${R.blueD},${R.blue})`,border:"none",borderRadius:"10px",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:"12px"}}>➕ Add Medicine</button>
            </div>
          </div>

          {/* CSV Preview */}
          {csvPreview&&(
            <div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:"14px",padding:"16px",marginBottom:"16px"}}>
              <div style={{fontWeight:700,color:R.greenL,marginBottom:"10px"}}>📋 CSV Preview — {csvPreview.length} medicines ready to import</div>
              <div style={{maxHeight:"200px",overflowY:"auto",marginBottom:"12px"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                  <thead><tr style={{background:"rgba(0,0,0,0.2)"}}>
                    {["Medicine","MRP","Retailer Disc%","Stock","Low At"].map(h=><th key={h} style={{padding:"6px 10px",textAlign:"left",color:R.muted,fontSize:"11px"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {csvPreview.slice(0,20).map((r,i)=>(
                      <tr key={i} style={{borderTop:`1px solid ${R.border}`}}>
                        <td style={{padding:"6px 10px",fontWeight:600}}>{r.name}</td>
                        <td style={{padding:"6px 10px",color:R.blueL}}>{r.mrp?fmt(r.mrp):"—"}</td>
                        <td style={{padding:"6px 10px",color:R.amber}}>{r.retailerDisc?`${r.retailerDisc}%`:"—"}</td>
                        <td style={{padding:"6px 10px",color:R.greenL}}>{r.stock??"—"}</td>
                        <td style={{padding:"6px 10px",color:R.red}}>{r.lowAt??"—"}</td>
                      </tr>
                    ))}
                    {csvPreview.length>20&&<tr><td colSpan={5} style={{padding:"8px 10px",color:R.muted,fontSize:"12px"}}>...and {csvPreview.length-20} more</td></tr>}
                  </tbody>
                </table>
              </div>
              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={importCSV} style={{flex:1,padding:"10px",background:`linear-gradient(135deg,${R.greenD},#16a34a)`,border:"none",borderRadius:"10px",color:"#fff",fontWeight:700,cursor:"pointer"}}>✅ Import All {csvPreview.length} Medicines</button>
                <button onClick={()=>setCsvPreview(null)} style={{padding:"10px 16px",background:R.card,border:`1px solid ${R.border}`,borderRadius:"10px",color:R.muted,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          )}
          {csvError&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"10px",padding:"12px 16px",marginBottom:"14px",color:"#fca5a5",fontSize:"13px"}}>⚠️ {csvError}</div>}

          {/* CSV Format guide */}
          <div style={{background:"rgba(21,101,192,0.06)",border:`1px solid rgba(21,101,192,0.2)`,borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",fontSize:"12px",color:R.muted,lineHeight:"1.8"}}>
            <strong style={{color:R.blueL}}>📄 CSV Format:</strong> Columns — <code style={{color:R.amber,background:"rgba(0,0,0,0.2)",padding:"1px 6px",borderRadius:"4px"}}>name, mrp, retailer_disc, stock, low_at</code>
            <br/>Example row: <code style={{color:"#ccc",background:"rgba(0,0,0,0.2)",padding:"1px 6px",borderRadius:"4px"}}>Crocin 500mg, 30, 20, 100, 15</code>
            <br/>Download the template above to get started quickly.
          </div>

          {/* Add/Edit form */}
          {showForm&&(
            <div style={{background:"rgba(21,101,192,0.1)",border:"1px solid rgba(21,101,192,0.35)",borderRadius:"16px",padding:"18px",marginBottom:"18px"}}>
              <div style={{fontWeight:700,color:R.blueL,marginBottom:"14px",fontSize:"15px"}}>{editName?`✏️ Edit: ${editName}`:"➕ Add New Medicine"}</div>
              <div style={{display:"grid",gridTemplateColumns:editName?"1fr 1fr 1fr 1fr 1fr":"2fr 1fr 1fr 1fr 1fr",gap:"12px",marginBottom:"14px"}}>
                {!editName&&(
                  <div>
                    <div style={{fontSize:"11px",color:R.muted,marginBottom:"5px",fontWeight:600,textTransform:"uppercase"}}>Medicine Name *</div>
                    <input value={fName} onChange={e=>setFName(e.target.value)} placeholder="e.g. Diclogem 50mg" style={{...iB(true)}} />
                  </div>
                )}
                {[
                  {lbl:"MRP (₹)",val:fMrp,set:setFMrp,ph:"60",hint:"Printed on pack"},
                  {lbl:"Retailer Margin %",val:fRetDisc,set:setFRetDisc,ph:"20",hint:"Your purchase discount"},
                  {lbl:"Stock (units)",val:fStock,set:setFStock,ph:"100",hint:"Current qty in store"},
                  {lbl:"Alert Below",val:fLowAt,set:setFLowAt,ph:"10",hint:"Show red warning"},
                ].map(f=>(
                  <div key={f.lbl}>
                    <div style={{fontSize:"11px",color:R.muted,marginBottom:"5px",fontWeight:600,textTransform:"uppercase"}}>{f.lbl}</div>
                    <input type="number" min="0" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{...iB(true)}} />
                    <div style={{fontSize:"10px",color:"#2a4a60",marginTop:"3px"}}>{f.hint}</div>
                  </div>
                ))}
              </div>
              {fMrp&&fRetDisc&&(
                <div style={{background:"rgba(0,0,0,0.2)",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",display:"flex",gap:"20px",flexWrap:"wrap"}}>
                  {(()=>{const m=parseFloat(fMrp);const r=parseFloat(fRetDisc);const c=+(m*(1-r/100)).toFixed(2);return[
                    {lbl:"MRP",val:fmt(m),col:R.blueL},{lbl:"Your Cost",val:fmt(c),col:R.red},
                    {lbl:"Max Profit/Unit",val:fmt(+(m-c).toFixed(2)),col:R.green},{lbl:"Margin",val:pct(r),col:R.amber},
                  ].map(s=><div key={s.lbl} style={{textAlign:"center"}}><div style={{fontSize:"10px",color:R.muted,textTransform:"uppercase"}}>{s.lbl}</div><div style={{fontSize:"18px",fontWeight:800,color:s.col}}>{s.val}</div></div>);})()}
                </div>
              )}
              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={saveForm} style={{flex:1,padding:"11px",background:`linear-gradient(135deg,${R.blueD},${R.blue})`,border:"none",borderRadius:"10px",color:"#fff",fontWeight:700,cursor:"pointer"}}>💾 Save</button>
                <button onClick={()=>{setShowForm(false);setEditName(null);}} style={{padding:"11px 16px",background:R.card,border:`1px solid ${R.border}`,borderRadius:"10px",color:R.muted,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          )}

          {/* Search catalog */}
          <input value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="🔍 Filter catalog…"
            style={{width:"100%",background:R.card,border:`1px solid ${R.border}`,borderRadius:"12px",padding:"10px 14px",color:R.text,fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"12px"}} />

          {catalogEntries.length===0
            ?<div style={{textAlign:"center",padding:"40px",color:"#2a4a60"}}><div style={{fontSize:"36px"}}>📋</div><div style={{marginTop:"10px",color:R.muted}}>No medicines in catalog</div><div style={{fontSize:"12px",marginTop:"6px",color:"#2a4a60"}}>Add medicines above or import a CSV</div></div>
            :<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {catalogEntries.map((name,i)=>{
                const c=catalog[name]||{};
                const cost=c.mrp&&c.retailerDisc?+(c.mrp*(1-c.retailerDisc/100)).toFixed(2):null;
                const low=isLow(name);
                return(
                  <div key={i} style={{background:R.card,border:`1px solid ${low?"rgba(239,68,68,0.4)":R.border}`,borderRadius:"12px",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                        {customMeds.includes(name)?"⭐":"💊"} {name}
                        {low&&<span style={{background:"rgba(239,68,68,0.2)",color:"#fca5a5",fontSize:"10px",padding:"2px 8px",borderRadius:"8px",fontWeight:700}}>🔴 LOW STOCK</span>}
                      </div>
                      <div style={{display:"flex",gap:"8px",marginTop:"5px",flexWrap:"wrap"}}>
                        {c.mrp&&<span style={{fontSize:"11px",color:R.blueL,background:"rgba(21,101,192,0.15)",padding:"2px 7px",borderRadius:"7px"}}>MRP {fmt(c.mrp)}</span>}
                        {c.retailerDisc&&<span style={{fontSize:"11px",color:R.amber,background:"rgba(251,140,0,0.1)",padding:"2px 7px",borderRadius:"7px"}}>{c.retailerDisc}% margin</span>}
                        {cost&&<span style={{fontSize:"11px",color:R.red,background:"rgba(248,113,113,0.1)",padding:"2px 7px",borderRadius:"7px"}}>Cost {fmt(cost)}</span>}
                        {c.stock!=null&&<span style={{fontSize:"11px",color:low?"#fca5a5":R.greenL,background:low?"rgba(239,68,68,0.12)":"rgba(74,222,128,0.1)",padding:"2px 7px",borderRadius:"7px"}}>📦 {c.stock} in stock</span>}
                        {c.lowAt!=null&&<span style={{fontSize:"11px",color:R.muted,background:"rgba(0,0,0,0.2)",padding:"2px 7px",borderRadius:"7px"}}>alert &lt;{c.lowAt}</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:"7px"}}>
                      <button onClick={()=>openEditForm(name)} style={{background:"rgba(21,101,192,0.2)",border:"1px solid rgba(21,101,192,0.35)",color:R.blueL,borderRadius:"8px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontWeight:600}}>Edit</button>
                      {customMeds.includes(name)&&<button onClick={()=>removeMed(name)} style={{background:"rgba(220,38,38,0.15)",border:"1px solid rgba(220,38,38,0.3)",color:"#fca5a5",borderRadius:"8px",padding:"5px 11px",cursor:"pointer",fontSize:"12px"}}>Remove</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      )}

      {/* ─── STOCK ─── */}
      {tab==="stock"&&(
        <div style={{padding:"16px",maxWidth:"860px",margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:"16px",color:R.orange,marginBottom:"6px"}}>📦 Stock Management</div>
          <div style={{fontSize:"13px",color:R.muted,marginBottom:"18px"}}>Stock reduces automatically on every bill. Restock medicines here.</div>

          {lowStockItems.length>0&&(
            <>
              <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.35)",borderRadius:"12px",padding:"12px 16px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontSize:"22px"}}>🔴</span>
                <span style={{fontWeight:700,color:"#fca5a5"}}>{lowStockItems.length} medicine{lowStockItems.length>1?"s":""} need restocking</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px"}}>
                {lowStockItems.map(([name,c])=>(
                  <RestockCard key={name} name={name} c={c} onRestock={restockMed} R={R} fmt={fmt} />
                ))}
              </div>
            </>
          )}

          <div style={{fontWeight:700,fontSize:"13px",color:R.muted,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.5px"}}>All Stock</div>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {Object.entries(catalog).filter(([,c])=>c.stock!=null).sort((a,b)=>(a[1].stock??0)-(b[1].stock??0)).map(([name,c])=>(
              <RestockCard key={name} name={name} c={c} onRestock={restockMed} R={R} fmt={fmt} />
            ))}
            {Object.keys(catalog).filter(n=>catalog[n].stock!=null).length===0&&(
              <div style={{textAlign:"center",padding:"40px",color:"#2a4a60"}}>
                <div style={{fontSize:"34px"}}>📦</div>
                <div style={{marginTop:"8px",color:R.muted}}>No stock tracked yet</div>
                <div style={{fontSize:"12px",marginTop:"6px",color:"#2a4a60"}}>Add stock quantities in the Catalog tab</div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5)}*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.1) transparent}`}</style>
    </div>
  );
}

/* Restock Card component */
function RestockCard({name,c,onRestock,R,fmt}){
  const [amt,setAmt]=useState("10");
  const low = c.stock<=(c.lowAt??10);
  return(
    <div style={{background:R.card,border:`1px solid ${low?"rgba(239,68,68,0.4)":R.border}`,borderRadius:"12px",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
      <div>
        <div style={{fontWeight:600,fontSize:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
          {name}
          {low&&<span style={{background:"rgba(239,68,68,0.2)",color:"#fca5a5",fontSize:"10px",padding:"2px 8px",borderRadius:"8px",fontWeight:700}}>🔴 ORDER NOW</span>}
        </div>
        <div style={{display:"flex",gap:"8px",marginTop:"4px",flexWrap:"wrap"}}>
          <span style={{fontSize:"12px",color:low?"#fca5a5":R.greenL,fontWeight:700}}>📦 {c.stock} in stock</span>
          {c.lowAt!=null&&<span style={{fontSize:"11px",color:R.muted}}>alert below {c.lowAt}</span>}
          {c.mrp&&<span style={{fontSize:"11px",color:R.blueL}}>MRP {fmt(c.mrp)}</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
        <input type="number" min="1" value={amt} onChange={e=>setAmt(e.target.value)} style={{width:"70px",background:"rgba(0,0,0,0.3)",border:`1px solid ${R.border}`,borderRadius:"8px",padding:"7px 10px",color:"#fff",fontSize:"14px",outline:"none"}} />
        <button onClick={()=>onRestock(name,parseInt(amt)||1)} style={{padding:"8px 16px",background:`linear-gradient(135deg,#166534,#16a34a)`,border:"none",borderRadius:"8px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:"13px",whiteSpace:"nowrap"}}>+ Restock</button>
      </div>
    </div>
  );
}