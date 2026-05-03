export const factCheckDB = [
  {
    keywords: ['online', 'internet', 'e-voting', 'electronic', 'app'],
    verdict: 'MISLEADING',
    verdictClass: 'text-[#e6a139] border-[#e6a139] bg-[#e6a139]/10',
    explanation: `<strong>Analysis:</strong> This claim is misleading because it presents a complex issue as settled fact.\n\n<strong>What is true:</strong> Online voting faces real cybersecurity concerns — including risks of hacking, malware, and lack of a verifiable paper trail.\n\n<strong>What is also true:</strong> Paper ballots are not perfect either — they can be lost, damaged, or miscounted.\n\n<strong>What experts say:</strong> Most security researchers recommend paper-based systems with electronic counting as a balanced approach. Some countries use online voting with specific cryptography measures.\n\n<em>Verdict: MISLEADING — The reality is more nuanced than a simple comparison.</em>`
  },
  {
    keywords: ['id', 'photo id', 'identification', 'require', 'every country', 'all countries'],
    verdict: 'FALSE',
    verdictClass: 'text-[#e63946] border-[#e63946] bg-[#e63946]/10',
    explanation: `<strong>Analysis:</strong> This is FALSE.\n\n<strong>Why:</strong> ID requirements vary enormously by country. In the UK, no ID was required for most elections until recently. In Canada, voters can be vouched for by another voter. Many democracies use voter registration rolls combined with signature verification as the primary means of verification.\n\n<em>Verdict: FALSE — No universal rule applies to "every country."</em>`
  },
  {
    keywords: ['observer', 'monitor', 'watch', 'counting', 'independent'],
    verdict: 'TRUE',
    verdictClass: 'text-[#2a9d8f] border-[#2a9d8f] bg-[#2a9d8f]/10',
    explanation: `<strong>Analysis:</strong> This is generally TRUE.\n\n<strong>Why:</strong> Most democratic countries allow accredited observers to monitor vote counting. This includes:\n• Representatives from political parties\n• Non-partisan civic organizations\n• International observer missions (e.g., UN, OSCE)\n\n<strong>The purpose:</strong> Observers enhance transparency. They typically cannot interfere but can report irregularities.\n\n<em>Verdict: TRUE — Though specific rules vary by jurisdiction.</em>`
  },
  {
    keywords: ['fraud', 'massive', 'widespread', 'millions', 'stolen'],
    verdict: 'FALSE',
    verdictClass: 'text-[#e63946] border-[#e63946] bg-[#e63946]/10',
    explanation: `<strong>Analysis:</strong> Statistically FALSE in established democracies.\n\n<strong>The Data:</strong> Comprehensive audits, academic studies, and judicial reviews consistently show that coordinated, widespread voter fraud is exceedingly rare. Instances of individual fraud do occur but at statistically negligible rates (often less than 0.0001% of votes cast) that do not alter national outcomes.\n\n<em>Verdict: FALSE — High-volume systemic fraud requires immense logistical coordination that is almost impossible to hide.</em>`
  },
  {
    keywords: ['mail', 'absentee', 'postal', 'fraudulent', 'unsecure'],
    verdict: 'MISLEADING',
    verdictClass: 'text-[#e6a139] border-[#e6a139] bg-[#e6a139]/10',
    explanation: `<strong>Analysis:</strong> This is MISLEADING.\n\n<strong>The Mechanics:</strong> Mail-in voting systems incorporate multiple layers of security:\n1. <strong>Identity verification:</strong> Signatures are matched against database records.\n2. <strong>Barcoding:</strong> Unique barcodes track envelopes to prevent duplication.\n3. <strong>Chain of custody:</strong> Strict rules govern how drop boxes and postal deliveries are handled.\n\n<em>Verdict: MISLEADING — While no system is perfect, mail-in voting has been used securely for decades in many jurisdictions.</em>`
  },
  {
    keywords: ['machine', 'switch', 'hacked', 'algorithm'],
    verdict: 'INSUFFICIENT DATA / CONTEXT DEPENDENT',
    verdictClass: 'text-[#e6a139] border-[#e6a139] bg-[#e6a139]/10',
    explanation: `<strong>Analysis:</strong> Requires highly specific context.\n\n<strong>The Reality:</strong> Voting machines <em>can</em> suffer from calibration errors or software bugs, occasionally resulting in "vote flipping" on the display screen. However, this is usually a localized touchscreen calibration issue, not a malicious algorithm. \n\n<strong>Security Protocol:</strong> Most modern systems print a Voter-Verified Paper Audit Trail (VVPAT) so the human can confirm the machine's record before finalizing.\n\n<em>Verdict: Claims of massive algorithm hacking are generally unproven, but localized technical errors do occur.</em>`
  }
];

export const knowledgeBase = {
  gerrymandering: {
    q: 'What is gerrymandering?',
    a: `Gerrymandering is the practice of drawing electoral district boundaries in a way that gives one group an advantage.\n\n<strong>How it works:</strong>\n1. Electoral districts must be redrawn periodically based on census data.\n2. Those in power may draw boundaries to concentrate opposing voters ("packing") or split them across districts ("cracking").\n3. This can result in election outcomes that do not proportionally reflect overall voter preferences.\n\n<em>Note: Courts in many countries review redistricting for fairness.</em>`
  },
  electoralcollege: {
    q: 'How does the Electoral College work?',
    a: `The Electoral College is the system used to elect the President of the United States.\n\n<strong>How it works:</strong>\n1. Each state is assigned "electors" based on its congressional representation.\n2. A candidate needs 270 of 538 total electoral votes to win.\n3. Most states use a "winner-take-all" system — all electors go to whoever wins the state's popular vote.\n\n<em>Note: This is an explanation of the system's mechanics only.</em>`
  },
  municipal: {
    q: 'What are Municipal Elections?',
    a: `Municipal elections are held to elect local government bodies (like Municipal Corporations or City Councils).\n\n<strong>Mechanics:</strong>\n1. <strong>Wards:</strong> A city is divided into 'Wards'.\n2. <strong>Corporators:</strong> Voters in each ward elect a representative.\n3. <strong>The Mayor:</strong> Elected corporators usually elect the Mayor from among themselves (indirect election).\n\n<em>Purpose: Handling local infrastructure like water supply and sanitation.</em>`
  },
  cm_selection: {
    q: 'How is a Chief Minister (CM) selected?',
    a: `In parliamentary systems, the Chief Minister is not directly elected by the public.\n\n<strong>Mechanics:</strong>\n1. <strong>Direct Election of MLAs:</strong> Citizens elect Members of the Legislative Assembly.\n2. <strong>Majority Rule:</strong> A party or coalition must win >50% of the seats.\n3. <strong>Selection:</strong> The winning coalition elects an internal leader.\n4. <strong>Appointment:</strong> The Governor formally appoints this leader as CM.`
  },
  counting: {
    q: 'How are ballots counted securely?',
    a: `Ballot counting combines human oversight with technical efficiency.\n\n<strong>Standard Protocols:</strong>\n1. <strong>Optical Scanners:</strong> High-speed scanners read filled bubbles on paper ballots.\n2. <strong>Adjudication:</strong> If a scanner cannot read a ballot (e.g., a messy mark), a bipartisan team of human judges reviews the original paper ballot to determine the voter's intent.\n3. <strong>Air-gapping:</strong> Tabulation computers are typically "air-gapped"—meaning they are never connected to the internet, preventing remote hacking.\n4. <strong>Audits:</strong> A percentage of paper ballots are hand-counted post-election to ensure the scanners were accurate.`
  },
  security: {
    q: 'What is a paper trail (VVPAT)?',
    a: `VVPAT stands for Voter-Verified Paper Audit Trail.\n\n<strong>Why it matters:</strong>\nIf a voter uses an electronic touchscreen to vote, the machine prints a physical paper receipt showing their choices. The voter reviews the paper through a glass window. If it is correct, the paper drops into a secure lockbox.\n\n<strong>The Benefit:</strong> If the electronic totals are ever questioned, election officials have a physical, human-readable paper record that cannot be altered by software bugs or hackers. The paper is the ultimate source of truth.`
  }
};

export const refusalTopics = ['who should i vote', 'who to vote', 'vote for', 'which party', 'which candidate', 'best party', 'best candidate', 'my opinion', 'your opinion'];
