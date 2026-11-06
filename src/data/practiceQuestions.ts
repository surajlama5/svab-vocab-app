import type { PracticeQuestion, PracticeSubject } from '@/types/study';

export const subjects: { id: PracticeSubject; title: string; description: string }[] = [
  { id: 'word-knowledge', title: 'Word Knowledge', description: 'Use vocabulary meanings and context clues.' },
  { id: 'paragraph-comprehension', title: 'Paragraph Comprehension', description: 'Read a short passage and identify its meaning.' },
  { id: 'arithmetic-reasoning', title: 'Arithmetic Reasoning', description: 'Solve original practical math word problems.' },
  { id: 'mathematics-knowledge', title: 'Mathematics Knowledge', description: 'Practice arithmetic, algebra, geometry, and probability.' },
];

const DEFAULT_PARAGRAPH = 'A recruit increased the length of every workout but began feeling slower. A coach suggested alternating demanding days with lighter activity and allowing enough sleep. After two weeks, the recruit felt stronger and completed the same course more quickly.';

const makeQuestion = (
  subject: PracticeSubject,
  id: string,
  prompt: string,
  answers: [string, string, string, string],
  correct: number,
  explanation: string,
  passage?: string,
): PracticeQuestion => {
  const reading = passage ?? (subject === 'paragraph-comprehension' ? DEFAULT_PARAGRAPH : undefined);
  return {
    id,
    subject,
    prompt,
    choices: answers.map((label, index) => ({ id: `${id}-${index}`, label })),
    correctChoiceId: `${id}-${correct}`,
    explanation,
    ...(reading ? { passage: reading } : {}),
  };
};

const pc: PracticeQuestion[] = [
  makeQuestion('paragraph-comprehension', 'pc-1', 'What is the main idea?', ['Rest is part of effective training.', 'Long workouts are always better.', 'Water is only needed in hot weather.', 'Stretching replaces sleep.'], 0, 'The passage explains that rest helps the body recover and improve.', 'A recruit increased the length of every workout but began feeling slower. A coach suggested alternating demanding days with lighter activity and allowing enough sleep. After two weeks, the recruit felt stronger and completed the same course more quickly.'),
  makeQuestion('paragraph-comprehension', 'pc-2', 'Why did the coach recommend lighter activity on some days?', ['To give the body time to recover.', 'To avoid measuring progress.', 'To replace all demanding exercise.', 'To make the course longer.'], 0, 'The passage links alternating intensity with recovery and improved performance.', 'A recruit increased the length of every workout but began feeling slower. A coach suggested alternating demanding days with lighter activity and allowing enough sleep. After two weeks, the recruit felt stronger and completed the same course more quickly.'),
  makeQuestion('paragraph-comprehension', 'pc-3', 'What can be inferred about the recruit’s original routine?', ['It did not include enough recovery.', 'It focused only on sleep.', 'It was already improving speed.', 'It included too many light days.'], 0, 'The recruit felt slower while increasing workout length, suggesting the routine lacked adequate recovery.'),
  makeQuestion('paragraph-comprehension', 'pc-4', 'In the passage, “alternating” most nearly means:', ['Taking turns between different things.', 'Repeating one thing continuously.', 'Stopping an activity permanently.', 'Increasing something gradually.'], 0, 'Alternating demanding and lighter days means taking turns between them.'),
  makeQuestion('paragraph-comprehension', 'pc-5', 'Which result followed the adjusted routine?', ['The recruit felt stronger and finished faster.', 'The recruit stopped training.', 'The course became shorter.', 'The coach removed sleep from the plan.'], 0, 'The final sentence directly reports feeling stronger and finishing more quickly.'),
  makeQuestion('paragraph-comprehension', 'pc-6', 'What is the main purpose of the passage?', ['To explain a benefit of balancing work and recovery.', 'To compare two training courses.', 'To describe how to measure sleep.', 'To argue against physical training.'], 0, 'The passage presents a problem and shows how recovery helped performance.'),
  makeQuestion('paragraph-comprehension', 'pc-7', 'Which statement is supported by the passage?', ['More exercise is not always better without recovery.', 'A recruit should avoid all difficult workouts.', 'Sleep makes exercise unnecessary.', 'A lighter day must follow every hour of exercise.'], 0, 'The recruit improved after balancing demanding days with recovery.'),
  makeQuestion('paragraph-comprehension', 'pc-8', 'What does “the same course” indicate?', ['The recruit improved without an easier course.', 'The coach changed the course.', 'The recruit took a different route.', 'The course was not completed.'], 0, 'The passage says the recruit got faster on the same course.'),
  makeQuestion('paragraph-comprehension', 'pc-9', 'What happened after two weeks?', ['The recruit noticed better strength and speed.', 'The coach ended the training plan.', 'The recruit lengthened every workout again.', 'The recruit had less time to sleep.'], 0, 'This is stated in the passage’s final sentence.'),
  makeQuestion('paragraph-comprehension', 'pc-10', 'Which title best fits the passage?', ['Training Hard and Recovering Well', 'The Longest Course in Camp', 'How to Avoid Sleep', 'A Coach Changes the Rules'], 0, 'This title captures both the training adjustment and its recovery benefit.'),
];

const ar: PracticeQuestion[] = [
  makeQuestion('arithmetic-reasoning', 'ar-1', 'A supply team packs 8 boxes with 24 bandages each. How many bandages are packed?', ['192', '184', '200', '32'], 0, 'Multiply 8 boxes by 24 bandages per box: 8 × 24 = 192.'),
  makeQuestion('arithmetic-reasoning', 'ar-2', 'A vehicle travels 180 miles in 3 hours at a steady rate. What is its speed?', ['60 miles per hour', '45 miles per hour', '90 miles per hour', '540 miles per hour'], 0, 'Speed equals distance divided by time: 180 ÷ 3 = 60.'),
  makeQuestion('arithmetic-reasoning', 'ar-3', 'A jacket costs $80 and is discounted by 25%. What is the sale price?', ['$60', '$20', '$55', '$75'], 0, 'One quarter of $80 is $20; $80 − $20 = $60.'),
  makeQuestion('arithmetic-reasoning', 'ar-4', 'A team uses 3 liters of fuel for every 12 kilometers. At that rate, how much fuel is needed for 40 kilometers?', ['10 liters', '9 liters', '12 liters', '15 liters'], 0, 'The rate is 3 ÷ 12 = 0.25 liter per kilometer. Then 40 × 0.25 = 10.'),
  makeQuestion('arithmetic-reasoning', 'ar-5', 'A water container is 3/4 full and holds 28 gallons when full. How many gallons are in it?', ['21 gallons', '7 gallons', '24 gallons', '25 gallons'], 0, 'Find three quarters of 28: 28 ÷ 4 × 3 = 21.'),
  makeQuestion('arithmetic-reasoning', 'ar-6', 'A group of 15 people is divided equally into 3 teams. How many people are on each team?', ['5', '3', '12', '45'], 0, 'Divide 15 people by 3 teams: 15 ÷ 3 = 5.'),
  makeQuestion('arithmetic-reasoning', 'ar-7', 'A worker earns $18 per hour for 7 hours. What is the total pay before deductions?', ['$126', '$25', '$108', '$136'], 0, 'Multiply the hourly rate by hours: 18 × 7 = 126.'),
  makeQuestion('arithmetic-reasoning', 'ar-8', 'A map scale shows 1 inch represents 5 miles. Two locations are 3.6 inches apart on the map. What is the actual distance?', ['18 miles', '8.6 miles', '15 miles', '20 miles'], 0, 'Multiply the map distance by the scale: 3.6 × 5 = 18.'),
  makeQuestion('arithmetic-reasoning', 'ar-9', 'A storage room has 48 batteries. If 5/8 are issued, how many batteries remain?', ['18', '30', '8', '13'], 0, 'Five eighths of 48 is 30 issued; 48 − 30 = 18 remain.'),
  makeQuestion('arithmetic-reasoning', 'ar-10', 'A 120-mile trip is 40% complete. How many miles remain?', ['72 miles', '48 miles', '80 miles', '60 miles'], 0, 'Forty percent is 48 miles completed. 120 − 48 = 72 miles remain.'),
];

const mk: PracticeQuestion[] = [
  makeQuestion('mathematics-knowledge', 'mk-1', 'Solve for x: 3x + 5 = 20.', ['5', '15', '25/3', '8'], 0, 'Subtract 5 from both sides to get 3x = 15, then divide by 3.'),
  makeQuestion('mathematics-knowledge', 'mk-2', 'What is the area of a rectangle 9 units long and 4 units wide?', ['36 square units', '26 square units', '13 square units', '72 square units'], 0, 'Area of a rectangle is length × width: 9 × 4 = 36.'),
  makeQuestion('mathematics-knowledge', 'mk-3', 'What is the value of 2⁴?', ['16', '8', '6', '12'], 0, '2⁴ means 2 × 2 × 2 × 2, which equals 16.'),
  makeQuestion('mathematics-knowledge', 'mk-4', 'Simplify: 7a − 2a + 3.', ['5a + 3', '5a − 3', '9a + 3', '5a'], 0, 'Combine like terms 7a − 2a; the constant 3 remains.'),
  makeQuestion('mathematics-knowledge', 'mk-5', 'A right triangle has legs of 6 and 8 units. What is the hypotenuse?', ['10 units', '14 units', '√28 units', '12 units'], 0, 'By the Pythagorean theorem, c² = 6² + 8² = 100, so c = 10.'),
  makeQuestion('mathematics-knowledge', 'mk-6', 'What is 3/5 expressed as a percentage?', ['60%', '35%', '50%', '80%'], 0, 'Convert to hundredths: 3/5 = 60/100 = 60%.'),
  makeQuestion('mathematics-knowledge', 'mk-7', 'What is the mean of 4, 6, 8, and 10?', ['7', '6', '8', '28'], 0, 'Add the values (28) and divide by 4: 28 ÷ 4 = 7.'),
  makeQuestion('mathematics-knowledge', 'mk-8', 'Two angles in a triangle are 55° and 65°. What is the third angle?', ['60°', '70°', '120°', '55°'], 0, 'Triangle angles sum to 180°: 180 − 55 − 65 = 60°.'),
  makeQuestion('mathematics-knowledge', 'mk-9', 'Factor: x² − 9.', ['(x − 3)(x + 3)', '(x − 9)(x + 1)', '(x − 3)²', '(x + 9)(x − 1)'], 0, 'This is a difference of squares: a² − b² = (a − b)(a + b).'),
  makeQuestion('mathematics-knowledge', 'mk-10', 'A fair six-sided die is rolled. What is the probability of rolling an even number?', ['1/2', '1/3', '2/3', '1/6'], 0, 'Three of the six outcomes (2, 4, 6) are even: 3/6 = 1/2.'),
];

export const nonVocabularyQuestions: Partial<Record<PracticeSubject, PracticeQuestion[]>> = {
  'paragraph-comprehension': pc,
  'arithmetic-reasoning': ar,
  'mathematics-knowledge': mk,
};

export function getSubjectTitle(subject: PracticeSubject): string {
  return subjects.find((item) => item.id === subject)?.title ?? subjects[0].title;
}
