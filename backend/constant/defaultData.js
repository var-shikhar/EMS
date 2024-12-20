const ACADEMIC_CLASSES = [
  { className: 'Elementary School - 5th Grade' },
  { className: 'Elementary School - 6th Grade' },
  { className: 'Middle School - 7th Grade' },
  { className: 'Middle School - 8th Grade' },
  { className: 'High School - 9th Grade' },
  { className: 'High School - 10th Grade' },
  { className: 'High School - 11th Grade' },
  { className: 'High School - 12th Grade' }
];
const ACADEMIC_SECTIONS = [
  {
    className: 'Elementary School - 5th Grade',
    sectionName: 'A',
    sectionCode: '5A'
  },
  {
    className: 'Elementary School - 5th Grade',
    sectionName: 'B',
    sectionCode: '5B'
  },
  {
    className: 'Elementary School - 6th Grade', 
    sectionName: 'A',
    sectionCode: '6A'
  },
  {
    className: 'Elementary School - 6th Grade', 
    sectionName: 'B',
    sectionCode: '6B'
  },
  {
    className: 'Middle School - 7th Grade', 
    sectionName: 'A',
    sectionCode: '7A'
  },
  {
    className: 'High School - 9th Grade', 
    sectionName: 'A',
    sectionCode: '9A'
  },
  {
    className: 'High School - 9th Grade', 
    sectionName: 'B',
    sectionCode: '9B'
  },
];
const BOOK_CATEGORY = [
  { name: 'Mathematics' },
  { name: 'Science' },
  { name: 'Literature' },
  { name: 'History' },
  { name: 'Geography' },
  { name: 'Computer Science' },
  { name: 'Physics' },
  { name: 'Chemistry' },
  { name: 'Biology' },
  { name: 'Economics' },
  { name: 'Art' },
  { name: 'Philosophy' },
  { name: 'Physical Education' },
  { name: 'Social Studies' },
  { name: 'Music' }
];
const BOOK_GENRES = [
  { name: 'Adventure' },
  { name: 'Romance' },
  { name: 'Science Fiction' },
  { name: 'Fantasy' },
  { name: 'Mystery' },
  { name: 'Horror' },
  { name: 'Historical' },
  { name: 'Thriller' },
  { name: 'Non-Fiction' },
  { name: 'Self-Help' },
  { name: 'Memoir' },
  { name: 'Biography' },
  { name: 'Young Adult' },
  { name: 'Children’s' },
  { name: 'Poetry' }
];
const GENDER = [
  { genderName: 'Male' },
  { genderName: 'Female' },
  { genderName: 'Non-Binary' },
  { genderName: 'Prefer not to say' },
];
const USER_ROLE = [
  { roleName: 'Student' },
  { roleName: 'Teacher' },
  { roleName: 'Parent' },
  { roleName: 'Staff' },
  { roleName: 'Principal' },
  { roleName: 'Librarian' },
];
const USERS = [
  {
    firstName: 'Aarav',
    lastName: 'Sharma',
    displayName: 'AaravS',
    userPhone: '9876543210',
    userEmail: 'aarav.sharma@example.com',
    gender: 'Male',
    password: 'Aarav@1234',
    userRole: 'Teacher',
    isActive: true,
    isBlocked: false,
    uniqueID: 986526,
  },
  {
    firstName: 'Rishabh',
    lastName: 'Kumar',
    displayName: 'rishabhK',
    userPhone: '9871234560',
    userEmail: 'rishabhK@example.com',
    gender: 'Male',
    password: 'Rishabh@1234',
    userRole: 'Parent',
    isActive: true,
    isBlocked: false,
    uniqueID: 869752,
  },
  {
    firstName: 'Meera',
    lastName: 'Nair',
    displayName: 'MeeraN',
    userPhone: '9998887777',
    userEmail: 'meera.nair@example.com',
    gender: 'Female',
    password: 'Meera@1234',
    userRole: 'Librarian',
    isActive: true,
    isBlocked: false,
    uniqueID: 789541,
  },
  {
    firstName: 'Rohan',
    lastName: 'Choudhary',
    displayName: 'rohanChoudhary',
    userPhone: null,
    userEmail: null,
    gender: 'Male',
    password: 'Rohan@1234',
    userRole: 'Student',
    isActive: true,
    isBlocked: false,
    uniqueID: 689402,
  },
  {
    firstName: 'Sanya',
    lastName: 'Singh',
    displayName: 'sanyaSingh',
    userPhone: '9988776655',
    userEmail: 'sanya.singh@example.com',
    gender: 'Female',
    password: 'Sanya@1234',
    userRole: 'Teacher',
    isActive: true,
    isBlocked: false,
    uniqueID: 745896,
  },
  {
    firstName: 'Kabir',
    lastName: 'Patel',
    displayName: 'kabirP',
    userPhone: null,
    userEmail: null,
    gender: 'Male',
    password: 'Kabir@1234',
    userRole: 'Student',
    isActive: true,
    isBlocked: false,
    uniqueID: 659874,
  },
  {
    firstName: 'Aisha',
    lastName: 'Khan',
    displayName: 'aishaK',
    userPhone: null,
    userEmail: null,
    gender: 'Female',
    password: 'Aisha@1234',
    userRole: 'Student',
    isActive: true,
    isBlocked: false,
    uniqueID: 598741,
  },
  {
    firstName: 'Arjun',
    lastName: 'Verma',
    displayName: 'arjunV',
    userPhone: '9988112233',
    userEmail: 'arjun.verma@example.com',
    gender: 'Male',
    password: 'Arjun@1234',
    userRole: 'Librarian',
    isActive: true,
    isBlocked: false,
    uniqueID: 523698,
  },
  {
    firstName: 'Lakshmi',
    lastName: 'Rao',
    displayName: 'lakshmiR',
    userPhone: null,
    userEmail: null,
    gender: 'Female',
    password: 'Lakshmi@1234',
    userRole: 'Student',
    isActive: true,
    isBlocked: false,
    uniqueID: 412598,
  },
  {
    firstName: 'Vikas',
    lastName: 'Mishra',
    displayName: 'vikasM',
    userPhone: null,
    userEmail: null,
    gender: 'Male',
    password: 'Vikas@1234',
    userRole: 'Student',
    isActive: true,
    isBlocked: false,
    uniqueID: 398741,
  },
];
const DEF_BOOKS = [
  {
    title: 'To Kill a Mockingbird',
    category: 'Literature',
    genre: 'Fantasy',
    ISBN: '978-0-06-112008-4',
    author: 'Harper Lee',
    addedBy: 'Aarav',
    totalQuantities: 10,
    lostQuantities: 1,
    availableQuantities: 9,
    rentalPrice: 5,
    fine: 0.99,
    description: 'A novel about racial injustice in the Deep South.'
  },
  {
    title: '1984',
    category: 'Philosophy',
    genre: 'Thriller',
    ISBN: '978-0-452-28423-4',
    author: 'George Orwell',
    addedBy: 'Aarav',
    totalQuantities: 5,
    lostQuantities: 0,
    availableQuantities: 5,
    rentalPrice: 4.99,
    fine: 1.50,
    description: 'A dystopian novel set in a totalitarian society ruled by Big Brother.'
  },
  {
    title: 'The Great Gatsby',
    category: 'Physics',
    genre: 'Biography',
    ISBN: '978-0-7432-7356-5',
    author: 'F. Scott Fitzgerald',
    addedBy: 'Aarav',
    totalQuantities: 8,
    lostQuantities: 2,
    availableQuantities: 6,
    rentalPrice: 3.99,
    fine: 0.75,
    description: 'A novel about the American dream and the roaring twenties.'
  },
  {
    title: 'The Catcher in the Rye',
    category: 'Physical Education',
    genre: 'Young Adult',
    ISBN: '978-0-316-76948-0',
    author: 'J.D. Salinger',
    addedBy: 'Aarav',
    totalQuantities: 12,
    lostQuantities: 0,
    availableQuantities: 12,
    rentalPrice: 6.50,
    fine: 1.00,
    description: 'A story about teenage rebellion and alienation.'
  }
];
const BOOK_TAGS = [
  { name: 'Technology' },
  { name: 'Health' },
  { name: 'Travel' },
  { name: 'Food' },
  { name: 'Lifestyle' },
  { name: 'Education' },
  { name: 'Finance' },
  { name: 'Fitness' },
  { name: 'Parenting' },
  { name: 'Environment' },
  { name: 'Politics' },
  { name: 'Art' },
  { name: 'Culture' },
  { name: 'Fashion' },
  { name: 'Entertainment' },
  { name: 'Book Reviews' },      
  { name: 'Author Interviews' },  
  { name: 'Literary Analysis' },  
  { name: 'Reading Lists' },      
  { name: 'Book Recommendations' },
  { name: 'Book Events' },        
  { name: 'Book Quotes' },        
  { name: 'Self-Publishing' }     
];
const SUBSCRIPTION_TYPES = [
  { name: 'Library Card', description: 'Access to the school library for borrowing books.' },
  { name: 'Canteen Card', description: 'Allows purchasing food and beverages from the school canteen.' },
  { name: 'Bus Card', description: 'Access to the school bus services for transportation.' },
  { name: 'Sports Club Membership', description: 'Membership for various sports activities organized by the school.' },
  { name: 'Swimming Pool Membership', description: 'Access to the school swimming pool and related facilities.' },
  { name: 'Gym Membership', description: 'Allows access to the school gym facilities.' },
  { name: 'Drama Club Membership', description: 'Participation in school theater and drama events.' },
  { name: 'Science Club Membership', description: 'Involvement in science projects and club activities.' },
  { name: 'Coding Club Membership', description: 'Participation in coding and programming workshops.' },
  { name: 'Robotics Club Membership', description: 'Participation in robotics and AI activities.' },
  { name: 'Chess Club Membership', description: 'Access to school chess club activities and tournaments.' },
  { name: 'Math Club Membership', description: 'Membership to participate in math-related activities and competitions.' },
];
const USER_SUBSCRIPTIONS = [
  {
    userID: 689402,
    subscriptionTypeName: 'Library Card',
    status: 'Active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2025-01-15'),
  },
  {
    userID: 689402,
    subscriptionTypeName: 'Library Card',
    status: 'Active',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-02-01'),
  },
  {
    userID: 689402,
    subscriptionTypeName: 'Canteen Card',
    status: 'Inactive',
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-09-10'),
  },
  {
    userID: 689402,
    subscriptionTypeName: 'Sports Club Membership',
    status: 'Expired',
    startDate: new Date('2023-04-15'),
    endDate: new Date('2024-04-15'),
  },
  {
    userID: 689402,
    subscriptionTypeName: 'Gym Membership',
    status: 'Active',
    startDate: new Date('2024-06-20'),
    endDate: new Date('2025-06-20'),
  },
  {
    userID: 689402,
    subscriptionTypeName: 'Coding Club Membership',
    status: 'Active',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2025-07-10'),
  },
];
const DEF_SUBJECTS = [
  {
    name: "Mathematics",
    code: "MATH101",
    description: "Basic mathematics covering algebra, geometry, and trigonometry.",
    isActive: true
  },
  {
    name: "Physics",
    code: "PHY102",
    description: "Introduction to mechanics, waves, and thermodynamics.",
    isActive: true
  },
  {
    name: "Chemistry",
    code: "CHEM103",
    description: "Basic concepts of organic and inorganic chemistry.",
    isActive: true
  },
  {
    name: "History",
    code: "HIST104",
    description: "World history focusing on ancient and modern civilizations.",
    isActive: false
  },
];
const DEF_DEGREES = [
  {
    name: "Bachelor of Science in Mathematics",
    code: "BSCMATH",
    durationYears: 3,
    description: "A degree focusing on mathematical theories and applications.",
    department: "Department of Mathematics",
    isActive: true
  },
  {
    name: "Bachelor of Science in Physics",
    code: "BSCPHY",
    durationYears: 3,
    description: "An undergraduate program in classical and modern physics.",
    department: "Department of Physics",
    isActive: true
  },
  {
    name: "Bachelor of Arts in History",
    code: "BAHIST",
    durationYears: 3,
    description: "A degree exploring global history and its impact on modern society.",
    department: "Department of History",
    isActive: true
  },
  {
    name: "Master of Science in Chemistry",
    code: "MSCHEM",
    durationYears: 2,
    description: "Advanced studies in organic and inorganic chemistry.",
    department: "Department of Chemistry",
    isActive: false
  }
];
const DEF_DEPARTMENTS = [
  {
    name: "Department of Mathematics",
    code: "DEPTMATH",
    description: "Focuses on mathematical research and education.",
    isActive: true
  },
  {
    name: "Department of Physics",
    code: "DEPTPHY",
    description: "Engaged in teaching and research in physics.",
    isActive: true
  },
  {
    name: "Department of Chemistry",
    code: "DEPTCHEM",
    description: "Covers chemical sciences and interdisciplinary research.",
    isActive: true
  },
  {
    name: "Department of History",
    code: "DEPTHIST",
    description: "Explores historical studies and heritage preservation.",
    isActive: false
  }
];




const DEFAULT_DATA = { DEF_SUBJECTS, DEF_DEGREES, DEF_DEPARTMENTS, 
  ACADEMIC_CLASSES, ACADEMIC_SECTIONS, BOOK_CATEGORY, BOOK_GENRES, GENDER, USER_ROLE, USERS, DEF_BOOKS, BOOK_TAGS, SUBSCRIPTION_TYPES, USER_SUBSCRIPTIONS }
export default DEFAULT_DATA;