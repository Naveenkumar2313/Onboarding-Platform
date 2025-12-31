// Define distinct navigation arrays for each role
export const adminNavigation = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  { label: 'Management', type: 'label' },
  { name: 'Invite Users', path: '/admin/invite', icon: 'group_add' }, // We'll build this later
  { name: 'Verifications', path: '/dashboard/default', icon: 'verified_user' },
];

export const studentNavigation = [
  { name: 'My Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  { label: 'Application', type: 'label' },
  { name: 'My Profile', path: '/onboarding/student', icon: 'person' }, // Links back to form for editing
];

export const facultyNavigation = [
  { name: 'My Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  { label: 'Professional', type: 'label' },
  { name: 'My Profile', path: '/onboarding/faculty', icon: 'school' },
  { name: 'personal info', path: '/onboarding/personal_info', icon: 'person' },
];

