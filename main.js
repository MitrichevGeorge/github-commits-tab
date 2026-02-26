// ==UserScript==
// @name         GitHub Commits Tab
// @match        https://github.com/*/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function insert() {
        const nav = document.querySelector('nav[aria-label="Repository"]');
        if (!nav) return;

        const ul = nav.querySelector('ul[role="list"]');
        if (!ul) return;

        if (ul.querySelector('.tm-commits-tab')) return;

        const parts = location.pathname.split('/').filter(Boolean);
        if (parts.length < 2) return;

        const repoPath = `/${parts[0]}/${parts[1]}`;
        const commitsUrl = `${repoPath}/commits`;

        const template = ul.querySelector('li.prc-UnderlineNav-UnderlineNavItem-syRjR');
        if (!template) return;

        const li = template.cloneNode(true);
        const a = li.querySelector('a');

        const isActive = location.pathname.startsWith(commitsUrl);

        a.href = commitsUrl;
        a.removeAttribute('data-hotkey');
        a.setAttribute('data-react-nav', 'commits-view');
        a.setAttribute('data-turbo-frame', 'repo-content-turbo-frame');

        if (isActive) {
            a.setAttribute('aria-current', 'page');
        } else {
            a.removeAttribute('aria-current');
        }

        a.innerHTML = `
            <svg aria-hidden="true" focusable="false"
                 class="octicon octicon-git-commit"
                 viewBox="0 0 16 16"
                 width="16" height="16"
                 fill="currentColor"
                 style="vertical-align:text-bottom;margin-right:4px">
                <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
            </svg>
            <span data-component="text">Commits</span>
        `;

        li.classList.add('tm-commits-tab');

        const moreLi = ul.querySelector('button')?.closest('li');
        if (moreLi) {
            ul.insertBefore(li, moreLi);
        } else {
            ul.appendChild(li);
        }
    }

    function updateActive() {
        const tab = document.querySelector('.tm-commits-tab a');
        if (!tab) return;

        const parts = location.pathname.split('/').filter(Boolean);
        if (parts.length < 2) return;

        const repoPath = `/${parts[0]}/${parts[1]}`;
        const commitsUrl = `${repoPath}/commits`;

        if (location.pathname.startsWith(commitsUrl)) {
            tab.setAttribute('aria-current', 'page');
        } else {
            tab.removeAttribute('aria-current');
        }
    }

    function run() {
        insert();
        updateActive();
    }

    run();
    document.addEventListener('turbo:render', run);
    document.addEventListener('pjax:end', run);

    new MutationObserver(run).observe(document.body, {
        childList: true,
        subtree: true
    });

})();
