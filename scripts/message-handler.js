/**
 * UNHOLY DEVOTION - Message Handler System
 * Sistema de registro y derivación de mensajes
 * 
 * Features:
 * - Registro de mensajes en localStorage (demo)
 * - Sistema de categorización automática (routing)
 * - Exportación de datos (JSON/CSV)
 * - Dashboard de administración
 */

const UNHOLY_MESSAGES = {
    // Categorías de mensaje
    CATEGORIES: {
        PRESS: 'press',
        BOOKING: 'booking',
        COLLAB: 'collab',
        GENERAL: 'general',
        BUG: 'bug'
    },

    // Prioridades
    PRIORITY: {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
        URGENT: 4
    },

    // Estado del mensaje
    STATUS: {
        NEW: 'new',
        READ: 'read',
        REPLIED: 'replied',
        ARCHIVED: 'archived'
    },

    // Inicializar base de datos local
    init() {
        if (!localStorage.getItem('unholy_messages')) {
            localStorage.setItem('unholy_messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('unholy_contacts')) {
            localStorage.setItem('unholy_contacts', JSON.stringify([]));
        }
    },

    // Categorizar mensaje según contenido
    categorize(message, email) {
        const content = (message + ' ' + email).toLowerCase();
        
        if (content.includes('press') || content.includes('entrevista') || 
            content.includes('review') || content.includes('periodico') ||
            content.includes('magazine') || content.includes('news')) {
            return this.CATEGORIES.PRESS;
        }
        
        if (content.includes('booking') || content.includes('contratar') || 
            content.includes('gig') || content.includes('event') ||
            content.includes('fecha') || content.includes('tour') ||
            content.includes('club') || content.includes('festival')) {
            return this.CATEGORIES.BOOKING;
        }
        
        if (content.includes('collab') || content.includes('colaboracion') || 
            content.includes('feature') || content.includes('remix') ||
            content.includes('produce')) {
            return this.CATEGORIES.COLLAB;
        }
        
        if (content.includes('bug') || content.includes('error') || 
            content.includes('problema') || content.includes('issue')) {
            return this.CATEGORIES.BUG;
        }
        
        return this.CATEGORIES.GENERAL;
    },

    // Asignar prioridad según contenido
    getPriority(message) {
        const content = message.toLowerCase();
        
        if (content.includes('urgente') || content.includes('urgent') || 
            content.includes('ahora') || content.includes('immediately')) {
            return this.PRIORITY.URGENT;
        }
        
        if (content.includes('importante') || content.includes('important') ||
            content.includes('booking')) {
            return this.PRIORITY.HIGH;
        }
        
        if (content.includes('hola') || content.includes('hi') ||
            content.includes('hello')) {
            return this.PRIORITY.MEDIUM;
        }
        
        return this.PRIORITY.LOW;
    },

    // Guardar mensaje
    saveMessage(formData) {
        this.init();
        
        const messages = JSON.parse(localStorage.getItem('unholy_messages') || '[]');
        
        const newMessage = {
            id: this.generateId(),
            name: formData.name || 'Anonymous',
            email: formData.email || '',
            message: formData.message || '',
            category: this.categorize(formData.message || '', formData.email || ''),
            priority: this.getPriority(formData.message || ''),
            status: this.STATUS.NEW,
            rating: formData.rating || 0,
            timestamp: new Date().toISOString(),
            readAt: null,
            repliedAt: null,
            notes: ''
        };
        
        messages.unshift(newMessage); // Agregar al inicio
        localStorage.setItem('unholy_messages', JSON.stringify(messages));
        
        // Guardar contacto
        this.saveContact(newMessage);
        
        return newMessage;
    },

    // Guardar contacto
    saveContact(message) {
        const contacts = JSON.parse(localStorage.getItem('unholy_contacts') || '[]');
        
        // Verificar si ya existe
        const exists = contacts.find(c => c.email === message.email);
        
        if (!exists) {
            contacts.push({
                id: this.generateId(),
                name: message.name,
                email: message.email,
                firstContact: message.timestamp,
                lastContact: message.timestamp,
                totalMessages: 1,
                category: message.category
            });
        } else {
            exists.lastContact = message.timestamp;
            exists.totalMessages++;
        }
        
        localStorage.setItem('unholy_contacts', JSON.stringify(contacts));
    },

    // Obtener todos los mensajes
    getMessages(filters = {}) {
        let messages = JSON.parse(localStorage.getItem('unholy_messages') || '[]');
        
        if (filters.category) {
            messages = messages.filter(m => m.category === filters.category);
        }
        
        if (filters.status) {
            messages = messages.filter(m => m.status === filters.status);
        }
        
        if (filters.priority) {
            messages = messages.filter(m => m.priority === filters.priority);
        }
        
        return messages;
    },

    // Obtener contactos
    getContacts() {
        return JSON.parse(localStorage.getItem('unholy_contacts') || '[]');
    },

    // Actualizar estado del mensaje
    updateStatus(messageId, status) {
        const messages = JSON.parse(localStorage.getItem('unholy_messages') || '[]');
        const message = messages.find(m => m.id === messageId);
        
        if (message) {
            message.status = status;
            if (status === this.STATUS.READ) {
                message.readAt = new Date().toISOString();
            }
            if (status === this.STATUS.REPLIED) {
                message.repliedAt = new Date().toISOString();
            }
            
            localStorage.setItem('unholy_messages', JSON.stringify(messages));
        }
        
        return message;
    },

    // Agregar nota al mensaje
    addNote(messageId, note) {
        const messages = JSON.parse(localStorage.getItem('unholy_messages') || '[]');
        const message = messages.find(m => m.id === messageId);
        
        if (message) {
            message.notes = note;
            localStorage.setItem('unholy_messages', JSON.stringify(messages));
        }
        
        return message;
    },

    // Obtener estadísticas
    getStats() {
        const messages = JSON.parse(localStorage.getItem('unholy_messages') || '[]');
        const contacts = JSON.parse(localStorage.getItem('unholy_contacts') || '[]');
        
        const stats = {
            total: messages.length,
            new: messages.filter(m => m.status === this.STATUS.NEW).length,
            read: messages.filter(m => m.status === this.STATUS.READ).length,
            replied: messages.filter(m => m.status === this.STATUS.REPLIED).length,
            archived: messages.filter(m => m.status === this.STATUS.ARCHIVED).length,
            byCategory: {},
            byPriority: {},
            totalContacts: contacts.length,
            thisWeek: 0,
            thisMonth: 0
        };
        
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        messages.forEach(m => {
            const timestamp = new Date(m.timestamp);
            
            // Contar por categoría
            stats.byCategory[m.category] = (stats.byCategory[m.category] || 0) + 1;
            
            // Contar por prioridad
            stats.byPriority[m.priority] = (stats.byPriority[m.priority] || 0) + 1;
            
            // Mensajes esta semana
            if (timestamp > weekAgo) stats.thisWeek++;
            
            // Mensajes este mes
            if (timestamp > monthAgo) stats.thisMonth++;
        });
        
        return stats;
    },

    // Exportar mensajes
    exportMessages(format = 'json') {
        const messages = this.getMessages();
        
        if (format === 'csv') {
            const headers = ['ID', 'Name', 'Email', 'Message', 'Category', 'Priority', 'Status', 'Timestamp'];
            const rows = messages.map(m => [
                m.id, m.name, m.email, m.message.replace(/,/g, ';'), 
                m.category, m.priority, m.status, m.timestamp
            ]);
            
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        return JSON.stringify(messages, null, 2);
    },

    // Generar ID único
    generateId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Enviar auto-respuesta
    sendAutoReply(email, name, category) {
        const templates = {
            [this.CATEGORIES.PRESS]: {
                subject: 'UNHOLY DEVOTION - Press Inquiry Received',
                message: `Dear ${name},\n\nThank you for your interest in UNHOLY DEVOTION. We have received your press inquiry and will respond within 48 hours.\n\nPlease find our press kit at: https://unholydevotion.com/press\n\nBest regards,\nUNHOLY DEVOTION`
            },
            [this.CATEGORIES.BOOKING]: {
                subject: 'UNHOLY DEVOTION - Booking Request Received',
                message: `Dear ${name},\n\nThank you for your booking inquiry. Our management team will review your request and get back to you within 72 hours.\n\nFor urgent bookings, please contact us directly.\n\nBest regards,\nUNHOLY DEVOTION`
            },
            [this.CATEGORIES.COLLAB]: {
                subject: 'UNHOLY DEVOTION - Collaboration Inquiry',
                message: `Dear ${name},\n\nWe have received your collaboration proposal. Our team will evaluate the details and respond within one week.\n\nBest regards,\nUNHOLY DEVOTION`
            },
            default: {
                subject: 'UNHOLY DEVOTION - Message Received',
                message: `Dear ${name},\n\nWe have received your message. Thank you for reaching out to UNHOLY DEVOTION.\n\nWe will respond at the next ritual.\n\nBest regards,\nUNHOLY DEVOTION`
            }
        };
        
        const template = templates[category] || templates.default;
        
        // En una implementación real, esto enviaría un email
        console.log('Auto-reply would be sent:', {
            to: email,
            subject: template.subject,
            message: template.message
        });
        
        return template;
    }
};

// Auto-inicializar
UNHOLY_MESSAGES.init();

// Exportar para uso global
window.UNHOLY_MESSAGES = UNHOLY_MESSAGES;
