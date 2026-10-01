import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  SlidersHorizontal,
  Info,
  ChevronRight
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/ads/AdSlot';

interface MeritPreset {
  id: string;
  name: string;
  university: string;
  category: 'Engineering & CS' | 'Medical (MBBS/BDS)' | 'General / Public';
  matricWeight: number;
  fscWeight: number;
  testWeight: number;
  testName: string;
  testTotalDefault: number;
  description: string;
  note?: string;
}

const MERIT_PRESETS: MeritPreset[] = [
  {
    id: 'pmdc-mdcat',
    name: 'PMDC National MDCAT',
    university: 'Medical & Dental Colleges (MBBS/BDS)',
    category: 'Medical (MBBS/BDS)',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'MDCAT Score',
    testTotalDefault: 200,
    description: 'Official PMDC regulatory formula for all public & private medical/dental colleges across Pakistan.',
    note: 'Requires minimum 55% in MDCAT for MBBS and 50% for BDS eligibility.'
  },
  {
    id: 'nust-net',
    name: 'NUST NET (Engineering & Computing)',
    university: 'National University of Sciences & Technology (NUST)',
    category: 'Engineering & CS',
    matricWeight: 10,
    fscWeight: 15,
    testWeight: 75,
    testName: 'NUST NET Score',
    testTotalDefault: 200,
    description: 'Official NUST undergraduate formula for H-12 Islamabad, EME, and military constituent colleges.',
    note: 'FSc Part-1 marks are used if Part-2 results are awaiting.'
  },
  {
    id: 'uet-ecat',
    name: 'UET Combined Entry Test (ECAT)',
    university: 'UET Lahore, Taxila & Affiliated Engineering Colleges',
    category: 'Engineering & CS',
    matricWeight: 25,
    fscWeight: 45,
    testWeight: 30,
    testName: 'UET ECAT Score',
    testTotalDefault: 400,
    description: 'UET Lahore and Punjab Engineering institutions official merit criteria.',
    note: 'Candidates with DAE have specific technical criteria.'
  },
  {
    id: 'fast-nu',
    name: 'FAST-NUCES (NU Admission Test)',
    university: 'FAST National University (CS & Engineering)',
    category: 'Engineering & CS',
    matricWeight: 0,
    fscWeight: 50,
    testWeight: 50,
    testName: 'FAST NU Test Score',
    testTotalDefault: 100,
    description: 'FAST-NUCES computing campuses (Islamabad, Lahore, Karachi, Peshawar, CFD).',
    note: 'FAST weighs 50% Intermediate + 50% NU Test (or NTS NAT/SAT).'
  },
  {
    id: 'comsats-nat',
    name: 'COMSATS University (NTS NAT)',
    university: 'COMSATS University Islamabad (All Campuses)',
    category: 'Engineering & CS',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'NTS NAT-IE / NAT-ICS Score',
    testTotalDefault: 100,
    description: 'Official CUI formula for Islamabad, Lahore, Abbottabad, Wah, Attock, Sahiwal, Vehari.',
    note: 'Valid NTS NAT test within 12 months is accepted.'
  },
  {
    id: 'giki-test',
    name: 'GIKI Admission Test',
    university: 'Ghulam Ishaq Khan Institute (GIKI)',
    category: 'Engineering & CS',
    matricWeight: 0,
    fscWeight: 15,
    testWeight: 85,
    testName: 'GIKI Admission Test Score',
    testTotalDefault: 200,
    description: 'GIKI Topi Top-tier engineering and computer science programs.',
    note: 'GIKI places high weight (85%) on its own analytical entry test.'
  },
  {
    id: 'pu-merit',
    name: 'Punjab University (PU Merit)',
    university: 'University of the Punjab (PU Lahore)',
    category: 'General / Public',
    matricWeight: 25,
    fscWeight: 75,
    testWeight: 0,
    testName: 'PU Entry Test (if applicable)',
    testTotalDefault: 100,
    description: 'Standard PU academic formula (1/4th Matric + FSc Total).',
    note: 'Certain computing faculties now also combine 50% PU entrance test.'
  },
  {
    id: 'custom',
    name: 'Custom / Other University Formula',
    university: 'Customizable percentage weights',
    category: 'General / Public',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'University Test / NTS',
    testTotalDefault: 100,
    description: 'Manually specify weightages matching any specific Pakistani institution.'
  }
];

interface ProgramBenchmark {
  id: string;
  university: string;
  program: string;
  category: string;
  closingMerit2025: number;
  city: string;
}

const PROGRAM_BENCHMARKS: ProgramBenchmark[] = [
  { id: '1', university: 'NUST Islamabad', program: 'BS Computer Science', category: 'Computing', closingMerit2025: 81.65, city: 'Islamabad' },
  { id: '2', university: 'NUST Islamabad', program: 'BS Software Engineering', category: 'Computing', closingMerit2025: 79.80, city: 'Islamabad' },
  { id: '3', university: 'NUST Islamabad', program: 'BS Electrical Engineering', category: 'Engineering', closingMerit2025: 70.40, city: 'Islamabad' },
  { id: '4', university: 'FAST-NUCES Islamabad', program: 'BS Computer Science', category: 'Computing', closingMerit2025: 77.20, city: 'Islamabad' },
  { id: '5', university: 'FAST-NUCES Lahore', program: 'BS Software Engineering', category: 'Computing', closingMerit2025: 75.80, city: 'Lahore' },
  { id: '6', university: 'King Edward Medical University', program: 'MBBS (Punjab Open Merit)', category: 'Medical', closingMerit2025: 93.65, city: 'Lahore' },
  { id: '7', university: 'Allama Iqbal Medical College', program: 'MBBS (Punjab Open Merit)', category: 'Medical', closingMerit2025: 92.40, city: 'Lahore' },
  { id: '8', university: 'Rawalpindi Medical University', program: 'MBBS (Punjab Open Merit)', category: 'Medical', closingMerit2025: 91.50, city: 'Rawalpindi' },
  { id: '9', university: 'COMSATS Islamabad', program: 'BS Computer Science', category: 'Computing', closingMerit2025: 84.80, city: 'Islamabad' },
  { id: '10', university: 'COMSATS Lahore', program: 'BS Software Engineering', category: 'Computing', closingMerit2025: 80.20, city: 'Lahore' },
  { id: '11', university: 'UET Lahore', program: 'BS Computer Science', category: 'Computing', closingMerit2025: 79.90, city: 'Lahore' },
  { id: '12', university: 'UET Lahore', program: 'BSc Mechanical Engineering', category: 'Engineering', closingMerit2025: 72.10, city: 'Lahore' },
  { id: '13', university: 'GIKI Swabi', program: 'BS Computer Engineering', category: 'Computing', closingMerit2025: 76.50, city: 'Topi, KPK' },
  { id: '14', university: 'PIEAS Islamabad', program: 'BS Electrical Engineering', category: 'Engineering', closingMerit2025: 71.80, city: 'Islamabad' },
  { id: '15', university: 'Quaid-i-Azam University', program: 'BS Computer Science', category: 'Computing', closingMerit2025: 82.50, city: 'Islamabad' }
];

interface MeritCalculatorViewProps {
  onNavigate: (tab: string, slug?: string) => void;
}

export const MeritCalculatorView: React.FC<MeritCalculatorViewProps> = ({ onNavigate }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pmdc-mdcat');
  
  // Marks inputs
  const [matricObtained, setMatricObtained] = useState<string>('980');
  const [matricTotal, setMatricTotal] = useState<string>('1100');
  
  const [fscObtained, setFscObtained] = useState<string>('950');
  const [fscTotal, setFscTotal] = useState<string>('1100');
  
  const [testObtained, setTestObtained] = useState<string>('165');
  const [testTotal, setTestTotal] = useState<string>('200');

  // Custom weights if 'custom' preset is picked
  const [customMatricWeight, setCustomMatricWeight] = useState<number>(10);
  const [customFscWeight, setCustomFscWeight] = useState<number>(40);
  const [customTestWeight, setCustomTestWeight] = useState<number>(50);

  // Target aggregate simulation goal
  const [targetAggregate, setTargetAggregate] = useState<string>('85');

  const activePreset = useMemo(() => {
    return MERIT_PRESETS.find(p => p.id === selectedPresetId) || MERIT_PRESETS[0];
  }, [selectedPresetId]);

  // Handle Preset switch
  const handleSelectPreset = (preset: MeritPreset) => {
    setSelectedPresetId(preset.id);
    if (preset.id !== 'custom') {
      setTestTotal(preset.testTotalDefault.toString());
      if (preset.id === 'pmdc-mdcat') {
        setTestObtained('160');
      } else if (preset.id === 'nust-net') {
        setTestObtained('145');
      } else if (preset.id === 'uet-ecat') {
        setTestObtained('280');
      } else if (preset.id === 'fast-nu') {
        setTestObtained('72');
      } else if (preset.id === 'comsats-nat') {
        setTestObtained('78');
      }
    }
  };

  // Calculation logic
  const calculation = useMemo(() => {
    const mObt = parseFloat(matricObtained) || 0;
    const mTot = parseFloat(matricTotal) || 1;
    const fObt = parseFloat(fscObtained) || 0;
    const fTot = parseFloat(fscTotal) || 1;
    const tObt = parseFloat(testObtained) || 0;
    const tTot = parseFloat(testTotal) || 1;

    const matricPct = Math.min(100, Math.max(0, (mObt / mTot) * 100));
    const fscPct = Math.min(100, Math.max(0, (fObt / fTot) * 100));
    const testPct = Math.min(100, Math.max(0, (tObt / tTot) * 100));

    const wMatric = selectedPresetId === 'custom' ? customMatricWeight : activePreset.matricWeight;
    const wFsc = selectedPresetId === 'custom' ? customFscWeight : activePreset.fscWeight;
    const wTest = selectedPresetId === 'custom' ? customTestWeight : activePreset.testWeight;

    const totalWeight = wMatric + wFsc + wTest;
    const scaleFactor = totalWeight > 0 ? 100 / totalWeight : 1;

    const matricContribution = matricPct * (wMatric / 100) * (totalWeight !== 100 ? scaleFactor : 1);
    const fscContribution = fscPct * (wFsc / 100) * (totalWeight !== 100 ? scaleFactor : 1);
    const testContribution = testPct * (wTest / 100) * (totalWeight !== 100 ? scaleFactor : 1);

    const aggregate = Math.min(100, matricContribution + fscContribution + testContribution);

    // Calculate required test marks for target aggregate
    const targetAgg = parseFloat(targetAggregate) || 80;
    let requiredTestScore: number | null = null;
    let requiredTestPercent: number | null = null;
    
    if (wTest > 0) {
      const fixedContribution = matricContribution + fscContribution;
      const neededFromTest = targetAgg - fixedContribution;
      const testNeededPct = (neededFromTest / wTest) * 100;
      requiredTestPercent = testNeededPct;
      requiredTestScore = (testNeededPct / 100) * tTot;
    }

    return {
      matricPct,
      fscPct,
      testPct,
      matricContribution,
      fscContribution,
      testContribution,
      aggregate,
      wMatric,
      wFsc,
      wTest,
      requiredTestScore,
      requiredTestPercent
    };
  }, [
    matricObtained,
    matricTotal,
    fscObtained,
    fscTotal,
    testObtained,
    testTotal,
    selectedPresetId,
    activePreset,
    customMatricWeight,
    customFscWeight,
    customTestWeight,
    targetAggregate
  ]);

  const resetValues = () => {
    setMatricObtained('950');
    setMatricTotal('1100');
    setFscObtained('920');
    setFscTotal('1100');
    setTestObtained(activePreset.testTotalDefault === 400 ? '260' : activePreset.testTotalDefault === 100 ? '75' : '150');
    setTestTotal(activePreset.testTotalDefault.toString());
  };

  // Eligibility categorization
  const eligibleBenchmarks = useMemo(() => {
    return PROGRAM_BENCHMARKS.map((b) => {
      const diff = calculation.aggregate - b.closingMerit2025;
      let status: 'Safe' | 'Competitive' | 'Ambitious';
      if (diff >= 1.5) {
        status = 'Safe';
      } else if (diff >= -2.0) {
        status = 'Competitive';
      } else {
        status = 'Ambitious';
      }
      return { ...b, diff, status };
    }).sort((a, b) => b.closingMerit2025 - a.closingMerit2025);
  }, [calculation.aggregate]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/', onClick: () => onNavigate('home') },
            { label: 'Aggregate & Merit Calculator' }
          ]}
        />
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calculator className="h-3.5 w-3.5" />
              Official Pakistani Formulas
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Pakistani University Aggregate & Merit Calculator
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Calculate your exact merit percentage for <strong>MDCAT (MBBS/BDS)</strong>, <strong>NUST NET</strong>, <strong>UET ECAT</strong>, <strong>FAST-NUCES</strong>, <strong>COMSATS</strong>, and <strong>GIKI</strong>. Check your admission chances against verified closing merits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetValues}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Marks
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Select University / Entry Test Formula:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {MERIT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {preset.matricWeight}%M / {preset.fscWeight}%F / {preset.testWeight}%T
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Formula Explanation Banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">{activePreset.university}: </span>
            <span>{activePreset.description}</span>
            {activePreset.note && (
              <span className="block mt-0.5 text-slate-500 italic font-medium">{activePreset.note}</span>
            )}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shrink-0 font-medium">
          <span className="text-slate-600">Formula Weights:</span>
          <span className="font-bold text-emerald-800">
            {calculation.wMatric}% Matric + {calculation.wFsc}% FSc + {calculation.wTest}% Test
          </span>
        </div>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Marks Card (5 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
              Enter Your Academic Scores
            </h2>

            {/* Matric / O-Level */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  1. Matric / SSC / O-Levels
                  <span className="text-[11px] font-normal text-slate-500">
                    (Weight: {calculation.wMatric}%)
                  </span>
                </label>
                <span className="text-slate-500 font-medium tabular-nums">
                  {calculation.matricPct.toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    min="0"
                    max={matricTotal}
                    value={matricObtained}
                    onChange={(e) => setMatricObtained(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    placeholder="e.g. 980"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={matricTotal}
                    onChange={(e) => setMatricTotal(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    placeholder="e.g. 1100"
                  />
                </div>
              </div>
            </div>

            {/* FSc / HSSC / A-Level */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  2. Intermediate / FSc / A-Levels
                  <span className="text-[11px] font-normal text-slate-500">
                    (Weight: {calculation.wFsc}%)
                  </span>
                </label>
                <span className="text-slate-500 font-medium tabular-nums">
                  {calculation.fscPct.toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    min="0"
                    max={fscTotal}
                    value={fscObtained}
                    onChange={(e) => setFscObtained(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    placeholder="e.g. 950"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Total Marks (Part-1 or Total)</label>
                  <input
                    type="number"
                    min="1"
                    value={fscTotal}
                    onChange={(e) => setFscTotal(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    placeholder="e.g. 1100 or 550"
                  />
                </div>
              </div>
            </div>

            {/* Entry Test Score */}
            {calculation.wTest > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    3. {activePreset.testName}
                    <span className="text-[11px] font-normal text-slate-500">
                      (Weight: {calculation.wTest}%)
                    </span>
                  </label>
                  <span className="text-slate-500 font-medium tabular-nums">
                    {calculation.testPct.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      min="0"
                      max={testTotal}
                      value={testObtained}
                      onChange={(e) => setTestObtained(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      placeholder="e.g. 165"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Total Marks</label>
                    <input
                      type="number"
                      min="1"
                      value={testTotal}
                      onChange={(e) => setTestTotal(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      placeholder="e.g. 200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom weights if selected */}
            {selectedPresetId === 'custom' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">Customize Formula Weights (%):</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block">Matric %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customMatricWeight}
                      onChange={(e) => setCustomMatricWeight(parseFloat(e.target.value) || 0)}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">FSc %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customFscWeight}
                      onChange={(e) => setCustomFscWeight(parseFloat(e.target.value) || 0)}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Entry Test %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customTestWeight}
                      onChange={(e) => setCustomTestWeight(parseFloat(e.target.value) || 0)}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Total Weight: <strong>{customMatricWeight + customFscWeight + customTestWeight}%</strong>
                </div>
              </div>
            )}

            {/* IBCC Equivalence Note */}
            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>O-Levels / A-Levels students should enter their official <strong>IBCC Equivalence Marks</strong> out of 1100.</span>
            </div>
          </div>

          {/* Goal Simulator Card */}
          {calculation.wTest > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  What-If Entry Test Target Simulator
                </h3>
                <span className="text-[11px] text-slate-500">Goal Planner</span>
              </div>
              <p className="text-xs text-slate-600">
                Want to know how many marks you need in {activePreset.testName} to achieve your desired aggregate?
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 block mb-1">Target Aggregate (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={targetAggregate}
                    onChange={(e) => setTargetAggregate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold"
                  />
                </div>
                <div className="flex-1 bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-medium">Test Marks Needed:</div>
                  <div className="text-lg font-bold text-emerald-950 tabular-nums">
                    {calculation.requiredTestScore !== null
                      ? calculation.requiredTestScore > parseFloat(testTotal)
                        ? 'Not Possible (Exceeds 100%)'
                        : calculation.requiredTestScore < 0
                        ? 'Already Achieved!'
                        : `${Math.ceil(calculation.requiredTestScore)} / ${testTotal} (${calculation.requiredTestPercent?.toFixed(1)}%)`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Calculated Aggregate & Program Eligibility (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Big Result Card */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-linear-to-br from-emerald-900 to-slate-900 text-white p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Award className="h-48 w-48 text-white" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Total Calculated Aggregate
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                  {activePreset.name}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white tabular-nums">
                  {calculation.aggregate.toFixed(2)}%
                </span>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-2 pt-2 border-t border-emerald-800/60 text-xs">
                <div className="text-[11px] font-medium text-emerald-200">Contribution Breakdown:</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
                    <div className="text-[10px] text-emerald-400">Matric ({calculation.wMatric}%)</div>
                    <div className="font-bold text-white tabular-nums">+{calculation.matricContribution.toFixed(2)}%</div>
                  </div>
                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
                    <div className="text-[10px] text-emerald-400">FSc ({calculation.wFsc}%)</div>
                    <div className="font-bold text-white tabular-nums">+{calculation.fscContribution.toFixed(2)}%</div>
                  </div>
                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
                    <div className="text-[10px] text-emerald-400">Test ({calculation.wTest}%)</div>
                    <div className="font-bold text-white tabular-nums">+{calculation.testContribution.toFixed(2)}%</div>
                  </div>
                </div>
              </div>

              {/* Status Band */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-800/60 border border-emerald-600/40 text-xs text-emerald-100 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  {calculation.aggregate >= 85 ? (
                    <span>Exceptional Merit: Prime standing for top computing & medical admissions.</span>
                  ) : calculation.aggregate >= 75 ? (
                    <span>Strong Merit: Highly competitive for leading engineering & computing institutes.</span>
                  ) : calculation.aggregate >= 65 ? (
                    <span>Good Merit: Competitive for provincial universities and private sector leaders.</span>
                  ) : (
                    <span>Baseline Merit: Meets minimum qualifying criteria for degree programs.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Program Benchmarks & Eligibility Check */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-700" />
                  Estimated Program Eligibility
                </h3>
                <p className="text-xs text-slate-500">
                  Compared against last session's verified closing merits across Pakistani institutions.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1 space-y-1">
              {eligibleBenchmarks.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{b.university}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                        {b.city}
                      </span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-2">
                      <span>{b.program}</span>
                      <span className="text-[11px] text-slate-400">• Last Closing: {b.closingMerit2025}%</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      b.status === 'Safe'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Competitive'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {b.status === 'Safe' ? 'High Chance' : b.status === 'Competitive' ? 'Competitive' : 'Stretch'}
                    </span>
                    <div className="text-[10px] text-slate-400 tabular-nums mt-0.5">
                      {b.diff >= 0 ? `+${b.diff.toFixed(2)}% margin` : `${b.diff.toFixed(2)}% margin`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Ready to explore active admissions?</span>
              <button
                onClick={() => onNavigate('admissions')}
                className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
              >
                <span>View Open Admissions</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('universities')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 text-left transition-colors flex items-center justify-between group shadow-xs"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Universities Directory
                </div>
                <div className="text-[11px] text-slate-500">240+ HEC verified institutions</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </button>
            <button
              onClick={() => onNavigate('entry-tests')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 text-left transition-colors flex items-center justify-between group shadow-xs"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Entry Test Schedules
                </div>
                <div className="text-[11px] text-slate-500">MDCAT, ECAT, NET dates</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </button>
          </div>

        </div>
      </div>

      {/* Ad slot in context */}
      <div className="pt-4">
        <AdSlot placement="footer" />
      </div>
    </div>
  );
};
