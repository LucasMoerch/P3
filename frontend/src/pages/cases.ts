import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderAddNewCaseCard } from '../components/newCard/addNewCaseCard';
import { renderNewButton } from '../components/newButton/newButton';
import axios from 'axios';
import { isAdmin } from '../auth/auth';

export function renderCasesPage(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = `<h1>Cases</h1>`;

    const container = document.createElement('div');
    container.classList.add('container');
    container.appendChild(div);
    container.appendChild(renderSearchComponent());

    const realDataSection = document.createElement('div');
    realDataSection.innerHTML = `<h2>Cases from Database</h2><p>Loading...</p>`;
    container.appendChild(realDataSection);

    axios
        .get('/api/cases')
        .then((res) => {
            const cases = res.data;
            const caseData = cases.map((c: any) => ({
                title: c.title || 'Untitled',
                description: c.description || '-',
                status: c.status || 'UNKNOWN',
                createdAt: new Date(c.createdAt).toLocaleDateString('da-DK'),
            }));

            realDataSection.innerHTML = '<h2>Cases from Database</h2>';
            realDataSection.appendChild(renderTable(caseData));
        })
        .catch((err) => {
            console.error('Failed to load cases:', err);
            realDataSection.innerHTML = '<h2>Cases from Database</h2><p>Failed to load cases data.</p>';
        });

    if (isAdmin()) {
        console.log('You are Admin');

    } else {
        console.log('You are not Admin');
    }

    return container;
}
