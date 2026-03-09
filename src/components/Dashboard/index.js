import React, { useState, useEffect } from 'react';
import ScrollContainer from '../ui-components/ScrollContainer';
import { SparklesSectionTitle } from '../ui/SparklesSectionTitle';
import { 
  FiUser, 
  FiBell, 
  FiSettings, 
  FiTrendingUp, 
  FiCalendar, 
  FiFileText, 
  FiHeart, 
  FiShare2, 
  FiDownload, 
  FiUpload,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiStar,
  FiTarget,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiMapPin,
  FiDollarSign,
  FiGlobe,
  FiFilter,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSend
} from 'react-icons/fi';
import styles from './style.module.css';

// Mock data for demonstration
const mockDashboardData = {
  user: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "👨‍🎓",
    level: "Senior",
    progress: 75
  },
  stats: {
    applications: 12,
    matches: 8,
    documents: 15,
    scholarships: 5,
    interviews: 3,
    acceptances: 2
  },
  recentActivity: [
    {
      id: 1,
      type: "application",
      title: "Application submitted to Harvard University",
      time: "2 hours ago",
      status: "submitted",
      icon: FiCheckCircle
    },
    {
      id: 2,
      type: "document",
      title: "Transcript uploaded successfully",
      time: "4 hours ago",
      status: "completed",
      icon: FiFileText
    },
    {
      id: 3,
      type: "interview",
      title: "Interview scheduled with Stanford University",
      time: "1 day ago",
      status: "scheduled",
      icon: FiCalendar
    },
    {
      id: 4,
      type: "scholarship",
      title: "New scholarship opportunity: Merit Scholarship",
      time: "2 days ago",
      status: "available",
      icon: FiAward
    }
  ],
  applications: [
    {
      id: 1,
      university: "Harvard University",
      program: "Computer Science",
      status: "submitted",
      progress: 100,
      deadline: "2024-01-15",
      matchScore: 98,
      priority: "high"
    },
    {
      id: 2,
      university: "Stanford University",
      program: "Engineering",
      status: "in_progress",
      progress: 75,
      deadline: "2024-01-20",
      matchScore: 95,
      priority: "high"
    },
    {
      id: 3,
      university: "MIT",
      program: "Computer Science",
      status: "in_progress",
      progress: 60,
      deadline: "2024-01-25",
      matchScore: 92,
      priority: "medium"
    },
    {
      id: 4,
      university: "University of Oxford",
      program: "Mathematics",
      status: "draft",
      progress: 30,
      deadline: "2024-02-01",
      matchScore: 89,
      priority: "low"
    }
  ],
  matches: [
    {
      id: 1,
      university: "Harvard University",
      matchScore: 98,
      programs: ["Computer Science", "Business"],
      location: "Cambridge, MA",
      tuition: 54000,
      ranking: 1,
      deadline: "2024-01-15"
    },
    {
      id: 2,
      university: "Stanford University",
      matchScore: 95,
      programs: ["Engineering", "Computer Science"],
      location: "Stanford, CA",
      tuition: 56000,
      ranking: 2,
      deadline: "2024-01-20"
    },
    {
      id: 3,
      university: "MIT",
      matchScore: 92,
      programs: ["Engineering", "Physics"],
      location: "Cambridge, MA",
      tuition: 53000,
      ranking: 3,
      deadline: "2024-01-25"
    }
  ],
  scholarships: [
    {
      id: 1,
      name: "Merit Scholarship",
      amount: 15000,
      university: "Harvard University",
      deadline: "2024-01-10",
      status: "available",
      requirements: ["GPA 3.8+", "SAT 1400+"]
    },
    {
      id: 2,
      name: "Engineering Excellence Award",
      amount: 20000,
      university: "Stanford University",
      deadline: "2024-01-15",
      status: "applied",
      requirements: ["Engineering Major", "Portfolio"]
    },
    {
      id: 3,
      name: "Research Fellowship",
      amount: 25000,
      university: "MIT",
      deadline: "2024-01-20",
      status: "available",
      requirements: ["Research Experience", "Recommendation"]
    }
  ]
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(mockDashboardData);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications
      const newNotification = {
        id: Date.now(),
        type: "info",
        title: "New university match found",
        message: "You have a new 95% match with UC Berkeley",
        time: "Just now",
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
      case 'completed':
      case 'accepted':
        return 'var(--color-success)';
      case 'in_progress':
      case 'scheduled':
        return 'var(--color-warning)';
      case 'draft':
      case 'available':
        return 'var(--color-info)';
      case 'rejected':
      case 'expired':
        return 'var(--color-error)';
      default:
        return 'var(--color-neutral-500)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
      case 'completed':
        return FiCheckCircle;
      case 'in_progress':
      case 'scheduled':
        return FiClock;
      case 'draft':
      case 'available':
        return FiAlertCircle;
      default:
        return FiAlertCircle;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={styles.dashboard}>
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {data.user.avatar}
              </div>
              <div className={styles.userDetails}>
                <h1 className={styles.userName}>Welcome back, {data.user.name}!</h1>
                <p className={styles.userLevel}>Level {data.user.level} • {data.user.progress}% Complete</p>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <button 
                className={styles.notificationButton}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell />
                {notifications.length > 0 && (
                  <span className={styles.notificationBadge}>{notifications.length}</span>
                )}
              </button>
              
              <button className={styles.settingsButton}>
                <FiSettings />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className={styles.notificationsDropdown}>
          <div className={styles.container}>
            <div className={styles.notificationsContent}>
              <div className={styles.notificationsHeader}>
                <h3>Notifications</h3>
                <button 
                  className={styles.clearAllButton}
                  onClick={() => setNotifications([])}
                >
                  Clear All
                </button>
              </div>
              
              <div className={styles.notificationsList}>
                {notifications.length === 0 ? (
                  <p className={styles.noNotifications}>No new notifications</p>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className={styles.notificationItem}>
                      <div className={styles.notificationIcon}>
                        <FiBell />
                      </div>
                      <div className={styles.notificationContent}>
                        <h4 className={styles.notificationTitle}>{notification.title}</h4>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <span className={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Navigation */}
      <div className={styles.dashboardNav}>
        <div className={styles.container}>
          <nav className={styles.navTabs}>
            <button 
              className={`${styles.navTab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FiBarChart />
              Overview
            </button>
            <button 
              className={`${styles.navTab} ${activeTab === 'applications' ? styles.active : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <FiFileText />
              Applications
            </button>
            <button 
              className={`${styles.navTab} ${activeTab === 'matches' ? styles.active : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <FiTarget />
              Matches
            </button>
            <button 
              className={`${styles.navTab} ${activeTab === 'documents' ? styles.active : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FiUpload />
              Documents
            </button>
            <button 
              className={`${styles.navTab} ${activeTab === 'timeline' ? styles.active : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <FiCalendar />
              Timeline
            </button>
            <button 
              className={`${styles.navTab} ${activeTab === 'scholarships' ? styles.active : ''}`}
              onClick={() => setActiveTab('scholarships')}
            >
              <FiAward />
              Scholarships
            </button>
          </nav>
        </div>
      </div>

      {/* Dashboard Content with Scroll Container */}
      <ScrollContainer variant="minimal" className={styles.dashboardContent}>
        <div className={styles.container}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              {/* Quick Stats */}
              <div className={styles.quickStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiFileText />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>{data.stats.applications}</div>
                    <div className={styles.statLabel}>Applications</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiTarget />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>{data.stats.matches}</div>
                    <div className={styles.statLabel}>Matches</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiUpload />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>{data.stats.documents}</div>
                    <div className={styles.statLabel}>Documents</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiAward />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>{data.stats.scholarships}</div>
                    <div className={styles.statLabel}>Scholarships</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={styles.recentActivity}>
                <div className={styles.sectionHeader}>
                  <SparklesSectionTitle as="h2" className={styles.sectionTitle}>Recent Activity</SparklesSectionTitle>
                  <button className="btn btn-outline btn-sm">View All</button>
                </div>
                
                <div className={styles.activityList}>
                  {data.recentActivity.map(activity => {
                    const StatusIcon = activity.icon;
                    return (
                      <div key={activity.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          <StatusIcon style={{ color: getStatusColor(activity.status) }} />
                        </div>
                        <div className={styles.activityContent}>
                          <h4 className={styles.activityTitle}>{activity.title}</h4>
                          <span className={styles.activityTime}>{activity.time}</span>
                        </div>
                        <div className={styles.activityStatus}>
                          <span 
                            className={styles.statusBadge}
                            style={{ backgroundColor: getStatusColor(activity.status) }}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Overview */}
              <div className={styles.progressOverview}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Application Progress</h2>
                </div>
                
                <div className={styles.progressCards}>
                  {data.applications.map(application => (
                    <div key={application.id} className={styles.progressCard}>
                      <div className={styles.progressHeader}>
                        <h3 className={styles.progressTitle}>{application.university}</h3>
                        <span className={styles.matchScore}>{application.matchScore}% Match</span>
                      </div>
                      
                      <div className={styles.progressBody}>
                        <div className={styles.progressInfo}>
                          <span className={styles.programName}>{application.program}</span>
                          <span className={styles.deadline}>
                            Due: {formatDate(application.deadline)} ({getDaysUntilDeadline(application.deadline)} days)
                          </span>
                        </div>
                        
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${application.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className={styles.progressStats}>
                          <span className={styles.progressPercent}>{application.progress}% Complete</span>
                          <span className={styles.progressStatus}>{application.status}</span>
                        </div>
                      </div>
                      
                      <div className={styles.progressActions}>
                        <button className="btn btn-outline btn-sm">
                          <FiEye />
                          View
                        </button>
                        <button className="btn btn-primary btn-sm">
                          <FiEdit />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className={styles.applicationsTab}>
              <div className={styles.sectionHeader}>
                <SparklesSectionTitle as="h2" className={styles.sectionTitle}>My Applications</SparklesSectionTitle>
                <button className="btn btn-primary">
                  <FiPlus />
                  New Application
                </button>
              </div>
              
              <div className={styles.applicationsList}>
                {data.applications.map(application => (
                  <div key={application.id} className={styles.applicationCard}>
                    <div className={styles.applicationHeader}>
                      <div className={styles.universityInfo}>
                        <h3 className={styles.universityName}>{application.university}</h3>
                        <p className={styles.programName}>{application.program}</p>
                      </div>
                      <div className={styles.applicationMeta}>
                        <span className={styles.matchScore}>{application.matchScore}% Match</span>
                        <span className={styles.priority}>{application.priority} Priority</span>
                      </div>
                    </div>
                    
                    <div className={styles.applicationBody}>
                      <div className={styles.progressSection}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${application.progress}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>{application.progress}% Complete</span>
                      </div>
                      
                      <div className={styles.applicationDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Status:</span>
                          <span 
                            className={styles.detailValue}
                            style={{ color: getStatusColor(application.status) }}
                          >
                            {application.status}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Deadline:</span>
                          <span className={styles.detailValue}>{formatDate(application.deadline)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Days Left:</span>
                          <span className={styles.detailValue}>{getDaysUntilDeadline(application.deadline)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.applicationActions}>
                      <button className="btn btn-outline btn-sm">
                        <FiEye />
                        View
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <FiEdit />
                        Edit
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <FiSend />
                        Submit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className={styles.matchesTab}>
              <div className={styles.sectionHeader}>
                <SparklesSectionTitle as="h2" className={styles.sectionTitle}>University Matches</SparklesSectionTitle>
                <button className="btn btn-outline">
                  <FiFilter />
                  Filter Matches
                </button>
              </div>
              
              <div className={styles.matchesGrid}>
                {data.matches.map(match => (
                  <div key={match.id} className={styles.matchCard}>
                    <div className={styles.matchHeader}>
                      <div className={styles.universityLogo}>🎓</div>
                      <div className={styles.matchInfo}>
                        <h3 className={styles.universityName}>{match.university}</h3>
                        <div className={styles.matchLocation}>
                          <FiMapPin />
                          {match.location}
                        </div>
                      </div>
                      <div className={styles.matchScore}>
                        <span className={styles.scoreNumber}>{match.matchScore}%</span>
                        <span className={styles.scoreLabel}>Match</span>
                      </div>
                    </div>
                    
                    <div className={styles.matchBody}>
                      <div className={styles.matchStats}>
                        <div className={styles.stat}>
                          <FiTrendingUp />
                          <span>#{match.ranking} Ranking</span>
                        </div>
                        <div className={styles.stat}>
                          <FiDollarSign />
                          <span>{formatCurrency(match.tuition)}/year</span>
                        </div>
                        <div className={styles.stat}>
                          <FiCalendar />
                          <span>Due: {formatDate(match.deadline)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.programs}>
                        <h4 className={styles.programsTitle}>Available Programs:</h4>
                        <div className={styles.programsList}>
                          {match.programs.map((program, index) => (
                            <span key={index} className={styles.programTag}>
                              {program}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.matchActions}>
                      <button className="btn btn-outline btn-sm">
                        <FiHeart />
                        Save
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <FiShare2 />
                        Share
                      </button>
                      <button className="btn btn-primary btn-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scholarships' && (
            <div className={styles.scholarshipsTab}>
              <div className={styles.sectionHeader}>
                <SparklesSectionTitle as="h2" className={styles.sectionTitle}>Scholarship Opportunities</SparklesSectionTitle>
                <button className="btn btn-outline">
                  <FiSearch />
                  Find More
                </button>
              </div>
              
              <div className={styles.scholarshipsList}>
                {data.scholarships.map(scholarship => (
                  <div key={scholarship.id} className={styles.scholarshipCard}>
                    <div className={styles.scholarshipHeader}>
                      <div className={styles.scholarshipInfo}>
                        <h3 className={styles.scholarshipName}>{scholarship.name}</h3>
                        <p className={styles.scholarshipUniversity}>{scholarship.university}</p>
                      </div>
                      <div className={styles.scholarshipAmount}>
                        <span className={styles.amountNumber}>{formatCurrency(scholarship.amount)}</span>
                        <span className={styles.amountLabel}>per year</span>
                      </div>
                    </div>
                    
                    <div className={styles.scholarshipBody}>
                      <div className={styles.scholarshipDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Deadline:</span>
                          <span className={styles.detailValue}>{formatDate(scholarship.deadline)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Status:</span>
                          <span 
                            className={styles.detailValue}
                            style={{ color: getStatusColor(scholarship.status) }}
                          >
                            {scholarship.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.requirements}>
                        <h4 className={styles.requirementsTitle}>Requirements:</h4>
                        <ul className={styles.requirementsList}>
                          {scholarship.requirements.map((requirement, index) => (
                            <li key={index} className={styles.requirementItem}>
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className={styles.scholarshipActions}>
                      <button className="btn btn-outline btn-sm">
                        <FiEye />
                        View Details
                      </button>
                      <button className="btn btn-primary btn-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default Dashboard;