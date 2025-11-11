import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'architecture/overview',
        'architecture/domain',
        'architecture/application',
        'architecture/infrastructure',
        'architecture/presentation',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Fonctionnalités',
      items: [
        'features/monsters',
        'features/authentication',
        'features/dashboard',
      ],
    },
    {
      type: 'category',
      label: '🔌 API',
      items: [
        'api/endpoints',
        'api/server-actions',
        'api/use-cases',
      ],
    },
  ],
};

export default sidebars;
