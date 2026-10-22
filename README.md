# holliscutler.github.io

Personal website for Hollis Cutler — <https://holliscutler.github.io>

Built with [Jekyll](https://jekyllrb.com) using the
[Academic Pages](https://github.com/academicpages/academicpages.github.io)
template (itself a fork of
[Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)).

## How it deploys

Pushing to `main` triggers `.github/workflows/jekyll.yml`, which builds the site
with Jekyll and publishes it to GitHub Pages. This requires **Settings → Pages →
Build and deployment → Source = GitHub Actions** (not "Deploy from a branch") —
the branch-based option can't run the plugins this template uses.

## Where the content lives

| Path | What it is |
| --- | --- |
| `_config.yml` | Site-wide settings: title, URL, and the `author:` block that fills the sidebar |
| `_data/navigation.yml` | The header menu |
| `_pages/about.md` | The homepage (`permalink: /`) |
| `_pages/cv.md` | CV — pulls publications in automatically |
| `_publications/` | One file per paper or thesis; `category:` must match a key in `publication_category` in `_config.yml` |
| `_portfolio/` | One file per project |
| `_talks/`, `_teaching/`, `_posts/` | Empty for now; the matching header links are commented out in `navigation.yml` |
| `files/` | PDFs and downloads, served at `/files/...` |
| `images/` | Images, including the sidebar avatar (`author.avatar` in `_config.yml`) |
| `_sass/`, `assets/css/` | Styling |

`site_theme` in `_config.yml` switches between the bundled looks: `default`,
`air`, `sunrise`, `mint`, `dirt`, `contrast`.

## Running it locally

Needs Ruby plus the headers and toolchain for native gem builds:

```bash
sudo apt-get install -y ruby-dev build-essential zlib1g-dev libffi-dev
gem install --user-install bundler
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000>. Changes to everything except `_config.yml`
reload automatically; editing `_config.yml` needs a server restart.
