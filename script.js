document.addEventListener("DOMContentLoaded", (event) => {
    // GSAP plugins are still registered as usual
    gsap.registerPlugin(Flip); // SplitType doesn't need to be registered with GSAP

    let splitTextInstances = []; // To store SplitType instances for cleanup if needed

    const setupTextSplitting = () => {
        // Clear previous instances if this function is called multiple times
        splitTextInstances.forEach(instance => instance.revert());
        splitTextInstances = [];

        const textElements = document.querySelectorAll("h1, h2, p, a:not(#wishlist-btn)");
        textElements.forEach((element) => {
            // Use SplitType to create the split elements
            const splitInstance = new SplitType(element, {
                type: "lines",
                lineClass: "line",
            });
            splitTextInstances.push(splitInstance);
        });
    };

    const createCounterDigits = () => {
        // Create a simple counter display
        const counter1 = document.querySelector(".counter-1 .num");
        const counter2 = document.querySelector(".counter-2 .num");
        const counter3 = document.querySelector(".counter-3 .num");
        
        if (counter1) {
            counter1.textContent = '0';
        }
        if (counter2) {
            counter2.textContent = '0';
        }
        if (counter3) {
            counter3.textContent = '0';
        }
    };

    const animateCounter = (duration) => {
        let currentNumber = 0;
        const targetNumber = 100;
        const counter1 = document.querySelector(".counter-1 .num");
        const counter2 = document.querySelector(".counter-2 .num");
        const counter3 = document.querySelector(".counter-3 .num");
        
        const interval = duration * 1000 / targetNumber; // Convert to milliseconds
        
        // Add a small delay before starting
        setTimeout(() => {
            const timer = setInterval(() => {
                currentNumber++;
                
                if (currentNumber > targetNumber) {
                    clearInterval(timer);
                    return;
                }
                
                // Update the display
                const hundreds = Math.floor(currentNumber / 100);
                const tens = Math.floor((currentNumber % 100) / 10);
                const ones = currentNumber % 10;
                
                if (counter1) counter1.textContent = hundreds;
                if (counter2) counter2.textContent = tens;
                if (counter3) counter3.textContent = ones;
                
            }, interval);
        }, 500); // 500ms delay before starting
    };

    function animateImages() {
        const images = document.querySelectorAll(".img");

        images.forEach((img) => {
            img.classList.remove("animate-out");
        });

        const state = Flip.getState(images);

        images.forEach((img) => img.classList.add("animate-out"));

        const mainTimeline = gsap.timeline();

        mainTimeline.add(
            Flip.from(state, {
                duration: 1,
                stagger: 0.1,
                ease: "power3.inOut",
            })
        );

        images.forEach((img, index) => {
            const scaleTimeline = gsap.timeline();

            scaleTimeline
                .to(
                    img,
                    {
                        scale: 2.5,
                        duration: 0.45,
                        ease: "power3.in",
                    },
                    0.025
                )
                .to(
                    img,
                    {
                        scale: 1,
                        duration: 0.45,
                        ease: "power3.out",
                    },
                    0.5
                );

            mainTimeline.add(scaleTimeline, index * 0.1);
        });

        return mainTimeline;
    }

    // Initialize everything
    setupTextSplitting();
    createCounterDigits();

    // Start counter animation to count from 1 to 100
    animateCounter(1);

    // Main animation timeline
    const t1 = gsap.timeline();

    t1.to(".hero-bg", {
        scaleY: "100%",
        duration: 3,
        ease: "power2.inOut",
        delay: 0.25,
    });

    t1.to(
        ".img",
        {
            scale: 1,
            duration: 1,
            stagger: 0.125,
            ease: "power3.out",
        },
        "<"
    );

    t1.to(".counter", {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 1.5, // Increased delay so counter is visible longer
        onStart: () => {
            animateImages();
        },
    });

    t1.to(".sidebar .divider", {
        scaleY: "100%",
        duration: 1,
        ease: "power3.inOut",
        delay: 1.25,
    });

    t1.to(
        ["nav .divider", ".site-info .divider"],
        {
            scaleX: "100%",
            duration: 1,
            stagger: 0.5,
            ease: "power3.inOut",
        },
        "<"
    );

    t1.to(
        ".logo",
        {
            scale: 1,
            duration: 1,
            ease: "power4.inOut",
        },
        "<"
    );

    // Animate text elements
    t1.to(
        [
            ".logo-name a .line",
            ".links a .line",
            ".links p .line",
            ".cta a .line"
        ],
        {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.Out",
            delay: 0.5,
        },
        "<"
    );

    t1.to(
        [
            ".header .line",
            ".site-info .line",
            ".hero-footer .line"
        ],
        {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.Out",
            delay: 0.5,
        },
        "<"
    );

    // Add animation-settled class when animation completes
    t1.call(() => {
        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.classList.add('animation-settled');
        }
    });
});

// Wishlist Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistModal = document.getElementById('wishlist-modal');
    const closeModal = document.getElementById('close-modal');
    const wishlistForm = document.getElementById('wishlist-form');

    // Open modal
    wishlistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        wishlistModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        wishlistModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    wishlistModal.addEventListener('click', function(e) {
        if (e.target === wishlistModal) {
            wishlistModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Handle form submission
    wishlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = wishlistForm.querySelector('input[type="email"]').value;
        
        // Here you would typically send the email to your backend
        // For now, we'll just show a success message
        const content = wishlistModal.querySelector('.wishlist-content');
        content.innerHTML = `
            <button class="close-modal" id="close-modal">&times;</button>
            <h2>Thank You!</h2>
            <p>You've been added to our wishlist. We'll notify you as soon as we launch!</p>
            <button class="wishlist-form button" onclick="location.reload()">Close</button>
        `;
        
        // Re-attach close functionality
        document.getElementById('close-modal').addEventListener('click', function() {
            wishlistModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}); 