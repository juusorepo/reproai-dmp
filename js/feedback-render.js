/**
 * Rendering utilities for the DMP feedback view
 */

// Render manuscript metadata section
function renderManuscriptMetadata(data) {
    const container = document.getElementById('manuscript-metadata');
    container.innerHTML = '';
    
    // Get normalized data
    const normalizedData = FeedbackData.normalizeData(data);
    
    // Create section header
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Manuscript Metadata';
    container.appendChild(header);
    
    // Create metadata container
    const metadataDiv = document.createElement('div');
    metadataDiv.className = 'metadata-container';
    
    // Get manuscript title from multiple possible fields
    const title = FeedbackData.safeGet(normalizedData, 'title') || 
                  FeedbackData.safeGet(normalizedData, 'manuscript_title') || 
                  'Untitled Manuscript';
    
    // Create title element
    const titleElem = document.createElement('h3');
    titleElem.className = 'manuscript-title';
    titleElem.textContent = title;
    metadataDiv.appendChild(titleElem);
    
    // Get study design and discipline from DMP metadata
    const studyDesign = FeedbackData.safeGet(normalizedData, 'study_design');
    const discipline = FeedbackData.safeGet(normalizedData, 'discipline');
    
    if (studyDesign) {
        const designElem = document.createElement('p');
        designElem.className = 'metadata-item';
        designElem.textContent = `Study Design: ${studyDesign}`;
        metadataDiv.appendChild(designElem);
    }
    
    if (discipline) {
        const disciplineElem = document.createElement('p');
        disciplineElem.className = 'metadata-item';
        disciplineElem.textContent = `Discipline: ${discipline}`;
        metadataDiv.appendChild(disciplineElem);
    }
    
    // Get authors
    const authors = FeedbackData.safeGet(normalizedData, 'authors', []);
    if (authors && authors.length > 0) {
        const authorsElem = document.createElement('p');
        authorsElem.className = 'metadata-item';
        authorsElem.textContent = `Authors: ${authors.join(', ')}`;
        metadataDiv.appendChild(authorsElem);
    }
    
    // Get DOI
    let doi = FeedbackData.safeGet(normalizedData, 'doi');
    // Handle MongoDB ObjectId format
    if (doi && typeof doi === 'object' && doi.$oid) {
        doi = doi.$oid;
    }
    
    if (doi) {
        const doiElem = document.createElement('p');
        doiElem.className = 'metadata-item';
        doiElem.textContent = `DOI: ${doi}`;
        metadataDiv.appendChild(doiElem);
    }
    
    container.appendChild(metadataDiv);
}

// Render analysis information section
function renderAnalysisInfo(data) {
    const container = document.getElementById('analysis-info');
    container.innerHTML = '';
    
    // Get normalized data
    const normalizedData = FeedbackData.normalizeData(data);
    
    // Create section header
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Analysis Information';
    container.appendChild(header);
    
    // Create info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'metadata-container';
    
    // Analysis date
    const timestamp = FeedbackData.safeGet(normalizedData, 'timestamp') || 
                      FeedbackData.safeGet(normalizedData, 'created_at');
    
    if (timestamp) {
        const dateElem = document.createElement('p');
        dateElem.className = 'metadata-item';
        dateElem.textContent = `Analysis Date: ${FeedbackData.formatDate(timestamp)}`;
        infoDiv.appendChild(dateElem);
    }
    
    // Analysis ID
    const runId = FeedbackData.safeGet(normalizedData, 'run_id');
    const id = FeedbackData.safeGet(normalizedData, '_id');
    
    if (runId) {
        const idElem = document.createElement('p');
        idElem.className = 'metadata-item';
        idElem.textContent = `Analysis ID: ${runId}`;
        infoDiv.appendChild(idElem);
    } else if (id) {
        const idElem = document.createElement('p');
        idElem.className = 'metadata-item';
        idElem.textContent = `Analysis ID: ${typeof id === 'object' && id.$oid ? id.$oid : id}`;
        infoDiv.appendChild(idElem);
    }
    
    // Configuration ID
    const configId = FeedbackData.safeGet(normalizedData, 'config_id');
    
    if (configId) {
        const configElem = document.createElement('p');
        configElem.className = 'metadata-item';
        configElem.textContent = `Configuration: ${configId}`;
        infoDiv.appendChild(configElem);
    }
    
    container.appendChild(infoDiv);
}

// Render feedback note section
function renderFeedbackNote(feedbackNote) {
    const container = document.getElementById('feedback-note');
    container.innerHTML = '';
    
    if (!feedbackNote) return;
    
    // Create section header
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Feedback Summary';
    container.appendChild(header);
    
    // Create note container
    const noteDiv = document.createElement('div');
    noteDiv.className = 'feedback-note-container';
    
    // Convert markdown to HTML
    const converter = new showdown.Converter();
    noteDiv.innerHTML = converter.makeHtml(feedbackNote);
    
    container.appendChild(noteDiv);
}

// Render domain summaries section
function renderDomainSummaries(data, checklist) {
    const container = document.getElementById('domain-summaries');
    container.innerHTML = '';
    
    // Get normalized data
    const normalizedData = FeedbackData.normalizeData(data);
    
    // Get domain summaries
    const domainSummaries = FeedbackData.extractDomainSummaries(normalizedData);
    if (!domainSummaries || Object.keys(domainSummaries).length === 0) return;
    
    // Create section header
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Domain Summaries';
    container.appendChild(header);
    
    // Get sections with domains
    const sections = FeedbackData.extractSections(normalizedData);
    
    // Create table for each section
    sections.forEach(section => {
        if (!section.domains || section.domains.length === 0) return;
        
        // Create section header if there are multiple sections
        if (sections.length > 1) {
            const sectionHeader = document.createElement('h3');
            sectionHeader.className = 'section-subheader';
            sectionHeader.textContent = section.name || `Section ${section.section_id}`;
            container.appendChild(sectionHeader);
        }
        
        // Create table
        const table = document.createElement('table');
        table.className = 'domain-summary-table';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Domain', 'Result', 'Evidence', 'Recommendations'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add rows for each domain in this section
        section.domains.forEach(domain => {
            if (!domain.domain_id) return;
            
            const row = document.createElement('tr');
            
            // Domain title
            const domainCell = document.createElement('td');
            domainCell.textContent = domain.title || `Domain ${domain.domain_id}`;
            row.appendChild(domainCell);
            
            // Result/Classification
            const resultCell = document.createElement('td');
            const classification = domain.summary?.classification || 
                                  domain.compliance || 
                                  'Unknown';
            
            const badge = document.createElement('span');
            badge.className = `badge ${FeedbackData.getComplianceColorClass(classification)}`;
            badge.textContent = classification;
            resultCell.appendChild(badge);
            row.appendChild(resultCell);
            
            // Evidence
            const evidenceCell = document.createElement('td');
            const evidence = domain.summary?.evidence || [];
            
            if (evidence.length > 0) {
                const ul = document.createElement('ul');
                evidence.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                evidenceCell.appendChild(ul);
            } else {
                evidenceCell.textContent = domainSummaries[domain.domain_id] || '';
            }
            
            row.appendChild(evidenceCell);
            
            // Recommendations
            const recsCell = document.createElement('td');
            recsCell.textContent = domain.summary?.recommendations || '';
            row.appendChild(recsCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
    });
}

// Render domains and items section
function renderDomains(data, checklist) {
    const container = document.getElementById('domains');
    container.innerHTML = '';
    
    // Get normalized data
    const normalizedData = FeedbackData.normalizeData(data);
    
    // Create section header
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'Detailed Domain Analysis';
    container.appendChild(header);
    
    // Get sections with domains
    const sections = FeedbackData.extractSections(normalizedData);
    
    // Process each section
    sections.forEach(section => {
        if (!section.domains || section.domains.length === 0) return;
        
        // Create section header if there are multiple sections
        if (sections.length > 1) {
            const sectionHeader = document.createElement('h3');
            sectionHeader.className = 'section-subheader';
            sectionHeader.textContent = section.name || `Section ${section.section_id}`;
            container.appendChild(sectionHeader);
        }
        
        // Process each domain in this section
        section.domains.forEach(domain => {
            if (!domain.domain_id) return;
            
            // Create domain container
            const domainDiv = document.createElement('div');
            domainDiv.className = 'domain-container';
            domainDiv.id = `domain-${domain.domain_id}`;
            
            // Domain header with title and compliance
            const domainHeader = document.createElement('div');
            domainHeader.className = 'domain-header';
            
            // Domain title
            const domainTitle = document.createElement('h4');
            domainTitle.className = 'domain-title';
            domainTitle.textContent = domain.title || `Domain ${domain.domain_id}`;
            domainHeader.appendChild(domainTitle);
            
            // Domain compliance badge
            const classification = domain.summary?.classification || 
                                  domain.compliance || 
                                  'Unknown';
            
            const badge = document.createElement('span');
            badge.className = `badge ${FeedbackData.getComplianceColorClass(classification)}`;
            badge.textContent = classification;
            domainHeader.appendChild(badge);
            
            domainDiv.appendChild(domainHeader);
            
            // Domain summary
            if (domain.summary?.summary || domain.explanation) {
                const summaryDiv = document.createElement('div');
                summaryDiv.className = 'domain-summary';
                summaryDiv.textContent = domain.summary?.summary || domain.explanation || '';
                domainDiv.appendChild(summaryDiv);
            }
            
            // Items table if available
            if (domain.items && domain.items.length > 0) {
                // Create table
                const table = document.createElement('table');
                table.className = 'items-table';
                
                // Create table header
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                
                const headers = ['Item', 'Compliance', 'Question', 'Explanation'];
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                
                thead.appendChild(headerRow);
                table.appendChild(thead);
                
                // Create table body
                const tbody = document.createElement('tbody');
                
                // Add rows for each item
                domain.items.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.className = index % 2 === 0 ? 'even-row' : 'odd-row';
                    
                    // Item title
                    const itemCell = document.createElement('td');
                    itemCell.textContent = item.title || `Item ${item.item_id}`;
                    row.appendChild(itemCell);
                    
                    // Compliance
                    const complianceCell = document.createElement('td');
                    const itemCompliance = item.analysis?.compliance || 'Unknown';
                    
                    const itemBadge = document.createElement('span');
                    itemBadge.className = `badge ${FeedbackData.getComplianceColorClass(itemCompliance)}`;
                    itemBadge.textContent = itemCompliance;
                    complianceCell.appendChild(itemBadge);
                    row.appendChild(complianceCell);
                    
                    // Question
                    const questionCell = document.createElement('td');
                    questionCell.textContent = item.question || '';
                    row.appendChild(questionCell);
                    
                    // Explanation
                    const explanationCell = document.createElement('td');
                    explanationCell.textContent = item.analysis?.explanation || '';
                    row.appendChild(explanationCell);
                    
                    tbody.appendChild(row);
                });
                
                table.appendChild(tbody);
                domainDiv.appendChild(table);
            }
            
            container.appendChild(domainDiv);
        });
    });
}

// Export the functions
window.FeedbackRender = {
    renderManuscriptMetadata,
    renderAnalysisInfo,
    renderFeedbackNote,
    renderDomainSummaries,
    renderDomains
};
