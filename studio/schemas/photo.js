export default {
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(500)
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location']
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for screen readers. Very important for SEO and accessibility.',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where was this photo taken?'
    },
    {
      name: 'dateTaken',
      title: 'Date Taken',
      type: 'date',
      description: 'When was this photo taken?'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: 'Tags help categorize and filter photos. Examples: eagle, mountain, wildlife, autumn'
    },
    {
      name: 'featured',
      title: 'Featured Photo',
      type: 'boolean',
      description: 'Should this photo appear in the featured carousel on the homepage?',
      initialValue: false
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'URL-friendly version of the title'
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      location: 'location',
      featured: 'featured'
    },
    prepare(selection) {
      const {title, media, location, featured} = selection
      return {
        title: title,
        subtitle: `${location || 'Unknown location'}${featured ? ' • Featured' : ''}`,
        media: media
      }
    }
  },
  orderings: [
    {
      title: 'Date Taken, New',
      name: 'dateTakenDesc',
      by: [
        {field: 'dateTaken', direction: 'desc'}
      ]
    },
    {
      title: 'Date Taken, Old',
      name: 'dateTakenAsc',
      by: [
        {field: 'dateTaken', direction: 'asc'}
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    }
  ]
}