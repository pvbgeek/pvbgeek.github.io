# GitHub Pages deployment

This site is fully static. No build step, Node.js, server, or database is required.

## Replace the current GitHub Pages files

1. Back up the current repository if desired.
2. Copy all files and folders from this package into the root of the GitHub Pages repository, preserving the same structure.
3. Commit and push to the branch currently used by GitHub Pages.
4. `index.html` automatically opens `about.html`, so `https://pvbgeek.github.io/` lands on About.
5. The navigation item **View Resume** opens `resume.html`, which renders `assets/pdf/Resume.pdf` directly on the site.

## Updating the resume later

Replace only:

`assets/pdf/Resume.pdf`

Keep that filename unchanged. The View Resume page will automatically display the new PDF with no HTML/CSS/JS edits required.

## Notes

- Existing HTML filenames were retained.
- The site uses only static HTML/CSS/JavaScript and is compatible with GitHub Pages.
- The visual system uses a remote Google Fonts stylesheet when internet access is available and gracefully falls back to system fonts if it is not.
- Motion is automatically reduced for visitors who enable `prefers-reduced-motion`.
