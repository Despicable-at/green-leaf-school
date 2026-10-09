# Green Leaf School Website

Official website of Green Leaf School, Atimatim, Edwenase, Ashanti Region, Ghana.

This repository contains the source code for the site. It is maintained by the school, and the live site is deployed from the `main` branch.

## Overview

The website provides information about the school and its admissions process. It includes:

- Information on the school, its academic levels (Creche, Nursery, Primary and JHS) and its offer: tuition-free education, scholarships, child-centred learning and co-curricular activities
- An online admission form
- A photo gallery
- A staff and faculty directory
- Contact details and an embedded map of the school's location

## Technology

| Area | Details |
| --- | --- |
| Markup and styling | HTML5, CSS3 |
| Scripting | Vanilla JavaScript (ES modules) |
| Hosting | Vercel (static hosting) |
| Form delivery | Web3Forms (email), WhatsApp link (message prefill) |

The site has no framework, build step, database or server-side code.

## Repository structure

```
.
├── index.html            Home
├── about.html            About the school
├── academics.html        Academic levels and co-curricular activities
├── admissions.html       Admission information and form
├── gallery.html          Photo gallery
├── staff.html            Staff and faculty directory
├── 404.html              Not-found page
├── css/                  Stylesheets
├── js/
│   ├── config.js         School contact details and form settings
│   ├── layout.js         Shared header, footer and map
│   ├── main.js           Animations and interactions
│   ├── form.js           Admission form logic
│   ├── gallery.js        Gallery rendering
│   ├── staff.js          Staff directory rendering
│   └── data/             Staff and gallery content
├── assets/               Logo, favicon, staff and gallery images
├── vercel.json           Security headers, caching and routing
├── robots.txt
└── sitemap.xml
```

## Content management

The site has no admin panel. Content is edited directly in this repository.

- **Staff directory:** edit `js/data/staff-data.js`. Staff photos go in `assets/staff/`.
- **Gallery:** edit `js/data/gallery-data.js`. Images go in `assets/gallery/`.
- **Contact details:** edit `js/config.js`.

## Admission form

Applications are validated in the browser and sent by email to the school through Web3Forms. After submitting, the applicant can send the same details to the school's WhatsApp line.

The Web3Forms access key is set in `js/config.js`. The key is intended to be public and can only deliver submissions to the school's inbox. No applicant data is stored in the browser or in this repository.

## Deployment

The site is deployed on Vercel and redeploys automatically on every push to `main`.

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Build command | None |
| Output directory | Project root |

## Security

- Security headers, including a strict Content Security Policy, are defined in `vercel.json`.
- Scripts and styles are loaded from files only. There are no inline scripts or inline styles.
- User input is validated and sanitised, and it is never written to the page as HTML.
- Changes to the live site can only be made through this repository. Maintainers should enable two-factor authentication on their GitHub accounts and require review before merging into `main`.

## Contact

Green Leaf School
Atimatim, Edwenase, Ashanti Region, Ghana

- Phone / WhatsApp: 0540863834
- Phone: 0557474117
- Email: greenleafschool2006@gmail.com

## License

Copyright © Green Leaf School. All rights reserved. The code, text, images and branding in this repository may not be copied or reused without permission from the school.
