export default {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main title in the hero section (e.g., "Wildlife Photography")',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Subtitle in the hero section (e.g., "by Joel")',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'Description text below the hero title',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroButtons',
      title: 'Hero Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
              description: 'Internal link (e.g., "/explore") or external URL',
              validation: Rule => Rule.required()
            },
            {
              name: 'style',
              title: 'Button Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Primary', value: 'primary'},
                  {title: 'Secondary', value: 'secondary'}
                ]
              },
              initialValue: 'primary'
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name (eye, camera, etc.)',
              options: {
                list: [
                  {title: 'Eye', value: 'eye'},
                  {title: 'Camera', value: 'camera'},
                  {title: 'Arrow Right', value: 'arrow-right'},
                  {title: 'No Icon', value: 'none'}
                ]
              },
              initialValue: 'none'
            }
          ]
        }
      ],
      validation: Rule => Rule.max(3)
    },

    // Featured Section
    {
      name: 'featuredSectionTitle',
      title: 'Featured Section Title',
      type: 'string',
      description: 'Title for the featured photos section',
      validation: Rule => Rule.required()
    },
    {
      name: 'featuredSectionDescription',
      title: 'Featured Section Description',
      type: 'text',
      description: 'Description for the featured photos section',
      validation: Rule => Rule.required()
    },
    {
      name: 'featuredEmptyStateTitle',
      title: 'Featured Empty State Title',
      type: 'string',
      description: 'Title when no featured photos are available',
      validation: Rule => Rule.required()
    },
    {
      name: 'featuredEmptyStateDescription',
      title: 'Featured Empty State Description',
      type: 'text',
      description: 'Description when no featured photos are available',
      validation: Rule => Rule.required()
    },

    // About Section
    {
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      description: 'Title for the about section',
      validation: Rule => Rule.required()
    },
    {
      name: 'aboutText',
      title: 'About Text',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Rich text content for the about section'
    },
    {
      name: 'aboutButtonText',
      title: 'About Button Text',
      type: 'string',
      description: 'Text for the call-to-action button in about section',
      validation: Rule => Rule.required()
    },
    {
      name: 'aboutButtonLink',
      title: 'About Button Link',
      type: 'string',
      description: 'Link for the about section button',
      validation: Rule => Rule.required()
    },

    // Stats Card
    {
      name: 'statsCardTitle',
      title: 'Stats Card Title',
      type: 'string',
      description: 'Title for the statistics card',
      validation: Rule => Rule.required()
    },
    {
      name: 'statsCardSubtitle',
      title: 'Stats Card Subtitle',
      type: 'string',
      description: 'Subtitle for the statistics card',
      validation: Rule => Rule.required()
    },
    {
      name: 'statistics',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'number',
              title: 'Number',
              type: 'string',
              description: 'The statistic number (e.g., "10+", "1000+")',
              validation: Rule => Rule.required()
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Description of the statistic',
              validation: Rule => Rule.required()
            }
          ]
        }
      ],
      validation: Rule => Rule.min(1).max(6)
    }
  ],
  preview: {
    select: {
      title: 'heroTitle',
      subtitle: 'heroSubtitle'
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: subtitle
      }
    }
  }
}