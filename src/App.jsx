import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "janta_bills_v3";
const getTodayKey = () => new Date().toISOString().slice(0, 10);

// 300+ Indian medicines — brand names + generics
const MEDICINES = [
  // Pain / Fever
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

  // Antibiotics
  "Amoxicillin 250mg","Amoxicillin 500mg","Novamox 500mg","Mox 500mg",
  "Amoxicillin + Clavulanate 625mg","Augmentin 625mg","Clavam 625mg",
  "Azithromycin 250mg","Azithromycin 500mg","Zithromax 500mg","Azee 500mg","Azithral 500mg",
  "Ciprofloxacin 250mg","Ciprofloxacin 500mg","Cifran 500mg","Ciplox 500mg",
  "Doxycycline 100mg","Doxt-SL 100mg","Doxolin 100mg",
  "Metronidazole 200mg","Metronidazole 400mg","Flagyl 400mg","Metrogyl 400mg",
  "Cefixime 200mg","Taxim-O 200mg","Zifi 200mg","Cefix 200mg",
  "Cefuroxime 250mg","Cefuroxime 500mg","Cefakind 500mg",
  "Ofloxacin 200mg","Ofloxacin 400mg","Zanocin 200mg","Tarivid 400mg",
  "Levofloxacin 250mg","Levofloxacin 500mg","Levaquin 500mg","Levoday 500mg",
  "Co-trimoxazole 480mg","Bactrim DS","Septran DS",
  "Clindamycin 150mg","Clindamycin 300mg","Dalacin 300mg",
  "Clarithromycin 250mg","Clarithromycin 500mg","Claribid 500mg","Clarbact 500mg",

  // Antifungal / Antiviral
  "Fluconazole 150mg","Zocon 150mg","Forcan 150mg","Flucos 150mg",
  "Itraconazole 100mg","Itracip 100mg","Canditral 100mg",
  "Acyclovir 200mg","Acyclovir 400mg","Zovirax 400mg","Acivir 400mg",

  // Antacid / GI
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
  "Eno Sachet","Pudin Hara","Hajmola",
  "Antacid Suspension","Mucaine Gel","Gaviscon",
  "Lactulose Syrup 100ml","Cremaffin Syrup","Isabgol Husk",
  "ORS Sachet Electral","Electral Powder","Pedialyte Sachet",

  // Cold / Cough / Allergy
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

  // Diabetes
  "Metformin 500mg","Metformin 850mg","Metformin 1000mg","Glycomet 500mg","Glucophage 500mg",
  "Glimepiride 1mg","Glimepiride 2mg","Amaryl 2mg","Glimer 1mg",
  "Glibenclamide 5mg","Daonil 5mg",
  "Sitagliptin 50mg","Sitagliptin 100mg","Januvia 100mg","Janumet 50/500",
  "Vildagliptin 50mg","Galvus 50mg","Galvus Met",
  "Pioglitazone 15mg","Pioglitazone 30mg","Actos 30mg","Pioz 15mg",
  "Insulin Glargine","Insulin Regular","Insulin NPH","Mixtard 30",

  // BP / Heart
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

  // Thyroid
  "Levothyroxine 25mcg","Levothyroxine 50mcg","Levothyroxine 100mcg",
  "Thyroxine 50mcg","Eltroxin 50mcg","Thyronorm 50mcg","Thyronorm 100mcg",

  // Vitamins / Supplements
  "Vitamin C 500mg","Limcee 500mg","Celin 500mg",
  "Vitamin D3 1000IU","Vitamin D3 2000IU","Vitamin D3 60000IU sachet","Calcirol Sachet",
  "Calcium + Vitamin D3","Shelcal 500mg","Calcimax 500mg","Cipcal 500mg",
  "Zinc 10mg","Zincovit Tablet","Zinconia Tablet",
  "B-Complex Tablet","Neurobion Forte","Polybion","Becosules",
  "Methylcobalamin 500mcg","Methylcobalamin 1500mcg","Nervijen","Mecobal",
  "Multivitamin Tablet","Supradyn","Revital","Centrum",
  "Iron + Folic Acid","Ferrous Sulphate 200mg","Autrin","Orofer XT",
  "Folic Acid 5mg","Dexorange Syrup","Haemolift Syrup",
  "Fish Oil Omega-3","Flaxseed Oil Capsule",

  // Skin / Topical
  "Betadine Solution 100ml","Betadine Ointment","Povidone Iodine Ointment",
  "Savlon Antiseptic Liquid","Dettol Antiseptic",
  "Clotrimazole Cream 1%","Candid Cream","Canesten Cream",
  "Mupirocin Cream 2%","T-Bact Ointment","Bactroban Ointment",
  "Hydrocortisone Cream 1%","Cortison Cream",
  "Calamine Lotion","Lacto Calamine","Soframycin Cream",
  "Neosporin Cream","Cipladine Ointment",
  "Volini Gel 30g","Volini Spray","Moov Cream","Moov Spray","Iodex Balm",
  "Diclofenac Gel 1%","Voveran Gel","Emugel",

  // Eyes / Ears
  "Ciprofloxacin Eye Drops 0.3%","Ciplox Eye Drops","Cifran Eye Drops",
  "Ofloxacin Eye Drops 0.3%","Ocuflox Eye Drops",
  "Tobramycin Eye Drops","Tobaflam Eye Drops",
  "Refresh Tears Eye Drops","Systane Eye Drops","I-Lube Eye Drops",
  "Waxsol Ear Drops","Earex Ear Drops",

  // Steroids
  "Prednisolone 5mg","Prednisolone 10mg","Wysolone 5mg","Omnacortil 5mg",
  "Dexamethasone 0.5mg","Dexamethasone 4mg","Decadron 0.5mg",
  "Methylprednisolone 4mg","Medrol 4mg","Solumedrol Injection",
  "Betamethasone 0.5mg","Betnelan 0.5mg",

  // Respiratory
  "Salbutamol 2mg","Salbutamol 4mg","Ventolin 2mg","Asthalin 2mg",
  "Salbutamol Inhaler","Asthalin Inhaler","Ventolin Inhaler",
  "Budesonide Inhaler","Budecort Inhaler",
  "Formoterol + Budesonide Inhaler","Foracort Inhaler","Symbicort Inhaler",
  "Tiotropium Inhaler","Spiriva Inhaler",
  "Theophylline 100mg","Theophylline 200mg","Deriphyllin Tablet","Theo-Asthalin",
  "Levosalbutamol 1mg","Levolin 1mg",

  // Neuro / Sleep / Anxiety
  "Alprazolam 0.25mg","Alprazolam 0.5mg","Alprax 0.5mg","Restyl 0.5mg",
  "Clonazepam 0.25mg","Clonazepam 0.5mg","Rivotril 0.5mg","Clonafit 0.5mg",
  "Diazepam 2mg","Diazepam 5mg","Valium 5mg","Calmpose 5mg",
  "Zolpidem 5mg","Zolpidem 10mg","Stilnox 10mg","Zolfresh 10mg",
  "Gabapentin 100mg","Gabapentin 300mg","Neurontin 300mg","Gabapin 300mg",
  "Pregabalin 75mg","Pregabalin 150mg","Lyrica 75mg","Pregeb 75mg",
  "Amitriptyline 10mg","Amitriptyline 25mg","Tryptomer 10mg",
  "Sertraline 50mg","Zoloft 50mg","Serlift 50mg",
  "Fluoxetine 20mg","Prozac 20mg","Fludac 20mg",

  // Misc / OTC
  "Digoxin 0.25mg","Lanoxin 0.25mg",
  "Warfarin 1mg","Warfarin 2mg","Coumadin 2mg","Warf 2mg",
  "Ondansetron 4mg Syrup","Emeset 4mg Syrup",
  "Oral Rehydration Salts","Glucon-D Powder","Glucose Powder",
  "Burnol Ointment","Silver Sulphadiazine Cream","Silverex Ointment",
  "Albendazole 400mg","Bandy 400mg","Zentel 400mg",
  "Mebendazole 100mg","Vermox 100mg",
  "Ivermectin 3mg","Ivermectin 6mg","Ivecop 6mg",
  "Hydroxychloroquine 200mg","Plaquenil 200mg",
  "Colchicine 0.5mg","Colchicine 1mg",
  "Allopurinol 100mg","Allopurinol 300mg","Zyloric 100mg",
].sort();

const getTodayKey2 = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [qty, setQty] = useState("1");
  const [cart, setCart] = useState([]);
  const [bills, setBills] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [tab, setTab] = useState("billing");
  const [toast, setToast] = useState(null);
  const [selDate, setSelDate] = useState(getTodayKey());
  const [expandedBill, setExpandedBill] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(bills)); }, [bills]);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

  const handleSearch = (val) => {
    setSearch(val);
    setSelectedMed(null);
    if (val.length < 1) { setSuggestions([]); setShowSugg(false); return; }
    const q = val.toLowerCase();
    const filtered = MEDICINES.filter(m => m.toLowerCase().includes(q)).slice(0, 10);
    setSuggestions(filtered);
    setShowSugg(filtered.length > 0);
  };

  const pickMed = (name) => { setSelectedMed(name); setSearch(name); setShowSugg(false); setMrp(""); setDiscount(""); setQty("1"); };

  useEffect(() => {
    const fn = (e) => { if (!wrapRef.current?.contains(e.target)) setShowSugg(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Calculations
  const mrpN = parseFloat(mrp) || 0;
  const discN = parseFloat(discount) || 0;
  const qtyN = parseInt(qty) || 1;
  const discAmt = +(mrpN * discN / 100).toFixed(2);
  const salePrice = +(mrpN - discAmt).toFixed(2);
  const totalAmt = +(salePrice * qtyN).toFixed(2);
  const totalDisc = +(discAmt * qtyN).toFixed(2);
  const totalMrpLine = +(mrpN * qtyN).toFixed(2);

  const addToCart = () => {
    if (!selectedMed || mrpN <= 0) return;
    setCart(p => [...p, { id: Date.now(), name: selectedMed, mrp: mrpN, discount: discN, discAmt, salePrice, qty: qtyN, totalAmt, totalDisc, totalMrpLine }]);
    setSelectedMed(null); setSearch(""); setMrp(""); setDiscount(""); setQty("1");
  };

  const cartSum = cart.reduce((a, i) => ({ mrp: a.mrp + i.totalMrpLine, disc: a.disc + i.totalDisc, amt: a.amt + i.totalAmt }), { mrp: 0, disc: 0, amt: 0 });

  const saveBill = () => {
    if (!cart.length) return;
    setBills(p => [{ id: Date.now(), date: getTodayKey2(), time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), items: cart, totalMrp: cartSum.mrp, totalDisc: cartSum.disc, totalAmt: cartSum.amt }, ...p]);
    setCart([]);
    showToast("✅ Bill saved!");
  };

  const clearBills = () => {
    if (!window.confirm(`Delete all ${bills.length} bills permanently?`)) return;
    setBills([]);
    localStorage.removeItem(STORAGE_KEY);
    showToast("🗑️ All bills cleared", "err");
  };

  const dayBills = bills.filter(b => b.date === selDate);
  const daySum = dayBills.reduce((a, b) => ({ rev: a.rev + b.totalAmt, disc: a.disc + b.totalDisc, mrp: a.mrp + b.totalMrp }), { rev: 0, disc: 0, mrp: 0 });

  const fmt = n => `₹${Number(n).toFixed(2)}`;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(155deg,#0a1628 0%,#112240 55%,#0a1628 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#e2eaf6" }}>

      {toast && (
        <div style={{ position: "fixed", top: 68, left: "50%", transform: "translateX(-50%)", background: toast.type === "err" ? "#7f1d1d" : "#14532d", color: "#fff", padding: "10px 26px", borderRadius: "30px", fontWeight: 700, fontSize: "14px", zIndex: 999, boxShadow: "0 4px 20px #0008", whiteSpace: "nowrap" }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg,#0d3b8e,#1565c0)", padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 18px #0006", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: "19px", fontWeight: 800, color: "#fff" }}>💊 Janta Medical</div>
          <div style={{ fontSize: "10px", color: "#90caf9", letterSpacing: "2px" }}>& GENERAL STORE</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[["billing","🧾 Billing"],["dashboard","📊 Dashboard"]].map(([id,lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", background: tab===id ? "#fff" : "rgba(255,255,255,0.12)", color: tab===id ? "#0d47a1" : "#fff" }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* ── BILLING ── */}
      {tab === "billing" && (
        <div style={{ padding: "16px", maxWidth: "860px", margin: "0 auto" }}>

          {/* Search */}
          <div ref={wrapRef} style={{ position: "relative", marginBottom: "14px" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "17px" }}>🔍</span>
              <input value={search} onChange={e => handleSearch(e.target.value)} onFocus={() => suggestions.length && setShowSugg(true)}
                placeholder="Type medicine name… e.g. Crocin, Dolo, Augmentin"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "#e2eaf6" }} />
              {search && <button onClick={() => { setSearch(""); setSelectedMed(null); setSuggestions([]); setShowSugg(false); }} style={{ background: "none", border: "none", color: "#5a7a9a", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>}
            </div>
            {showSugg && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#16304f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", boxShadow: "0 8px 30px #0009", zIndex: 60, overflow: "hidden", maxHeight: "320px", overflowY: "auto" }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => pickMed(s)} style={{ padding: "11px 16px", cursor: "pointer", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(21,101,192,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    💊 {s}
                  </div>
                ))}
              </div>
            )}
            {search.length > 1 && suggestions.length === 0 && (
              <div style={{ fontSize: "12px", color: "#4a6a8a", marginTop: "6px", paddingLeft: "4px" }}>No match found — try a different spelling</div>
            )}
          </div>

          {/* Entry Form */}
          {selectedMed && (
            <div style={{ background: "rgba(21,101,192,0.12)", border: "1px solid rgba(21,101,192,0.35)", borderRadius: "16px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ fontWeight: 700, color: "#64b5f6", marginBottom: "12px", fontSize: "15px" }}>💊 {selectedMed}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                {[
                  { lbl: "MRP (₹) *", val: mrp, set: setMrp, ph: "e.g. 120" },
                  { lbl: "Discount (%)", val: discount, set: setDiscount, ph: "e.g. 10" },
                  { lbl: "Qty", val: qty, set: setQty, ph: "1" },
                ].map(f => (
                  <div key={f.lbl}>
                    <div style={{ fontSize: "11px", color: "#5a8ab8", marginBottom: "5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{f.lbl}</div>
                    <input type="number" min="0" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 12px", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>

              {/* Live Amount Breakdown */}
              {mrpN > 0 && (
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", color: "#5a8ab8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", fontWeight: 600 }}>Live Calculation</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", textAlign: "center" }}>
                    {[
                      { lbl: "MRP Total", val: fmt(totalMrpLine), color: "#7a9ec0", strike: discN > 0 },
                      { lbl: `Discount (${discN}%)`, val: discN > 0 ? `−${fmt(totalDisc)}` : "—", color: "#ffb74d" },
                      { lbl: "Sale Price/Unit", val: fmt(salePrice), color: "#64b5f6" },
                      { lbl: "Customer Pays", val: fmt(totalAmt), color: "#81c784", big: true },
                    ].map(s => (
                      <div key={s.lbl} style={{ padding: "10px 4px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
                        <div style={{ fontSize: "10px", color: "#4a6a8a", textTransform: "uppercase", marginBottom: "4px" }}>{s.lbl}</div>
                        <div style={{ fontSize: s.big ? "22px" : "16px", fontWeight: 800, color: s.color, textDecoration: s.strike ? "line-through" : "none", textDecorationColor: "#4a6a8a" }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={addToCart} disabled={mrpN <= 0} style={{ flex: 1, padding: "12px", background: mrpN > 0 ? "linear-gradient(135deg,#1255a0,#1e88e5)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", color: mrpN > 0 ? "#fff" : "#4a6a8a", fontWeight: 700, fontSize: "15px", cursor: mrpN > 0 ? "pointer" : "not-allowed" }}>
                  ➕ Add to Bill
                </button>
                <button onClick={() => { setSelectedMed(null); setSearch(""); }} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#7a9ec0", cursor: "pointer", fontSize: "18px" }}>×</button>
              </div>
            </div>
          )}

          {/* Cart */}
          {cart.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", marginBottom: "14px" }}>
              <div style={{ padding: "11px 16px", background: "rgba(21,101,192,0.2)", fontWeight: 700, fontSize: "13px" }}>
                🛒 Bill Items ({cart.length})
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                      {["Medicine","MRP","Disc%","Sale/Unit","Qty","Total MRP","Disc Amt","Amount",""].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#4a7aaa", fontSize: "11px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, i) => (
                      <tr key={item.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                        <td style={{ padding: "9px 10px", fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: "9px 10px", color: "#7a9ec0" }}>{fmt(item.mrp)}</td>
                        <td style={{ padding: "9px 10px", color: "#ffb74d" }}>{item.discount > 0 ? `${item.discount}%` : "—"}</td>
                        <td style={{ padding: "9px 10px", color: "#64b5f6" }}>{fmt(item.salePrice)}</td>
                        <td style={{ padding: "9px 10px" }}>{item.qty}</td>
                        <td style={{ padding: "9px 10px", color: "#4a6a8a", textDecoration: item.discount > 0 ? "line-through" : "none" }}>{fmt(item.totalMrpLine)}</td>
                        <td style={{ padding: "9px 10px", color: "#ffb74d" }}>{item.totalDisc > 0 ? `−${fmt(item.totalDisc)}` : "—"}</td>
                        <td style={{ padding: "9px 10px", fontWeight: 700, color: "#81c784" }}>{fmt(item.totalAmt)}</td>
                        <td style={{ padding: "9px 10px" }}>
                          <button onClick={() => setCart(p => p.filter(x => x.id !== item.id))} style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5", borderRadius: "6px", padding: "3px 9px", cursor: "pointer", fontSize: "12px" }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bill Total */}
              <div style={{ padding: "12px 16px", borderTop: "2px solid rgba(21,101,192,0.3)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#4a6a8a" }}>TOTAL MRP</div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#4a6a8a", textDecoration: "line-through" }}>{fmt(cartSum.mrp)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#4a6a8a" }}>DISCOUNT</div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#ffb74d" }}>−{fmt(cartSum.disc)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#4a6a8a" }}>CUSTOMER PAYS</div>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: "#81c784" }}>{fmt(cartSum.amt)}</div>
                </div>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <button onClick={saveBill} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#14532d,#16a34a)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}>
                  ✅ Save Bill
                </button>
              </div>
            </div>
          )}

          {!cart.length && !selectedMed && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#1e3a5f" }}>
              <div style={{ fontSize: "50px" }}>💊</div>
              <div style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px", color: "#3a6080" }}>Type a medicine name above to start</div>
              <div style={{ fontSize: "12px", marginTop: "6px", color: "#2a4a60" }}>Try: Crocin, Dolo, Augmentin, Azee, Pan, Combiflam…</div>
            </div>
          )}
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && (
        <div style={{ padding: "16px", maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "11px 14px", color: "#e2eaf6", fontSize: "14px", outline: "none" }} />
            <button onClick={() => setSelDate(getTodayKey())} style={{ padding: "11px 16px", background: "rgba(21,101,192,0.2)", border: "1px solid rgba(21,101,192,0.4)", borderRadius: "12px", color: "#64b5f6", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>Today</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px", marginBottom: "16px" }}>
            {[
              { lbl: "Revenue Collected", val: fmt(daySum.rev), icon: "💰", bg: "rgba(21,101,192,0.18)", border: "rgba(21,101,192,0.4)", col: "#64b5f6" },
              { lbl: "Discounts Given", val: fmt(daySum.disc), icon: "🎁", bg: "rgba(251,140,0,0.12)", border: "rgba(251,140,0,0.35)", col: "#ffb74d" },
              { lbl: "MRP Value Billed", val: fmt(daySum.mrp), icon: "🏷️", bg: "rgba(100,100,100,0.1)", border: "rgba(100,100,100,0.25)", col: "#9ab0c8" },
              { lbl: "Bills Today", val: dayBills.length, icon: "🧾", bg: "rgba(22,163,74,0.12)", border: "rgba(22,163,74,0.35)", col: "#86efac" },
            ].map(s => (
              <div key={s.lbl} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "26px" }}>{s.icon}</div>
                <div style={{ fontSize: "11px", color: "#4a7aaa", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "8px" }}>{s.lbl}</div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: s.col, marginTop: "4px" }}>{s.val}</div>
              </div>
            ))}
          </div>

          <div style={{ fontWeight: 700, fontSize: "13px", color: "#4a7aaa", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Bills — {new Date(selDate + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>

          {dayBills.length === 0
            ? <div style={{ textAlign: "center", padding: "36px", color: "#2a4a60" }}><div style={{ fontSize: "34px" }}>📋</div><div style={{ marginTop: "8px" }}>No bills for this date</div></div>
            : <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {dayBills.map((bill, idx) => (
                  <div key={bill.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
                    <div onClick={() => setExpandedBill(expandedBill === bill.id ? null : bill.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer", background: "rgba(21,101,192,0.1)" }}>
                      <div>
                        <span style={{ fontWeight: 700, color: "#64b5f6" }}>Bill #{dayBills.length - idx}</span>
                        <span style={{ fontSize: "12px", color: "#4a6a8a", marginLeft: "8px" }}>{bill.time} · {bill.items.length} item{bill.items.length > 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        {bill.totalDisc > 0 && <div style={{ textAlign: "right" }}><div style={{ fontSize: "10px", color: "#4a6a8a" }}>Discount</div><div style={{ fontWeight: 700, color: "#ffb74d", fontSize: "13px" }}>−{fmt(bill.totalDisc)}</div></div>}
                        <div style={{ textAlign: "right" }}><div style={{ fontSize: "10px", color: "#4a6a8a" }}>Collected</div><div style={{ fontWeight: 800, color: "#81c784", fontSize: "16px" }}>{fmt(bill.totalAmt)}</div></div>
                        <span style={{ color: "#4a6a8a" }}>{expandedBill === bill.id ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {expandedBill === bill.id && (
                      <div style={{ padding: "10px 14px" }}>
                        {bill.items.map((it, j) => (
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px", flexWrap: "wrap", gap: "4px" }}>
                            <span style={{ fontWeight: 600 }}>{it.name}</span>
                            <span style={{ color: "#4a7aaa" }}>
                              ×{it.qty} @ {fmt(it.mrp)}
                              {it.discount > 0 ? <span style={{ color: "#ffb74d" }}> −{it.discount}%</span> : ""}
                              {" = "}<strong style={{ color: "#81c784" }}>{fmt(it.totalAmt)}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
          }

          {bills.length > 0 && (
            <button onClick={clearBills} style={{ marginTop: "18px", width: "100%", padding: "11px", background: "rgba(127,29,29,0.2)", border: "1px solid rgba(220,38,38,0.35)", borderRadius: "10px", color: "#fca5a5", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
              🗑️ Clear All Bills ({bills.length} total)
            </button>
          )}
        </div>
      )}

      <style>{`
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
        *{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.1) transparent}
      `}</style>
    </div>
  );
}