export const marketingAds = [
  {
    id: 1,
    title: 'Digital India Summit 2024',
    description: 'Join us for the biggest digital transformation event',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    date: '2024-02-15'
  },
  {
    id: 2,
    title: 'Swachh Bharat Mission',
    description: 'Clean India, Green India - Be part of the change',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    date: '2024-02-20'
  },
  {
    id: 3,
    title: 'Skill Development Program',
    description: 'Empowering youth with modern skills',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    date: '2024-02-25'
  }
];

export const progressData = {
  todayTarget: {
    achieved: 75,
    total: 100,
    label: 'Today\'s Target'
  },
  overallTarget: {
    achieved: 450,
    total: 600,
    label: 'Overall Target'
  },
  votersReached: {
    count: 1250,
    label: 'Voters Reached'
  },
  applicationsProcessed: {
    count: 89,
    label: 'Applications Processed'
  }
};

export const quickActions = [
  {
    id: 1,
    title: 'Voters',
    icon: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop',
    route: '/search-voter',
    badge: 0
  },
  {
    id: 2,
    title: 'Help Desk ',
    icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
    route: '/help-desk',
    badge: 5
  },
  {
    id: 3,
    title: 'Application',
    icon: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop',
    route: '/pending-applications',
    badge: 12
  },
  {
    id: 4,
    title: 'Event',
    icon: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100&h=100&fit=crop',
    route: '/events',
    badge: 0
  },
  {
    id: 5,
    title: 'Survey',
    icon: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop',
    route: '/surveys',
    badge: 3
  },
  {
    id: 6,
    title: 'Feedback',
    icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
    route: '/feedback',
    badge: 0
  }
];

export const mockVoters = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    voterId: 'BJP001234',
    mobileNumber: '9876543210',
    guardianName: 'Suresh Kumar',
    houseName: 'Kumar Villa',
    address: 'MG Road, Kochi, Kerala',
    lastInteractionDate: '2024-01-15',
    karyakartaName: 'Priya Nair',
    partyInclination: 'BJP',
    age: 45,
    gender: 'Male',
    ward: 'Ward 12',
    assemblyConstituency: 'Kochi Central'
  },
  {
    id: '2',
    name: 'Meera Devi',
    voterId: 'IND005678',
    mobileNumber: '',
    guardianName: 'Raman Nair',
    houseName: 'Nair House',
    address: 'Temple Road, Thrissur, Kerala',
    lastInteractionDate: '2024-01-10',
    karyakartaName: 'Sunil Kumar',
    partyInclination: 'Independent',
    age: 52,
    gender: 'Female',
    ward: 'Ward 8',
    assemblyConstituency: 'Thrissur East'
  },
  {
    id: '3',
    name: 'Arjun Menon',
    voterId: 'BJP009876',
    mobileNumber: '8765432109',
    guardianName: 'Krishnan Menon',
    houseName: 'Menon Bhavan',
    address: 'Beach Road, Kozhikode, Kerala',
    lastInteractionDate: '2024-01-20',
    karyakartaName: 'Lakshmi Pillai',
    partyInclination: 'BJP',
    age: 38,
    gender: 'Male',
    ward: 'Ward 15',
    assemblyConstituency: 'Kozhikode North'
  },
  {
    id: '4',
    name: 'Priya Nair',
    voterId: 'BJP002345',
    mobileNumber: '9123456789',
    guardianName: 'Ravi Nair',
    houseName: 'Nair Residence',
    address: 'Civil Lines, Thiruvananthapuram, Kerala',
    lastInteractionDate: '2024-01-25',
    karyakartaName: 'Rajesh Kumar',
    partyInclination: 'BJP',
    age: 34,
    gender: 'Female',
    ward: 'Ward 5',
    assemblyConstituency: 'Thiruvananthapuram Central'
  },
  {
    id: '5',
    name: 'Arun Pillai',
    voterId: 'INC003456',
    mobileNumber: '9234567890',
    guardianName: 'Gopal Pillai',
    houseName: 'Pillai House',
    address: 'Market Road, Kollam, Kerala',
    lastInteractionDate: '2024-01-12',
    karyakartaName: 'Meera Devi',
    partyInclination: 'Inclined',
    age: 41,
    gender: 'Male',
    ward: 'Ward 9',
    assemblyConstituency: 'Kollam South'
  },
  {
    id: '6',
    name: 'Lakshmi Pillai',
    voterId: 'NEU004567',
    mobileNumber: '9345678901',
    guardianName: 'Krishnan Pillai',
    houseName: 'Lakshmi Bhavan',
    address: 'Station Road, Palakkad, Kerala',
    lastInteractionDate: '2024-01-08',
    karyakartaName: 'Arjun Menon',
    partyInclination: 'Neutral',
    age: 48,
    gender: 'Female',
    ward: 'Ward 11',
    assemblyConstituency: 'Palakkad East'
  },
  {
    id: '7',
    name: 'Sunil Kumar',
    voterId: 'ANT005678',
    mobileNumber: '9456789012',
    guardianName: 'Mohan Kumar',
    houseName: 'Kumar Nivas',
    address: 'Church Road, Kottayam, Kerala',
    lastInteractionDate: '2024-01-18',
    karyakartaName: 'Priya Nair',
    partyInclination: 'Anti',
    age: 55,
    gender: 'Male',
    ward: 'Ward 7',
    assemblyConstituency: 'Kottayam West'
  },
  {
    id: '8',
    name: 'Ramesh Kumar',
    voterId: 'BJP006789',
    mobileNumber: '9567890123',
    guardianName: 'Vijay Kumar',
    houseName: 'Ramesh Villa',
    address: 'Main Street, Kannur, Kerala',
    lastInteractionDate: '2024-01-22',
    karyakartaName: 'Lakshmi Pillai',
    partyInclination: 'BJP',
    age: 42,
    gender: 'Male',
    ward: 'Ward 14',
    assemblyConstituency: 'Kannur North'
  },
  {
    id: '9',
    name: 'Sita Devi',
    voterId: 'IND007890',
    mobileNumber: '',
    guardianName: 'Ram Prasad',
    houseName: 'Sita Mandir',
    address: 'Temple Street, Alappuzha, Kerala',
    lastInteractionDate: '2024-01-05',
    karyakartaName: 'Sunil Kumar',
    partyInclination: 'Independent',
    age: 39,
    gender: 'Female',
    ward: 'Ward 6',
    assemblyConstituency: 'Alappuzha Central'
  },
  {
    id: '10',
    name: 'Vinod Menon',
    voterId: 'BJP008901',
    mobileNumber: '9678901234',
    guardianName: 'Raman Menon',
    houseName: 'Vinod House',
    address: 'Hill View, Munnar, Kerala',
    lastInteractionDate: '2024-01-28',
    karyakartaName: 'Ramesh Kumar',
    partyInclination: 'BJP',
    age: 36,
    gender: 'Male',
    ward: 'Ward 3',
    assemblyConstituency: 'Munnar Hills'
  }
];

export const mockHelpDeskApplications = {
  total_count: 2,
  applications: [
    {
      id: '689c8192ba876f40dd019f67',
      user_id: '688b2c56dd4428cbec098cdf',
      name: 'Test Name X01',
      voter_id: '123456789101',
      aadhaar_number: '123456121232',
      mobile_number: '7012311734',
      email: 'akbar.k@edifydata.com',
      dob: '1983-08-18T18:30:00',
      gender: 'MALE',
      religion: 'Test Religion',
      caste: 'Test Cast',
      address_line1: 'Test Address',
      address_line2: 'Test Address 2',
      district: 'Thrissur North',
      assembly_mandalam: 'Guruvayoor',
      panchayat: null,
      municipalitie: 'Guruvayur',
      corporation: null,
      ward: 'Pillakkad',
      pincode: '680505',
      occupation: 'Test Occupation',
      marital_status: 'Married',
      income_range: '5-10L',
      benefited_scheme: 'NO',
      scheme_id: '686b58a506487974ab387ec2',
      scheme_details: '',
      required_help: 'Test Help',
      documents: [
        'https://vikasitakeraladocs.s3.amazonaws.com/documents/20250813_121404_TestDocument.docx'
      ],
      status: 'PENDING',
      created_at: '2025-08-13T12:14:10.901000',
      updated_at: '2025-08-13T12:14:10.901000',
      application_id: 'VK202508130002'
    },
    {
      id: '689c8ecfba876f40dd019f6a',
      user_id: '688b2c56dd4428cbec098cdf',
      name: 'Midhun P',
      voter_id: 'V123456789',
      aadhaar_number: '123456789012',
      mobile_number: '9074842009',
      email: 'midhun.p@edifydata.com',
      dob: '1994-06-12T13:00:00',
      gender: 'MALE',
      religion: 'Hindu',
      caste: 'nil',
      address_line1: 'Midhunam Apra 220 chackai pettah p.o',
      address_line2: 'trivandrum',
      district: 'Thiruvananthapuram City',
      assembly_mandalam: 'Thiruvananthapuram Central',
      panchayat: null,
      municipalitie: null,
      corporation: 'Thiruvananthapuram Corporation',
      ward: 'Palayam',
      pincode: '695024',
      occupation: 'IT Sector',
      marital_status: 'Married',
      income_range: '5-10L',
      benefited_scheme: 'NO',
      scheme_id: '686b8152e57d484e613b1353',
      scheme_details: '',
      required_help: 'No',
      documents: [
        'https://vikasitakeraladocs.s3.amazonaws.com/documents/20250813_131018_KERALA_STYLE_CAULIFLOWER_KURMA-ezgif.com-jpg-to-webp-converter.webp'
      ],
      status: 'PENDING',
      created_at: '2025-08-13T13:10:39.668000',
      updated_at: '2025-08-13T13:11:37.232000',
      application_id: 'VK202508130003'
    }
  ]
};

export const mockGovernmentSchemes = {
  items: [
    {
      name: 'Pradhan Mantri Mudra Yojana',
      category: 'EMPLOYMENT',
      min_age: 1,
      max_age: 120,
      gender: 'ALL',
      marital_status: null,
      community: 'GENERAL',
      differently_Abled: false,
      occupation: null,
      student_status: false,
      BPL_Status: false,
      official_site: 'https://www.jansamarth.in/home',
      start_date: '2025-07-07T05:15:06.846000',
      end_date: '2030-10-06T18:30:00',
      status: 'ACTIVE',
      beneficiaries: 'Any Indian citizen wanting to start or expand a non-farm income-generating activity',
      budget: 2000000,
      description: 'Seeks to promote entrepreneurship and financial inclusion among small business owners. Offers collateral-free loans up to ₹20 lakh to micro and small enterprises.',
      id: '686b58a506487974ab387ec2',
      created_at: '2025-07-07T05:18:29.487000',
      updated_at: '2025-07-07T05:18:29.487000'
    },
    {
      name: 'Kisan Credit Card',
      category: 'AGRICULTURE',
      min_age: 1,
      max_age: 120,
      gender: 'ALL',
      marital_status: null,
      community: 'GENERAL',
      differently_Abled: false,
      occupation: null,
      student_status: false,
      BPL_Status: false,
      official_site: null,
      start_date: '2025-07-07T05:23:20.725000',
      end_date: '2030-10-06T18:30:00',
      status: 'ACTIVE',
      beneficiaries: 'All farmers, including individual farmers, joint borrowers, tenant farmers, and sharecroppers.',
      budget: 100000,
      description: 'Provide farmers with timely and adequate credit to meet their short-term and long-term agricultural needs.',
      id: '686b5cf906487974ab387ec3',
      created_at: '2025-07-07T05:36:57.648000',
      updated_at: '2025-07-07T05:36:57.648000'
    },
    {
      name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana',
      category: 'HEALTH',
      min_age: 1,
      max_age: 120,
      gender: 'ALL',
      marital_status: null,
      community: 'GENERAL',
      differently_Abled: false,
      occupation: null,
      student_status: false,
      BPL_Status: false,
      official_site: 'https://pmjay.gov.in/',
      start_date: '2025-07-07T07:59:20.335000',
      end_date: '2030-10-06T18:30:00',
      status: 'ACTIVE',
      beneficiaries: 'Economically weaker sections as identified by the Socio-Economic and Caste Census (SECC), 2011 data.',
      budget: 499999,
      description: 'To provide health insurance to economically weaker sections of society. Health insurance coverage of ₹5 lakh per family per year for hospitalisation.',
      id: '686b8152e57d484e613b1353',
      created_at: '2025-07-07T08:12:02.625000',
      updated_at: '2025-07-07T08:12:02.625000'
    }
  ],
  total: 3
};