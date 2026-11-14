import type { Theme } from '../contract';
import About from './pages/About.astro';
import Home from './pages/Home.astro';
import Join from './pages/Join.astro';
import NotFound from './pages/NotFound.astro';
import Project from './pages/Project.astro';
import Publications from './pages/Publications.astro';
import Research from './pages/Research.astro';
import Team from './pages/Team.astro';

const theme: Theme = {
  id: 'reference',
  name: 'Reference',
  pages: { Home, Research, Project, Publications, Team, About, Join, NotFound },
};

export default theme;
