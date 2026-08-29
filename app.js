// ==========================================================================
// SnapHaven Website Interactive JavaScript & Beta Form Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Glassmorphism Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile App Modal Handlers
    window.openAppModal = function(platform) {
        const modal = document.getElementById('appModal');
        const icon = document.getElementById('modalAppIcon');
        const title = document.getElementById('modalTitle');
        const badge = document.getElementById('modalBadge');
        const body = document.getElementById('modalBody');
        const platformInput = document.getElementById('modalPlatformInput');
        const statusDiv = document.getElementById('modalBetaStatus');

        if (statusDiv) {
            statusDiv.className = 'beta-status-msg';
            statusDiv.innerText = '';
        }

        if (platform === 'android') {
            if (icon) icon.innerText = '🤖';
            if (title) title.innerText = 'SnapHaven for Android';
            if (badge) badge.innerText = 'Coming Soon to Google Play';
            if (body) body.innerText = 'The SnapHaven Android application is currently in closed testing. Enter your email below to receive an early access invite link via Google Play!';
            if (platformInput) platformInput.value = 'android';
        } else if (platform === 'ios') {
            if (icon) icon.innerText = '🍏';
            if (title) title.innerText = 'SnapHaven for iOS';
            if (badge) badge.innerText = 'In Active Development';
            if (body) body.innerText = 'The SnapHaven iOS application is under active development. Enter your email below to join the TestFlight early access list!';
            if (platformInput) platformInput.value = 'ios';
        } else {
            if (icon) icon.innerText = '📱';
            if (title) title.innerText = 'SnapHaven Mobile App';
            if (badge) badge.innerText = 'Closed Beta Open';
            if (body) body.innerText = 'Enter your email below to join our mobile beta program!';
            if (platformInput) platformInput.value = platform || 'mobile';
        }

        if (modal) modal.classList.add('active');
    };

    window.closeAppModal = function() {
        const modal = document.getElementById('appModal');
        if (modal) modal.classList.remove('active');
    };

    // Close modal on background overlay click
    const modal = document.getElementById('appModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'appModal') {
                window.closeAppModal();
            }
        });
    }

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeAppModal();
        }
    });

    // 3. Beta Form Submission Handler (Client Validation, Honeypot & Turnstile)
    window.handleBetaSubmit = async function(event, formId) {
        event.preventDefault();
        const form = document.getElementById(formId);
        if (!form) return;

        const emailInput = form.querySelector('input[type="email"]');
        const honeypotInput = form.querySelector('input[name="company_website"]');
        const platformInput = form.querySelector('[name="platform"]');
        const statusDiv = form.querySelector('.beta-status-msg');
        const submitBtn = form.querySelector('button[type="submit"]');

        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const platform = platformInput ? platformInput.value : 'android';

        // 1. Honeypot check (Bots fill out hidden fields)
        if (honeypotInput && honeypotInput.value !== '') {
            console.warn('Bot submission blocked via honeypot trap.');
            showStatus(statusDiv, 'error', 'Submission rejected. Anti-bot validation failed.');
            return;
        }

        // 2. Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showStatus(statusDiv, 'error', 'Please enter a valid email address.');
            return;
        }

        // 3. Extract Turnstile token if present
        let turnstileToken = '';
        if (window.turnstile) {
            turnstileToken = window.turnstile.getResponse() || '';
        }

        // UI Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>⏳ Processing Request...</span>';
        }
        showStatus(statusDiv, 'info', 'Validating email and requesting beta access...');

        try {
            // Target API endpoint (Cloudflare Worker endpoint)
            const API_ENDPOINT = 'https://snaphaven-beta.jonathan-richardson.workers.dev';

            // Attempt API call
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    platform: platform,
                    turnstileToken: turnstileToken
                })
            });

            // Handle response
            if (response && response.ok) {
                const data = await response.json();
                showStatus(statusDiv, 'success', data.message || '🎉 Verification email sent! Please check your inbox to confirm your beta spot.');
                form.reset();
            } else {
                let errorMsg = 'Failed to process request.';
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || errData.message || errorMsg;
                } catch (e) {}
                showStatus(statusDiv, 'error', `⚠️ ${errorMsg}`);
            }
        } catch (err) {
            console.error('Beta sign-up error:', err);
            showStatus(statusDiv, 'error', 'An error occurred while submitting your request. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>🚀 Request Beta Access</span>';
            }
        }
    };

    function showStatus(el, type, text) {
        if (!el) return;
        el.className = `beta-status-msg ${type}`;
        el.innerText = text;
    }
});
