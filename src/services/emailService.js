/**
 * EmailJS Service for UniversityMatch
 * Handles email notifications and contact form submissions
 */

class EmailService {
    constructor() {
        // EmailJS Configuration
        this.emailServiceId = 'service_s0bhkhi'; // Your EmailJS service ID
        this.emailTemplateId = 'template_we4r5x9'; // Your EmailJS template ID
        this.emailPublicKey = 'I_m3b6E2nY4M58E_k'; // Your EmailJS public key
        this.to_email = 'quadfounderscorporation@gmail.com'; // Your email address
        
        // Telegram Configuration
        this.telegramBotToken = '8257597178:AAE97pOSor5qt3eFNstmk9y0XeyyheOoXGg'; // Your bot token
        this.telegramChatId = '1845331783'; // Your Telegram chat ID
        
        // Initialize EmailJS
        this.initEmailJS();
    }

    /**
     * Initialize EmailJS
     */
    initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailPublicKey);
        } else {
            console.warn('EmailJS not loaded. Please include EmailJS script.');
        }
    }

    /**
     * Send contact form email
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form (contact, application, etc.)
     */
    async sendContactEmail(formData, formType = 'contact-form') {
        try {
            const templateParams = {
                to_email: this.to_email,
                from_name: formData.name || 'UniversityMatch User',
                from_email: formData.email || 'noreply@universitymatch.com',
                subject: this.getEmailSubject(formType),
                message: this.formatEmailMessage(formData, formType),
                form_type: formType,
                timestamp: new Date().toLocaleString(),
                user_ip: await this.getUserIP()
            };

            const result = await emailjs.send(
                this.emailServiceId,
                this.emailTemplateId,
                templateParams
            );

            console.log('Email sent successfully:', result);
            
            // Send Telegram notification
            await this.sendTelegramNotification(formData, formType);
            
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send application form email
     * @param {Object} applicationData - Application data
     */
    async sendApplicationEmail(applicationData) {
        const formData = {
            name: applicationData.fullName,
            email: applicationData.email,
            phone: applicationData.phone,
            university: applicationData.university,
            program: applicationData.program,
            gpa: applicationData.gpa,
            testScores: applicationData.testScores,
            message: applicationData.personalStatement || 'No personal statement provided'
        };

        return await this.sendContactEmail(formData, 'university-application');
    }

    /**
     * Send scholarship inquiry email
     * @param {Object} scholarshipData - Scholarship inquiry data
     */
    async sendScholarshipEmail(scholarshipData) {
        const formData = {
            name: scholarshipData.fullName,
            email: scholarshipData.email,
            phone: scholarshipData.phone,
            scholarship: scholarshipData.scholarshipName,
            university: scholarshipData.university,
            message: scholarshipData.inquiryMessage || 'Interested in scholarship information'
        };

        return await this.sendContactEmail(formData, 'scholarship-inquiry');
    }

    /**
     * Send meeting booking email
     * @param {Object} meetingData - Meeting booking data
     */
    async sendMeetingEmail(meetingData) {
        const formData = {
            name: meetingData.fullName,
            email: meetingData.email,
            phone: meetingData.phone,
            meeting_type: meetingData.meetingType,
            preferred_date: meetingData.preferredDate,
            preferred_time: meetingData.preferredTime,
            message: meetingData.message || 'Meeting booking request'
        };

        return await this.sendContactEmail(formData, 'meeting-booking');
    }

    /**
     * Send team application email
     * @param {Object} teamData - Team application data
     */
    async sendTeamApplicationEmail(teamData) {
        const formData = {
            name: teamData.fullName,
            email: teamData.email,
            phone: teamData.phone,
            position: teamData.position,
            experience: teamData.experience,
            skills: teamData.skills,
            message: teamData.coverLetter || 'Team application submission'
        };

        return await this.sendContactEmail(formData, 'team-application');
    }

    /**
     * Send Telegram notification
     * @param {Object} formData - Form data
     * @param {string} formType - Form type
     */
    async sendTelegramNotification(formData, formType) {
        if (!this.telegramBotToken || !this.telegramChatId) {
            console.warn('Telegram notifications not configured');
            return;
        }

        try {
            const message = this.formatTelegramMessage(formData, formType);
            
            const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.telegramChatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (response.ok) {
                console.log('Telegram notification sent successfully');
            } else {
                console.error('Telegram notification failed:', await response.text());
            }
        } catch (error) {
            console.error('Telegram notification error:', error);
        }
    }

    /**
     * Get email subject based on form type
     * @param {string} formType - Type of form
     * @returns {string} Email subject
     */
    getEmailSubject(formType) {
        const subjects = {
            'contact-form': 'New Contact Form Submission - UniversityMatch',
            'university-application': 'New University Application - UniversityMatch',
            'scholarship-inquiry': 'New Scholarship Inquiry - UniversityMatch',
            'meeting-booking': 'New Meeting Booking Request - UniversityMatch',
            'team-application': 'New Team Application - UniversityMatch'
        };
        return subjects[formType] || 'New Form Submission - UniversityMatch';
    }

    /**
     * Format email message
     * @param {Object} formData - Form data
     * @param {string} formType - Form type
     * @returns {string} Formatted message
     */
    formatEmailMessage(formData, formType) {
        let message = `Form Type: ${formType}\n\n`;
        
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                message += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${formData[key]}\n`;
            }
        });

        message += `\nTimestamp: ${new Date().toLocaleString()}`;
        return message;
    }

    /**
     * Format Telegram message
     * @param {Object} formData - Form data
     * @param {string} formType - Form type
     * @returns {string} Formatted Telegram message
     */
    formatTelegramMessage(formData, formType) {
        const emoji = this.getFormTypeEmoji(formType);
        let message = `${emoji} <b>New ${formType.replace('-', ' ').toUpperCase()} Submission</b>\n\n`;
        
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                message += `<b>${label}:</b> ${formData[key]}\n`;
            }
        });

        message += `\n<i>Time: ${new Date().toLocaleString()}</i>`;
        return message;
    }

    /**
     * Get emoji for form type
     * @param {string} formType - Form type
     * @returns {string} Emoji
     */
    getFormTypeEmoji(formType) {
        const emojis = {
            'contact-form': '📧',
            'university-application': '🎓',
            'scholarship-inquiry': '💰',
            'meeting-booking': '📅',
            'team-application': '👥'
        };
        return emojis[formType] || '📝';
    }

    /**
     * Get user IP address
     * @returns {Promise<string>} User IP
     */
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'Unknown';
        }
    }

    /**
     * Validate email address
     * @param {string} email - Email address
     * @returns {boolean} Is valid email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number
     * @returns {boolean} Is valid phone
     */
    validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
}

// Export singleton instance
export default new EmailService();
