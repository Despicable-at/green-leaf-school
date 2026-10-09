# Green Leaf School website

A responsive static website made with HTML, CSS and native JavaScript ES modules. It has no runtime framework, npm dependencies, build step, bundler, database or backend. Pages are served directly from the project root.

## Preview locally

Run `python3 -m http.server 5000 --bind 0.0.0.0` from this directory, then open the local preview on port 5000. The Replit preview workflow uses the same Python standard-library server and its assigned port.

## Pages and files

- `index.html` — school overview and routes into the site
- `about.html` — philosophy, mission, vision and values
- `academics.html` — four learning stages, co-curricular activities and enquiry timeline
- `admissions.html` — admission information and a three-step enquiry form
- `gallery.html` — category filters and keyboard/touch-friendly image viewer
- `staff.html` — searchable department profile placeholders
- `404.html` — static not-found page
- `css/styles.css` — shared responsive design system
- `js/` — shared layout, page interactions, form logic and frozen gallery/staff data
- `assets/` — brand SVGs and directories reserved for approved media
- `vercel.json`, `robots.txt`, `sitemap.xml` — static-host headers, crawler rules and placeholder-domain sitemap

## Assumptions and content boundaries

- School information in the pages is limited to the supplied details: Green Leaf School; Atimatim, Edwenase, Ashanti Region, Ghana; Creche, Nursery, Primary and JHS; admission in progress; no school fees/tuition free; scholarships; child-centred learning; well-groomed teachers; a conducive learning environment; and co-curricular activities.
- Mission, vision, values and philosophy copy is generic illustrative editorial language, not a claim about an officially adopted school statement.
- The gallery contains nine designed placeholders with empty image paths. The staff page contains exactly six labelled placeholder profiles across Leadership, Creche, Nursery, Primary, JHS and Administration. No actual staff, photographs, years, enrolment counts, awards or testimonials are represented.
- `--hero-image` is intentionally a CSS-only gradient; an approved local photograph can replace it later.
- The Google Maps iframe uses the exact embed URL supplied for Green Leaf School; the directions link points to the supplied school name and location.
- The Web3Forms key in `js/config.js` is intentionally the literal placeholder `YOUR_WEB3FORMS_ACCESS_KEY`. Until the school supplies its key, the form clearly reports that email delivery is not configured and offers WhatsApp/email alternatives. A static browser form cannot read a private workspace secret. Treat the Web3Forms access key as public client-side configuration and restrict its allowed domain to the production website in the Web3Forms dashboard. No personal application details are stored in browser storage.
- `sitemap.xml`, `robots.txt`, canonical URLs and Open Graph URLs use `https://www.example.com` as a placeholder domain. Replace it with the approved public domain before the site is indexed.
- The school details and Google Maps embed use only the information supplied for this site. Staff names/photos and gallery images remain labelled placeholders; replace them only with school-approved details and media.

## Update staff and gallery content

- Edit the frozen records in `js/data/staff-data.js`. Keep the seven fields (`name`, `role`, `department`, `qualifications`, `bio`, `email`, `photo`) and use only the listed departments. Replace placeholder names and copy with approved staff details. Put approved portraits in `assets/staff/` and set each `photo` to its relative path.
- Place approved photos in `assets/gallery/`, then set each record’s `src`, factual `alt` text, category and caption in `js/data/gallery-data.js`. Empty `src` values intentionally display designed placeholders.

## Configure admission email

Replace `YOUR_WEB3FORMS_ACCESS_KEY` in `js/config.js` with the Web3Forms access key associated with `greenleafschool2006@gmail.com`. In the Web3Forms dashboard, restrict the key to the production domain. The key is visible in the browser by design; never put a private account credential in this static site. Test email delivery only after the school has supplied and restricted the key.

## Push changes to GitHub

Connect this folder to the school’s GitHub repository, then commit and push the static files (`git add .`, `git commit -m "Update Green Leaf School website"`, `git push`). Enable two-factor authentication for repository owners and protect the main branch with pull-request review and status checks. Treat the GitHub repository as the source of truth for future site changes.

## Vercel static hosting

No deployment or hosting has been configured from Replit. When the school is ready to publish, import the GitHub repository into Vercel, choose Framework Preset **Other**, leave the Build Command empty, and set the Output Directory to `.`. If the whole Replit workspace is in GitHub, set the Vercel Root Directory to `artifacts/green-leaf-school`; if this folder alone is the repository, use its root. `vercel.json` provides clean URLs and security/cache headers. Replace all `www.example.com` placeholders before publishing.

## Contact

- Phone: 0540863834 / 0557474117
- WhatsApp: `https://wa.me/233540863834`
- Email: greenleafschool2006@gmail.com
