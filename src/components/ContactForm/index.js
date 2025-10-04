/**
 * Contact Form Component for UniversityMatch
 * Handles various types of contact forms with email and Telegram notifications
 */

import React, { useState } from 'react';
import emailService from '../services/emailService';
import './ContactForm.css';

const ContactForm = ({ formType = 'contact', onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        university: '',
        program: '',
        gpa: '',
        testScores: '',
        personalStatement: '',
        scholarshipName: '',
        inquiryMessage: '',
        meetingType: '',
        preferredDate: '',
        preferredTime: '',
        position: '',
        experience: '',
        skills: '',
        coverLetter: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    // Form configurations for different types
    const formConfigs = {
        contact: {
            title: 'Contact Us',
            description: 'Get in touch with our team for any questions or support.',
            fields: ['fullName', 'email', 'phone', 'message'],
            required: ['fullName', 'email', 'message']
        },
        application: {
            title: 'University Application',
            description: 'Submit your university application through our platform.',
            fields: ['fullName', 'email', 'phone', 'university', 'program', 'gpa', 'testScores', 'personalStatement'],
            required: ['fullName', 'email', 'university', 'program']
        },
        scholarship: {
            title: 'Scholarship Inquiry',
            description: 'Inquire about scholarship opportunities.',
            fields: ['fullName', 'email', 'phone', 'scholarshipName', 'university', 'inquiryMessage'],
            required: ['fullName', 'email', 'scholarshipName']
        },
        meeting: {
            title: 'Book a Meeting',
            description: 'Schedule a consultation with our education advisors.',
            fields: ['fullName', 'email', 'phone', 'meetingType', 'preferredDate', 'preferredTime', 'message'],
            required: ['fullName', 'email', 'meetingType', 'preferredDate']
        },
        team: {
            title: 'Join Our Team',
            description: 'Apply to join the UniversityMatch team.',
            fields: ['fullName', 'email', 'phone', 'position', 'experience', 'skills', 'coverLetter'],
            required: ['fullName', 'email', 'position', 'coverLetter']
        }
    };

    const config = formConfigs[formType] || formConfigs.contact;

    const fieldLabels = {
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        message: 'Message',
        university: 'University',
        program: 'Program of Interest',
        gpa: 'GPA',
        testScores: 'Test Scores (SAT/ACT/IELTS/TOEFL)',
        personalStatement: 'Personal Statement',
        scholarshipName: 'Scholarship Name',
        inquiryMessage: 'Inquiry Message',
        meetingType: 'Meeting Type',
        preferredDate: 'Preferred Date',
        preferredTime: 'Preferred Time',
        position: 'Position',
        experience: 'Experience',
        skills: 'Skills',
        coverLetter: 'Cover Letter'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        config.required.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = `${fieldLabels[field]} is required`;
            }
        });

        // Email validation
        if (formData.email && !emailService.validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (formData.phone && !emailService.validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSuccess(false);

        try {
            let result;
            
            switch (formType) {
                case 'application':
                    result = await emailService.sendApplicationEmail(formData);
                    break;
                case 'scholarship':
                    result = await emailService.sendScholarshipEmail(formData);
                    break;
                case 'meeting':
                    result = await emailService.sendMeetingEmail(formData);
                    break;
                case 'team':
                    result = await emailService.sendTeamApplicationEmail(formData);
                    break;
                default:
                    result = await emailService.sendContactEmail(formData, 'contact-form');
            }

            if (result.success) {
                setSuccess(true);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    message: '',
                    university: '',
                    program: '',
                    gpa: '',
                    testScores: '',
                    personalStatement: '',
                    scholarshipName: '',
                    inquiryMessage: '',
                    meetingType: '',
                    preferredDate: '',
                    preferredTime: '',
                    position: '',
                    experience: '',
                    skills: '',
                    coverLetter: ''
                });
                
                if (onSuccess) {
                    onSuccess(result);
                }
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            if (onError) {
                onError(error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (fieldName) => {
        const isRequired = config.required.includes(fieldName);
        const fieldType = fieldName === 'email' ? 'email' : 
                         fieldName === 'phone' ? 'tel' :
                         ['message', 'personalStatement', 'inquiryMessage', 'coverLetter'].includes(fieldName) ? 'textarea' :
                         fieldName === 'preferredDate' ? 'date' :
                         fieldName === 'preferredTime' ? 'time' : 'text';

        return (
            <div key={fieldName} className="form-group">
                <label htmlFor={fieldName} className="form-label">
                    {fieldLabels[fieldName]}
                    {isRequired && <span className="required">*</span>}
                </label>
                
                {fieldType === 'textarea' ? (
                    <textarea
                        id={fieldName}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        className={`form-input ${errors[fieldName] ? 'error' : ''}`}
                        placeholder={`Enter your ${fieldLabels[fieldName].toLowerCase()}`}
                        rows={4}
                    />
                ) : (
                    <input
                        type={fieldType}
                        id={fieldName}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        className={`form-input ${errors[fieldName] ? 'error' : ''}`}
                        placeholder={`Enter your ${fieldLabels[fieldName].toLowerCase()}`}
                    />
                )}
                
                {errors[fieldName] && (
                    <span className="error-message">{errors[fieldName]}</span>
                )}
            </div>
        );
    };

    if (success) {
        return (
            <div className="contact-form success-message">
                <div className="success-icon">✅</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for your submission. We'll get back to you within 24 hours.</p>
                <button 
                    className="btn btn-primary" 
                    onClick={() => setSuccess(false)}
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="contact-form">
            <div className="form-header">
                <h2 className="form-title">{config.title}</h2>
                <p className="form-description">{config.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                    {config.fields.map(renderField)}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Sending...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Send Message
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
