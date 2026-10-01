export interface QuizQuestion {
  id: string;
  test: 'MDCAT' | 'ECAT' | 'NET (NUST)';
  subject: 'Biology' | 'Chemistry' | 'Physics' | 'Mathematics' | 'English & Intelligence';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  year?: string;
}

export const sampleQuizQuestions: QuizQuestion[] = [
  // MDCAT Biology
  {
    id: 'mdcat-bio-01',
    test: 'MDCAT',
    subject: 'Biology',
    question: 'During cellular respiration, in which part of the mitochondrion does the Krebs cycle (Citric Acid Cycle) take place?',
    options: [
      'Outer mitochondrial membrane',
      'Inner mitochondrial membrane (Cristae)',
      'Mitochondrial matrix',
      'Intermembrane space'
    ],
    correctIndex: 2,
    explanation: 'The Krebs cycle takes place within the mitochondrial matrix, where soluble enzymes catalyze the oxidation of acetyl-CoA. Electron transport chain takes place on the cristae/inner membrane.',
    topic: 'Bioenergetics',
    year: 'MDCAT 2024'
  },
  {
    id: 'mdcat-bio-02',
    test: 'MDCAT',
    subject: 'Biology',
    question: 'Which of the following hormones is secreted by the corpus luteum to maintain the endometrium during the secretory phase?',
    options: [
      'Luteinizing Hormone (LH)',
      'Progesterone',
      'Follicle Stimulating Hormone (FSH)',
      'Oxytocin'
    ],
    correctIndex: 1,
    explanation: 'Progesterone is secreted by the corpus luteum in large quantities to prepare and vascularize the uterine lining (endometrium) for possible embryo implantation.',
    topic: 'Reproduction',
    year: 'MDCAT 2023'
  },
  {
    id: 'mdcat-bio-03',
    test: 'MDCAT',
    subject: 'Biology',
    question: 'The junction between two neurons across which nerve impulses are transmitted via neurotransmitters is termed as:',
    options: [
      'Node of Ranvier',
      'Synapse',
      'Sarcolemma',
      'Neuromuscular junction'
    ],
    correctIndex: 1,
    explanation: 'A synapse is the functional gap between the axon terminal of a presynaptic neuron and the dendrite/soma of a postsynaptic neuron where neurotransmitter molecules diffuse.',
    topic: 'Nervous Coordination',
    year: 'MDCAT 2024'
  },
  // MDCAT Chemistry
  {
    id: 'mdcat-chem-01',
    test: 'MDCAT',
    subject: 'Chemistry',
    question: 'Which of the following organic compounds will give a positive Iodoform (triiodomethane) test upon treatment with I₂ and NaOH?',
    options: [
      'Methanol (CH₃OH)',
      'Ethanol (CH₃CH₂OH)',
      '1-Propanol (CH₃CH₂CH₂OH)',
      'Benzaldehyde (C₆H₅CHO)'
    ],
    correctIndex: 1,
    explanation: 'Ethanol contains the CH₃-CH(OH)- group, which upon oxidation produces acetaldehyde containing a methyl carbonyl group (CH₃-C=O), yielding yellow iodoform (CHI₃) crystals.',
    topic: 'Alcohols & Carbonyl Compounds',
    year: 'MDCAT 2024'
  },
  {
    id: 'mdcat-chem-02',
    test: 'MDCAT',
    subject: 'Chemistry',
    question: 'According to Le Chatelier’s principle, an increase in pressure on the gaseous system: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) will:',
    options: [
      'Shift the equilibrium to the left (reactants)',
      'Shift the equilibrium to the right (products)',
      'Have no effect on equilibrium',
      'Decrease the value of the equilibrium constant Kc'
    ],
    correctIndex: 1,
    explanation: 'Increasing pressure favors the direction with fewer moles of gas. Reactants have 1+3=4 moles, while products have 2 moles. Thus, equilibrium shifts forward to the right.',
    topic: 'Chemical Equilibrium',
    year: 'MDCAT 2023'
  },
  // ECAT / NET Physics
  {
    id: 'ecat-phy-01',
    test: 'ECAT',
    subject: 'Physics',
    question: 'A projectile is launched with initial velocity v at an angle θ with the horizontal. At the maximum height of its trajectory, its velocity is:',
    options: [
      'Zero',
      'v cos θ',
      'v sin θ',
      'v'
    ],
    correctIndex: 1,
    explanation: 'At the apex of projectile motion, the vertical component of velocity (vy) becomes momentarily zero, but the horizontal component (vx = v cos θ) remains constant throughout (neglecting air resistance).',
    topic: 'Motion and Force',
    year: 'UET ECAT'
  },
  {
    id: 'ecat-phy-02',
    test: 'NET (NUST)',
    subject: 'Physics',
    question: 'Two point charges of +2 μC and +8 μC are separated by a distance d in air. The electrostatic force between them is F. If the distance between them is doubled, the new force becomes:',
    options: [
      '2F',
      'F / 2',
      'F / 4',
      '4F'
    ],
    correctIndex: 2,
    explanation: 'According to Coulomb’s Law, F ∝ 1/r². When distance r is doubled (2d), the new force is F / (2)² = F / 4.',
    topic: 'Electrostatics',
    year: 'NUST NET'
  },
  // ECAT / NET Mathematics
  {
    id: 'ecat-math-01',
    test: 'ECAT',
    subject: 'Mathematics',
    question: 'What is the derivative of f(x) = ln(sin x) with respect to x?',
    options: [
      'tan x',
      'cot x',
      'sec x',
      '-cot x'
    ],
    correctIndex: 1,
    explanation: 'Using the chain rule: d/dx [ln(u)] = (1/u) * du/dx. Here, (1/sin x) * d/dx(sin x) = (cos x) / (sin x) = cot x.',
    topic: 'Differentiation',
    year: 'ECAT 2024'
  },
  {
    id: 'ecat-math-02',
    test: 'NET (NUST)',
    subject: 'Mathematics',
    question: 'The value of the definite integral ∫ from 0 to π/2 of cos(x) dx is equal to:',
    options: [
      '0',
      '1',
      '-1',
      'π / 2'
    ],
    correctIndex: 1,
    explanation: 'The antiderivative of cos(x) is sin(x). Evaluating from 0 to π/2: sin(π/2) - sin(0) = 1 - 0 = 1.',
    topic: 'Integration',
    year: 'NUST NET'
  },
  // English & Intelligence
  {
    id: 'net-eng-01',
    test: 'NET (NUST)',
    subject: 'English & Intelligence',
    question: 'Choose the word most nearly opposite in meaning (Antonym) to "CANDID":',
    options: [
      'Frank',
      'Deceitful',
      'Blunt',
      'Outspoken'
    ],
    correctIndex: 1,
    explanation: 'Candid means truthful, straightforward, and sincere. Its opposite is deceitful, evasive, or disingenuous.',
    topic: 'Vocabulary & Antonyms',
    year: 'NUST NET 2024'
  }
];
