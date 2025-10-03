export default {
  name: 'explorePage',
  title: 'Explore Page',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Main title for the explore page',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Page Description',
      type: 'text',
      description: 'Description text below the title',
      validation: Rule => Rule.required()
    },
    {
      name: 'loadingText',
      title: 'Loading Text',
      type: 'string',
      description: 'Text shown while photos are loading',
      validation: Rule => Rule.required()
    },
    {
      name: 'emptyStateTitle',
      title: 'Empty State Title',
      type: 'string',
      description: 'Title when no photos are found',
      validation: Rule => Rule.required()
    },
    {
      name: 'emptyStateDescription',
      title: 'Empty State Description',
      type: 'text',
      description: 'Description when no photos are found',
      validation: Rule => Rule.required()
    },
    {
      name: 'searchPlaceholder',
      title: 'Search Placeholder',
      type: 'string',
      description: 'Placeholder text for the search input',
      validation: Rule => Rule.required()
    },
    {
      name: 'filtersButtonText',
      title: 'Filters Button Text',
      type: 'string',
      description: 'Text for the filters toggle button',
      validation: Rule => Rule.required()
    },
    {
      name: 'activeFiltersText',
      title: 'Active Filters Text',
      type: 'string',
      description: 'Text label for active filters',
      validation: Rule => Rule.required()
    },
    {
      name: 'clearAllFiltersText',
      title: 'Clear All Filters Text',
      type: 'string',
      description: 'Text for clear all filters button',
      validation: Rule => Rule.required()
    },
    {
      name: 'filterLabels',
      title: 'Filter Labels',
      type: 'object',
      fields: [
        {
          name: 'photoType',
          title: 'Photo Type Label',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'allPhotos',
          title: 'All Photos Label',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'featuredOnly',
          title: 'Featured Only Label',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'regularOnly',
          title: 'Regular Only Label',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'tags',
          title: 'Tags Label',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
}