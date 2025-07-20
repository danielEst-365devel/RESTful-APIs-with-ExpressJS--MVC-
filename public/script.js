// Equipment Reservation System - Frontend JavaScript
class EquipmentReservationSystem {
    constructor() {
        this.currentSection = 'equipment';
        this.selectedEquipment = null;
        this.equipmentData = [];
        this.categoriesData = [];
        this.reservationsData = [];
        this.statusesData = [];
        
        this.initializeApp();
    }

    // Initialize the application
    async initializeApp() {
        this.setupEventListeners();
        this.showSection('equipment');
        await this.checkServerStatus();
        await this.loadInitialData();
        
        // Set minimum datetime for reservation form
        const now = new Date();
        now.setHours(now.getHours() + 1); // Set to next hour
        document.getElementById('start-date').min = this.formatDateTimeLocal(now);
        
        console.log('Equipment Reservation System initialized successfully!');
    }

    // Setup all event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showSection(e.target.dataset.section);
            });
        });

        // Equipment section
        document.getElementById('search-btn').addEventListener('click', () => this.searchEquipment());
        document.getElementById('equipment-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchEquipment();
        });
        document.getElementById('category-filter').addEventListener('change', () => this.filterEquipment());
        document.getElementById('load-equipment-btn').addEventListener('click', () => this.loadEquipment());

        // Reservations section
        document.getElementById('load-reservations-btn').addEventListener('click', () => this.loadUserReservations());
        document.getElementById('status-filter').addEventListener('change', () => this.filterReservations());

        // Create reservation form
        document.getElementById('reservation-form').addEventListener('submit', (e) => this.submitReservation(e));
        document.getElementById('clear-form-btn').addEventListener('click', () => this.clearReservationForm());
        document.getElementById('start-date').addEventListener('change', () => this.validateDates());
        document.getElementById('end-date').addEventListener('change', () => this.validateDates());

        // Admin section
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showAdminTab(e.target.dataset.tab);
            });
        });
        document.getElementById('load-all-reservations-btn').addEventListener('click', () => this.loadAllReservations());
        document.getElementById('load-system-status-btn').addEventListener('click', () => this.loadSystemStatus());

        // Modal
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        document.getElementById('reserve-equipment-btn').addEventListener('click', () => this.selectEquipmentForReservation());
        
        // Close modal when clicking outside
        document.getElementById('equipment-modal').addEventListener('click', (e) => {
            if (e.target.id === 'equipment-modal') this.closeModal();
        });
    }

    // API helper methods
    async apiRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`/api${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    // Server status check
    async checkServerStatus() {
        try {
            const data = await this.apiRequest('/health');
            const statusElement = document.getElementById('server-status');
            statusElement.textContent = data.status;
            statusElement.className = `stat-value ${data.status === 'OK' ? 'status-available' : 'status-maintenance'}`;
        } catch (error) {
            const statusElement = document.getElementById('server-status');
            statusElement.textContent = 'ERROR';
            statusElement.className = 'stat-value status-in-use';
        }
    }

    // Load initial data
    async loadInitialData() {
        await Promise.all([
            this.loadEquipment(),
            this.loadCategories(),
            this.loadReservationStatuses(),
            this.loadUserReservations()
        ]);
    }

    // Navigation
    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionName);
        });

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === `${sectionName}-section`);
        });

        this.currentSection = sectionName;

        // Load section-specific data if needed
        if (sectionName === 'admin') {
            this.loadSystemStats();
        }
    }

    // Equipment management
    async loadEquipment() {
        try {
            this.showLoading('equipment-grid');
            const data = await this.apiRequest('/equipment');
            this.equipmentData = data.data;
            this.renderEquipment(this.equipmentData);
        } catch (error) {
            this.showError('equipment-grid', 'Failed to load equipment');
        }
    }

    async loadCategories() {
        try {
            const data = await this.apiRequest('/equipment/categories');
            this.categoriesData = data.data;
            this.populateCategoryFilter();
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    populateCategoryFilter() {
        const filter = document.getElementById('category-filter');
        filter.innerHTML = '<option value="">All Categories</option>';
        
        this.categoriesData.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            filter.appendChild(option);
        });
    }

    async searchEquipment() {
        const searchTerm = document.getElementById('equipment-search').value.trim();
        const categoryId = document.getElementById('category-filter').value;
        
        if (!searchTerm) {
            this.showNotification('Please enter a search term', 'warning');
            return;
        }

        try {
            this.showLoading('equipment-grid');
            let endpoint = `/equipment/search?q=${encodeURIComponent(searchTerm)}`;
            if (categoryId) {
                endpoint += `&category=${categoryId}`;
            }
            
            const data = await this.apiRequest(endpoint);
            this.renderEquipment(data.data);
            this.showNotification(`Found ${data.count} equipment items`, 'success');
        } catch (error) {
            this.showError('equipment-grid', 'Search failed');
        }
    }

    filterEquipment() {
        const categoryId = document.getElementById('category-filter').value;
        
        if (!categoryId) {
            this.loadEquipment();
            return;
        }

        const filtered = this.equipmentData.filter(equipment => 
            equipment.category_id == categoryId
        );
        
        this.renderEquipment(filtered);
    }

    renderEquipment(equipment) {
        const grid = document.getElementById('equipment-grid');
        
        if (equipment.length === 0) {
            grid.innerHTML = '<div class="loading">No equipment found</div>';
            return;
        }

        grid.innerHTML = equipment.map(item => `
            <div class="equipment-card" onclick="equipmentSystem.showEquipmentDetails(${item.equipment_id})">
                <h3>${this.escapeHtml(item.name)}</h3>
                <div class="equipment-code">${this.escapeHtml(item.equipment_code)}</div>
                <p class="equipment-description">${this.escapeHtml(item.description || 'No description available')}</p>
                
                <div class="equipment-meta">
                    <div class="meta-item">
                        <span class="meta-label">Category</span>
                        <span class="meta-value">${this.escapeHtml(item.category_name)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Brand</span>
                        <span class="meta-value">${this.escapeHtml(item.brand || 'N/A')}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Model</span>
                        <span class="meta-value">${this.escapeHtml(item.model || 'N/A')}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Location</span>
                        <span class="meta-value">${this.escapeHtml(item.location || 'N/A')}</span>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span class="status-badge status-${item.availability_status.toLowerCase().replace(' ', '-')}">
                        ${item.availability_status}
                    </span>
                    <span class="status-badge status-${item.condition_status.toLowerCase()}">
                        ${item.condition_status}
                    </span>
                </div>
            </div>
        `).join('');
    }

    async showEquipmentDetails(equipmentId) {
        try {
            const data = await this.apiRequest(`/equipment/${equipmentId}`);
            const equipment = data.data;
            
            document.getElementById('modal-equipment-name').textContent = equipment.name;
            document.getElementById('equipment-details').innerHTML = `
                <div class="equipment-code" style="margin-bottom: 1rem;">${this.escapeHtml(equipment.equipment_code)}</div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Description</h4>
                    <p style="color: var(--text-secondary);">${this.escapeHtml(equipment.description || 'No description available')}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">Details</h4>
                        <p><strong>Category:</strong> ${this.escapeHtml(equipment.category_name)}</p>
                        <p><strong>Brand:</strong> ${this.escapeHtml(equipment.brand || 'N/A')}</p>
                        <p><strong>Model:</strong> ${this.escapeHtml(equipment.model || 'N/A')}</p>
                        <p><strong>Serial:</strong> ${this.escapeHtml(equipment.serial_number || 'N/A')}</p>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">Status</h4>
                        <p><strong>Availability:</strong> <span class="status-badge status-${equipment.availability_status.toLowerCase().replace(' ', '-')}">${equipment.availability_status}</span></p>
                        <p><strong>Condition:</strong> <span class="status-badge status-${equipment.condition_status.toLowerCase()}">${equipment.condition_status}</span></p>
                        <p><strong>Location:</strong> ${this.escapeHtml(equipment.location || 'N/A')}</p>
                    </div>
                </div>
                
                ${equipment.notes ? `
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">Notes</h4>
                        <p style="color: var(--text-secondary);">${this.escapeHtml(equipment.notes)}</p>
                    </div>
                ` : ''}
            `;
            
            // Store selected equipment for reservation
            this.selectedEquipment = equipment;
            
            // Show/hide reserve button based on availability
            const reserveBtn = document.getElementById('reserve-equipment-btn');
            reserveBtn.style.display = equipment.availability_status === 'Available' ? 'block' : 'none';
            
            this.showModal();
        } catch (error) {
            this.showNotification('Failed to load equipment details', 'error');
        }
    }

    // Reservations management
    async loadUserReservations() {
        try {
            this.showLoading('reservations-list');
            const data = await this.apiRequest('/reservations/my');
            this.reservationsData = data.data;
            this.renderReservations(this.reservationsData, 'reservations-list');
        } catch (error) {
            this.showError('reservations-list', 'Failed to load reservations');
        }
    }

    async loadAllReservations() {
        try {
            this.showLoading('all-reservations-list');
            const status = document.getElementById('admin-status-filter').value;
            let endpoint = '/reservations';
            if (status) {
                endpoint += `?status=${encodeURIComponent(status)}`;
            }
            
            const data = await this.apiRequest(endpoint);
            this.renderReservations(data.data, 'all-reservations-list');
        } catch (error) {
            this.showError('all-reservations-list', 'Failed to load reservations');
        }
    }

    async loadReservationStatuses() {
        try {
            const data = await this.apiRequest('/reservations/statuses');
            this.statusesData = data.data;
            this.populateStatusFilters();
        } catch (error) {
            console.error('Failed to load reservation statuses:', error);
        }
    }

    populateStatusFilters() {
        ['status-filter', 'admin-status-filter'].forEach(filterId => {
            const filter = document.getElementById(filterId);
            filter.innerHTML = '<option value="">All Statuses</option>';
            
            this.statusesData.forEach(status => {
                const option = document.createElement('option');
                option.value = status.status_name;
                option.textContent = status.status_name;
                filter.appendChild(option);
            });
        });
    }

    filterReservations() {
        const status = document.getElementById('status-filter').value;
        
        if (!status) {
            this.renderReservations(this.reservationsData, 'reservations-list');
            return;
        }

        const filtered = this.reservationsData.filter(reservation => 
            reservation.status_name === status
        );
        
        this.renderReservations(filtered, 'reservations-list');
    }

    renderReservations(reservations, containerId) {
        const container = document.getElementById(containerId);
        
        if (reservations.length === 0) {
            container.innerHTML = '<div class="loading">No reservations found</div>';
            return;
        }

        container.innerHTML = reservations.map(reservation => `
            <div class="reservation-card">
                <div class="reservation-header">
                    <div>
                        <div class="reservation-title">${this.escapeHtml(reservation.equipment_name)}</div>
                        <div class="reservation-id">Reservation #${reservation.reservation_id}</div>
                        ${reservation.user_name ? `<div class="text-muted">Reserved by: ${this.escapeHtml(reservation.user_name)}</div>` : ''}
                    </div>
                    <div>
                        <span class="status-badge status-${reservation.status_name.toLowerCase()}">${reservation.status_name}</span>
                    </div>
                </div>
                
                <div class="reservation-dates">
                    <div class="date-item">
                        <span class="date-label">Start Date</span>
                        <span class="date-value">${this.formatDateTime(reservation.start_date)}</span>
                    </div>
                    <div class="date-item">
                        <span class="date-label">End Date</span>
                        <span class="date-value">${this.formatDateTime(reservation.end_date)}</span>
                    </div>
                </div>
                
                ${reservation.purpose ? `<p><strong>Purpose:</strong> ${this.escapeHtml(reservation.purpose)}</p>` : ''}
                
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${this.getReservationActions(reservation)}
                </div>
            </div>
        `).join('');
    }

    getReservationActions(reservation) {
        const actions = [];
        
        if (reservation.status_name === 'Pending') {
            actions.push(`<button onclick="equipmentSystem.updateReservationStatus(${reservation.reservation_id}, 'Approved')" class="btn-success">✅ Approve</button>`);
            actions.push(`<button onclick="equipmentSystem.updateReservationStatus(${reservation.reservation_id}, 'Cancelled')" class="btn-error">❌ Cancel</button>`);
        }
        
        if (reservation.status_name === 'Approved') {
            actions.push(`<button onclick="equipmentSystem.updateReservationStatus(${reservation.reservation_id}, 'Active')" class="btn-primary">🔄 Mark Active</button>`);
        }
        
        if (reservation.status_name === 'Active') {
            actions.push(`<button onclick="equipmentSystem.updateReservationStatus(${reservation.reservation_id}, 'Completed')" class="btn-success">✅ Complete</button>`);
        }
        
        return actions.join('');
    }

    async updateReservationStatus(reservationId, status) {
        try {
            await this.apiRequest(`/reservations/${reservationId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            
            this.showNotification(`Reservation ${status.toLowerCase()} successfully`, 'success');
            
            // Reload the appropriate reservations list
            if (this.currentSection === 'reservations') {
                this.loadUserReservations();
            } else if (this.currentSection === 'admin') {
                this.loadAllReservations();
            }
        } catch (error) {
            this.showNotification(`Failed to update reservation status`, 'error');
        }
    }

    // Create reservation
    selectEquipmentForReservation() {
        if (!this.selectedEquipment) return;
        
        // Update the selected equipment display
        const container = document.getElementById('selected-equipment');
        container.innerHTML = `
            <div class="equipment-selection">
                <div class="selection-details">
                    <h4>${this.escapeHtml(this.selectedEquipment.name)}</h4>
                    <p class="equipment-code">${this.escapeHtml(this.selectedEquipment.equipment_code)}</p>
                    <p>${this.escapeHtml(this.selectedEquipment.category_name)} - ${this.escapeHtml(this.selectedEquipment.location || 'N/A')}</p>
                </div>
            </div>
        `;
        
        this.closeModal();
        this.showSection('create');
        this.showNotification('Equipment selected for reservation', 'success');
    }

    async submitReservation(event) {
        event.preventDefault();
        
        if (!this.selectedEquipment) {
            this.showNotification('Please select equipment first', 'error');
            return;
        }

        const formData = new FormData(event.target);
        const reservationData = {
            equipment_id: this.selectedEquipment.equipment_id,
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            purpose: formData.get('purpose'),
            special_instructions: formData.get('special_instructions')
        };

        try {
            const submitBtn = event.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Reservation...';

            await this.apiRequest('/reservations', {
                method: 'POST',
                body: JSON.stringify(reservationData)
            });

            this.showNotification('Reservation created successfully!', 'success');
            this.clearReservationForm();
            this.showSection('reservations');
            this.loadUserReservations();
        } catch (error) {
            this.showNotification('Failed to create reservation', 'error');
        } finally {
            const submitBtn = event.target.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = '📋 Submit Reservation';
        }
    }

    clearReservationForm() {
        document.getElementById('reservation-form').reset();
        this.selectedEquipment = null;
        document.getElementById('selected-equipment').innerHTML = '<span class="no-selection">No equipment selected. Browse equipment first.</span>';
        
        // Reset minimum datetime
        const now = new Date();
        now.setHours(now.getHours() + 1);
        document.getElementById('start-date').min = this.formatDateTimeLocal(now);
    }

    validateDates() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (end <= start) {
                document.getElementById('end-date').setCustomValidity('End date must be after start date');
            } else {
                document.getElementById('end-date').setCustomValidity('');
            }
        }
    }

    // Admin panel
    showAdminTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Load tab-specific data
        if (tabName === 'overview') {
            this.loadSystemStats();
        }
    }

    async loadSystemStats() {
        try {
            const data = await this.apiRequest('/system/status');
            
            if (data.statistics) {
                document.getElementById('total-equipment').textContent = data.statistics.equipment_count;
                document.getElementById('active-reservations').textContent = data.statistics.active_reservations;
                document.getElementById('total-users').textContent = data.statistics.total_users;
            }
        } catch (error) {
            console.error('Failed to load system stats:', error);
        }
    }

    async loadSystemStatus() {
        try {
            this.showLoading('system-details');
            const data = await this.apiRequest('/system/status');
            
            document.getElementById('system-details').innerHTML = `
                <div style="margin-top: 1rem;">
                    <h4>System Information</h4>
                    <div class="system-detail-item">
                        <span>Status</span>
                        <span class="status-badge status-${data.status.toLowerCase()}">${data.status}</span>
                    </div>
                    <div class="system-detail-item">
                        <span>Environment</span>
                        <span>${data.environment}</span>
                    </div>
                    <div class="system-detail-item">
                        <span>Server Uptime</span>
                        <span>${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m</span>
                    </div>
                    <div class="system-detail-item">
                        <span>Database</span>
                        <span class="status-badge status-${data.services.database.toLowerCase()}">${data.services.database}</span>
                    </div>
                    <div class="system-detail-item">
                        <span>Memory Usage</span>
                        <span>${Math.round(data.memory_usage.rss / 1024 / 1024)} MB</span>
                    </div>
                </div>
            `;
        } catch (error) {
            this.showError('system-details', 'Failed to load system status');
        }
    }

    // Modal management
    showModal() {
        document.getElementById('equipment-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('equipment-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notification-message');
        
        messageElement.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    // Utility methods
    showLoading(containerId) {
        document.getElementById(containerId).innerHTML = '<div class="loading">Loading...</div>';
    }

    showError(containerId, message) {
        document.getElementById(containerId).innerHTML = `<div class="loading">${message}</div>`;
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString();
    }

    formatDateTimeLocal(date) {
        const offset = date.getTimezoneOffset();
        const localISOTime = new Date(date.getTime() - (offset * 60000)).toISOString().slice(0, -1);
        return localISOTime.substring(0, 16);
    }
}

// Initialize the application when the DOM is loaded
let equipmentSystem;
document.addEventListener('DOMContentLoaded', () => {
    equipmentSystem = new EquipmentReservationSystem();
});
