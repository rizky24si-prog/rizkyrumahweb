// dentalAPI.js
import axios from 'axios'

const API_URL = "https://bruwtlugpglumcftdnid.supabase.co/rest/v1"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJydXd0bHVncGdsdW1jZnRkbmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjE1NzIsImV4cCI6MjA5NzAzNzU3Mn0.CE9JX3jqU89uZdh2rGzRPyXAMbM9BcEWP0DzI816WtU"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

// =====================================================
// DENTAL API SERVICE - LENGKAP UNTUK SEMUA TABEL
// =====================================================

export const dentalAPI = {
    // =====================================================
    // 1. USERS
    // =====================================================
    users: {
        // Get all users
        async getAll() {
            const response = await axios.get(`${API_URL}/users`, { headers })
            return response.data
        },
        // Get user by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/users?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get user by username
        async getByUsername(username) {
            const response = await axios.get(`${API_URL}/users?username=eq.${username}`, { headers })
            return response.data[0]
        },
        // Create new user
        async create(data) {
            const response = await axios.post(`${API_URL}/users`, data, { headers })
            return response.data
        },
        // Update user
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/users?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete user
        async delete(id) {
            const response = await axios.delete(`${API_URL}/users?id=eq.${id}`, { headers })
            return response.data
        },
        // Get all doctors (users with role = dokter)
        async getAllDoctors() {
            const response = await axios.get(`${API_URL}/users?role=eq.dokter&is_active=eq.true`, { headers })
            return response.data
        },
        // Get all admins
        async getAllAdmins() {
            const response = await axios.get(`${API_URL}/users?role=in.(super_admin,admin)`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 2. PATIENTS
    // =====================================================
    patients: {
        // Get all patients
        async getAll() {
            const response = await axios.get(`${API_URL}/patients`, { headers })
            return response.data
        },
        // Get patient by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/patients?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get patient by RM number
        async getByRmNumber(rmNumber) {
            const response = await axios.get(`${API_URL}/patients?rm_number=eq.${rmNumber}`, { headers })
            return response.data[0]
        },
        // Get patient by NIK
        async getByNik(nik) {
            const response = await axios.get(`${API_URL}/patients?nik=eq.${nik}`, { headers })
            return response.data[0]
        },
        // Get patient by phone
        async getByPhone(phone) {
            const response = await axios.get(`${API_URL}/patients?phone=eq.${phone}`, { headers })
            return response.data[0]
        },
        // Search patients by name
        async searchByName(name) {
            const response = await axios.get(`${API_URL}/patients?full_name=ilike.*${name}*`, { headers })
            return response.data
        },
        // Get active patients only
        async getActive() {
            const response = await axios.get(`${API_URL}/patients?is_active=eq.true`, { headers })
            return response.data
        },
        // Create new patient
        async create(data) {
            const response = await axios.post(`${API_URL}/patients`, data, { headers })
            return response.data
        },
        // Update patient
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/patients?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete patient (soft delete)
        async softDelete(id) {
            const response = await axios.patch(`${API_URL}/patients?id=eq.${id}`, { is_active: false }, { headers })
            return response.data
        },
        // Hard delete patient
        async hardDelete(id) {
            const response = await axios.delete(`${API_URL}/patients?id=eq.${id}`, { headers })
            return response.data
        },
        // Get patients with upcoming birthday (this month)
        async getBirthdayThisMonth() {
            const response = await axios.get(`${API_URL}/patients?birth_date=gte.${new Date().getFullYear()}-${new Date().getMonth()+1}-01`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 3. PATIENT DOCUMENTS
    // =====================================================
    patientDocuments: {
        // Get all documents
        async getAll() {
            const response = await axios.get(`${API_URL}/patient_documents`, { headers })
            return response.data
        },
        // Get documents by patient ID
        async getByPatientId(patientId) {
            const response = await axios.get(`${API_URL}/patient_documents?patient_id=eq.${patientId}`, { headers })
            return response.data
        },
        // Get document by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/patient_documents?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Create new document
        async create(data) {
            const response = await axios.post(`${API_URL}/patient_documents`, data, { headers })
            return response.data
        },
        // Update document
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/patient_documents?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete document
        async delete(id) {
            const response = await axios.delete(`${API_URL}/patient_documents?id=eq.${id}`, { headers })
            return response.data
        },
        // Get X-ray documents by patient
        async getRontgenByPatientId(patientId) {
            const response = await axios.get(`${API_URL}/patient_documents?patient_id=eq.${patientId}&document_type=eq.rontgen`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 4. DOCTORS
    // =====================================================
    doctors: {
        // Get all doctors
        async getAll() {
            const response = await axios.get(`${API_URL}/doctors`, { headers })
            return response.data
        },
        // Get doctor by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/doctors?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get doctor by user ID
        async getByUserId(userId) {
            const response = await axios.get(`${API_URL}/doctors?user_id=eq.${userId}`, { headers })
            return response.data[0]
        },
        // Get active doctors
        async getActive() {
            const response = await axios.get(`${API_URL}/doctors?is_active=eq.true`, { headers })
            return response.data
        },
        // Get doctors by specialization
        async getBySpecialization(specialization) {
            const response = await axios.get(`${API_URL}/doctors?specialization=eq.${specialization}`, { headers })
            return response.data
        },
        // Create new doctor
        async create(data) {
            const response = await axios.post(`${API_URL}/doctors`, data, { headers })
            return response.data
        },
        // Update doctor
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/doctors?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete doctor
        async delete(id) {
            const response = await axios.delete(`${API_URL}/doctors?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 5. DOCTOR SCHEDULES
    // =====================================================
    doctorSchedules: {
        // Get all schedules
        async getAll() {
            const response = await axios.get(`${API_URL}/doctor_schedules`, { headers })
            return response.data
        },
        // Get schedule by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/doctor_schedules?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get schedules by doctor ID
        async getByDoctorId(doctorId) {
            const response = await axios.get(`${API_URL}/doctor_schedules?doctor_id=eq.${doctorId}`, { headers })
            return response.data
        },
        // Get schedule for specific day
        async getByDoctorAndDay(doctorId, dayOfWeek) {
            const response = await axios.get(`${API_URL}/doctor_schedules?doctor_id=eq.${doctorId}&day_of_week=eq.${dayOfWeek}`, { headers })
            return response.data[0]
        },
        // Create new schedule
        async create(data) {
            const response = await axios.post(`${API_URL}/doctor_schedules`, data, { headers })
            return response.data
        },
        // Update schedule
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/doctor_schedules?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete schedule
        async delete(id) {
            const response = await axios.delete(`${API_URL}/doctor_schedules?id=eq.${id}`, { headers })
            return response.data
        },
        // Set doctor off day (cuti)
        async setOffDay(doctorId, dayOfWeek) {
            const response = await axios.patch(`${API_URL}/doctor_schedules?doctor_id=eq.${doctorId}&day_of_week=eq.${dayOfWeek}`, { is_off: true }, { headers })
            return response.data
        }
    },

    // =====================================================
    // 6. TREATMENTS
    // =====================================================
    treatments: {
        // Get all treatments
        async getAll() {
            const response = await axios.get(`${API_URL}/treatments`, { headers })
            return response.data
        },
        // Get treatment by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/treatments?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get treatment by code
        async getByCode(code) {
            const response = await axios.get(`${API_URL}/treatments?code=eq.${code}`, { headers })
            return response.data[0]
        },
        // Get active treatments
        async getActive() {
            const response = await axios.get(`${API_URL}/treatments?is_active=eq.true`, { headers })
            return response.data
        },
        // Get treatments by category
        async getByCategory(category) {
            const response = await axios.get(`${API_URL}/treatments?category=eq.${category}`, { headers })
            return response.data
        },
        // Create new treatment
        async create(data) {
            const response = await axios.post(`${API_URL}/treatments`, data, { headers })
            return response.data
        },
        // Update treatment
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/treatments?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete treatment
        async delete(id) {
            const response = await axios.delete(`${API_URL}/treatments?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 7. TREATMENT PACKAGES
    // =====================================================
    treatmentPackages: {
        // Get all packages
        async getAll() {
            const response = await axios.get(`${API_URL}/treatment_packages`, { headers })
            return response.data
        },
        // Get package by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/treatment_packages?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get active packages
        async getActive() {
            const now = new Date().toISOString().split('T')[0]
            const response = await axios.get(`${API_URL}/treatment_packages?is_active=eq.true&start_date=lte.${now}&end_date=gte.${now}`, { headers })
            return response.data
        },
        // Create new package
        async create(data) {
            const response = await axios.post(`${API_URL}/treatment_packages`, data, { headers })
            return response.data
        },
        // Update package
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/treatment_packages?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete package
        async delete(id) {
            const response = await axios.delete(`${API_URL}/treatment_packages?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 8. PACKAGE ITEMS
    // =====================================================
    packageItems: {
        // Get all package items
        async getAll() {
            const response = await axios.get(`${API_URL}/package_items`, { headers })
            return response.data
        },
        // Get items by package ID
        async getByPackageId(packageId) {
            const response = await axios.get(`${API_URL}/package_items?package_id=eq.${packageId}`, { headers })
            return response.data
        },
        // Create new package item
        async create(data) {
            const response = await axios.post(`${API_URL}/package_items`, data, { headers })
            return response.data
        },
        // Delete package item
        async delete(id) {
            const response = await axios.delete(`${API_URL}/package_items?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 9. APPOINTMENTS
    // =====================================================
    appointments: {
        // Get all appointments
        async getAll() {
            const response = await axios.get(`${API_URL}/appointments`, { headers })
            return response.data
        },
        // Get appointment by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/appointments?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get appointments by patient ID
        async getByPatientId(patientId) {
            const response = await axios.get(`${API_URL}/appointments?patient_id=eq.${patientId}`, { headers })
            return response.data
        },
        // Get appointments by doctor ID
        async getByDoctorId(doctorId) {
            const response = await axios.get(`${API_URL}/appointments?doctor_id=eq.${doctorId}`, { headers })
            return response.data
        },
        // Get appointments by date
        async getByDate(date) {
            const response = await axios.get(`${API_URL}/appointments?appointment_date=eq.${date}`, { headers })
            return response.data
        },
        // Get appointments by date range
        async getByDateRange(startDate, endDate) {
            const response = await axios.get(`${API_URL}/appointments?appointment_date=gte.${startDate}&appointment_date=lte.${endDate}`, { headers })
            return response.data
        },
        // Get appointments by status
        async getByStatus(status) {
            const response = await axios.get(`${API_URL}/appointments?status=eq.${status}`, { headers })
            return response.data
        },
        // Get today's appointments
        async getToday() {
            const today = new Date().toISOString().split('T')[0]
            const response = await axios.get(`${API_URL}/appointments?appointment_date=eq.${today}`, { headers })
            return response.data
        },
        // Get upcoming appointments
        async getUpcoming() {
            const today = new Date().toISOString().split('T')[0]
            const response = await axios.get(`${API_URL}/appointments?appointment_date=gte.${today}&status=in.(pending,confirmed)`, { headers })
            return response.data
        },
        // Create new appointment
        async create(data) {
            const response = await axios.post(`${API_URL}/appointments`, data, { headers })
            return response.data
        },
        // Update appointment
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/appointments?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Update appointment status
        async updateStatus(id, status) {
            const response = await axios.patch(`${API_URL}/appointments?id=eq.${id}`, { status }, { headers })
            return response.data
        },
        // Cancel appointment
        async cancel(id, reason, cancelledBy = 'clinic') {
            const status = cancelledBy === 'patient' ? 'cancelled_by_patient' : 'cancelled_by_clinic'
            const response = await axios.patch(`${API_URL}/appointments?id=eq.${id}`, { status, notes: reason }, { headers })
            return response.data
        },
        // Delete appointment
        async delete(id) {
            const response = await axios.delete(`${API_URL}/appointments?id=eq.${id}`, { headers })
            return response.data
        },
        // Get available slots for a doctor on a date
        async getAvailableSlots(doctorId, date) {
            // First get doctor's schedule
            const dayOfWeek = new Date(date).getDay()
            const schedule = await axios.get(`${API_URL}/doctor_schedules?doctor_id=eq.${doctorId}&day_of_week=eq.${dayOfWeek}`, { headers })
            
            if (!schedule.data[0] || schedule.data[0].is_off) {
                return []
            }
            
            // Then get existing appointments
            const appointments = await axios.get(`${API_URL}/appointments?doctor_id=eq.${doctorId}&appointment_date=eq.${date}`, { headers })
            
            // Calculate available slots (simplified)
            const start = schedule.data[0].start_time
            const end = schedule.data[0].end_time
            const breakStart = schedule.data[0].break_start
            const breakEnd = schedule.data[0].break_end
            
            return { schedule: schedule.data[0], existingAppointments: appointments.data, start, end, breakStart, breakEnd }
        }
    },

    // =====================================================
    // 10. APPOINTMENT TREATMENTS
    // =====================================================
    appointmentTreatments: {
        // Get all
        async getAll() {
            const response = await axios.get(`${API_URL}/appointment_treatments`, { headers })
            return response.data
        },
        // Get by appointment ID
        async getByAppointmentId(appointmentId) {
            const response = await axios.get(`${API_URL}/appointment_treatments?appointment_id=eq.${appointmentId}`, { headers })
            return response.data
        },
        // Create
        async create(data) {
            const response = await axios.post(`${API_URL}/appointment_treatments`, data, { headers })
            return response.data
        },
        // Create multiple (bulk)
        async createBulk(dataArray) {
            const promises = dataArray.map(data => axios.post(`${API_URL}/appointment_treatments`, data, { headers }))
            const responses = await Promise.all(promises)
            return responses.map(r => r.data)
        },
        // Delete by appointment ID
        async deleteByAppointmentId(appointmentId) {
            const response = await axios.delete(`${API_URL}/appointment_treatments?appointment_id=eq.${appointmentId}`, { headers })
            return response.data
        },
        // Delete by ID
        async delete(id) {
            const response = await axios.delete(`${API_URL}/appointment_treatments?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 11. INVOICES
    // =====================================================
    invoices: {
        // Get all invoices
        async getAll() {
            const response = await axios.get(`${API_URL}/invoices`, { headers })
            return response.data
        },
        // Get invoice by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/invoices?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get invoice by number
        async getByNumber(invoiceNumber) {
            const response = await axios.get(`${API_URL}/invoices?invoice_number=eq.${invoiceNumber}`, { headers })
            return response.data[0]
        },
        // Get invoices by appointment ID
        async getByAppointmentId(appointmentId) {
            const response = await axios.get(`${API_URL}/invoices?appointment_id=eq.${appointmentId}`, { headers })
            return response.data[0]
        },
        // Get unpaid invoices
        async getUnpaid() {
            const response = await axios.get(`${API_URL}/invoices?status=in.(unpaid,partial)`, { headers })
            return response.data
        },
        // Get invoices by patient ID (via appointment)
        async getByPatientId(patientId) {
            // First get appointments for patient
            const appointments = await axios.get(`${API_URL}/appointments?patient_id=eq.${patientId}`, { headers })
            const appointmentIds = appointments.data.map(a => a.id)
            if (appointmentIds.length === 0) return []
            const response = await axios.get(`${API_URL}/invoices?appointment_id=in.(${appointmentIds.join(',')})`, { headers })
            return response.data
        },
        // Create new invoice
        async create(data) {
            const response = await axios.post(`${API_URL}/invoices`, data, { headers })
            return response.data
        },
        // Update invoice
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/invoices?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Update payment status
        async updatePaymentStatus(id, paidAmount) {
            const invoice = await this.getById(id)
            const newPaidAmount = invoice.paid_amount + paidAmount
            let status = 'unpaid'
            if (newPaidAmount >= invoice.total_amount - invoice.discount_amount) {
                status = 'paid'
            } else if (newPaidAmount > 0) {
                status = 'partial'
            }
            const response = await axios.patch(`${API_URL}/invoices?id=eq.${id}`, { paid_amount: newPaidAmount, status }, { headers })
            return response.data
        },
        // Delete invoice
        async delete(id) {
            const response = await axios.delete(`${API_URL}/invoices?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 12. PAYMENTS
    // =====================================================
    payments: {
        // Get all payments
        async getAll() {
            const response = await axios.get(`${API_URL}/payments`, { headers })
            return response.data
        },
        // Get payment by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/payments?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get payments by invoice ID
        async getByInvoiceId(invoiceId) {
            const response = await axios.get(`${API_URL}/payments?invoice_id=eq.${invoiceId}`, { headers })
            return response.data
        },
        // Get payments by date range
        async getByDateRange(startDate, endDate) {
            const response = await axios.get(`${API_URL}/payments?payment_date=gte.${startDate}&payment_date=lte.${endDate}`, { headers })
            return response.data
        },
        // Create new payment
        async create(data) {
            const response = await axios.post(`${API_URL}/payments`, data, { headers })
            // Update invoice status after payment
            if (data.invoice_id) {
                await invoices.updatePaymentStatus(data.invoice_id, data.amount)
            }
            return response.data
        },
        // Delete payment
        async delete(id) {
            const response = await axios.delete(`${API_URL}/payments?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 13. INVENTORY
    // =====================================================
    inventory: {
        // Get all inventory
        async getAll() {
            const response = await axios.get(`${API_URL}/inventory`, { headers })
            return response.data
        },
        // Get inventory by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/inventory?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get inventory by code
        async getByCode(code) {
            const response = await axios.get(`${API_URL}/inventory?code=eq.${code}`, { headers })
            return response.data[0]
        },
        // Get by category
        async getByCategory(category) {
            const response = await axios.get(`${API_URL}/inventory?category=eq.${category}`, { headers })
            return response.data
        },
        // Get low stock items
        async getLowStock() {
            const response = await axios.get(`${API_URL}/inventory`, { headers })
            return response.data.filter(item => item.stock <= item.min_stock)
        },
        // Get expiring items (30 days)
        async getExpiringSoon() {
            const thirtyDaysLater = new Date()
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
            const dateStr = thirtyDaysLater.toISOString().split('T')[0]
            const response = await axios.get(`${API_URL}/inventory?expiry_date=lte.${dateStr}&expiry_date=is.not.null`, { headers })
            return response.data
        },
        // Create new inventory item
        async create(data) {
            const response = await axios.post(`${API_URL}/inventory`, data, { headers })
            return response.data
        },
        // Update inventory
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/inventory?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Update stock
        async updateStock(id, quantity, type = 'set') {
            const item = await this.getById(id)
            let newStock
            if (type === 'add') {
                newStock = item.stock + quantity
            } else if (type === 'subtract') {
                newStock = item.stock - quantity
            } else {
                newStock = quantity
            }
            const response = await axios.patch(`${API_URL}/inventory?id=eq.${id}`, { stock: newStock }, { headers })
            return response.data
        },
        // Delete inventory
        async delete(id) {
            const response = await axios.delete(`${API_URL}/inventory?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 14. INVENTORY TRANSACTIONS
    // =====================================================
    inventoryTransactions: {
        // Get all transactions
        async getAll() {
            const response = await axios.get(`${API_URL}/inventory_transactions`, { headers })
            return response.data
        },
        // Get by inventory ID
        async getByInventoryId(inventoryId) {
            const response = await axios.get(`${API_URL}/inventory_transactions?inventory_id=eq.${inventoryId}`, { headers })
            return response.data
        },
        // Create transaction (and update stock automatically)
        async create(data) {
            const response = await axios.post(`${API_URL}/inventory_transactions`, data, { headers })
            // Update stock based on transaction type
            if (data.type === 'in') {
                await inventory.updateStock(data.inventory_id, data.quantity, 'add')
            } else if (data.type === 'out') {
                await inventory.updateStock(data.inventory_id, data.quantity, 'subtract')
            } else if (data.type === 'opname') {
                await inventory.updateStock(data.inventory_id, data.quantity, 'set')
            }
            return response.data
        }
    },

    // =====================================================
    // 15. SURVEYS
    // =====================================================
    surveys: {
        // Get all surveys
        async getAll() {
            const response = await axios.get(`${API_URL}/surveys`, { headers })
            return response.data
        },
        // Get survey by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/surveys?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get surveys by appointment ID
        async getByAppointmentId(appointmentId) {
            const response = await axios.get(`${API_URL}/surveys?appointment_id=eq.${appointmentId}`, { headers })
            return response.data[0]
        },
        // Get surveys by rating (bad reviews)
        async getBadReviews() {
            const response = await axios.get(`${API_URL}/surveys?rating_comfort=lte.3`, { headers })
            return response.data
        },
        // Get average rating per doctor (via appointment)
        async getAverageRatingByDoctor(doctorId) {
            // First get appointments for doctor
            const appointments = await axios.get(`${API_URL}/appointments?doctor_id=eq.${doctorId}`, { headers })
            const appointmentIds = appointments.data.map(a => a.id)
            if (appointmentIds.length === 0) return null
            const surveys = await axios.get(`${API_URL}/surveys?appointment_id=in.(${appointmentIds.join(',')})`, { headers })
            const avg = surveys.data.reduce((acc, s) => acc + s.rating_comfort, 0) / surveys.data.length
            return avg
        },
        // Create new survey
        async create(data) {
            const response = await axios.post(`${API_URL}/surveys`, data, { headers })
            return response.data
        },
        // Update survey
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/surveys?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Mark follow-up as done
        async markFollowUpDone(id) {
            const response = await axios.patch(`${API_URL}/surveys?id=eq.${id}`, { follow_up_status: 'done' }, { headers })
            return response.data
        },
        // Delete survey
        async delete(id) {
            const response = await axios.delete(`${API_URL}/surveys?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 16. LOYALTY POINTS
    // =====================================================
    loyaltyPoints: {
        // Get all loyalty points
        async getAll() {
            const response = await axios.get(`${API_URL}/loyalty_points`, { headers })
            return response.data
        },
        // Get points by patient ID
        async getByPatientId(patientId) {
            const response = await axios.get(`${API_URL}/loyalty_points?patient_id=eq.${patientId}`, { headers })
            return response.data
        },
        // Get total points for a patient
        async getTotalPoints(patientId) {
            const points = await this.getByPatientId(patientId)
            const total = points.reduce((acc, p) => acc + p.points, 0)
            return total
        },
        // Add points to patient
        async addPoints(patientId, points, source, transactionId = null) {
            const data = {
                patient_id: patientId,
                points: points,
                source: source,
                transaction_id: transactionId,
                expired_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
            }
            const response = await axios.post(`${API_URL}/loyalty_points`, data, { headers })
            return response.data
        },
        // Deduct points (for reward redemption)
        async deductPoints(patientId, points, source = 'reward_redemption') {
            const data = {
                patient_id: patientId,
                points: -points,
                source: source
            }
            const response = await axios.post(`${API_URL}/loyalty_points`, data, { headers })
            return response.data
        }
    },

    // =====================================================
    // 17. REWARDS
    // =====================================================
    rewards: {
        // Get all rewards
        async getAll() {
            const response = await axios.get(`${API_URL}/rewards`, { headers })
            return response.data
        },
        // Get active rewards
        async getActive() {
            const response = await axios.get(`${API_URL}/rewards?is_active=eq.true`, { headers })
            return response.data
        },
        // Get reward by ID
        async getById(id) {
            const response = await axios.get(`${API_URL}/rewards?id=eq.${id}`, { headers })
            return response.data[0]
        },
        // Get rewards patient can afford
        async getAffordableRewards(patientId) {
            const totalPoints = await loyaltyPoints.getTotalPoints(patientId)
            const rewards = await this.getActive()
            return rewards.filter(r => r.points_required <= totalPoints && r.stock > 0)
        },
        // Create reward
        async create(data) {
            const response = await axios.post(`${API_URL}/rewards`, data, { headers })
            return response.data
        },
        // Update reward
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/rewards?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Update stock (reduce when redeemed)
        async reduceStock(id) {
            const reward = await this.getById(id)
            const response = await axios.patch(`${API_URL}/rewards?id=eq.${id}`, { stock: reward.stock - 1 }, { headers })
            return response.data
        },
        // Delete reward
        async delete(id) {
            const response = await axios.delete(`${API_URL}/rewards?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 18. REWARD REDEMPTIONS
    // =====================================================
    rewardRedemptions: {
        // Get all redemptions
        async getAll() {
            const response = await axios.get(`${API_URL}/reward_redemptions`, { headers })
            return response.data
        },
        // Get redemptions by patient ID
        async getByPatientId(patientId) {
            const response = await axios.get(`${API_URL}/reward_redemptions?patient_id=eq.${patientId}`, { headers })
            return response.data
        },
        // Redeem reward
        async redeem(patientId, rewardId) {
            const reward = await rewards.getById(rewardId)
            if (!reward || reward.stock <= 0) {
                throw new Error('Reward out of stock')
            }
            const totalPoints = await loyaltyPoints.getTotalPoints(patientId)
            if (totalPoints < reward.points_required) {
                throw new Error('Insufficient points')
            }
            // Deduct points
            await loyaltyPoints.deductPoints(patientId, reward.points_required, `redeemed_${reward.name}`)
            // Reduce reward stock
            await rewards.reduceStock(rewardId)
            // Create redemption record
            const data = {
                patient_id: patientId,
                reward_id: rewardId,
                points_used: reward.points_required
            }
            const response = await axios.post(`${API_URL}/reward_redemptions`, data, { headers })
            return response.data
        }
    },

    // =====================================================
    // 19. PROMOTIONS
    // =====================================================
    promotions: {
        // Get all promotions
        async getAll() {
            const response = await axios.get(`${API_URL}/promotions`, { headers })
            return response.data
        },
        // Get active promotions
        async getActive() {
            const today = new Date().toISOString().split('T')[0]
            const response = await axios.get(`${API_URL}/promotions?is_active=eq.true&start_date=lte.${today}&end_date=gte.${today}`, { headers })
            return response.data
        },
        // Get promotion by coupon code
        async getByCouponCode(couponCode) {
            const response = await axios.get(`${API_URL}/promotions?coupon_code=eq.${couponCode}`, { headers })
            return response.data[0]
        },
        // Validate coupon
        async validateCoupon(couponCode, totalAmount) {
            const promo = await this.getByCouponCode(couponCode)
            if (!promo || !promo.is_active) {
                return { valid: false, message: 'Kupon tidak valid' }
            }
            const today = new Date().toISOString().split('T')[0]
            if (promo.start_date > today || promo.end_date < today) {
                return { valid: false, message: 'Kupon sudah kadaluarsa' }
            }
            if (totalAmount < promo.min_transaction) {
                return { valid: false, message: `Minimal belanja Rp${promo.min_transaction.toLocaleString()}` }
            }
            const discountAmount = (totalAmount * promo.discount_percent) / 100
            return { valid: true, discountPercent: promo.discount_percent, discountAmount }
        },
        // Create promotion
        async create(data) {
            const response = await axios.post(`${API_URL}/promotions`, data, { headers })
            return response.data
        },
        // Update promotion
        async update(id, data) {
            const response = await axios.patch(`${API_URL}/promotions?id=eq.${id}`, data, { headers })
            return response.data
        },
        // Delete promotion
        async delete(id) {
            const response = await axios.delete(`${API_URL}/promotions?id=eq.${id}`, { headers })
            return response.data
        }
    },

    // =====================================================
    // 20. COMMUNICATION LOGS
    // =====================================================
    communicationLogs: {
        // Get all logs
        async getAll() {
            const response = await axios.get(`${API_URL}/communication_logs`, { headers })
            return response.data
        },
        // Get logs by patient ID
        async getByPatientId(patientId) {
            const response = await axios.get(`${API_URL}/communication_logs?patient_id=eq.${patientId}`, { headers })
            return response.data
        },
        // Get logs by channel
        async getByChannel(channel) {
            const response = await axios.get(`${API_URL}/communication_logs?channel=eq.${channel}`, { headers })
            return response.data
        },
        // Log outgoing message
        async logOutgoing(patientId, channel, message, handledBy) {
            const data = {
                patient_id: patientId,
                channel: channel,
                direction: 'out',
                message: message,
                handled_by: handledBy
            }
            const response = await axios.post(`${API_URL}/communication_logs`, data, { headers })
            return response.data
        },
        // Log incoming message
        async logIncoming(patientId, channel, message) {
            const data = {
                patient_id: patientId,
                channel: channel,
                direction: 'in',
                message: message
            }
            const response = await axios.post(`${API_URL}/communication_logs`, data, { headers })
            return response.data
        }
    },

    // =====================================================
    // 21. ACTIVITY LOGS
    // =====================================================
    activityLogs: {
        // Get all logs
        async getAll() {
            const response = await axios.get(`${API_URL}/activity_logs`, { headers })
            return response.data
        },
        // Get logs by user ID
        async getByUserId(userId) {
            const response = await axios.get(`${API_URL}/activity_logs?user_id=eq.${userId}`, { headers })
            return response.data
        },
        // Get logs by action
        async getByAction(action) {
            const response = await axios.get(`${API_URL}/activity_logs?action=eq.${action}`, { headers })
            return response.data
        },
        // Get logs by date range
        async getByDateRange(startDate, endDate) {
            const response = await axios.get(`${API_URL}/activity_logs?created_at=gte.${startDate}&created_at=lte.${endDate}`, { headers })
            return response.data
        },
        // Log activity
        async log(userId, action, tableName, recordId, oldData = null, newData = null, ipAddress = null) {
            const data = {
                user_id: userId,
                action: action,
                table_name: tableName,
                record_id: recordId,
                old_data: oldData,
                new_data: newData,
                ip_address: ipAddress
            }
            const response = await axios.post(`${API_URL}/activity_logs`, data, { headers })
            return response.data
        }
    }
}

export default dentalAPI