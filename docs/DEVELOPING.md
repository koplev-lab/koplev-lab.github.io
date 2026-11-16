# Developing and deploying

For whoever maintains the site. Day-to-day content edits happen in Pages CMS (see
[EDITING.md](EDITING.md)); this page covers hosting, the CMS setup and the moving parts.

## How it fits together

```
Pages CMS (app.pagescms.org) ──commit──▶ GitHub: koplev-lab/koplev-lab.github.io (main)
                                               │
                         .github/workflows/deploy.yml  (on push, daily, or by hand)
                                               │
                                     npm ci → astro build → GitHub Pages
                                               │
                                   https://koplev-lab.github.io
```

- `ci.yml` checks every push (formatting, types, build, tests). It does not block deploys.
- `deploy.yml` builds and publishes on every push to `main`, once a day at 03:17 UTC (so job ads
  disappear after their deadline) and from the Actions tab ("Run workflow").
- A CMS save is a commit to `main`, so the site updates about two minutes after saving.

## One-time setup

1. **Create the repository** in the `koplev-lab` organization, named exactly
   `koplev-lab.github.io` (that name makes it the organization's site, served at the root). Leave
   it empty (no README).
2. **Push** this repository:
   ```sh
   git remote add origin https://github.com/koplev-lab/koplev-lab.github.io.git
   git push -u origin main
   ```
3. **Turn on Pages**: repository Settings → Pages → Build and deployment → Source: **GitHub
   Actions**. Then Actions → Deploy → Run workflow (or push again). The site appears at
   <https://koplev-lab.github.io> once the run is green.
4. **Install Pages CMS**: open <https://app.pagescms.org>, sign in with GitHub and follow the
   prompt to install the Pages CMS GitHub App. Pick the `koplev-lab` organization and grant access
   to **only** the `koplev-lab.github.io` repository (you need to be an owner of the organization,
   or ask one to approve the install). Open the repository in Pages CMS; it reads `.pages.yml`.
5. **Give Simon access**, either:
   - in GitHub: add his GitHub account to the repository with Write access, then he signs in to
     Pages CMS with GitHub; or
   - in Pages CMS: invite his email as a collaborator on the repository. He signs in with an
     email link and needs no GitHub account. Collaborators can edit content and media but not the
     configuration.
6. Send Simon the link to the repository in Pages CMS and [EDITING.md](EDITING.md).

No repository variables are needed for the GitHub Pages address.

## Moving to a custom domain later

1. Buy the domain and add the DNS records GitHub lists under Settings → Pages → Custom domain
   (an `A`/`AAAA` set for the apex, or a `CNAME` to `koplev-lab.github.io` for `www`).
2. Enter the domain in Settings → Pages → Custom domain and tick "Enforce HTTPS" once offered.
3. Set the repository variable `SITE_URL` (Settings → Secrets and variables → Actions →
   Variables), e.g. `https://koplevlab.se`, or change `DEFAULT_SITE_URL` in `src/site.config.ts`.
   This fixes canonical links, the sitemap and link previews. Re-run Deploy.

`BASE_PATH` stays empty (`/`) for both the `.github.io` address and a custom domain. It is only
needed if the site is ever served from a sub-path such as `example.org/website/`.

## Pages CMS details

- `.pages.yml` maps every content file to a form. Each field mirrors `src/lib/schemas.ts`; when a
  schema changes, change the form too.
- Images: Astro needs image paths relative to the content file, so each media folder in
  `.pages.yml` writes a relative `output` (`../../assets/…` for files one folder deep,
  `../assets/…` for `site.yaml`). Uploads land in `src/assets/…` and Astro optimizes them.
- References (project people, featured items on Home) are saved as filenames such as
  `simon-koplev.md`; the data layer accepts those as well as bare slugs.
- `settings.content.merge: true` keeps keys a form does not show; `site.yaml` is edited through
  two forms (lab details, interface wording) because of it.
- Saves are committed under the editor's own name (`settings.commit.identity: user`).
- The CMS rewrites YAML in its own layout, so `src/content/` is excluded from Prettier.

Checked before release: the configuration passes Pages CMS's own schema, and a simulated
"open and save" of every entry builds and passes the tests unchanged.

## Notes

- Scheduled workflows in a public repository are paused by GitHub after 60 days without any
  commit. If the site goes quiet for that long, re-enable "Deploy" in the Actions tab.
- Publications come from OpenAlex via `npm run pubs`, run by hand and committed.
