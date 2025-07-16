export const permissionsList = [
    { id: 1, name: 'isOutPatientParent' },
    { id: 2, name: 'isOutPatient' },
    { id: 3, name: 'isInPatient' },
    { id: 4, name: 'isLabStaff' },
    { id: 5, name: 'isRadiologyStaff' },
    { id: 6, name: 'isScheduleAppointmentStaff' },
    { id: 7, name: 'isScheduleProcedureStaff' },
    { id: 8, name: 'isPharmacyStaff' },
    { id: 9, name: 'isBillingStaff' },
    { id: 10, name: 'isAdminStaff' },
    { id: 11, name: 'isClinicalReport' },
    { id: 12, name: 'isUserManagerStaff' },
    { id: 13, name: 'isPaymentStaff' }
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