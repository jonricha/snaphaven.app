/**
 * SnapHaven User Guide & Knowledge Base Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initPlatformTabs();
    initAccordions();
    initCategoryFilters();
    initSearch();
    handleHashNavigation();
});

// Platform Tabs inside Step 1 & 2
function initPlatformTabs() {
    document.querySelectorAll('.platform-pill-group').forEach(group => {
        const pills = group.querySelectorAll('.platform-pill');
        const container = group.closest('.step-card') || group.parentElement;
        
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const targetPlatform = pill.getAttribute('data-platform');
                
                // Toggle pill active states within this group
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                // Toggle panes within this container
                container.querySelectorAll('.platform-pane').forEach(pane => {
                    if (pane.getAttribute('data-platform') === targetPlatform) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    });
}

// Accordion Toggles
function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            
            // Optional: Close others if desired, or allow multiple open. Allowing multiple is standard for tech docs.
            item.classList.toggle('is-open', !isOpen);
            trigger.setAttribute('aria-expanded', !isOpen);
        });
    });
}

// Category Filters for FAQ / Troubleshooting
function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.category-filter-btn');
    const items = document.querySelectorAll('.accordion-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            applyFilters(category, getSearchTerm());
        });
    });
}

// Real-time Search
function initSearch() {
    const searchInput = document.getElementById('guideSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.trim().toLowerCase();
        if (clearBtn) {
            clearBtn.style.display = term.length > 0 ? 'block' : 'none';
        }
        applyFilters(getActiveCategory(), term);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            searchInput.focus();
            applyFilters(getActiveCategory(), '');
        });
    }
}

function getActiveCategory() {
    const activeBtn = document.querySelector('.category-filter-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-category') : 'all';
}

function getSearchTerm() {
    const input = document.getElementById('guideSearchInput');
    return input ? input.value.trim().toLowerCase() : '';
}

function applyFilters(category, term) {
    const items = document.querySelectorAll('.accordion-item');
    const noResults = document.getElementById('noResultsMsg');
    let visibleCount = 0;

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';
        const itemText = item.textContent.toLowerCase();

        const matchesCategory = (category === 'all' || itemCategory.includes(category));
        const matchesSearch = (term === '' || itemText.includes(term));

        if (matchesCategory && matchesSearch) {
            item.style.display = 'block';
            visibleCount++;
            // If searching with a specific keyword, auto-expand matching items
            if (term.length > 2) {
                item.classList.add('is-open');
            }
        } else {
            item.style.display = 'none';
        }
    });

    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// Deep Linking via URL Hash (e.g. guide.html#firewall)
function handleHashNavigation() {
    const hash = window.location.hash;
    if (!hash) return;

    const targetElement = document.querySelector(hash);
    if (targetElement) {
        if (targetElement.classList.contains('accordion-item')) {
            targetElement.classList.add('is-open');
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        } else {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}

// Global Copy Code function
function copySnippet(elementId, btnElement) {
    const codeEl = document.getElementById(elementId);
    if (!codeEl) return;

    // Grab text ignoring the button itself
    let textToCopy = '';
    codeEl.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            textToCopy += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('guide-code-copy-btn')) {
            textToCopy += node.innerText;
        }
    });

    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Copied!';
        btnElement.style.color = '#10b981';
        btnElement.style.borderColor = '#10b981';
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.color = '';
            btnElement.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
