export const permissionsList = [
    { id: 1, name: 'OutPatientParent' },
    { id: 2, name: 'OutPatient' },
    { id: 3, name: 'InPatient' },
    { id: 4, name: 'LabStaff' },
    { id: 5, name: 'RadiologyStaff' },
    { id: 6, name: 'ScheduleAppointmentStaff' },
    { id: 7, name: 'ScheduleProcedureStaff' },
    { id: 8, name: 'PharmacyStaff' },
    { id: 9, name: 'BillingStaff' },
    { id: 10, name: 'AdminStaff' },
    { id: 11, name: 'ClinicalReport' },
    { id: 12, name: 'UserManagerStaff' },
    { id: 13, name: 'TheatreStaff' },
    { id: 14, name: "InventoryStaff" },
    { id: 15, name: "BillingStaffHOD" },
    { id: 16, name: "Histopathology" }
];

export const roles = [
    { id: 1, name: "Medical Director", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13] },
    { id: 2, name: "Medical Doctor", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12] },
    { id: 3, name: "General Nurse", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12] },
    { id: 4, name: "Nurse/Midwife", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12] },
    { id: 5, name: "Theatre Nurse", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12] },
    { id: 6, name: "Lab Technician", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12] },
    { id: 7, name: "Pharmacist", defaultPermissions: [8, 9, 11, 13] },
    { id: 8, name: "Pharmacy Technician", defaultPermissions: [8, 9, 11, 13] },
    { id: 9, name: "Accountant", defaultPermissions: [9, 11, 13] },
    { id: 10, name: "Cashiers", defaultPermissions: [9, 13] },
    { id: 11, name: "HOD Cashier", defaultPermissions: [9, 11, 13] },
    { id: 12, name: "Record Officer", defaultPermissions: [2] },
    { id: 13, name: "HOD Records", defaultPermissions: [3, 11] },
    { id: 14, name: "Dental Technician", defaultPermissions: [2, 3] },
    { id: 15, name: "Dental Therapist", defaultPermissions: [2, 3] },
    { id: 16, name: "ENT Nurse", defaultPermissions: [2, 3] },
    { id: 17, name: "Physiotherapy", defaultPermissions: [2, 3] },
    { id: 18, name: "Radiologist", defaultPermissions: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12] }
]