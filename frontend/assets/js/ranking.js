// Function to fetch and parse CSV data
async function fetchRankingData() {
    try {
        const response = await fetch('../source_files/fitcoin_rank.csv');
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error fetching ranking data:', error);
        return [];
    }
}

// Function to parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        const member = {};
        
        headers.forEach((header, index) => {
            member[header] = values[index];
        });

        // Convert totalFitCoins to number
        member.totalFitCoins = parseFloat(member.totalFitCoins) || 0;
        
        return member;
    });
}

function formatFitCoins(coins) {
    return Number(coins).toFixed(1);
}

async function createRankingTable() {
    const tableBody = document.getElementById('rankingBody');
    tableBody.innerHTML = ''; // Clear existing content
    
    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Loading...</td></tr>';
    
    try {
        const rankingData = await fetchRankingData();
        
        // Sort data by fitcoins in descending order
        const sortedData = rankingData.sort((a, b) => b.totalFitCoins - a.totalFitCoins);
        
        // Clear loading state
        tableBody.innerHTML = '';
        
        sortedData.forEach((member, index) => {
            const row = document.createElement('tr');
            
            // Create rank cell
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            
            // Create member info cell
            const memberCell = document.createElement('td');
            const memberInfo = document.createElement('div');
            memberInfo.className = 'member-info';
            
            const photo = document.createElement('img');
            photo.src = member.photoUrl;
            photo.alt = `${member.firstName} ${member.lastName}`;
            photo.className = 'member-photo';
            photo.onerror = function() {
                this.src = '../assets/images/default-avatar.png';
            };
            
            const name = document.createElement('span');
            name.className = 'member-name';
            name.textContent = `${member.firstName} ${member.lastName}`;
            
            memberInfo.appendChild(photo);
            memberInfo.appendChild(name);
            memberCell.appendChild(memberInfo);
            
            // Create fitcoins cell
            const fitcoinsCell = document.createElement('td');
            fitcoinsCell.className = 'fitcoins';
            fitcoinsCell.textContent = formatFitCoins(member.totalFitCoins);
            
            // Append all cells to the row
            row.appendChild(rankCell);
            row.appendChild(memberCell);
            row.appendChild(fitcoinsCell);
            
            // Append row to table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error creating ranking table:', error);
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Error loading ranking data</td></tr>';
    }
}

// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', createRankingTable); 