// Navigation Configuration for UniversityMatch
// Based on 3-tier smart navigation: Main > Sub-section > Items

export const navigationConfig = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    path: '/dashboard',
    badge: null,
    sections: null // No subsections, direct link
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: '🔍',
    path: null,
    expanded: true, // Default open
    sections: [
      {
        id: 'universities',
        label: 'Universities',
        icon: '🎓',
        path: '/discover/universities'
      },
      {
        id: 'scholarships',
        label: 'Scholarships',
        icon: '💰',
        path: '/discover/scholarships'
      },
      {
        id: 'dream-university',
        label: 'Dream University',
        icon: '⭐',
        path: '/discover/dream'
      }
    ]
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: '📋',
    path: null,
    badge: { text: '3', variant: 'warning' },
    sections: [
      {
        id: 'timeline',
        label: 'Timeline',
        icon: '📅',
        path: '/applications/timeline'
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: '📄',
        path: '/applications/documents'
      },
      {
        id: 'reels',
        label: 'University Reels',
        icon: '🎬',
        path: '/applications/reels'
      }
    ]
  },
  {
    id: 'ai-matching',
    label: 'AI Matching',
    icon: '🤖',
    path: null,
    badge: { text: 'AI', variant: 'premium' },
    sections: [
      {
        id: 'match-universities',
        label: 'Universities',
        icon: '🎯',
        path: '/ai/match-universities'
      },
      {
        id: 'match-scholarships',
        label: 'Scholarships',
        icon: '🎯',
        path: '/ai/match-scholarships'
      },
      {
        id: 'similar-students',
        label: 'Similar Students',
        icon: '👥',
        path: '/ai/similar-students'
      },
      {
        id: 'career-path',
        label: 'Career Path',
        icon: '📊',
        path: '/ai/career-path'
      }
    ]
  },
  {
    id: 'community',
    label: 'Community',
    icon: '👥',
    path: null,
    sections: [
      {
        id: 'friends',
        label: 'Friends',
        icon: '👫',
        path: '/community/friends'
      },
      {
        id: 'mentors',
        label: 'Alumni Mentors',
        icon: '🎓',
        path: '/community/mentors'
      },
      {
        id: 'study-together',
        label: 'Study Together',
        icon: '📚',
        path: '/community/study'
      }
    ]
  },
  {
    id: 'professional',
    label: 'Professional',
    icon: '💼',
    path: null,
    badge: { text: 'PRO', variant: 'premium' },
    sections: [
      {
        id: 'internships',
        label: 'Internships',
        icon: '💼',
        path: '/professional/internships'
      },
      {
        id: 'masters',
        label: 'Masters Programs',
        icon: '🎓',
        path: '/professional/masters'
      }
    ]
  },
  {
    id: 'services',
    label: 'Premium Services',
    icon: '✨',
    path: null,
    badge: { text: 'PREMIUM', variant: 'premium' },
    sections: [
      {
        id: 'essay-reviews',
        label: 'Essay Reviews',
        icon: '📝',
        path: '/services/essay-reviews'
      },
      {
        id: 'mock-interviews',
        label: 'Mock Interviews',
        icon: '🎤',
        path: '/services/interviews'
      },
      {
        id: 'concierge',
        label: 'Concierge',
        icon: '🎩',
        path: '/services/concierge'
      }
    ]
  }
]

// Secondary Navigation (Quick Links)
export const secondaryNav = [
  {
    id: 'courses',
    label: 'Courses',
    icon: '📖',
    path: '/courses'
  },
  {
    id: 'verification',
    label: 'Get Verified',
    icon: '✅',
    path: '/verification',
    badge: { text: 'NEW', variant: 'success' }
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: '🔒',
    path: '/privacy'
  },
  {
    id: 'contact',
    label: 'Send Info to Us',
    icon: '📤',
    path: '/contact'
  }
]



