/**
 * MAIN APPLICATION MODULE
 * 
 * This module handles all dynamic rendering of content from data.js
 * It follows these principles:
 * - DRY (Don't Repeat Yourself): Reusable template functions
 * - Separation of Concerns: Data vs. Presentation
 * - Pure Functions: Templates receive data, return HTML
 * - Declarative Rendering: Clear, readable component creation
 */

import {
    navigation,
    socialLinks,
    heroPills,
    techStack,
    projects,
    footerLinks,
    siteMetadata
} from './data.js';

import { initBackground } from './background.js';
import { initAnimations } from './animations.js';

/**
 * ============================================================================
 * REUSABLE COMPONENT TEMPLATES
 * ============================================================================
 */

/**
 * Creates a navigation link element
 * @param {Object} navItem - Navigation item with label and href
 * @returns {string} HTML string for navigation link
 */
function createNavLink(navItem) {
    return `
        <a class="font-display font-medium text-black dark:text-white hover:opacity-70 transition-opacity" 
           href="${navItem.href}">
            ${navItem.label}
        </a>
    `;
}

/**
 * Creates a social media icon link
 * @param {Object} social - Social link data
 * @param {string} variant - 'header' or 'footer' for different styling
 * @returns {string} HTML string for social icon
 */
function createSocialIcon(social, variant = 'header') {
    // Retro terminal style for both variants
    return `
        <a class="w-10 h-10 md:w-12 md:h-12 border border-retro-border flex items-center justify-center hover:bg-retro-cyan hover:text-retro-bg transition-colors text-retro-text font-body text-lg md:text-xl" 
           href="${social.url}"
           target="_blank"
           aria-label="${social.platform}">
            <i class="${social.icon}"></i>
        </a>
    `;
}

/**
 * Creates a floating pill button for hero section
 * @param {Object} pill - Pill button data
 * @returns {string} HTML string for pill button
 */
function createPillButton(pill) {
    const baseClasses = `
        absolute ${pill.position} 
        bg-retro-bg text-retro-text font-body 
        px-4 py-2 md:px-6 md:py-3 
        border border-retro-border transform ${pill.rotation} 
        hover:bg-retro-cyan hover:text-retro-bg transition-all z-20 
        whitespace-nowrap text-lg md:text-xl
    `.trim().replace(/\s+/g, ' ');

    const iconHTML = pill.icon ? `<i class="${pill.icon}"></i>` : '';
    const content = `${pill.text} ${iconHTML}`;

    // Some pills are divs (non-clickable), others are links
    if (pill.isDiv) {
        return `<div class="${baseClasses} cursor-pointer">${content}</div>`;
    } else {
        return `<a class="${baseClasses}" href="${pill.href}">${content}</a>`;
    }
}

/**
 * Creates a project card component
 * @param {Object} project - Project data
 * @returns {string} HTML string for project card
 */
function createProjectCard(project) {
    // Generate tag badges
    const tagBadges = project.tags
        .map(tag => `
            <span class="px-3 py-1 text-xs font-display font-medium bg-white/20 text-black dark:text-white rounded-full border border-white/10">
                ${tag}
            </span>
        `)
        .join('');

    return `
        <div class="group relative glass rounded-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <!-- Project Title -->
            <h3 class="font-display font-bold text-xl md:text-2xl mb-3 text-black dark:text-white">
                ${project.title}
            </h3>
            
            <!-- Project Description -->
            <p class="text-gray-700 dark:text-gray-300 font-body text-sm md:text-base mb-4 leading-relaxed">
                ${project.description}
            </p>
            
            <!-- Technology Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
                ${tagBadges}
            </div>
            
            <!-- GitHub Link -->
            <a href="${project.githubUrl}" 
               target="_blank"
               class="inline-flex items-center space-x-2 font-display font-medium text-black dark:text-white hover:opacity-70 transition-opacity group">
                <span>View on GitHub</span>
                <i class="fab fa-github text-lg group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>
    `;
}

/**
 * Creates a tech stack card with SVG logo and funny tagline
 * @param {Object} tech - Tech stack item data
 * @returns {string} HTML string for tech card
 */
function createTechCard(tech) {
    return `
        <a href="${tech.url}" target="_blank"
           class="tech-card group relative flex flex-col items-center justify-center p-4 md:p-5 border border-retro-border hover:border-retro-cyan bg-retro-dim/40 transition-all duration-300 cursor-pointer text-center overflow-hidden"
           data-effect="${tech.hoverEffect}">
            <div class="tech-logo mb-2 transition-transform duration-300">${tech.svg}</div>
            <span class="font-display text-[8px] md:text-[10px] text-retro-text">${tech.name}</span>
            <span class="font-body text-sm md:text-base text-retro-muted mt-0.5">${tech.tagline}</span>
        </a>
    `;
}

/**
 * Creates a footer link
 * @param {Object} link - Link data
 * @returns {string} HTML string for footer link
 */
function createFooterLink(link) {
    return `<a class="text-retro-muted hover:text-retro-cyan transition-colors text-base md:text-lg font-body" href="${link.href}" target="_blank">${link.label}</a>`;
}

/**
 * ============================================================================
 * RENDERING FUNCTIONS
 * ============================================================================
 */



/**
 * Renders hero pill buttons
 */
function renderHeroPills() {
    const pillsContainer = document.getElementById('hero-pills');
    if (!pillsContainer) return;

    pillsContainer.innerHTML = heroPills
        .map(createPillButton)
        .join('');
}

/**
 * Renders social icons in the footer
 */
function renderFooterSocial() {
    const socialContainer = document.getElementById('footer-social');
    if (!socialContainer) return;

    // Show all social links in footer
    socialContainer.innerHTML = socialLinks
        .map(social => createSocialIcon(social, 'footer'))
        .join('');
}

/**
 * Renders tech stack as interactive cartoon cards
 */
function renderTechStack() {
    const techContainer = document.getElementById('tech-stack');
    if (!techContainer) return;

    techContainer.innerHTML = techStack
        .map(createTechCard)
        .join('');
}

/**
 * Renders project cards
 * @param {boolean} featuredOnly - If true, only show featured projects
 */
function renderProjects(featuredOnly = false) {
    const projectsContainer = document.getElementById('projects-grid');
    if (!projectsContainer) return;

    const projectsToShow = featuredOnly
        ? projects.filter(p => p.featured)
        : projects;

    projectsContainer.innerHTML = projectsToShow
        .map(createProjectCard)
        .join('');
}

/**
 * Renders footer links
 */
function renderFooterLinks() {
    const linksContainer = document.getElementById('footer-links');
    if (!linksContainer) return;

    linksContainer.innerHTML = footerLinks
        .map(createFooterLink)
        .join('');
}

/**
 * ============================================================================
 * INITIALIZATION
 * ============================================================================
 */

/**
 * Initializes the application
 * Called when DOM is ready
 */
function init() {
    console.log('🚀 Initializing chathnindu portfolio...');

    try {
        // Render all components
        renderHeroPills();
        renderFooterSocial();
        renderTechStack();
        renderFooterLinks();

        // 3D Background & Animations
        initBackground();
        initAnimations();

        console.log('✅ Portfolio initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing portfolio:', error);
    }
}

/**
 * Wait for DOM to be ready, then initialize
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready
    init();
}

/**
 * ============================================================================
 * OPTIONAL: EXPORT FUNCTIONS FOR EXTERNAL USE
 * ============================================================================
 */

export {
    createNavLink,
    createSocialIcon,
    createPillButton,
    createProjectCard,
    renderProjects
};