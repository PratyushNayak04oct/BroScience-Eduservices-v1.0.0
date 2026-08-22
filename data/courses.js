// PLACEHOLDER DATA — Replace with approved course catalog, fees, and faculty assignments.

export const courses = [
  {
    slug: "class-7-10-foundation",
    title: "Class 7–10 Foundation Program",
    category: "Class 7-10",
    duration: "12 months",
    mode: "Hybrid",
    subjects: ["Mathematics", "Science", "English", "Social Science"],
    faculty: "Faculty Member 1, Faculty Member 4", // PLACEHOLDER faculty
    fee: 45000, // PLACEHOLDER fee in INR
    installments: 3,
    features: [
      "Concept-building live classes",
      "Weekly worksheets and quizzes",
      "Olympiad and NTSE orientation",
      "Parent progress dashboard",
    ],
    curriculum: [
      "Term-wise syllabus aligned to CBSE/State boards",
      "Foundation topics for future JEE/NEET streams",
      "Reading comprehension and writing practice",
      "Map work and project-based Social Science units",
    ],
    assessment: [
      "Fortnightly chapter tests",
      "Term-end examinations",
      "Personalised performance reports",
      "Remedial sessions for below-target scores",
    ],
  },
  {
    slug: "class-10-board-crash",
    title: "Class 10 Board Exam Crash Course",
    category: "Class 7-10",
    duration: "4 months",
    mode: "Online",
    subjects: ["Mathematics", "Science", "English", "Social Science"],
    faculty: "Faculty Member 4", // PLACEHOLDER faculty
    fee: 18000, // PLACEHOLDER fee in INR
    installments: 2,
    features: [
      "Board-pattern question practice",
      "Previous year paper discussions",
      "Exam writing strategy workshops",
      "Doubt marathon sessions before boards",
    ],
    curriculum: [
      "High-weightage chapter revision",
      "Sample paper solving drills",
      "Answer presentation and time management",
      "Last-minute formula and fact sheets",
    ],
    assessment: [
      "Full-length board mock tests",
      "Subject-wise pre-boards",
      "Answer sheet evaluation with feedback",
      "Rank and percentile tracking",
    ],
  },
  {
    slug: "class-11-science-core",
    title: "Class 11 Science — Core Program",
    category: "Class 11",
    duration: "10 months",
    mode: "Hybrid",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    faculty: "Faculty Member 1, Faculty Member 2", // PLACEHOLDER faculty
    fee: 55000, // PLACEHOLDER fee in INR
    installments: 3,
    features: [
      "NCERT-first teaching approach",
      "Competitive exam bridge modules",
      "Digital lab demonstrations",
      "Mentor-guided study planners",
    ],
    curriculum: [
      "Physics: Mechanics, Thermodynamics, Waves",
      "Chemistry: Physical, Organic, and Inorganic foundations",
      "Mathematics: Algebra, Calculus introduction, Coordinate Geometry",
      "Biology: Cell biology, Plant and Animal physiology",
    ],
    assessment: [
      "Monthly cumulative tests",
      "Board-style unit exams",
      "Competitive aptitude checkpoints",
      "Individual weakness analysis",
    ],
  },
  {
    slug: "class-12-science-integrated",
    title: "Class 12 Science — Integrated Board + Entrance",
    category: "Class 12",
    duration: "12 months",
    mode: "Hybrid",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    faculty: "Faculty Member 1, Faculty Member 2, Faculty Member 3", // PLACEHOLDER faculty
    fee: 65000, // PLACEHOLDER fee in INR
    installments: 4,
    features: [
      "Dual-track board and entrance preparation",
      "Daily practice problem sets",
      "Rank booster problem sessions",
      "Unlimited portal doubt access",
    ],
    curriculum: [
      "Complete Class 12 board syllabus coverage",
      "JEE/NEET-aligned extensions per subject",
      "Previous 10 years' question trends",
      "Revision capsules for high-yield topics",
    ],
    assessment: [
      "Part tests and full syllabi mocks",
      "Board and entrance parallel test series",
      "Detailed solutions and video explanations",
      "Mentor review before pre-boards",
    ],
  },
  {
    slug: "jee-main-advanced",
    title: "JEE Main & Advanced Comprehensive",
    category: "JEE",
    duration: "18 months",
    mode: "Online",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    faculty: "Faculty Member 1, Faculty Member 3", // PLACEHOLDER faculty
    fee: 85000, // PLACEHOLDER fee in INR
    installments: 4,
    features: [
      "Advanced problem-solving workshops",
      "All India test series with ranking",
      "PYQ mastery modules",
      "Personal mentor for test analysis",
    ],
    curriculum: [
      "Class 11 and 12 PCM mastery",
      "JEE Main pattern speed drills",
      "JEE Advanced multi-concept problems",
      "Revision planners for droppers and repeaters",
    ],
    assessment: [
      "Weekly JEE Main mocks",
      "Bi-weekly JEE Advanced mocks",
      "Chapter-wise accuracy tracking",
      "Post-test one-on-one analysis slots",
    ],
  },
  {
    slug: "neet-ug-complete",
    title: "NEET UG Complete Preparation",
    category: "NEET",
    duration: "15 months",
    mode: "Hybrid",
    subjects: ["Physics", "Chemistry", "Biology"],
    faculty: "Faculty Member 2, Faculty Member 5", // PLACEHOLDER faculty
    fee: 78000, // PLACEHOLDER fee in INR
    installments: 4,
    features: [
      "NCERT line-by-line Biology coverage",
      "Diagram and mnemonic banks",
      "All India NEET mock test series",
      "Counselling for college targets", // PLACEHOLDER service scope
    ],
    curriculum: [
      "Botany and Zoology integrated modules",
      "Physical and Organic Chemistry for NEET",
      "Physics numericals with medical entrance focus",
      "Daily Biology assertion-reason practice",
    ],
    assessment: [
      "Full-length NEET simulations",
      "Subject-wise part tests",
      "NCERT-based micro quizzes",
      "Biology 360 revision tests",
    ],
  },
  {
    slug: "cbse-board-excellence",
    title: "CBSE Board Excellence Program",
    category: "Board Exams",
    duration: "8 months",
    mode: "Online",
    subjects: ["Mathematics", "Science", "English", "Accountancy", "Economics"],
    faculty: "Faculty Member 4", // PLACEHOLDER faculty
    fee: 32000, // PLACEHOLDER fee in INR
    installments: 2,
    features: [
      "Board-specific marking scheme training",
      "Answer writing templates",
      "Sample paper marathon",
      "Parent-teacher virtual meets",
    ],
    curriculum: [
      "Stream-specific subject deep dives",
      "Case study and application-based questions",
      "English writing and literature analysis",
      "Practical exam viva preparation",
    ],
    assessment: [
      "Pre-board test series (3 rounds)",
      "Subject expert evaluated copies",
      "Improvement plans per subject",
      "Predicted score benchmarking",
    ],
  },
  {
    slug: "state-board-intensive",
    title: "State Board Intensive Coaching",
    category: "Board Exams",
    duration: "6 months",
    mode: "Hybrid",
    subjects: ["Mathematics", "Science", "Regional Language", "Social Science"],
    faculty: "Faculty Member 4", // PLACEHOLDER faculty
    fee: 28000, // PLACEHOLDER fee in INR
    installments: 2,
    features: [
      "State syllabus-aligned notes",
      "Regional language medium support", // PLACEHOLDER: confirm languages
      "Board practical guidance",
      "Local exam pattern workshops",
    ],
    curriculum: [
      "State board textbook chapter coverage",
      "Supplementary question banks",
      "Map and diagram practice for Social Science",
      "Language grammar and composition drills",
    ],
    assessment: [
      "State-pattern mock examinations",
      "Chapter completion tests",
      "Writing skill evaluations",
      "Final revision test battery",
    ],
  },
  {
    slug: "olympiad-ntse-prep",
    title: "Olympiad & NTSE Preparation",
    category: "Competitive Exams",
    duration: "9 months",
    mode: "Online",
    subjects: ["Mathematics", "Science", "Mental Ability", "Social Science"],
    faculty: "Faculty Member 3", // PLACEHOLDER faculty
    fee: 36000, // PLACEHOLDER fee in INR
    installments: 3,
    features: [
      "Higher-order thinking skill modules",
      "Past Olympiad paper discussions",
      "NTSE Stage 1 and 2 orientation",
      "Scholarship exam strategy sessions",
    ],
    curriculum: [
      "Advanced Mathematics problem sets",
      "Science reasoning and experimentation logic",
      "Mental ability patterns and shortcuts",
      "SAT and MAT-style practice for NTSE",
    ],
    assessment: [
      "Monthly Olympiad mock tests",
      "NTSE simulation papers",
      "Speed and accuracy benchmarks",
      "National-level comparative ranking", // PLACEHOLDER metric
    ],
  },
  {
    slug: "cuets-common-university",
    title: "CUET & Common University Entrance Prep",
    category: "Competitive Exams",
    duration: "5 months",
    mode: "Online",
    subjects: ["English", "General Test", "Domain Subjects"],
    faculty: "Faculty Member 4, Faculty Member 3", // PLACEHOLDER faculty
    fee: 24000, // PLACEHOLDER fee in INR
    installments: 2,
    features: [
      "Domain subject selection guidance",
      "General test aptitude training",
      "University-specific cutoff insights", // PLACEHOLDER data source
      "Application and form-filling support",
    ],
    curriculum: [
      "English comprehension and vocabulary",
      "Quantitative, logical, and general awareness",
      "Domain papers: Science, Commerce, or Humanities tracks",
      "Time-bound MCQ practice frameworks",
    ],
    assessment: [
      "Sectional CUET mock tests",
      "Full-length multi-section simulations",
      "Accuracy vs. attempt strategy reviews",
      "Post-mock mentor debriefs",
    ],
  },
];
