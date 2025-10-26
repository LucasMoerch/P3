import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderAddNewStaffCard } from '../components/newCard/addNewStaffCard';
import { renderNewButton } from '../components/newButton/newButton';
import { isAdmin } from '../auth/auth';
import http from '../api/http';

export type UserRole = 'staff' | 'admin';
export type UserStatus = 'invited' | 'active' | 'disabled';

export type UserDTO = {
  id: string;
  roles: UserRole[];
  status: UserStatus;
  auth: {
    provider: 'google';
    email: string;
    emailVerified: boolean;
    pictureUrl?: string | null; // optional on some users
  };

  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    phone?: string | null;
    locale?: string | null;
  } | null;

  staff?: {
    employeeNo?: string | null;
    hourlyRate?: number | null;
    defaultCaseIds?: string[] | null;
  } | null;

  audit?: {
    createdAt?: string | null; // ISO strings from API
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
  } | null;
};

/**
 * @param email The email of the user to invite.
 * @param role The role to assign ('staff' or 'admin').
 * @returns The UserDTO object returned by the server.
 */
async function inviteUser(email: string, role: UserRole): Promise<UserDTO> {

  const url = '/api/admin/invite';
  const data = { email, role };

  const response = (await http.post(url, data)) as UserDTO;
  return response;
}

function setupInvitationHandler(realDataSection: HTMLElement) {
    const handleInvite = async (email: string, role: UserRole) => {
        try {
            if (!email || !role) {
                alert('Please provide both email and role.');
                return false;
            }

            const newUser = await inviteUser(email, role);

            alert(`Invitation sent successfully to ${newUser.auth.email} with role(s): ${newUser.roles.join(', ')}`);

            loadStaff(realDataSection);

            return true;
        } catch (err) {
            console.error('Invitation Failed:', err);
            const message = (err as any).response?.data?.message || 'Failed to send invitation. Check server logs.';
            alert(`Invitation failed: ${message}`);
            return false; // Keep the form/card open on failure
        }
    };
    return handleInvite;
}

// loadStaff takes realDataSection as an argument to be refreshable
async function loadStaff(realDataSection: HTMLElement) {
    try {
        realDataSection.innerHTML = `<h2>Users from Database</h2><p>Loading...</p>`;

        const users = (await http.get('/users')) as UserDTO[];

        const staffData = (users ?? []).map((user) => ({
            id: user.id,
            name: user.profile?.displayName || user.auth.email, // Use email if display name is null
            role: user.roles.join(', '),
            status: user.status,
        }));

        realDataSection.innerHTML = '<h2>Users from Database</h2>';
        realDataSection.appendChild(renderTable(staffData));
    } catch (err) {
        console.error('Failed to load staff:', err);
        realDataSection.innerHTML = '<h2>Users from Database</h2><p>Failed to load staff data.</p>';
    }
}

export function renderStaffPage(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = `<h1>Staff page</h1>`;

    const container = document.createElement('div');
    container.classList.add('container');
    container.appendChild(div);
    container.appendChild(renderSearchComponent());

    // New section for real data from backend
    const realDataSection = document.createElement('div');
    realDataSection.innerHTML = `<h2>Users from Database</h2><p>Loading...</p>`;

    loadStaff(realDataSection);

    // Admin only functionality
    if (isAdmin()) {
        console.log('You are Admin');

        const handleInvite = setupInvitationHandler(realDataSection);
        //const newStaffButton = renderNewButton('New Staff');
        const newStaffCard = renderAddNewStaffCard(handleInvite);

        //container.appendChild(newStaffButton);
        container.appendChild(newStaffCard);

    } else {
        console.log('You are not Admin');
    }

    container.appendChild(realDataSection);

    return container;
}