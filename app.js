// ==========================================================================
// SnapHaven Website Interactive JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Glassmorphism Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile App Modal Handlers
    window.openAppModal = function(platform) {
        const modal = document.getElementById('appModal');
        const icon = document.getElementById('modalAppIcon');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        if (platform === 'android') {
            icon.innerText = '🤖';
            title.innerText = 'SnapHaven for Android';
            body.innerText = 'The SnapHaven Android application is currently in final testing before public release on Google Play. Check back shortly or download the Windows server build below!';
        } else if (platform === 'ios') {
            icon.innerText = '🍏';
            title.innerText = 'SnapHaven for iOS';
            body.innerText = 'The SnapHaven iOS application is under active development for iPhone & iPad. It will feature full background background photo sync and mTLS pairing.';
        }

        modal.classList.add('active');
    };

    window.closeAppModal = function() {
        const modal = document.getElementById('appModal');
        modal.classList.remove('active');
    };

    // Close modal on background overlay click
    document.getElementById('appModal').addEventListener('click', (e) => {
        if (e.target.id === 'appModal') {
            window.closeAppModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeAppModal();
        }
    });
});
