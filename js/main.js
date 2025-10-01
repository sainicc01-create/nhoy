        'use strict';
        document.addEventListener('DOMContentLoaded', function() {
            function initializeSlider(bannerElement, instanceName) {
                const bannerContainer = bannerElement.querySelector('.banner-container');
                const slides = bannerElement.querySelectorAll('.banner-slide');
                const dotsContainer = bannerElement.querySelector('.dots-container');
                const arrowLeft = bannerElement.querySelector('.arrow-left');
                const arrowRight = bannerElement.querySelector('.arrow-right');
                const totalSlides = slides.length;
                if (!bannerContainer || totalSlides === 0) return;
                let currentSlide = 0;
                let sliderInterval = null;
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    for (let i = 0; i < totalSlides; i++) {
                        const dot = document.createElement('div');
                        dot.classList.add('dot');
                        if (i === 0) dot.classList.add('active');
                        dot.addEventListener('click', () => {
                            updateSlider(i);
                            resetInterval();
                        });
                        dotsContainer.appendChild(dot);
                    }
                }
                const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
                function updateSlider(index) {
                    if (index < 0 || index >= totalSlides) index = 0;
                    bannerContainer.style.transform = `translateX(-${index * 100}%)`;
                    if (dots.length > 0) {
                        dots.forEach(dot => dot.classList.remove('active'));
                        dots[index].classList.add('active');
                    }
                    currentSlide = index;
                }
                function startInterval() {
                    clearInterval(sliderInterval);
                    if (totalSlides > 1) {
                        sliderInterval = setInterval(() => {
                            updateSlider((currentSlide + 1) % totalSlides);
                        }, 8000);
                    }
                }
                function resetInterval() { startInterval(); }
                if (arrowLeft) {
                    arrowLeft.addEventListener('click', () => {
                        updateSlider((currentSlide - 1 + totalSlides) % totalSlides);
                        resetInterval();
                    });
                }
                if (arrowRight) {
                    arrowRight.addEventListener('click', () => {
                        updateSlider((currentSlide + 1) % totalSlides);
                        resetInterval();
                    });
                }
                bannerElement.addEventListener('mouseenter', () => clearInterval(sliderInterval));
                bannerElement.addEventListener('mouseleave', () => resetInterval());
                updateSlider(0);
                startInterval();
            }
            const allBanners = document.querySelectorAll('.banner');
            allBanners.forEach((banner, index) => {
                const bannerName = `Banner-${index + 1}`;
                initializeSlider(banner, bannerName);
            });
            const navItems = document.querySelectorAll('.navigation .nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    navItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        });
                document.addEventListener('DOMContentLoaded', function() {
            if (window.guidedLockerInitialized) return;
            window.guidedLockerInitialized = true;

            const modal = document.getElementById('guidedLockerModal');
            if (!modal) {
                console.error("Guided Locker Modal not found!");
                return;
            }
            const closeModalBtn = modal.querySelector('.gl-close-btn');
            const allDownloadLinks = document.querySelectorAll('.arow-esign a, .data-usage a');
            
            const youtubeBtn = modal.querySelector('#youtubeActionBtn');
            const telegramBtn = modal.querySelector('#telegramActionBtn');
            const unlockBtn = modal.querySelector('#unlockActionBtn');

            let originalLink = '';
            let currentStep = 1;
            const totalSteps = 2;

            function openModal(href) {
                originalLink = href;
                currentStep = 1;
                updateUI();
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('visible'), 10);
            }

            function closeModal() {
                modal.classList.remove('visible');
                setTimeout(() => {
                    modal.style.display = 'none';
                    resetLockerState();
                }, 300);
            }

            function resetLockerState() {
                currentStep = 1;
                originalLink = '';
                // Reset progress bar visual state
                modal.querySelectorAll('.gl-progress-step').forEach(stepEl => {
                    stepEl.classList.remove('completed', 'active');
                });
                modal.querySelector('.gl-progress-step[data-step="1"]').classList.add('active');
                updateUI();
            }
            
            function advanceStep() {
                const completedStepIndicator = modal.querySelector(`.gl-progress-step[data-step="${currentStep}"]`);
                if (completedStepIndicator) {
                    completedStepIndicator.classList.add('completed');
                }
                currentStep++;
                if (currentStep > totalSteps) {
                    const finalStepIndicator = modal.querySelector(`.gl-progress-step[data-step="3"]`);
                    if (finalStepIndicator) {
                        finalStepIndicator.classList.add('completed');
                    }
                    showActionStep(3);
                } else {
                    updateUI();
                }
            }

            function updateUI() {
                modal.querySelectorAll('.gl-progress-step').forEach(stepEl => {
                    const stepNumber = parseInt(stepEl.dataset.step);
                    stepEl.classList.toggle('active', stepNumber === currentStep);
                });
                showActionStep(currentStep);
            }
            
            function showActionStep(stepNum) {
                modal.querySelectorAll('.gl-action-step').forEach(stepContent => {
                    stepContent.classList.toggle('active', parseInt(stepContent.dataset.step) === stepNum);
                });
            }

            allDownloadLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    openModal(this.href);
                });
            });

            if (closeModalBtn) closeModalBtn.onclick = closeModal;
            
            modal.addEventListener('click', function(event) {
                if (event.target === modal) closeModal();
            });
            
            if (youtubeBtn) youtubeBtn.onclick = advanceStep;
            if (telegramBtn) telegramBtn.onclick = advanceStep;
            
            if (unlockBtn) {
                unlockBtn.onclick = function() {
                    closeModal();
                    window.open(originalLink, '_blank');
                };
            }
        });