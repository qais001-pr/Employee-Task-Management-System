import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // --- Global Containers & ScrollView ---
    safeAreaView: {
        flex: 1,
        backgroundColor: '#F7F9FC', // Light, fresh background
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
    },
    horizontalListContainer: {
        paddingHorizontal: 15, // Adjusted padding for horizontal lists
        paddingVertical: 5,
    },
    employeeListWrapper: {
        paddingHorizontal: 20,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 300,
    },
    emptyContainerText: {
        fontSize: 14,
        color: '#ADB5BD',
        fontStyle: 'italic',
    },

    // --- Header & Search ---
    headerContainter: {
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    headerText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1B2A49', // Deep dark blue for a professional look
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
        marginTop: 25,
    },
    subHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#34495E', // Muted dark title
    },
    searchButton: {
        padding: 5,
    },
    searchInput: {
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CED4DA',
        fontSize: 14,
        color: '#495057',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    // --- 1. Project Cards (Blue/Primary Theme) ---
    projectCard: {
        backgroundColor: '#E6F0FF', // Very light blue background
        borderRadius: 15,
        padding: 18,
        marginHorizontal: 5, // Tighter spacing for horizontal
        width: 300,
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#C3D9FF',
        justifyContent: 'space-between',
        minHeight: 200,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0056B3',
        marginBottom: 5,
    },
    projectDescription: {
        fontSize: 12,
        color: '#6C757D',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    projectText: {
        fontSize: 13,
        color: '#34495E',
        lineHeight: 22,
    },
    projectStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    projectStatusBadge: {
        marginLeft: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: '700',
    },
    projectDuration: {
        fontSize: 11,
        color: '#ADB5BD',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#C3D9FF',
        paddingTop: 8,
    },

    // --- 2. Employee Cards (Green/Success Theme) ---
    employeeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 10,
        shadowColor: '#28A745',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderLeftWidth: 5,
        borderLeftColor: '#28A745', // Green vertical accent bar
    },
    employeeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    employeeName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#212529',
    },
    employeeStatus: {
        fontSize: 13,
        fontWeight: '800',
    },
    employeeDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
        paddingBottom: 5,
    },
    employeeText: {
        fontSize: 13,
        color: '#495057',
        width: '48%',
    },
    employeeEmail: {
        fontSize: 12,
        color: '#6C757D',
        marginTop: 5,
    },

    // --- 3. Department Cards (Purple/Secondary Theme) ---
    departmentCard: {
        backgroundColor: '#F3E5F5', // Very light purple background
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 5,
        width: 180,
        alignItems: 'center',
        shadowColor: '#9C27B0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#D1C4E9',
        minHeight: 180,
    },
    departmentName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#6A1B9A', // Dark purple text
        marginBottom: 5,
        textAlign: 'center',
    },
    departmentText: {
        fontSize: 12,
        color: '#495057',
        textAlign: 'center',
    },
});